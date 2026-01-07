'use client'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Erro Crítico da Aplicação
            </h1>
            <p style={{ marginBottom: '1rem', opacity: 0.7 }}>
              {error.message || 'Ocorreu um erro inesperado.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                }}
              >
                Tentar Novamente
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#27272a',
                  color: 'white',
                  border: '1px solid #3f3f46',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                }}
              >
                Voltar ao Início
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
