"use client"

import { useEffect, useMemo, useState } from "react"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Activity,
  AlertCircle,
  Link2,
  PauseCircle,
  PlayCircle,
  Radio,
  RefreshCw,
  SatelliteDish,
  StopCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getInterpretedStatus, getStatusBadgeClass } from "@/lib/monitoring-status"
import { cn } from "@/lib/utils"
import type { MonitoringEvent, MonitoringEventFilter, MonitoringSessionToken } from "@/types"

interface LiveStreamPanelProps {
  events: MonitoringEvent[]
  streaming: boolean
  connecting: boolean
  paused: boolean
  bufferSize: number
  totalReceived: number
  filters: MonitoringEventFilter
  sessionInfo: MonitoringSessionToken | null
  error?: string | null
  onFiltersChange: (filters: MonitoringEventFilter) => void
  onStart: () => void
  onStop: () => void
  onTogglePause: () => void
  onReset: () => void
  onViewEvent: (event: MonitoringEvent) => void
  onCopyStreamUrl: () => void
}

function sanitizeFilters(filters: MonitoringEventFilter): MonitoringEventFilter {
  const next: MonitoringEventFilter = { ...filters }
  if (!next.limit) next.limit = 50
  return next
}

function formatTTL(expiresAt: string | null | undefined, now: number) {
  if (!expiresAt) return "—"
  const diff = new Date(expiresAt).getTime() - now
  if (Number.isNaN(diff) || diff <= 0) return "expirado"
  const totalSeconds = Math.floor(diff / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`
}

export function LiveStreamPanel({
  events,
  streaming,
  connecting,
  paused,
  bufferSize,
  totalReceived,
  filters,
  sessionInfo,
  error,
  onFiltersChange,
  onStart,
  onStop,
  onTogglePause,
  onReset,
  onViewEvent,
  onCopyStreamUrl,
}: LiveStreamPanelProps) {
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  const normalizedFilters = useMemo(() => sanitizeFilters(filters), [filters])

  useEffect(() => {
    if (!sessionInfo?.expires_at) return
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionInfo?.expires_at])

  const ttl = useMemo(
    () => formatTTL(sessionInfo?.expires_at, currentTime),
    [sessionInfo?.expires_at, currentTime]
  )

  const handleFilterChange = (key: keyof MonitoringEventFilter, value: string) => {
    const next = { ...normalizedFilters }
    if (!value) {
      delete next[key]
    } else if (key === "limit" || key === "since_id") {
      const parsed = Number(value)
      if (!Number.isNaN(parsed)) {
        ;(next as Record<string, unknown>)[key] = parsed
      }
    } else {
      ;(next as Record<string, unknown>)[key] = value
    }
    onFiltersChange(next)
  }

  const handleToggleOnlyFailed = (enabled: boolean) => {
    onFiltersChange({ ...normalizedFilters, only_failed: enabled ? true : undefined })
  }

  const latestEvent = events[0]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-dashed">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <SatelliteDish className="h-4 w-4 text-primary" /> Stream de eventos em tempo real
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Conecte via SSE para visualizar eventos conforme são emitidos pelos transportes e
              buffer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={streaming ? "outline" : "secondary"}
              className={cn(
                "gap-1.5",
                streaming
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"      // 🟢 Verde
                  : connecting
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600"          // 🟡 Amarelo
                    : "border-red-500/30 bg-red-500/10 text-red-600"                // 🔴 Vermelho
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  streaming
                    ? "bg-emerald-500 animate-pulse"
                    : connecting
                      ? "bg-amber-500 animate-pulse"
                      : "bg-red-500"
                )}
              />
              {streaming ? "Conectado" : connecting ? "Conectando..." : "Desconectado"}
            </Badge>
            <Badge variant="outline" className="gap-1 text-xs">
              <Activity className="h-3 w-3" /> {totalReceived} eventos
            </Badge>
            {bufferSize > 0 && (
              <Badge variant="destructive" className="text-xs">
                {bufferSize} aguardando reprodução
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-4 xl:grid-cols-[360px,1fr]">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-3 text-sm font-semibold">Filtros da sessão</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="stream-user">User ID</Label>
                  <Input
                    id="stream-user"
                    value={normalizedFilters.user_id ?? ""}
                    onChange={(event) => handleFilterChange("user_id", event.target.value)}
                    placeholder="Opcional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream-type">Tipo de evento</Label>
                  <Input
                    id="stream-type"
                    value={normalizedFilters.event_type ?? ""}
                    onChange={(event) => handleFilterChange("event_type", event.target.value)}
                    placeholder="ex: message.sent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream-status">Status</Label>
                  <Input
                    id="stream-status"
                    value={normalizedFilters.status ?? ""}
                    onChange={(event) => handleFilterChange("status", event.target.value)}
                    placeholder="pending | delivered | failed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="stream-limit">Limite (catchup)</Label>
                    <Input
                      id="stream-limit"
                      type="number"
                      min={1}
                      max={1000}
                      value={normalizedFilters.limit ?? 50}
                      onChange={(event) => handleFilterChange("limit", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stream-since">Since ID</Label>
                    <Input
                      id="stream-since"
                      type="number"
                      min={0}
                      value={normalizedFilters.since_id ?? ""}
                      onChange={(event) => handleFilterChange("since_id", event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
                  <Switch
                    id="stream-failed"
                    checked={Boolean(normalizedFilters.only_failed)}
                    onCheckedChange={handleToggleOnlyFailed}
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="stream-failed" className="text-sm font-semibold">
                      Somente falhas
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Filtra status diferentes de failed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold">Sessão atual</h3>
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Token</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onCopyStreamUrl}
                    disabled={!sessionInfo?.stream_url}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="break-all font-mono">
                  {sessionInfo?.session_token ?? "Gerado automaticamente ao iniciar"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Expira em</span>
                    <p className="font-mono text-sm">{ttl}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">TTL (s)</span>
                    <p className="font-mono text-sm">{sessionInfo?.ttl_seconds ?? "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={streaming ? onStop : onStart}
                disabled={connecting}
                className="col-span-2"
              >
                {streaming ? (
                  <>
                    <StopCircle className="mr-2 h-4 w-4" /> Encerrar stream
                  </>
                ) : (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" /> Iniciar stream
                  </>
                )}
              </Button>
              <Button variant="outline" disabled={!streaming} onClick={onTogglePause}>
                {paused ? (
                  <>
                    <PlayCircle className="mr-2 h-4 w-4" /> Retomar
                  </>
                ) : (
                  <>
                    <PauseCircle className="mr-2 h-4 w-4" /> Pausar
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onReset} disabled={!streaming}>
                <RefreshCw className="mr-2 h-4 w-4" /> Limpar buffer
              </Button>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border">
            <div className="flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Radio className="h-4 w-4 text-primary" /> Últimos eventos recebidos
              </div>
              {latestEvent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs text-muted-foreground">
                      Atualizado{" "}
                      {formatDistanceToNow(new Date(latestEvent.updated_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </TooltipTrigger>
                    <TooltipContent>
                      {new Date(latestEvent.updated_at).toLocaleString("pt-BR")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="relative max-h-[60vh] overflow-auto">
              <div className="divide-y">
                {events.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Nenhum evento recebido ainda. Inicie o stream para acompanhar em tempo real.
                  </div>
                )}
                {events.map((event) => (
                  <button
                    key={`${event.id}-${event.updated_at}`}
                    type="button"
                    onClick={() => onViewEvent(event)}
                    className="flex w-full flex-col items-start gap-2 bg-background px-4 py-3 text-left transition hover:bg-muted/60"
                  >
                    <div className="flex w-full flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        <Badge variant="outline" className="font-mono text-[11px] shrink-0">
                          #{event.id}
                        </Badge>
                        <span className="break-all">{event.event_type}</span>
                      </div>
{(() => {
                        const interpreted = getInterpretedStatus(event)
                        return (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className={cn("shrink-0", getStatusBadgeClass(interpreted))}>
                                  <span className="mr-1">{interpreted.icon}</span>
                                  {interpreted.label}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-medium">{interpreted.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Confiança: {interpreted.confidence === "high" ? "Alta" : interpreted.confidence === "medium" ? "Média" : "Baixa"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Status DB: {event.status}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )
                      })()}
                    </div>
                    <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-mono break-all">{event.user_id || "—"}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="whitespace-nowrap">
                            Criado{" "}
                            {formatDistanceToNow(new Date(event.created_at), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </TooltipTrigger>
                          <TooltipContent>
                            {new Date(event.created_at).toLocaleString("pt-BR")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="whitespace-nowrap">Tentativas: {event.attempts}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
