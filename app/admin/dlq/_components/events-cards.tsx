"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertCircle, Eye, RotateCcw, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { safeDateFormat } from "@/lib/date-utils"
import type { DLQEvent } from "@/types"

interface EventsCardsProps {
  events: DLQEvent[]
  selectedIds: Set<number>
  onSelectionChange: (selectedIds: Set<number>) => void
  onViewDetails: (event: DLQEvent) => void
  onReplay: (event: DLQEvent) => void
  onDelete: (event: DLQEvent) => void
  loading?: boolean
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

export function EventsCards({
  events,
  selectedIds,
  onSelectionChange,
  onViewDetails,
  onReplay,
  onDelete,
  loading = false,
}: EventsCardsProps) {
  // Garantir que events é sempre um array
  const safeEvents = Array.isArray(events) ? events : []

  const handleSelectOne = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange(newSelected)
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando eventos...</div>
  }

  if (safeEvents.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhum evento encontrado</div>
  }

  return (
    <div className="space-y-4 w-full">
      {safeEvents.map((event) => (
        <Card key={event.id} className="relative w-full overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Checkbox
                  checked={selectedIds.has(event.id)}
                  onCheckedChange={() => handleSelectOne(event.id)}
                  aria-label={`Selecionar evento ${event.id}`}
                  className="mt-1 flex-shrink-0"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-mono text-muted-foreground">#{event.id}</span>
                    <Badge variant="outline" className={getTransportColor(event.transport)}>
                      <span className="truncate max-w-[150px] block">{event.transport}</span>
                    </Badge>
                    <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                      {event.event_type}
                    </Badge>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground truncate">
                    User:{" "}
                    <span className="truncate inline-block max-w-[200px] align-bottom">
                      {event.user_id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 w-full overflow-hidden">
            {/* Error */}
            <div className="flex items-start gap-2 min-w-0">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground line-clamp-2 break-words min-w-0">
                {event.last_error}
              </p>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="whitespace-nowrap">
                {event.attempts} tentativas
                {event.replay_count > 0 && ` (+${event.replay_count} replays)`}
              </span>
              <span className="whitespace-nowrap">
                {safeDateFormat(
                  event.failed_at,
                  (date) => formatDistanceToNow(date, { locale: ptBR, addSuffix: true }),
                  "-"
                )}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[100px]"
                onClick={() => onViewDetails(event)}
              >
                <Eye className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Ver Detalhes</span>
                <span className="sm:hidden">Ver</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[110px]"
                onClick={() => onReplay(event)}
              >
                <RotateCcw className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Reprocessar</span>
                <span className="sm:hidden">Replay</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(event)}
                className="text-destructive flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
