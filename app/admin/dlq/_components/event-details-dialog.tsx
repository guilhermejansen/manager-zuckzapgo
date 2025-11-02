"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Copy, RotateCcw, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { safeDateFormat } from "@/lib/date-utils"
import type { DLQEvent } from "@/types"

interface EventDetailsDialogProps {
  event: DLQEvent | null
  open: boolean
  onClose: () => void
  onReplay: (event: DLQEvent) => void
  onDelete: (event: DLQEvent) => void
}

const getTransportColor = (transport: string) => {
  const colors: Record<string, string> = {
    webhook: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    rabbitmq: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    s3: "bg-green-500/10 text-green-500 border-green-500/20",
    sqs: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    redis: "bg-red-500/10 text-red-500 border-red-500/20",
    websocket: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  }
  return colors[transport] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

const getEventTypeColor = (eventType: string) => {
  const colors: Record<string, string> = {
    Message: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    MessageUpdate: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    Receipt: "bg-green-500/10 text-green-500 border-green-500/20",
    Presence: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HistorySync: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    ChatPresence: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    Call: "bg-red-500/10 text-red-500 border-red-500/20",
    GroupInfo: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    Picture: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Status: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  }
  return colors[eventType] || "bg-gray-500/10 text-gray-500 border-gray-500/20"
}

export function EventDetailsDialog({
  event,
  open,
  onClose,
  onReplay,
  onDelete,
}: EventDetailsDialogProps) {
  if (!event) return null

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(event.payload, null, 2))
    toast.success("Payload copiado para área de transferência")
  }

  const handleCopyError = () => {
    navigator.clipboard.writeText(event.last_error)
    toast.success("Erro copiado para área de transferência")
  }

  const formattedPayload: string = JSON.stringify(event.payload, null, 2)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes do Evento #{event.id}
            <Badge variant="outline" className={getTransportColor(event.transport)}>
              {event.transport}
            </Badge>
            <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
              {event.event_type}
            </Badge>
          </DialogTitle>
          <DialogDescription>Informações completas sobre o evento que falhou</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">ID</p>
                <p className="text-sm font-mono text-muted-foreground">{event.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">User ID</p>
                <p className="text-sm font-mono text-muted-foreground">{event.user_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Tentativas</p>
                <p className="text-sm text-muted-foreground">{event.attempts}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Replays</p>
                <p className="text-sm text-muted-foreground">
                  {event.replay_count}
                  {event.last_replay_at && (
                    <span className="ml-2 text-xs">
                      (último:{" "}
                      {safeDateFormat(
                        event.last_replay_at,
                        (date) => format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
                        "-"
                      )}
                      )
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Falhou em</p>
                <p className="text-sm text-muted-foreground">
                  {safeDateFormat(
                    event.failed_at,
                    (date) => format(date, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }),
                    "-"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Arquivado em</p>
                <p className="text-sm text-muted-foreground">
                  {safeDateFormat(
                    event.archived_at,
                    (date) => format(date, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR }),
                    "-"
                  )}
                </p>
              </div>
            </div>

            <Separator />

            {/* Error */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Erro</p>
                <Button variant="ghost" size="sm" onClick={handleCopyError}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded-md bg-destructive/10 p-3">
                <pre className="text-xs text-destructive whitespace-pre-wrap break-words font-mono">
                  {event.last_error}
                </pre>
              </div>
            </div>

            <Separator />

            {/* Payload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Payload (JSON)</p>
                <Button variant="ghost" size="sm" onClick={handleCopyPayload}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded-md bg-muted p-3">
                <pre className="text-xs whitespace-pre-wrap break-words font-mono">
                  {formattedPayload}
                </pre>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Fechar
          </Button>
          <Button
            variant="default"
            onClick={() => {
              onReplay(event)
              onClose()
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reprocessar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(event)
              onClose()
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
