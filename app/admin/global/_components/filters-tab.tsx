import { Download, Megaphone, Newspaper, Phone, Radio, User, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { GlobalConfiguration } from "@/types"

import { ConfigItem } from "./config-item"
import { FilterToggle } from "./filter-toggle"

interface FiltersTabProps {
  config: GlobalConfiguration
}

export function FiltersTab({ config }: FiltersTabProps) {
  const { skip } = config

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros Globais de Skip</CardTitle>
          <CardDescription>
            Configure quais tipos de mensagens devem ser ignorados globalmente
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <FilterToggle
            label="Skip Groups"
            description="Ignorar todas as mensagens de grupos do WhatsApp"
            enabled={skip.skipGroups}
            icon={<Users className="h-4 w-4" />}
          />

          <FilterToggle
            label="Skip Newsletters"
            description="Ignorar mensagens de newsletters/canais do WhatsApp"
            enabled={skip.skipNewsletters}
            icon={<Newspaper className="h-4 w-4" />}
          />

          <FilterToggle
            label="Skip Broadcasts"
            description="Ignorar mensagens de listas de transmissão"
            enabled={skip.skipBroadcasts}
            icon={<Radio className="h-4 w-4" />}
          />

          <FilterToggle
            label="Skip Own Messages"
            description="Ignorar mensagens enviadas pelo próprio usuário"
            enabled={skip.skipOwnMessages}
            icon={<User className="h-4 w-4" />}
          />

          <FilterToggle
            label="Skip Calls"
            description="Ignorar eventos de chamadas (voz e vídeo)"
            enabled={skip.skipCalls}
            icon={<Phone className="h-4 w-4" />}
          />

          <FilterToggle
            label="Skip Media Download"
            description="Não fazer download automático de mídias (imagens, vídeos, etc.)"
            enabled={skip.skipMediaDownload}
            icon={<Download className="h-4 w-4" />}
          />
        </CardContent>
      </Card>

      {/* Call Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <CardTitle>Configurações de Chamadas</CardTitle>
          </div>
          <CardDescription>Comportamento ao receber chamadas de voz ou vídeo</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <ConfigItem label="Tipo de Rejeição" value={skip.callRejectType} badge="default" />
          <p className="text-xs text-muted-foreground pl-4">
            Tipos: <code className="text-xs bg-muted px-1 py-0.5 rounded">busy</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">decline</code>,{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">unavailable</code>
          </p>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Mensagem de Rejeição</p>
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-sm">{skip.callRejectMessage}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Esta mensagem será enviada automaticamente ao rejeitar chamadas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo dos Filtros</CardTitle>
          <CardDescription>Estado atual de todos os filtros globais</CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <ConfigItem
              label="Grupos"
              value={skip.skipGroups ? "Ignorados" : "Processados"}
              badge={skip.skipGroups ? "destructive" : "default"}
            />
            <ConfigItem
              label="Newsletters"
              value={skip.skipNewsletters ? "Ignorados" : "Processados"}
              badge={skip.skipNewsletters ? "destructive" : "default"}
            />
            <ConfigItem
              label="Broadcasts"
              value={skip.skipBroadcasts ? "Ignorados" : "Processados"}
              badge={skip.skipBroadcasts ? "destructive" : "default"}
            />
            <ConfigItem
              label="Próprias Mensagens"
              value={skip.skipOwnMessages ? "Ignoradas" : "Processadas"}
              badge={skip.skipOwnMessages ? "destructive" : "default"}
            />
            <ConfigItem
              label="Chamadas"
              value={skip.skipCalls ? "Ignoradas" : "Processadas"}
              badge={skip.skipCalls ? "destructive" : "default"}
            />
            <ConfigItem
              label="Download de Mídia"
              value={skip.skipMediaDownload ? "Desabilitado" : "Habilitado"}
              badge={skip.skipMediaDownload ? "destructive" : "default"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
