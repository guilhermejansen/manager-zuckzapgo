"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Activity, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminApi } from "@/lib/api"
import type {
  MonitoringEvent,
  MonitoringEventFilter,
  MonitoringHistoryParams,
  MonitoringSessionToken,
  MonitoringStatistics,
} from "@/types"

import { ClientsTable } from "./_components/clients-table"
import { EventDetailsDialog } from "./_components/event-details-dialog"
import { HistorySection } from "./_components/history-section"
import { LiveStreamPanel } from "./_components/live-stream-panel"
import { MonitoringOverviewCards } from "./_components/overview-cards"

const STREAM_BUFFER_LIMIT = 200

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message)
  }
  return fallback
}

function buildStreamUrl(streamUrl: string, filters: MonitoringEventFilter, sessionToken: string) {
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
      : process.env.NEXT_PUBLIC_API_URL || window.location.origin

  const url = new URL(streamUrl, base.endsWith("/") ? base : `${base}/`)
  url.searchParams.set("session", sessionToken)

  if (filters.user_id) url.searchParams.set("user_id", filters.user_id)
  if (filters.event_type) url.searchParams.set("event_type", filters.event_type)
  if (filters.status) url.searchParams.set("status", filters.status)
  if (filters.since_id) url.searchParams.set("since_id", filters.since_id.toString())
  if (filters.since_time) url.searchParams.set("since_time", filters.since_time)
  if (filters.limit) url.searchParams.set("limit", filters.limit.toString())
  if (filters.only_failed) url.searchParams.set("only_failed", "true")

  return url.toString()
}

