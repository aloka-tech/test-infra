import type { Job } from 'bullmq'
import pino from 'pino'
import { config } from '../config'
import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'
import { purgeHighlight } from '../lib/cloudflare'

const logger = pino({ level: config.logLevel })
const HIGHLIGHT_KEY = 'quotes:highlight'

export async function rotateHighlight(_job: Job): Promise<void> {
  const count = await prisma.quote.count()
  const skip = Math.floor(Math.random() * count)
  const [quote] = await prisma.quote.findMany({ take: 1, skip })

  const setAt = new Date().toISOString()
  const meta = { id: quote.id, text: quote.text, author: quote.author, setAt }

  await redis.set(HIGHLIGHT_KEY, JSON.stringify(meta))
  logger.info({ id: quote.id, author: quote.author, setAt }, 'HIGHLIGHT ROTATED — wrote quotes:highlight to Redis')

  await purgeHighlight()
}
