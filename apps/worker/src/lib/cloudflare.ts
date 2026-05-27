import { config } from '../config'

// Purges Cloudflare CDN cache for the highlight endpoint.
// Only fires when CLOUDFLARE_PURGE_ENABLED=true (production).
export async function purgeHighlight(): Promise<void> {
  if (!config.cloudflare.purgeEnabled) return
  // TODO: implement CF cache purge via API
}
