import { Activity, AlertCircle, CheckCircle2, Database, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GlobalStats } from "@/types"

import { StatCard } from "./stat-card"

interface OverviewTabProps {
  stats: GlobalStats
}

export function OverviewTab({ stats }: OverviewTabProps) {
  const successRate =
    stats.buffer.dequeued > 0
      ? ((stats.buffer.ackSuccess / stats.buffer.dequeued) * 100).toFixed(1)
      : "0.0"

  const failureRate =
    stats.buffer.dequeued > 0
      ? ((stats.buffer.ackFailures / stats.buffer.dequeued) * 100).toFixed(1)
      : "0.0"

  const activeTransports = [
    stats.webhook.enabled,
    stats.rabbitmq.enabled,
    stats.s3.enabled,
    stats.sqs.enabled,
    stats.redis.enabled,
    stats.websocket.enabled,
  ].filter(Boolean).length

  const totalTransports = 6

  const pendingVariant =
    stats.buffer.pending > 1000 ? "destructive" : stats.buffer.pending > 500 ? "warning" : "default"

  return (
    <div className="space-y-6">
      {/* Buffer Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Buffer de Eventos</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pendentes"
            value={stats.buffer.pending}
            variant={pendingVariant}
            icon={<Database className="h-4 w-4" />}
            description="Eventos aguardando processamento"
          />
          <StatCard
            title="Enfileirados"
            value={stats.buffer.enqueued}
            icon={<Layers className="h-4 w-4" />}
            description="Total de eventos adicionados"
          />
          <StatCard
            title="Processados"
            value={stats.buffer.dequeued}
            icon={<Activity className="h-4 w-4" />}
            description="Total de eventos processados"
          />
          <StatCard
            title="Taxa de Sucesso"
            value={`${successRate}%`}
            variant={
              Number(successRate) >= 95
                ? "success"
                : Number(successRate) >= 80
                  ? "warning"
                  : "destructive"
            }
            icon={<CheckCircle2 className="h-4 w-4" />}
            description={`${stats.buffer.ackSuccess} sucessos`}
          />
        </div>
      </div>

      {/* Success/Failure Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Processamento</CardTitle>
          <CardDescription>Detalhamento de sucesso e falha dos eventos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Taxa de Sucesso</span>
              <span className="text-sm text-muted-foreground">{successRate}%</span>
            </div>
            <Progress value={Number(successRate)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.buffer.ackSuccess} confirmações bem-sucedidas de {stats.buffer.dequeued} total
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Taxa de Falha</span>
              <span className="text-sm text-muted-foreground">{failureRate}%</span>
            </div>
            <Progress
              value={Number(failureRate)}
              className="h-2"
              // @ts-expect-error - Custom class for red progress bar
              indicatorClassName="bg-red-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.buffer.ackFailures} falhas de {stats.buffer.dequeued} total
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Reprocessados</p>
              <p className="text-2xl font-bold">{stats.buffer.replayed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Reenfileirados</p>
              <p className="text-2xl font-bold">{stats.buffer.requeued}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Arquivados</p>
              <p className="text-2xl font-bold">{stats.buffer.archiveStored}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Removidos</p>
              <p className="text-2xl font-bold">{stats.buffer.archivePruned}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transport Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Transportes</CardTitle>
          <CardDescription>
            {activeTransports} de {totalTransports} transportes ativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TransportStatusItem
              name="Webhook"
              enabled={stats.webhook.enabled}
              dispatchEnabled={stats.dispatchRules["global-webhook"].enabled}
            />
            <TransportStatusItem
              name="RabbitMQ"
              enabled={stats.rabbitmq.enabled}
              dispatchEnabled={stats.dispatchRules["global-rabbitmq"].enabled}
            />
            <TransportStatusItem
              name="S3"
              enabled={stats.s3.enabled}
              details={`Bucket: ${stats.s3.bucket}`}
            />
            <TransportStatusItem
              name="SQS"
              enabled={stats.sqs.enabled}
              dispatchEnabled={stats.dispatchRules["global-sqs"].enabled}
            />
            <TransportStatusItem
              name="Redis"
              enabled={stats.redis.enabled}
              dispatchEnabled={stats.dispatchRules["global-redis"].enabled}
            />
            <TransportStatusItem
              name="WebSocket"
              enabled={stats.websocket.enabled}
              dispatchEnabled={stats.dispatchRules["global-websocket"].enabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface TransportStatusItemProps {
  name: string
  enabled: boolean
  dispatchEnabled?: boolean
  details?: string
}

function TransportStatusItem({
  name,
  enabled,
  dispatchEnabled,
  details,
}: TransportStatusItemProps) {
  const showWarning = enabled && dispatchEnabled === false

  return (
    <div className="flex items-start justify-between gap-2 p-3 border rounded-lg">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{name}</h4>
        {details && <p className="text-xs text-muted-foreground mt-0.5 truncate">{details}</p>}
        {showWarning && (
          <div className="flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3 text-yellow-500" />
            <span className="text-xs text-yellow-600 dark:text-yellow-500">
              Dispatch desativado
            </span>
          </div>
        )}
      </div>
      <Badge variant={enabled ? "default" : "secondary"}>{enabled ? "Ativo" : "Inativo"}</Badge>
    </div>
  )
}
