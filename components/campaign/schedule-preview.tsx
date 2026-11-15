/**
 * Schedule Preview Component
 *
 * Preview das próximas execuções agendadas.
 * Mostra as próximas 5 execuções baseadas na expressão cron e timezone.
 *
 * @module components/campaign/schedule-preview
 */

"use client"

import { useMemo, useSyncExternalStore } from "react"

import cronParser from "cron-parser"
import { format } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
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
function getRelativeTime(date: Date, now: number): string {
  const diffMs = date.getTime() - now

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

interface ScheduleSnapshot {
  executions: ScheduleExecution[]
  error: string | null
}

/** A pure calculation: both cron and relative labels use the supplied instant. */
function getNextExecutions(
  cronExpression: string,
  timezone: string,
  count: number,
  referenceTime: number
): ScheduleSnapshot {
  try {
    const executions: ScheduleExecution[] = []
    const interval = cronParser.parse(cronExpression, {
      currentDate: new Date(referenceTime),
      tz: timezone,
    })

    for (let i = 0; i < count; i++) {
      const date = interval.next().toDate()
      executions.push({
        // Keep the absolute instant; timezone conversion is for presentation only.
        date,
        formattedDate: formatInTimeZone(date, timezone, "dd/MM/yyyy", { locale: ptBR }),
        formattedTime: formatInTimeZone(date, timezone, "HH:mm:ss", { locale: ptBR }),
        relativeTime: getRelativeTime(date, referenceTime),
      })
    }
    return { executions, error: null }
  } catch (error: unknown) {
    return {
      executions: [],
      error: error instanceof Error ? error.message : "Expressão cron inválida",
    }
  }
}

/**
 * Creating a store is pure. The browser clock is read only when React subscribes
 * and by the existing 60-second tick, never during render or server rendering.
 */
function createScheduleClock(cronExpression: string, timezone: string, count: number) {
  let snapshot: ScheduleSnapshot | null = null
  let timer: ReturnType<typeof setInterval> | null = null
  const listeners = new Set<() => void>()

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      if (timer === null) {
        snapshot = getNextExecutions(cronExpression, timezone, count, Date.now())
        if (snapshot.error) {
          logger.error("Schedule: Failed to calculate next executions", new Error(snapshot.error), {
            component: "SchedulePreview",
            action: "getNextExecutions",
          })
        } else {
          logger.debug("Schedule: Next executions calculated", null, {
            component: "SchedulePreview",
            action: "getNextExecutions",
            metadata: { count: snapshot.executions.length },
          })
        }
        timer = setInterval(() => {
          if (snapshot === null) return
          const now = Date.now()
          snapshot = {
            ...snapshot,
            executions: snapshot.executions.map((execution) => ({
              ...execution,
              relativeTime: getRelativeTime(execution.date, now),
            })),
          }
          listeners.forEach((notify) => notify())
        }, 60000)
      }
      listener()
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) {
          if (timer !== null) clearInterval(timer)
          timer = null
          snapshot = null
        }
      }
    },
  }
}

function getServerScheduleSnapshot(): null {
  return null
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SchedulePreview({
  cronExpression,
  timezone = "America/Sao_Paulo",
  count = 5,
}: SchedulePreviewProps) {
  const clock = useMemo(
    () => createScheduleClock(cronExpression, timezone, count),
    [cronExpression, timezone, count]
  )
  const snapshot = useSyncExternalStore(
    clock.subscribe,
    clock.getSnapshot,
    getServerScheduleSnapshot
  )
  const executions = snapshot?.executions ?? []
  const error = snapshot?.error ?? null
  const hasExecutions = executions.length > 0
  const nextExecution = executions[0] ?? null

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

        {snapshot === null && (
          <p role="status" className="text-sm text-muted-foreground">Calculando próximas execuções…</p>
        )}

        {snapshot !== null && !error && !hasExecutions && (
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
