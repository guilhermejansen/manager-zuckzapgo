import { AlertCircle, Rabbit } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { GlobalConfiguration, GlobalStats } from "@/types"

import { ConfigItem } from "./config-item"

interface RabbitMQTabProps {
  config: GlobalConfiguration
  stats: GlobalStats
}

export function RabbitMQTab({ config, stats }: RabbitMQTabProps) {
  const { rabbitmq } = config
  const dispatchRule = stats.dispatchRules["global-rabbitmq"]
  const rabbitStats = stats.rabbitmq

  const formatEvents = (events: string[]) => {
    if (!events || events.length === 0) return "Nenhum evento"
    if (events.includes("All")) return "Todos os eventos"
    return events.join(", ")
  }

  const maskUrl = (url: string) => {
    if (!url) return "Não configurado"
    try {
      const parsed = new URL(url)
      if (parsed.password) {
        return url.replace(parsed.password, "****")
      }
      return url
    } catch {
      return url
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rabbit className="h-5 w-5" />
                Configuração RabbitMQ Global
              </CardTitle>
              <CardDescription className="mt-1.5">
                Fila de distribuição de eventos via RabbitMQ
              </CardDescription>
            </div>
            <Badge variant={rabbitmq.enabled ? "default" : "secondary"}>
              {rabbitmq.enabled ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Connection Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configuração de Conexão</h4>
            <ConfigItem
              label="URL de Conexão"
              value={maskUrl(rabbitmq.url)}
              copyable={false}
              sensitive
            />
            <ConfigItem
              label="Exchange"
              value={rabbitmq.exchange || "Não configurado"}
              copyable={!!rabbitmq.exchange}
            />
            <ConfigItem label="Tipo de Exchange" value={rabbitmq.exchangeType} />
            <ConfigItem
              label="Queue"
              value={rabbitmq.queue || "Não configurado"}
              copyable={!!rabbitmq.queue}
            />
            <ConfigItem label="Tipo de Queue" value={rabbitmq.queueType} />
            <ConfigItem
              label="Routing Key"
              value={rabbitmq.routingKey || "Não configurado"}
              copyable={!!rabbitmq.routingKey}
            />
          </div>

          <Separator />

          {/* Message Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configurações de Mensagem</h4>
            <ConfigItem
              label="Modo de Entrega"
              value={rabbitmq.deliveryMode === 2 ? "Persistente" : "Não persistente"}
              badge={rabbitmq.deliveryMode === 2 ? "default" : "secondary"}
            />
            <ConfigItem
              label="Durável"
              value={
                <Badge variant={rabbitmq.durable ? "default" : "secondary"}>
                  {rabbitmq.durable ? "Sim" : "Não"}
                </Badge>
              }
            />
            <ConfigItem
              label="Auto Delete"
              value={
                <Badge variant={rabbitmq.autoDelete ? "destructive" : "default"}>
                  {rabbitmq.autoDelete ? "Sim" : "Não"}
                </Badge>
              }
            />
          </div>

          <Separator />

          {/* Event Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configurações de Eventos</h4>
            <ConfigItem label="Eventos Monitorados" value={formatEvents(rabbitmq.events)} />
          </div>

          <Separator />

          {/* Runtime Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Status de Execução</h4>
            <ConfigItem
              label="Status Global"
              value={
                <Badge variant={rabbitStats.enabled ? "default" : "secondary"}>
                  {rabbitStats.enabled ? "Habilitado" : "Desabilitado"}
                </Badge>
              }
            />
            <ConfigItem
              label="Dispatch Rule"
              value={
                <Badge variant={dispatchRule.enabled ? "default" : "secondary"}>
                  {dispatchRule.enabled ? "Ativo" : "Inativo"}
                </Badge>
              }
            />
            {dispatchRule.enabled && (
              <ConfigItem
                label="Eventos no Dispatch"
                value={dispatchRule.allowAll ? "Todos" : `${dispatchRule.events.length} eventos`}
              />
            )}
          </div>

          {/* Warnings */}
          {rabbitmq.enabled && !dispatchRule.enabled && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                RabbitMQ está configurado mas o dispatch está desabilitado. Eventos não serão
                enviados.
              </AlertDescription>
            </Alert>
          )}

          {!rabbitmq.enabled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                RabbitMQ global não está habilitado. Configure GLOBAL_RABBITMQ_ENABLED=true para
                ativar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
