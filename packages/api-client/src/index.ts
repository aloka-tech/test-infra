import type { QuotesResponse, HighlightResponse, StatsResponse } from '@quotekai/shared-types'

export function createApiClient(baseUrl: string) {
  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`)
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
    return res.json() as Promise<T>
  }

  return {
    getQuotes: () => get<QuotesResponse>('/api/quotes'),
    getHighlight: () => get<HighlightResponse>('/api/quotes/highlight'),
    getStats: () => get<StatsResponse>('/api/stats'),
  }
}
