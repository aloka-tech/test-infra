import type { Job } from 'bullmq'

// TODO: pick random quote from Postgres, write to Redis as quotes:highlight,
// then call purgeHighlight() to invalidate the Cloudflare edge cache.
export async function rotateHighlight(_job: Job): Promise<void> {
  throw new Error('Not implemented')
}
