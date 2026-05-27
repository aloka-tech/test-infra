import express from 'express'
import cors from 'cors'
import pino from 'pino'
import { config } from './config'
import { quotesRouter } from './routes/quotes'
import { statsRouter } from './routes/stats'

const logger = pino({ level: config.logLevel })
const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())

app.use('/api/quotes', quotesRouter)
app.use('/api/stats', statsRouter)

app.listen(config.port, () => {
  logger.info({ port: config.port }, 'API server started')
})
