import { Router, type IRouter } from 'express'

export const quotesRouter: IRouter = Router()

// GET /api/quotes
quotesRouter.get('/', async (_req, res) => {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented' } })
})

// GET /api/quotes/highlight
quotesRouter.get('/highlight', async (_req, res) => {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented' } })
})
