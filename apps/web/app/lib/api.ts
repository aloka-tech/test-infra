import { createApiClient } from '@quotekai/api-client'

export function getApiClient() {
  return createApiClient(process.env.API_BASE_URL ?? 'http://localhost:3001')
}
