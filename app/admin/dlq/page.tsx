"use client"

import { useCallback, useEffect, useState } from "react"

import { Activity, AlertCircle, Database, RefreshCw, Settings, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminApi } from "@/lib/api"
import type { DLQEvent, DLQListParams, DLQStats } from "@/types"

import { EventsTab } from "./_components/events-tab"
import { MaintenanceTab } from "./_components/maintenance-tab"
import { OverviewTab } from "./_components/overview-tab"

function getErrorMessage(error: any, fallback: string) {
  return error?.getUserMessage?.() || error?.message || fallback
}

export default function DLQPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DLQStats | null>(null)
  const [events, setEvents] = useState<DLQEvent[]>([])
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [filters, setFilters] = useState<DLQListParams>({
    limit: 50,
    offset: 0,
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsResponse, eventsResponse] = await Promise.all([
        adminApi.dlq.getStats(),
        adminApi.dlq.getEvents(filters),
      ])

      // A API retorna data.data (estrutura aninhada)
      setStats((statsResponse.data as any)?.data ?? null)
      setEvents((eventsResponse.data as any)?.data ?? [])
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível carregar os dados da DLQ"))
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
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dead Letter Queue (DLQ)</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de eventos que falharam após múltiplas tentativas
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
              value="settings"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Configurações</span>
              <span className="md:hidden">Config</span>
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

        <div className="mt-6 w-full">
          <TabsContent value="events" className="m-0 w-full">
            <EventsTab
              events={events}
              filters={filters}
              onFilterChange={setFilters}
              onRefresh={handleRefresh}
              totalCount={stats?.total_count || 0}
              availableTransports={Object.keys(stats?.by_transport ?? {})}
            />
          </TabsContent>

          <TabsContent value="settings" className="m-0 w-full">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-muted p-3">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-medium">Configurações da DLQ</h3>
                  <p className="text-sm text-muted-foreground">
                    As configurações de retry, timeout e limites são gerenciadas no backend através
                    das variáveis de ambiente e arquivo de configuração global.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-yellow-600 dark:text-yellow-500">
                      Para ajustar configurações, edite o arquivo .env
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="m-0 w-full">
            <MaintenanceTab stats={stats} onRefresh={handleRefresh} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
