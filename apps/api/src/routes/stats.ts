import { Router, type IRouter } from 'express'

export const statsRouter: IRouter = Router()

// GET /api/stats
statsRouter.get('/', async (_req, res) => {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Not yet implemented' } })
})
