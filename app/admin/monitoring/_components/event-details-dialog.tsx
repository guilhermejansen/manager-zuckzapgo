"use client"

import { ReactNode } from "react"

import { Copy, PauseCircle, PlayCircle, Radio, Zap } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { MonitoringEvent } from "@/types"

interface EventDetailsDialogProps {
  event: MonitoringEvent | null
  onClose: () => void
}

type MetadataItem = {
  label: string
  value?: string
  node?: ReactNode
  copyValue?: string
  mono?: boolean
  className?: string
}

const statusConfig: Record<
  string,
  {
    label: string
    icon: React.ComponentType<{ className?: string }>
    className: string
  }
> = {
  pending: {
    label: "Em fila",
    icon: PauseCircle,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  processing: {
    label: "Processando",
    icon: Radio,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  delivered: {
    label: "Entregue",
    icon: Zap,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  failed: {
    label: "Falhou",
    icon: PlayCircle,
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
}

function formatDate(date: string) {
  if (!date) return "—"
  return new Date(date).toLocaleString("pt-BR")
}

export function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  if (!event) return null

  const status = event.status?.toLowerCase?.() ?? ""

  const statusMeta = statusConfig[status] ?? {
    label: event.status ?? "Desconhecido",
    icon: Radio,
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
  }

  const StatusIcon = statusMeta.icon

  let payloadString = "{}"
  try {
    payloadString = JSON.stringify(event.payload ?? {}, null, 2)
  } catch {
    payloadString = String(event.payload)
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(payloadString)
      .then(() => toast.success("Payload copiado para a área de transferência"))
      .catch(() => toast.error("Não foi possível copiar o payload"))
  }

  const handleCopyValue = (value?: string, label?: string) => {
    if (!value) {
      toast.error("Não há valor para copiar")
      return
    }
    navigator.clipboard
      .writeText(value)
      .then(() => toast.success(`${label ?? "Valor"} copiado para a área de transferência`))
      .catch(() => toast.error("Não foi possível copiar o valor"))
  }

  const metadataItems: MetadataItem[] = [
    {
      label: "Usuário",
      value: event.user_id || "—",
      copyValue: event.user_id || undefined,
      mono: true,
      className: "font-mono text-foreground",
    },
    {
      label: "Tipo de evento",
      value: event.event_type,
      copyValue: event.event_type,
      className: "font-medium",
    },
    {
      label: "Criado em",
      value: formatDate(event.created_at),
      copyValue: event.created_at,
    },
    {
      label: "Atualizado em",
      value: formatDate(event.updated_at),
      copyValue: event.updated_at,
    },
    {
      label: "Tentativas",
      value: String(event.attempts),
      className: "font-semibold text-foreground",
    },
    {
      label: "Último ID entregue",
      value: String(event.id),
      copyValue: String(event.id),
      mono: true,
      className: "font-mono text-foreground",
    },
  ]

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
            Evento #{event.id}
            <Badge variant="outline" className={cn("gap-1 text-xs", statusMeta.className)}>
              <StatusIcon className="h-3.5 w-3.5" />
              {statusMeta.label}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Observabilidade em tempo real — inspeção completa do evento recebido.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6 pb-4">
            <section className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {metadataItems.map((item) => (
                <div key={item.label} className="space-y-1.5 sm:space-y-2">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-xs sm:text-sm break-all",
                        item.mono ? "font-mono" : undefined,
                        item.className ?? "text-muted-foreground"
                      )}
                    >
                      {item.value}
                    </p>
                    {item.copyValue && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => handleCopyValue(item.copyValue, item.label)}
                        aria-label={`Copiar ${item.label.toLowerCase()}`}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </section>

            <Separator />

            <section className="space-y-2 sm:space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold">Payload</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="w-full sm:w-auto"
                >
                  <Copy className="mr-2 h-3.5 w-3.5" /> Copiar JSON
                </Button>
              </div>
              <div className="rounded-md border bg-muted/50 p-3 sm:p-4">
                <div className="overflow-x-auto custom-scrollbar">
                  <pre className="text-[10px] sm:text-xs leading-relaxed whitespace-pre text-foreground">
                    <code className="block whitespace-pre">{payloadString}</code>
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="flex-shrink-0 border-t bg-muted/40 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
