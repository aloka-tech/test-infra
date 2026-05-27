import Link from 'next/link'
import './globals.css'

export const metadata = { title: 'QuoteKai' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            QuoteKai
          </Link>
          <nav className="site-nav" aria-label="Primary navigation">
            <Link href="/">Quotes</Link>
            <Link href="/highlight">Highlight</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
