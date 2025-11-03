'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, Home, RefreshCw, Server, Wifi } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global Application Error:', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', {
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString(),
      })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection)
  }, [error])

  // Determine error type and provide helpful context
  const getErrorContext = () => {
    const message = error.message.toLowerCase()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

    // API Connection Errors
    if (message.includes('fetch failed') || message.includes('network') || message.includes('econnrefused')) {
      return {
        title: 'Erro de Conexão com Backend',
        description: 'Não foi possível conectar ao servidor ZuckZapGo.',
        icon: <Wifi className="h-6 w-6" />,
        suggestions: [
          `Verifique se o backend está rodando em ${apiUrl}`,
          'Confirme que as variáveis de ambiente estão corretas',
          'Verifique sua conexão de rede',
        ],
      }
    }

    // Server Component Errors
    if (message.includes('server component') || error.digest) {
      return {
        title: 'Erro no Servidor',
        description: 'Ocorreu um erro ao processar esta página no servidor.',
        icon: <Server className="h-6 w-6" />,
        suggestions: [
          'Tente recarregar a página',
          'Verifique os logs do servidor para mais detalhes',
          `Digest: ${error.digest || 'N/A'}`,
        ],
      }
    }

    // Unhandled Promise Rejection
    if (message.includes('promise') || message.includes('async')) {
      return {
        title: 'Erro de Promise Não Tratada',
        description: 'Uma operação assíncrona falhou inesperadamente.',
        icon: <AlertCircle className="h-6 w-6" />,
        suggestions: [
          'Esta operação pode ter falhado por timeout',
          'Verifique a conexão com serviços externos',
          'Tente novamente em alguns instantes',
        ],
      }
    }

    // Generic Error
    return {
      title: 'Erro Inesperado',
      description: 'Algo deu errado ao processar sua solicitação.',
      icon: <AlertCircle className="h-6 w-6" />,
      suggestions: [
        'Tente recarregar a página',
        'Se o problema persistir, contate o suporte',
        'Verifique sua conexão de internet',
      ],
    }
  }

  const errorContext = getErrorContext()

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl border-destructive/50 shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3 text-destructive">
              {errorContext.icon}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">{errorContext.title}</CardTitle>
              <CardDescription className="text-base mt-1">
                {errorContext.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-mono text-sm">
              {error.message}
            </AlertDescription>
          </Alert>

          {/* Suggestions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Possíveis Soluções:
            </h3>
            <ul className="space-y-2">
              {errorContext.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && error.stack && (
            <details className="rounded-lg border bg-muted/50 p-4">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                Detalhes Técnicos (Dev)
              </summary>
              <pre className="mt-3 overflow-auto text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                {error.stack}
              </pre>
            </details>
          )}

          {/* Environment Info */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Informações do Ambiente:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="text-muted-foreground">Backend URL:</div>
              <div className="text-foreground font-semibold">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}
              </div>
              <div className="text-muted-foreground">Environment:</div>
              <div className="text-foreground font-semibold">
                {process.env.NODE_ENV || 'development'}
              </div>
              {error.digest && (
                <>
                  <div className="text-muted-foreground">Error Digest:</div>
                  <div className="text-foreground font-semibold">{error.digest}</div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={reset}
              className="flex-1 gap-2"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-center text-xs text-muted-foreground pt-2">
            Se o problema persistir, verifique os logs do servidor ou contate o suporte técnico.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
