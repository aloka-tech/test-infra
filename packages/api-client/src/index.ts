import type { QuotesResponse, HighlightResponse, StatsResponse } from '@quotekai/shared-types'

const DEFAULT_BASE_URL = 'http://localhost:3001'

type ApiClientOptions = {
  fetchOptions?: RequestInit
}

export function createApiClient(baseUrl = DEFAULT_BASE_URL, options: ApiClientOptions = {}) {
  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      cache: 'no-store',
      ...options.fetchOptions,
    })

    if (!res.ok) {
      let message = `API error ${res.status}: ${path}`

      try {
        const body = await res.json() as { error?: { message?: string } }
        if (body.error?.message) message = body.error.message
      } catch {
        // Keep the status-based message when the API does not return JSON.
      }

      throw new Error(message)
    }

    return res.json() as Promise<T>
  }

  return {
    getQuotes: () => get<QuotesResponse>('/api/quotes'),
    getHighlight: () => get<HighlightResponse>('/api/quotes/highlight'),
    getStats: () => get<StatsResponse>('/api/stats'),
  }
}
