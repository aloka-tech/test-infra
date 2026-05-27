import pino from 'pino'
import { config } from '../config'

const logger = pino({ level: config.logLevel })

// Purges Cloudflare CDN cache for the highlight endpoint.
// Only fires when CLOUDFLARE_PURGE_ENABLED=true (production).
export async function purgeHighlight(): Promise<void> {
  if (!config.cloudflare.purgeEnabled) {
    logger.debug('Cloudflare purge disabled — skipping')
    return
  }

  const url = `${config.cloudflare.apiBaseUrl}/api/quotes/highlight`
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${config.cloudflare.zoneId}/purge_cache`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${config.cloudflare.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ files: [url] }),
    },
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Cloudflare purge failed: ${response.status} — ${text}`)
  }

  logger.info({ url }, 'Cloudflare cache purged for highlight endpoint')
}
