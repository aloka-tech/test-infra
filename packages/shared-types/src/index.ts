export interface Quote {
  id: string
  text: string
  author: string
  createdAt: string
}

export interface ApiError {
  code: string
  message: string
}

export type QuotesResponse = {
  quotes: Quote[]
  count: number
}

export type HighlightResponse = {
  quote: Quote
  highlightSetAt: string
  fallback?: true
}

export type StatsResponse = {
  timestamp: string
  database: {
    connected: boolean
    totalQuotes: number
    error?: string
  }
  redis: {
    connected: boolean
    highlight: {
      id: string
      setAt: string
      ageSeconds: number
    } | null
    quotesAllCached: boolean
    quotesAllTTLSeconds: number | null
  }
  uptime: {
    processSeconds: number
  }
}
