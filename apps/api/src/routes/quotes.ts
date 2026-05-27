import { Router, type IRouter } from 'express'
import pino from 'pino'
import { config } from '../config'
import { getAllQuotes, getHighlight } from '../services/quote-service'

const logger = pino({ level: config.logLevel })

export const quotesRouter: IRouter = Router()

quotesRouter.get('/', async (_req, res) => {
  try {
    const result = await getAllQuotes()
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300')
    res.json(result)
  } catch (err) {
    logger.error(err, 'GET /api/quotes failed')
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } })
  }
})

quotesRouter.get('/highlight', async (_req, res) => {
  try {
    const result = await getHighlight()
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300')
    res.json(result)
  } catch (err) {
    logger.error(err, 'GET /api/quotes/highlight failed')
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected error' } })
  }
})
