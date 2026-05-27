import pino from 'pino'
import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'
import { config } from '../config'

const logger = pino({ level: config.logLevel })

const QUOTES_ALL_KEY = 'quotes:all'
const QUOTES_ALL_TTL = 1800
const HIGHLIGHT_KEY = 'quotes:highlight'

type Quote = { id: string; text: string; author: string; createdAt: string }
type HighlightMeta = { id: string; text: string; author: string; setAt: string }

export async function getAllQuotes(): Promise<{ quotes: Quote[]; count: number }> {
  const cached = await redis.get(QUOTES_ALL_KEY)
  if (cached) {
    logger.info({ key: QUOTES_ALL_KEY }, 'CACHE HIT quotes:all')
    return JSON.parse(cached)
  }

  logger.info({ key: QUOTES_ALL_KEY }, 'CACHE MISS quotes:all — fetching from Postgres')
  const rows = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  const quotes = rows.map(q => ({ id: q.id, text: q.text, author: q.author, createdAt: q.createdAt.toISOString() }))
  const result = { quotes, count: quotes.length }

  await redis.set(QUOTES_ALL_KEY, JSON.stringify(result), 'EX', QUOTES_ALL_TTL)
  logger.info({ count: quotes.length, ttl: QUOTES_ALL_TTL }, 'CACHE WRITE quotes:all → Redis')

  return result
}

export async function getHighlight(): Promise<{ quote: Quote; highlightSetAt: string; fallback?: true }> {
  const cached = await redis.get(HIGHLIGHT_KEY)
  if (cached) {
    logger.info({ key: HIGHLIGHT_KEY }, 'CACHE HIT quotes:highlight')
    const meta: HighlightMeta = JSON.parse(cached)
    return {
      quote: { id: meta.id, text: meta.text, author: meta.author, createdAt: meta.setAt },
      highlightSetAt: meta.setAt,
    }
  }

  // Redis is empty — worker hasn't run yet or Redis was flushed. Pick a random quote immediately.
  logger.warn({ key: HIGHLIGHT_KEY }, 'CACHE MISS quotes:highlight — fallback: picking random quote')
  const count = await prisma.quote.count()
  const skip = Math.floor(Math.random() * count)
  const [row] = await prisma.quote.findMany({ take: 1, skip })
  const setAt = new Date().toISOString()
  const meta: HighlightMeta = { id: row.id, text: row.text, author: row.author, setAt }

  await redis.set(HIGHLIGHT_KEY, JSON.stringify(meta))
  logger.info({ id: row.id, setAt }, 'CACHE WRITE quotes:highlight → Redis (fallback)')

  return {
    quote: { id: row.id, text: row.text, author: row.author, createdAt: row.createdAt.toISOString() },
    highlightSetAt: setAt,
    fallback: true,
  }
}

export async function getStats() {
  let dbConnected = false
  let totalQuotes = 0
  try {
    totalQuotes = await prisma.quote.count()
    dbConnected = true
  } catch (err) {
    logger.error(err, 'stats: Postgres health check failed')
  }

  let redisConnected = false
  let highlight: { id: string; setAt: string; ageSeconds: number } | null = null
  let quotesAllCached = false
  let quotesAllTTLSeconds: number | null = null
  try {
    const [highlightRaw, allTTL] = await Promise.all([
      redis.get(HIGHLIGHT_KEY),
      redis.ttl(QUOTES_ALL_KEY),
    ])
    redisConnected = true

    if (highlightRaw) {
      const meta: HighlightMeta = JSON.parse(highlightRaw)
      const ageSeconds = Math.floor((Date.now() - new Date(meta.setAt).getTime()) / 1000)
      highlight = { id: meta.id, setAt: meta.setAt, ageSeconds }
    }

    // ttl returns -2 if key doesn't exist, -1 if no expiry
    quotesAllCached = allTTL > 0
    quotesAllTTLSeconds = allTTL > 0 ? allTTL : null
  } catch (err) {
    logger.error(err, 'stats: Redis health check failed')
  }

  return {
    timestamp: new Date().toISOString(),
    database: { connected: dbConnected, totalQuotes },
    redis: { connected: redisConnected, highlight, quotesAllCached, quotesAllTTLSeconds },
    uptime: { processSeconds: Math.floor(process.uptime()) },
  }
}
