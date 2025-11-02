"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertCircle, Clock, Database, TrendingUp } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { safeDateFormat } from "@/lib/date-utils"
import type { DLQStats } from "@/types"

interface StatsDashboardProps {
  stats: DLQStats | null
  loading: boolean
}

export function StatsDashboard({ stats, loading }: StatsDashboardProps) {
  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">Nenhuma estatística disponível</div>
    )
  }

  const topTransport = Object.entries(stats.by_transport || {}).sort(([, a], [, b]) => b - a)[0]

  const topEventType = Object.entries(stats.by_event_type || {}).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_count}</div>
          <p className="text-xs text-muted-foreground mt-1">Eventos na fila de falhas</p>
        </CardContent>
      </Card>

      {/* Top Transport */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Principal Transport</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topTransport ? (
              <Badge variant="outline" className="text-base">
                {topTransport[0]}
              </Badge>
            ) : (
              "N/A"
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {topTransport ? `${topTransport[1]} eventos` : "Sem eventos"}
          </p>
        </CardContent>
      </Card>

      {/* Top Event Type */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipo Mais Comum</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topEventType ? (
              <Badge variant="secondary" className="text-base">
                {topEventType[0]}
              </Badge>
            ) : (
              "N/A"
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {topEventType ? `${topEventType[1]} eventos` : "Sem eventos"}
          </p>
        </CardContent>
      </Card>

      {/* Time Range */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Intervalo</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {safeDateFormat(
              stats.oldest_event,
              (date) => formatDistanceToNow(date, { locale: ptBR, addSuffix: false }),
              "N/A"
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.oldest_event ? "Evento mais antigo" : "Sem eventos"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
