/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

"use client"

import { useEffect, useMemo, useState } from "react"

import cronParser from "cron-parser"
import { format } from "date-fns"
import { formatInTimeZone, toZonedTime } from "date-fns-tz"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, Info } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { logger } from "@/lib/logger"

/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

// ============================================================================
// TYPES
// ============================================================================

interface SchedulePreviewProps {
  cronExpression: string
  timezone?: string
  count?: number
}

interface ScheduleExecution {
  date: Date
  formattedDate: string
  formattedTime: string
  relativeTime: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calcula o tempo relativo até a data
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()

  if (diffMs < 0) {
    return "No passado"
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    return `Em ${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`
  } else if (diffHours < 24) {
    return `Em ${diffHours} hora${diffHours !== 1 ? "s" : ""}`
  } else if (diffDays < 7) {
    return `Em ${diffDays} dia${diffDays !== 1 ? "s" : ""}`
  } else {
    const weeks = Math.floor(diffDays / 7)
    return `Em ${weeks} semana${weeks !== 1 ? "s" : ""}`
  }
}

/**
 * Calcula as próximas N execuções baseadas na expressão cron
 */
function getNextExecutions(
  cronExpression: string,
  timezone: string,
  count: number
): ScheduleExecution[] {
  try {
    const executions: ScheduleExecution[] = []
    const options = {
      currentDate: new Date(),
      tz: timezone,
    }

    const interval = cronParser.parse(cronExpression, options)

    for (let i = 0; i < count; i++) {
      const next = interval.next()
      const date = next.toDate()

      // Convert to target timezone
      const zonedDate = toZonedTime(date, timezone)

      executions.push({
        date: zonedDate,
        formattedDate: formatInTimeZone(date, timezone, "dd/MM/yyyy", { locale: ptBR }),
        formattedTime: formatInTimeZone(date, timezone, "HH:mm:ss", { locale: ptBR }),
        relativeTime: getRelativeTime(date),
      })
    }

    logger.debug("Schedule: Next executions calculated", null, {
      component: "SchedulePreview",
      action: "getNextExecutions",
      metadata: { count: executions.length },
    })

    return executions
  } catch (error: any) {
    logger.error("Schedule: Failed to calculate next executions", error, {
      component: "SchedulePreview",
      action: "getNextExecutions",
    })
    return []
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SchedulePreview({
  cronExpression,
  timezone = "America/Sao_Paulo",
  count = 5,
}: SchedulePreviewProps) {
  const [executions, setExecutions] = useState<ScheduleExecution[]>([])
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Calculate next executions when cron or timezone changes
  useEffect(() => {
    try {
      const nextExecutions = getNextExecutions(cronExpression, timezone, count)
      setExecutions(nextExecutions)
      setError(null)
    } catch (error: any) {
      setError(error.message)
      setExecutions([])
    }
  }, [cronExpression, timezone, count])

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setExecutions((prev) =>
        prev.map((exec) => ({
          ...exec,
          relativeTime: getRelativeTime(exec.date),
        }))
      )
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  const hasExecutions = executions.length > 0

  const nextExecution = useMemo(() => {
    if (!hasExecutions) return null
    return executions[0]
  }, [executions, hasExecutions])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximas Execuções
        </CardTitle>
        <CardDescription>Preview das próximas {count} execuções agendadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && !hasExecutions && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Configure a expressão cron para visualizar as próximas execuções
            </AlertDescription>
          </Alert>
        )}

        {!error && hasExecutions && (
          <>
            {/* Next execution highlight */}
            {nextExecution && (
              <Alert className="border-primary">
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-1">Próxima execução</div>
                  <div className="flex items-center justify-between">
                    <div>
                      {nextExecution.formattedDate} às {nextExecution.formattedTime}
                    </div>
                    <Badge variant="default">{nextExecution.relativeTime}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Execution list */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Todas as próximas execuções
              </h4>
              <div className="space-y-2">
                {executions.map((execution, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>#{index + 1}</Badge>
                        <div>
                          <div className="font-medium text-sm">{execution.formattedDate}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {execution.formattedTime}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{execution.relativeTime}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Os horários são calculados para o fuso horário <strong>{timezone}</strong>. As
                execuções são atualizadas automaticamente.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  )
}
