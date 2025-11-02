import { AlertCircle, Cloud, ExternalLink } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { GlobalConfiguration, GlobalStats } from "@/types"

import { ConfigItem } from "./config-item"

interface S3TabProps {
  config: GlobalConfiguration
  stats: GlobalStats
}

export function S3Tab({ config, stats }: S3TabProps) {
  const { s3 } = config
  const s3Stats = stats.s3

  const maskCredential = (value: string) => {
    if (!value) return "Não configurado"
    if (value.length <= 4) return "****"
    return `****${value.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Configuração S3 Global
              </CardTitle>
              <CardDescription className="mt-1.5">
                Armazenamento de mídia em bucket S3
              </CardDescription>
            </div>
            <Badge variant={s3.enabled ? "default" : "secondary"}>
              {s3.enabled ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Connection Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configuração de Conexão</h4>
            <ConfigItem
              label="Endpoint"
              value={s3.endpoint || "AWS S3 (padrão)"}
              copyable={!!s3.endpoint}
            />
            {s3.endpoint && (
              <a
                href={s3.endpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="h-3 w-3" />
                Abrir Console S3
              </a>
            )}
            <ConfigItem label="Região" value={s3.region} />
            <ConfigItem label="Bucket" value={s3.bucket} copyable />
            <ConfigItem
              label="URL Pública"
              value={s3.publicURL || "Não configurado"}
              copyable={!!s3.publicURL}
            />
          </div>

          <Separator />

          {/* Credentials */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Credenciais</h4>
            <ConfigItem label="Access Key ID" value={maskCredential(s3.accessKey)} sensitive />
            <ConfigItem label="Secret Access Key" value={maskCredential(s3.secretKey)} sensitive />
          </div>

          <Separator />

          {/* Configuration Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Opções de Configuração</h4>
            <ConfigItem
              label="Path Style"
              value={
                <Badge variant={s3.pathStyle ? "default" : "secondary"}>
                  {s3.pathStyle ? "Habilitado" : "Desabilitado"}
                </Badge>
              }
            />
            <ConfigItem
              label="Disable ACL"
              value={
                <Badge variant={s3.disableACL ? "default" : "secondary"}>
                  {s3.disableACL ? "Habilitado" : "Desabilitado"}
                </Badge>
              }
            />
            {s3.disableACL && (
              <p className="text-xs text-muted-foreground pl-4">
                ACL desabilitado - compatível com "Bucket owner enforced" da AWS
              </p>
            )}
          </div>

          <Separator />

          {/* Media Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Configurações de Mídia</h4>
            <ConfigItem
              label="Modo de Entrega"
              value={s3.mediaDelivery}
              badge={s3.mediaDelivery === "both" ? "default" : "secondary"}
            />
            <ConfigItem
              label="Retenção (dias)"
              value={s3.retentionDays === 0 ? "Sem expiração" : `${s3.retentionDays} dias`}
            />
          </div>

          <Separator />

          {/* Runtime Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Status de Execução</h4>
            <ConfigItem
              label="Status Global"
              value={
                <Badge variant={s3Stats.enabled ? "default" : "secondary"}>
                  {s3Stats.enabled ? "Habilitado" : "Desabilitado"}
                </Badge>
              }
            />
            <ConfigItem
              label="Cliente S3"
              value={
                <Badge variant={s3Stats.hasClient ? "default" : "destructive"}>
                  {s3Stats.hasClient ? "Conectado" : "Desconectado"}
                </Badge>
              }
            />
            {s3Stats.enabled && (
              <>
                <ConfigItem label="Bucket Ativo" value={s3Stats.bucket} copyable />
                <ConfigItem label="Região Ativa" value={s3Stats.region} />
                <ConfigItem label="Endpoint Ativo" value={s3Stats.endpoint} copyable />
                <ConfigItem label="Modo de Entrega Ativo" value={s3Stats.mediaDelivery} />
              </>
            )}
          </div>

          {/* Warnings */}
          {s3.enabled && !s3Stats.hasClient && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                S3 está configurado mas o cliente não está conectado. Verifique as credenciais.
              </AlertDescription>
            </Alert>
          )}

          {!s3.enabled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                S3 global não está habilitado. Configure GLOBAL_S3_ENABLED=true para ativar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
