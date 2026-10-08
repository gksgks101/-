import Link from 'next/link';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#07060f',
          color: '#f6f3ff',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <main style={{maxWidth: '40rem', margin: '0 auto', padding: '6rem 1.25rem'}}>
          <h1 style={{fontSize: '2.5rem', lineHeight: 1.05, margin: 0}}>
            That page is not on the stage
          </h1>
          <p style={{color: '#d4cce6', fontSize: '1.125rem', lineHeight: 1.6}}>
            The link may be out of date. Head back home to pick a game.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              marginTop: '1.5rem',
              borderRadius: '999px',
              background: '#c4b5fd',
              color: '#140e24',
              fontWeight: 650,
              padding: '0.75rem 1.4rem',
              textDecoration: 'none',
            }}
          >
            Back to home
          </Link>
        </main>
      </body>
    </html>
  );
}
