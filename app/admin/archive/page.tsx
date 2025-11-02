"use client"

import { useCallback, useEffect, useState } from "react"

import { Activity, Archive, Database, RefreshCw, Settings, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminApi } from "@/lib/api"
import type { ArchiveEvent, ArchiveListParams, ArchiveStats } from "@/types"

import { EventsTab } from "./_components/events-tab"
import { MaintenanceTab } from "./_components/maintenance-tab"
import { OverviewTab } from "./_components/overview-tab"

function getErrorMessage(error: any, fallback: string) {
  return error?.getUserMessage?.() || error?.message || fallback
}

export default function ArchivePage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ArchiveStats | null>(null)
  const [events, setEvents] = useState<ArchiveEvent[]>([])
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [filters, setFilters] = useState<ArchiveListParams>({
    status: "",
    limit: 50,
    offset: 0,
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsResponse, eventsResponse] = await Promise.all([
        adminApi.archive.getStats(),
        adminApi.archive.getEvents(filters),
      ])

      // A API retorna data.data (estrutura aninhada)
      setStats((statsResponse.data as any)?.data ?? null)
      setEvents((eventsResponse.data as any)?.data ?? [])
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível carregar os dados do Archive"))
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void loadData()
  }, [loadData])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      void loadData()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [autoRefresh, loadData])

  const handleRefresh = () => {
    void loadData()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Eventos Arquivados</h1>
          <p className="text-sm text-muted-foreground">
            Visualização completa de eventos arquivados (DLQ + Sucesso)
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
            <Activity className={`mr-2 h-4 w-4 ${autoRefresh ? "animate-pulse" : ""}`} />
            Auto-refresh {autoRefresh ? "ON" : "OFF"}
          </Button>

          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards - Mostrado sempre no topo */}
      {stats && <OverviewTab stats={stats} />}

      {/* Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full h-auto flex-wrap gap-1 p-1">
            <TabsTrigger
              value="events"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Eventos</span>
            </TabsTrigger>

            <TabsTrigger
              value="maintenance"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Manutenção</span>
              <span className="md:hidden">Maint</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="events" className="m-0">
            <EventsTab
              events={events}
              filters={filters}
              onFilterChange={setFilters}
              onRefresh={handleRefresh}
              totalCount={stats?.total_count || 0}
              availableTransports={Object.keys(stats?.by_transport ?? {})}
            />
          </TabsContent>

          <TabsContent value="maintenance" className="m-0">
            {stats && <MaintenanceTab stats={stats} onRefresh={handleRefresh} />}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
