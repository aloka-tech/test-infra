import { Queue, Worker } from 'bullmq'
import pino from 'pino'
import { config } from './config'
import { rotateHighlight } from './jobs/rotate-highlight'

const logger = pino({ level: config.logLevel })

const connection = { url: config.redisUrl }

const queue = new Queue('highlight-rotation', { connection })
const worker = new Worker('highlight-rotation', rotateHighlight, { connection })

async function start() {
  // Register a repeating job — BullMQ deduplicates by job name.
  await queue.add(
    'rotate',
    {},
    {
      repeat: { every: 5 * 60 * 1000 }, // every 5 minutes
      removeOnComplete: 10,
      removeOnFail: 5,
    },
  )

  worker.on('completed', (job) => logger.info({ jobId: job.id }, 'highlight rotated'))
  worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err }, 'rotation failed'))

  logger.info('Worker started — highlight-rotation queue active')
}

start().catch((err) => {
  logger.error({ err }, 'Worker startup failed')
  process.exit(1)
})
