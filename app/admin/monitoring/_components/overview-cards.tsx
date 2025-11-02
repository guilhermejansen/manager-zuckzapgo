"use client"

import { memo } from "react"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Activity, CircleDot, Cpu, Gauge, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { MonitoringStatistics } from "@/types"

interface MonitoringOverviewCardsProps {
  stats: MonitoringStatistics | null
  loading?: boolean
}

function safeEntries<RecordType extends Record<string, number> | undefined>(record?: RecordType) {
  if (!record) return [] as Array<[string, number]>
  return Object.entries(record) as Array<[string, number]>
}

export const MonitoringOverviewCards = memo(function MonitoringOverviewCards({
  stats,
  loading = false,
}: MonitoringOverviewCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-dashed">
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center text-muted-foreground">
          Nenhuma estatística disponível no momento.
        </CardContent>
      </Card>
    )
  }

  const totalByStatus = safeEntries(stats.events?.by_status)
  const totalEvents = totalByStatus.reduce((acc, [, value]) => acc + value, 0)
  const queueUtilization = stats.notifier.queue_utilization ?? 0

  const typeEntries = safeEntries(stats.events?.by_type)
  const topEventType =
    typeEntries.length > 0 ? [...typeEntries].sort((a, b) => b[1] - a[1])[0] : null

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes conectados</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hub.connected_clients}</div>
          <p className="text-xs text-muted-foreground">
            Uptime: {formatDistanceToNow(new Date(stats.hub.start_time), { locale: ptBR })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eventos entregues</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hub.total_events_delivered}</div>
          <p className="text-xs text-muted-foreground">
            Último broadcast em{" "}
            {stats.hub.last_broadcast_at
              ? formatDistanceToNow(new Date(stats.hub.last_broadcast_at), {
                  addSuffix: true,
                  locale: ptBR,
                })
              : "—"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">{(stats.hub.cache_hit_rate * 100).toFixed(1)}%</div>
          <Progress value={Math.min(100, Math.max(0, stats.hub.cache_hit_rate * 100))} />
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>{stats.hub.cache_hits} hits</span>
            <span>{stats.hub.cache_misses} misses</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fila de notificações</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{stats.notifier.queue_size}</span>
            <span className="text-xs text-muted-foreground">/{stats.notifier.queue_capacity}</span>
          </div>
          <Progress value={Math.min(100, Math.max(0, queueUtilization * 100))} />
          <Badge variant={stats.notifier.enabled ? "outline" : "secondary"} className="w-fit">
            {stats.notifier.enabled ? "Workers ativos" : "Notifier pausado"}
          </Badge>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribuição por status</CardTitle>
          <CircleDot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          {totalByStatus.length === 0 && (
            <p className="text-xs text-muted-foreground">Ainda não há eventos processados.</p>
          )}
          {totalByStatus.map(([status, value]) => {
            const percent = totalEvents > 0 ? (value / totalEvents) * 100 : 0
            return (
              <div key={status} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="capitalize">{status}</span>
                  <span className="text-muted-foreground">
                    {value} ({percent.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percent} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipo de evento predominante</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2">
          {topEventType ? (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {topEventType[0]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {topEventType[1]} eventos nos últimos minutos
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Sem eventos recentes suficientes para análise.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
})

MonitoringOverviewCards.displayName = "MonitoringOverviewCards"
