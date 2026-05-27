import { Router, type IRouter } from 'express'
import { getStats } from '../services/quote-service'

export const statsRouter: IRouter = Router()

statsRouter.get('/', async (_req, res) => {
  const result = await getStats()
  res.setHeader('Cache-Control', 'no-store')
  res.json(result)
})
