import { getApiClient } from '../lib/api'
import { RefreshButton } from './refresh-button'

export const dynamic = 'force-dynamic'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default async function HighlightPage() {
  const client = getApiClient()

  try {
    const result = await client.getHighlight()

    return (
      <main className="page-shell highlight-shell">
        <section className="page-heading">
          <p className="eyebrow">Current highlight</p>
          <h1>Highlight</h1>
          <p className="summary">Rotated by the background worker every 5 minutes.</p>
        </section>

        <article className="highlight-card">
          {result.fallback ? <p className="status-pill">Fallback selected by API</p> : null}
          <p className="highlight-text">"{result.quote.text}"</p>
          <p className="highlight-author">{result.quote.author}</p>
          <div className="highlight-meta">
            <span>Set at {formatDate(result.highlightSetAt)}</span>
            <RefreshButton />
          </div>
        </article>
      </main>
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to load highlight quote'

    return (
      <main className="page-shell highlight-shell">
        <section className="page-heading">
          <p className="eyebrow">Current highlight</p>
          <h1>Highlight</h1>
        </section>
        <section className="empty-state error-state">
          <h2>Highlight is unavailable</h2>
          <p>{message}</p>
          <RefreshButton />
        </section>
      </main>
    )
  }
}
