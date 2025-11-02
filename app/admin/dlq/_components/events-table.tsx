"use client"

import { useState } from "react"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Eye, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { safeDateFormat } from "@/lib/date-utils"
import type { DLQEvent } from "@/types"

interface EventsTableProps {
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

export function EventsTable({
  events,
  selectedIds,
  onSelectionChange,
  onViewDetails,
  onReplay,
  onDelete,
  loading = false,
}: EventsTableProps) {
  // Garantir que events é sempre um array
  const safeEvents = Array.isArray(events) ? events : []

  const allSelected = safeEvents.length > 0 && safeEvents.every((e) => selectedIds.has(e.id))
  const someSelected = safeEvents.some((e) => selectedIds.has(e.id)) && !allSelected

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(safeEvents.map((e) => e.id)))
    }
  }

  const handleSelectOne = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange(newSelected)
  }

  const truncateError = (error: string, maxLength = 50) => {
    if (error.length <= maxLength) return error
    return error.substring(0, maxLength) + "..."
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando eventos...</div>
  }

  if (safeEvents.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Nenhum evento encontrado</div>
  }

  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Selecionar todos"
                className="data-[state=indeterminate]:bg-primary"
                {...(someSelected && { "data-state": "indeterminate" })}
              />
            </TableHead>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Transport</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead>Tipo de Evento</TableHead>
            <TableHead className="max-w-[300px]">Erro</TableHead>
            <TableHead className="w-[100px]">Tentativas</TableHead>
            <TableHead className="w-[120px]">Falhou em</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(event.id)}
                  onCheckedChange={() => handleSelectOne(event.id)}
                  aria-label={`Selecionar evento ${event.id}`}
                />
              </TableCell>
              <TableCell className="font-mono text-sm">{event.id}</TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className={getTransportColor(event.transport)}>
                        <span className="truncate max-w-[150px] block">{event.transport}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{event.transport}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="font-mono text-sm">
                <span className="truncate block max-w-[180px]" title={event.user_id}>
                  {event.user_id}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                  {event.event_type}
                </Badge>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-muted-foreground cursor-help">
                        {truncateError(event.last_error)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p className="text-sm whitespace-pre-wrap">{event.last_error}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">
                  {event.attempts}
                  {event.replay_count > 0 && (
                    <span className="text-muted-foreground ml-1">(+{event.replay_count})</span>
                  )}
                </span>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-muted-foreground cursor-help">
                        {safeDateFormat(
                          event.failed_at,
                          (date) => formatDistanceToNow(date, { locale: ptBR, addSuffix: true }),
                          "-"
                        )}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {safeDateFormat(
                          event.failed_at,
                          (date) => date.toLocaleString("pt-BR"),
                          "-"
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(event)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onReplay(event)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reprocessar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(event)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
