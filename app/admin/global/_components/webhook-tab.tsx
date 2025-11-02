import { AlertCircle, ExternalLink, Globe } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { GlobalConfiguration, GlobalStats } from "@/types"

import { ConfigItem } from "./config-item"

interface WebhookTabProps {
  config: GlobalConfiguration
  stats: GlobalStats
}

export function WebhookTab({ config, stats }: WebhookTabProps) {
  const { webhook } = config
  const dispatchRule = stats.dispatchRules["global-webhook"]
  const webhookStats = stats.webhook

  const formatEvents = (events: string[]) => {
    if (!events || events.length === 0) return "Nenhum evento"
    if (events.includes("All")) return "Todos os eventos"
    return events.join(", ")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configuração Webhook Global
              </CardTitle>
              <CardDescription className="mt-1.5">
                Sistema de webhook compartilhado para distribuição de eventos
              </CardDescription>
            </div>
            <Badge variant={webhook.enabled ? "default" : "secondary"}>
              {webhook.enabled ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Connection Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configuração de Conexão</h4>
            <ConfigItem
              label="URL do Webhook"
              value={webhook.url || "Não configurado"}
              copyable={!!webhook.url}
            />
            {webhook.url && (
              <a
                href={webhook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir URL
              </a>
            )}
            <ConfigItem label="Eventos Monitorados" value={formatEvents(webhook.events)} />
          </div>

          <Separator />

          {/* Performance Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configurações de Performance</h4>
            <ConfigItem label="Concorrência Máxima" value={webhook.maxConcurrency} />
            <ConfigItem label="Timeout" value={webhook.timeout} />
            <ConfigItem label="Fator de Backoff" value={webhook.backoffFactor} />
          </div>

          <Separator />

          {/* Retry Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configurações de Retry</h4>
            <ConfigItem label="Tentativas de Retry" value={webhook.retryCount} />
            <ConfigItem label="Delay Inicial" value={webhook.retryDelay} />
            <ConfigItem label="Delay Máximo" value={webhook.maxRetryDelay} />
          </div>

          <Separator />

          {/* Runtime Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Status de Execução</h4>
            <ConfigItem
              label="Status Global"
              value={
                <Badge variant={webhookStats.enabled ? "default" : "secondary"}>
                  {webhookStats.enabled ? "Habilitado" : "Desabilitado"}
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
          {webhook.enabled && !dispatchRule.enabled && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Webhook está configurado mas o dispatch está desabilitado. Eventos não serão
                enviados.
              </AlertDescription>
            </Alert>
          )}

          {!webhook.enabled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Webhook global não está habilitado. Configure GLOBAL_WEBHOOK_ENABLED=true para
                ativar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
