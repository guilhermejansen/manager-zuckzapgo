'use client'

import { useEffect } from 'react'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Root Layout Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }, [error])

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <div className="w-full max-w-2xl rounded-lg border border-destructive/50 bg-card p-6 shadow-lg">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Erro Crítico da Aplicação</h1>
                  <p className="text-muted-foreground mt-1">
                    Ocorreu um erro crítico no sistema.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="font-mono text-sm">{error.message}</p>
                </div>
              </div>

              {/* Environment Info */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  Informações do Ambiente:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="text-muted-foreground">Backend URL:</div>
                  <div className="font-semibold">
                    {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}
                  </div>
                  <div className="text-muted-foreground">Environment:</div>
                  <div className="font-semibold">
                    {process.env.NODE_ENV || 'development'}
                  </div>
                  {error.digest && (
                    <>
                      <div className="text-muted-foreground">Error Digest:</div>
                      <div className="font-semibold">{error.digest}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Technical Details (Development) */}
              {process.env.NODE_ENV === 'development' && error.stack && (
                <details className="rounded-lg border bg-muted/50 p-4">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                    Stack Trace (Dev)
                  </summary>
                  <pre className="mt-3 overflow-auto text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={reset}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <RefreshCw className="h-4 w-4" />
                  Tentar Novamente
                </button>
                <a
                  href="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Home className="h-4 w-4" />
                  Voltar ao Início
                </a>
              </div>

              {/* Help Text */}
              <p className="text-center text-xs text-muted-foreground pt-2">
                Este é um erro crítico do sistema. Por favor, recarregue a página ou contate o
                suporte.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
