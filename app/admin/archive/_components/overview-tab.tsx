"use client"

import { Archive, CheckCircle2, TrendingUp, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { ArchiveStats } from "@/types"

interface OverviewTabProps {
  stats: ArchiveStats
}

export function OverviewTab({ stats }: OverviewTabProps) {
  const successRate =
    stats.total_count > 0 ? ((stats.success_count / stats.total_count) * 100).toFixed(1) : "0.0"

  const successRateNum = parseFloat(successRate)

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card 1: Total Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_count.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Todos os eventos arquivados</p>
        </CardContent>
      </Card>

      {/* Card 2: Success Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eventos Sucesso</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.success_count.toLocaleString()}
          </div>
          <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Entregues com sucesso
          </Badge>
        </CardContent>
      </Card>

      {/* Card 3: DLQ Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eventos DLQ</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.dlq_count.toLocaleString()}</div>
          <Badge variant="destructive" className="mt-2">
            <XCircle className="mr-1 h-3 w-3" />
            Falharam após retries
          </Badge>
        </CardContent>
      </Card>

      {/* Card 4: Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <Progress value={successRateNum} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {successRateNum >= 95
              ? "Excelente taxa de entrega"
              : successRateNum >= 85
                ? "Boa taxa de entrega"
                : successRateNum >= 70
                  ? "Taxa moderada"
                  : "Requer atenção"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
