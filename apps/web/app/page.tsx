import { getApiClient } from './lib/api'

export const dynamic = 'force-dynamic'

export default async function QuotesPage() {
  const client = getApiClient()

  try {
    const result = await client.getQuotes()

    return (
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">All quotes</p>
          <h1>Quotes</h1>
          <p className="summary">
            {result.count === 1 ? '1 seeded quote' : `${result.count} seeded quotes`}
          </p>
        </section>

        {result.quotes.length === 0 ? (
          <section className="empty-state">
            <h2>No quotes found</h2>
            <p>Seed the database, then refresh this page.</p>
          </section>
        ) : (
          <section className="quote-list" aria-label="Seeded quotes">
            {result.quotes.map(quote => (
              <article className="quote-card" key={quote.id}>
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-author">{quote.author}</p>
              </article>
            ))}
          </section>
        )}
      </main>
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to load quotes'

    return (
      <main className="page-shell">
        <section className="page-heading">
          <p className="eyebrow">All quotes</p>
          <h1>Quotes</h1>
        </section>
        <section className="empty-state error-state">
          <h2>Quotes are unavailable</h2>
          <p>{message}</p>
        </section>
      </main>
    )
  }
}
