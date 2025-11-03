"use client"

import { CheckCircle2, Copy, XCircle } from "lucide-react"
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
import type { ArchiveEvent } from "@/types"

import { formatArchiveDateString, formatArchiveEventDate } from "./date-utils"

interface EventDetailsDialogProps {
  event: ArchiveEvent
  onClose: () => void
}

const statusConfig = {
  success: {
    badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    icon: CheckCircle2,
    label: "Success",
  },
  dlq: {
    badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    icon: XCircle,
    label: "Failed (DLQ)",
  },
}

export function EventDetailsDialog({ event, onClose }: EventDetailsDialogProps) {
  const config = statusConfig[event.status]
  const StatusIcon = config.icon

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(event.payload)
    toast.success("Payload copiado para clipboard")
  }

  let parsedPayload: any = null
  try {
    parsedPayload = JSON.parse(event.payload)
  } catch {
    // Payload não é JSON válido
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 pr-8">
            <span className="text-sm sm:text-base font-semibold">
              Event Details - ID {event.id}
            </span>
            <Badge className={config.badge}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {config.label}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Detalhes completos do evento arquivado
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar">
          <div className="space-y-4">
            {/* Metadata Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Metadata</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">Transport:</span>
                  <p className="font-mono text-xs break-words">{event.transport}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">User ID:</span>
                  <p className="font-mono text-xs break-words">{event.user_id}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">Event Type:</span>
                  <p className="font-medium text-xs">{event.event_type}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">Attempts:</span>
                  <p className="text-xs">{event.attempts}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">Created At:</span>
                  <p className="text-xs">{formatArchiveDateString(event.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">Archived At:</span>
                  <p className="text-xs">{formatArchiveEventDate(event)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">Replay Count:</span>
                  <p className="text-xs">{event.replay_count}</p>
                </div>
                {event.last_replay_at && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs block">Last Replay:</span>
                    <p className="text-xs">{formatArchiveDateString(event.last_replay_at)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Section (DLQ only) */}
            {event.status === "dlq" && event.last_error && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600">Error</h4>
                  <div className="rounded-md bg-red-50 dark:bg-red-950 p-3 border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-900 dark:text-red-100 font-mono break-words whitespace-pre-wrap">
                      {event.last_error}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Payload Section */}
            <Separator />
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h4 className="text-sm font-semibold">Event Payload</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPayload}
                  className="w-full sm:w-auto shrink-0"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy JSON
                </Button>
              </div>
              <div className="rounded-md bg-muted/50 p-3 border">
                <div className="overflow-x-auto custom-scrollbar">
                  <pre className="text-[10px] leading-relaxed font-mono">
                    {parsedPayload ? JSON.stringify(parsedPayload, null, 2) : event.payload}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t bg-muted/30">
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
