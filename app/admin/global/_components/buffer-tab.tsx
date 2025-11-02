import { Activity, AlertCircle, Archive, Database, RefreshCw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { GlobalStats } from "@/types"

import { ConfigItem } from "./config-item"
import { StatCard } from "./stat-card"

interface BufferTabProps {
  stats: GlobalStats
}

export function BufferTab({ stats }: BufferTabProps) {
  const { buffer } = stats

  const successRate =
    buffer.dequeued > 0 ? ((buffer.ackSuccess / buffer.dequeued) * 100).toFixed(1) : "0.0"

  const failureRate =
    buffer.dequeued > 0 ? ((buffer.ackFailures / buffer.dequeued) * 100).toFixed(1) : "0.0"

  const pendingVariant =
    buffer.pending > 1000 ? "destructive" : buffer.pending > 500 ? "warning" : "default"

  const successRateVariant =
    Number(successRate) >= 95 ? "success" : Number(successRate) >= 80 ? "warning" : "destructive"

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Eventos Pendentes"
          value={buffer.pending}
          variant={pendingVariant}
          icon={<Database className="h-4 w-4" />}
          description="Aguardando processamento"
        />
        <StatCard
          title="Total Enfileirado"
          value={buffer.enqueued}
          icon={<Activity className="h-4 w-4" />}
          description="Eventos adicionados ao buffer"
        />
        <StatCard
          title="Total Processado"
          value={buffer.dequeued}
          icon={<RefreshCw className="h-4 w-4" />}
          description="Eventos removidos do buffer"
        />
      </div>

      {/* Success/Failure Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Taxas de Sucesso e Falha</CardTitle>
          <CardDescription>Performance de processamento dos eventos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Taxa de Sucesso</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{successRate}%</span>
                <Badge
                  variant={
                    Number(successRate) >= 95
                      ? "default"
                      : Number(successRate) >= 80
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {Number(successRate) >= 95
                    ? "Excelente"
                    : Number(successRate) >= 80
                      ? "Bom"
                      : "Atenção"}
                </Badge>
              </div>
            </div>
            <Progress value={Number(successRate)} className="h-3" />
            <p className="text-xs text-muted-foreground mt-1">
              {buffer.ackSuccess.toLocaleString()} confirmações bem-sucedidas de{" "}
              {buffer.dequeued.toLocaleString()} total
            </p>
          </div>

          <Separator />

          {/* Failure Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Taxa de Falha</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{failureRate}%</span>
                <Badge variant={Number(failureRate) > 5 ? "destructive" : "secondary"}>
                  {Number(failureRate) > 5 ? "Alto" : "Normal"}
                </Badge>
              </div>
            </div>
            <Progress
              value={Number(failureRate)}
              className="h-3"
              // @ts-expect-error - Custom indicator class
              indicatorClassName="bg-red-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {buffer.ackFailures.toLocaleString()} falhas de {buffer.dequeued.toLocaleString()}{" "}
              total
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reprocessing Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Reprocessamento</CardTitle>
          <CardDescription>Eventos que foram reprocessados ou reenfileirados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Reprocessados (Replay)</p>
              </div>
              <p className="text-3xl font-bold">{buffer.replayed.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Eventos executados novamente</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Reenfileirados (Requeue)</p>
              </div>
              <p className="text-3xl font-bold">{buffer.requeued.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Eventos devolvidos à fila</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Archive Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Arquivo</CardTitle>
          <CardDescription>Eventos arquivados e removidos permanentemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Arquivados</p>
              </div>
              <p className="text-3xl font-bold">{buffer.archiveStored.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Eventos movidos para arquivo</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Removidos (Pruned)</p>
              </div>
              <p className="text-3xl font-bold">{buffer.archivePruned.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Eventos excluídos permanentemente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buffer Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Buffer</CardTitle>
          <CardDescription>Configurações e estado atual do sistema de buffer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <ConfigItem
            label="Buffer Habilitado"
            value={
              <Badge variant={buffer.enabled ? "default" : "destructive"}>
                {buffer.enabled ? "Ativo" : "Inativo"}
              </Badge>
            }
          />
          <Separator />
          <ConfigItem
            label="Eventos Pendentes"
            value={buffer.pending.toLocaleString()}
            badge={
              buffer.pending > 1000 ? "destructive" : buffer.pending > 500 ? "secondary" : "default"
            }
          />
          <ConfigItem label="Total Enfileirado" value={buffer.enqueued.toLocaleString()} />
          <ConfigItem label="Total Processado" value={buffer.dequeued.toLocaleString()} />
          <ConfigItem label="Sucessos" value={buffer.ackSuccess.toLocaleString()} badge="default" />
          <ConfigItem
            label="Falhas"
            value={buffer.ackFailures.toLocaleString()}
            badge={buffer.ackFailures > 0 ? "destructive" : "secondary"}
          />
        </CardContent>
      </Card>
    </div>
  )
}
