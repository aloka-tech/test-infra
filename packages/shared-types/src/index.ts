export interface Quote {
  id: string
  text: string
  author: string
  createdAt: string
}

export interface HighlightMeta {
  id: string
  text: string
  author: string
  setAt: string
}

export interface ApiError {
  code: string
  message: string
}

export type QuotesResponse = { data: Quote[] }
export type HighlightResponse = { data: HighlightMeta }
export type StatsResponse = {
  data: {
    redisConnected: boolean
    highlightKey: string | null
    highlightSetAt: string | null
    quotesCached: boolean
  }
}