export default function MonitoringPage() {
  const [stats, setStats] = useState<MonitoringStatistics | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [historyEvents, setHistoryEvents] = useState<MonitoringEvent[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyMeta, setHistoryMeta] = useState({ count: 0, has_more: false, next_id: 0 })
  const [historyFilters, setHistoryFilters] = useState<MonitoringHistoryParams>({
    limit: 50,
  })
  const [historyPage, setHistoryPage] = useState(1)

  const [autoRefreshStats, setAutoRefreshStats] = useState(true)
  const [autoRefreshHistory, setAutoRefreshHistory] = useState(false)

  const [selectedEvent, setSelectedEvent] = useState<MonitoringEvent | null>(null)

  const [streamEvents, setStreamEvents] = useState<MonitoringEvent[]>([])
  const [streamFilters, setStreamFilters] = useState<MonitoringEventFilter>({ limit: 50 })
  const [streaming, setStreaming] = useState(false)
  const [streamPaused, setStreamPaused] = useState(false)
  const [streamError, setStreamError] = useState<string | null>(null)
  const [streamSession, setStreamSession] = useState<MonitoringSessionToken | null>(null)
  const [streamConnecting, setStreamConnecting] = useState(false)
  const [streamTotal, setStreamTotal] = useState(0)

  const historyCursorStack = useRef<(number | null)[]>([])
  const eventSourceRef = useRef<EventSource | null>(null)
  const bufferRef = useRef<MonitoringEvent[]>([])
  const streamPausedRef = useRef(false)

  useEffect(() => {
    streamPausedRef.current = streamPaused
  }, [streamPaused])

  const resetHistoryPagination = useCallback(() => {
    historyCursorStack.current = []
    setHistoryPage(1)
  }, [])

  const handleHistoryFiltersChange = useCallback(
    (nextFilters: MonitoringHistoryParams) => {
      resetHistoryPagination()
      setHistoryFilters(nextFilters)
    },
    [resetHistoryPagination]
  )

  const handleResetHistoryFilters = useCallback(() => {
    resetHistoryPagination()
    setHistoryFilters({ limit: 50 })
  }, [resetHistoryPagination])

  const handleHistoryNextPage = useCallback(() => {
    if (!historyMeta.has_more || !historyMeta.next_id) return
    historyCursorStack.current.push(historyFilters.before_id ?? null)
    setHistoryFilters((prev) => ({
      ...prev,
      before_id: historyMeta.next_id,
    }))
    setHistoryPage((prev) => prev + 1)
  }, [historyFilters.before_id, historyMeta.has_more, historyMeta.next_id])

  const handleHistoryPreviousPage = useCallback(() => {
    if (historyCursorStack.current.length === 0) return
    const previousCursor = historyCursorStack.current.pop()
    setHistoryFilters((prev) => ({
      ...prev,
      before_id: previousCursor ?? undefined,
    }))
    setHistoryPage((prev) => Math.max(1, prev - 1))
  }, [])

  const loadStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const response = await adminApi.monitoring.getStats()
      setStats(response)
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível carregar as estatísticas"))
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const response = await adminApi.monitoring.getHistory(historyFilters)
      setHistoryEvents(Array.isArray(response.events) ? response.events : [])
      setHistoryMeta({
        count: Number(response.count || 0),
        has_more: Boolean(response.has_more),
        next_id: Number(response.next_id || 0),
      })
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível carregar o histórico de eventos"))
    } finally {
      setHistoryLoading(false)
    }
  }, [historyFilters])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

  useEffect(() => {
    if (!autoRefreshStats) return
    const id = setInterval(() => {
      void loadStats()
    }, 15000)
    return () => clearInterval(id)
  }, [autoRefreshStats, loadStats])

  useEffect(() => {
    if (!autoRefreshHistory) return
    const id = setInterval(() => {
      void loadHistory()
    }, 20000)
    return () => clearInterval(id)
  }, [autoRefreshHistory, loadHistory])

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setStreaming(false)
    setStreamConnecting(false)
    setStreamPaused(false)
  }, [])

  const startStream = useCallback(async () => {
    if (streaming || streamConnecting) return
    setStreamConnecting(true)
    setStreamError(null)
    bufferRef.current = []
    setStreamEvents([])
    setStreamTotal(0)

    try {
      const session = await adminApi.monitoring.createSession(
        Object.keys(streamFilters).length ? { filters: streamFilters } : undefined
      )

      const finalStreamUrl = buildStreamUrl(
        session.stream_url || "/admin/events/stream",
        streamFilters,
        session.session_token
      )

      const eventSource = new EventSource(finalStreamUrl)
      eventSourceRef.current = eventSource
      setStreamSession(session)

      eventSource.onmessage = (event) => {
        try {
          const parsed: MonitoringEvent = JSON.parse(event.data)
          setStreamTotal((previous) => previous + 1)
          if (streamPausedRef.current) {
            bufferRef.current = [parsed, ...bufferRef.current].slice(0, STREAM_BUFFER_LIMIT)
            return
          }
          setStreamEvents((previous) => [parsed, ...previous].slice(0, STREAM_BUFFER_LIMIT))
        } catch {
          // Ignore malformed payloads
        }
      }

      eventSource.onerror = () => {
        setStreamError("Conexão interrompida. Tente iniciar o stream novamente.")
        stopStream()
      }

      setStreaming(true)
      toast.success("Stream iniciado com sucesso")
    } catch (error) {
      setStreamError(getErrorMessage(error, "Não foi possível iniciar o stream"))
      stopStream()
    } finally {
      setStreamConnecting(false)
    }
  }, [streaming, streamConnecting, streamFilters, stopStream])

  const togglePause = useCallback(() => {
    setStreamPaused((previous) => {
      if (previous) {
        setStreamEvents((prev) => [...bufferRef.current, ...prev].slice(0, STREAM_BUFFER_LIMIT))
        bufferRef.current = []
      }
      return !previous
    })
  }, [])

  const resetStreamBuffer = useCallback(() => {
    bufferRef.current = []
    setStreamEvents([])
    setStreamTotal(0)
  }, [])

  const copyStreamUrl = useCallback(() => {
    if (!streamSession) {
      toast.info("Gere um token iniciando o stream para copiar a URL.")
      return
    }
    const url = buildStreamUrl(
      streamSession.stream_url || "/admin/events/stream",
      streamFilters,
      streamSession.session_token
    )
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("URL do stream copiada para a área de transferência"))
      .catch(() => toast.error("Não foi possível copiar a URL do stream"))
  }, [streamSession, streamFilters])

  useEffect(() => () => stopStream(), [stopStream])

  const clientList = useMemo(() => stats?.clients ?? [], [stats?.clients])

  const statsTotalEvents = useMemo(() => {
    if (!stats?.events?.by_status) return undefined
    return Object.values(stats.events.by_status).reduce((total, value) => total + Number(value ?? 0), 0)
  }, [stats?.events?.by_status])

  const { before_id: _beforeId, limit: _limit, ...filterValues } = historyFilters
  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        (filterValues.user_id && filterValues.user_id.trim()) ||
          filterValues.event_type ||
          filterValues.status ||
          filterValues.since_time ||
          filterValues.only_failed
      ),
    [filterValues.event_type, filterValues.only_failed, filterValues.since_time, filterValues.status, filterValues.user_id]
  )

  const historyLimit = historyFilters.limit ?? 50
  const estimatedPagesFromStats = statsTotalEvents
    ? Math.max(1, Math.ceil(statsTotalEvents / historyLimit))
    : undefined

  const totalCountForPagination = hasActiveFilters
    ? historyMeta.count
    : statsTotalEvents ?? historyMeta.count ?? events.length

  const totalPages = (() => {
    if (hasActiveFilters) {
      const fromMeta = historyMeta.count ? Math.ceil(historyMeta.count / historyLimit) : undefined
      return Math.max(historyPage, fromMeta ?? historyPage)
    }
    if (historyMeta.has_more) {
      return estimatedPagesFromStats ?? historyPage + 1
    }
    return historyPage
  })()

  const canGoNext = historyMeta.has_more && historyMeta.next_id > 0
  const canGoPrevious = historyPage > 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Observabilidade dos Eventos</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe métricas, histórico e eventos em tempo real
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefreshStats(!autoRefreshStats)}
          >
            <Activity className={`mr-2 h-4 w-4 ${autoRefreshStats ? "animate-pulse" : ""}`} />
            Métricas {autoRefreshStats ? "ON" : "OFF"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefreshHistory(!autoRefreshHistory)}
          >
            <Activity className={`mr-2 h-4 w-4 ${autoRefreshHistory ? "animate-pulse" : ""}`} />
            Histórico {autoRefreshHistory ? "ON" : "OFF"}
          </Button>

          <Button variant="outline" onClick={() => void loadStats()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {statsLoading && !stats ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <MonitoringOverviewCards stats={stats} loading={statsLoading} />
      )}

      <Tabs defaultValue="stream" className="space-y-4">
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="inline-flex w-auto min-w-full gap-1">
            <TabsTrigger value="stream" className="flex items-center gap-2 text-xs sm:text-sm">
              <Activity className="h-3.5 w-3.5" /> Live stream
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 text-xs sm:text-sm">
              <AlertCircle className="h-3.5 w-3.5" /> Histórico
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2 text-xs sm:text-sm">
              <ShieldCheck className="h-3.5 w-3.5" /> Sessões & Clientes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stream" className="space-y-4">
          <LiveStreamPanel
            events={streamEvents}
            streaming={streaming}
            connecting={streamConnecting}
            paused={streamPaused}
            bufferSize={bufferRef.current.length}
            totalReceived={streamTotal}
            filters={streamFilters}
            sessionInfo={streamSession}
            error={streamError}
            onFiltersChange={setStreamFilters}
            onStart={startStream}
            onStop={stopStream}
            onTogglePause={togglePause}
            onReset={resetStreamBuffer}
            onViewEvent={setSelectedEvent}
            onCopyStreamUrl={copyStreamUrl}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <HistorySection
            events={historyEvents}
            loading={historyLoading}
            filters={historyFilters}
            totalCount={totalCountForPagination}
            hasMore={historyMeta.has_more}
            currentPage={historyPage}
            totalPages={totalPages}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            onFiltersChange={handleHistoryFiltersChange}
            onResetFilters={handleResetHistoryFilters}
            onRefresh={() => void loadHistory()}
            onViewEvent={setSelectedEvent}
            onNextPage={handleHistoryNextPage}
            onPreviousPage={handleHistoryPreviousPage}
          />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ClientsTable clients={clientList} />
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <EventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  )
}
