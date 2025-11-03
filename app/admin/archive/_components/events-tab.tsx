"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Eye,
  PlayCircle,
  Trash2,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { adminApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { ArchiveEvent, ArchiveListParams } from "@/types"
import { EVENT_LABELS, SUPPORTED_EVENTS, type SupportedEvent } from "@/types/constants"

import { formatTransportLabel } from "@/app/admin/shared/transport-utils"

import { EventDetailsDialog } from "./event-details-dialog"
import { formatArchiveEventDate, parseArchiveDate } from "./date-utils"

const DATE_FILTER_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function formatDateFilterLabel(date: Date | null): string {
  return date ? DATE_FILTER_FORMATTER.format(date) : ""
}

interface EventsTabProps {
  events: ArchiveEvent[]
  filters: ArchiveListParams
  onFilterChange: (filters: ArchiveListParams) => void
  onRefresh: () => void
  totalCount: number
  availableTransports: string[]
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
    label: "Failed",
  },
}

export function EventsTab({
  events,
  filters,
  onFilterChange,
  onRefresh,
  totalCount,
  availableTransports,
}: EventsTabProps) {
  const [selectedEvent, setSelectedEvent] = useState<ArchiveEvent | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [transportValue, setTransportValue] = useState(filters.transport ?? "")
  const [userIdValue, setUserIdValue] = useState(filters.user_id ?? "")
  const [transportOpen, setTransportOpen] = useState(false)

  const fromDate = useMemo(() => parseArchiveDate(filters.from_date), [filters.from_date])
  const toDate = useMemo(() => parseArchiveDate(filters.to_date), [filters.to_date])

  const filtersRef = useRef(filters)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialUserSync = useRef(true)

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    setTransportValue(filters.transport ?? "")
  }, [filters.transport])

  useEffect(() => {
    setUserIdValue(filters.user_id ?? "")
  }, [filters.user_id])

  useEffect(() => {
    if (isInitialUserSync.current) {
      isInitialUserSync.current = false
      return
    }

    if (userIdValue === (filtersRef.current.user_id ?? "")) {
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      onFilterChange({
        ...filtersRef.current,
        user_id: userIdValue,
        offset: 0,
      })
    }, 400)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [userIdValue, onFilterChange])

  const handleReplay = async (event: ArchiveEvent) => {
    setActionLoading(event.id)
    try {
      await adminApi.archive.replay({ event_id: event.id })
      toast.success(`Evento ${event.id} reenviado com sucesso`)
      onRefresh()
    } catch (error: any) {
      toast.error(`Erro ao reenviar evento: ${error.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (event: ArchiveEvent) => {
    if (!confirm(`Deseja deletar permanentemente o evento ${event.id}?`)) return

    setActionLoading(event.id)
    try {
      await adminApi.archive.deleteEvent(event.id)
      toast.success(`Evento ${event.id} deletado com sucesso`)
      onRefresh()
    } catch (error: any) {
      toast.error(`Erro ao deletar evento: ${error.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const pageSize = filters.limit || 50
  const currentPage = Math.floor((filters.offset || 0) / pageSize) + 1
  const totalPages = Math.ceil(totalCount / pageSize)

  const handlePageChange = (page: number) => {
    const size = filtersRef.current.limit || 50
    onFilterChange({
      ...filtersRef.current,
      transport: transportValue,
      user_id: userIdValue,
      offset: (page - 1) * size,
    })
  }

  const selectedEventType: SupportedEvent =
    filters.event_type && SUPPORTED_EVENTS.includes(filters.event_type as SupportedEvent)
      ? (filters.event_type as SupportedEvent)
      : "All"

  const transportOptions = useMemo(() => {
    const uniqueTransports = new Set<string>()
    availableTransports.forEach((transport) => {
      if (transport) uniqueTransports.add(transport)
    })
    events.forEach((event) => {
      if (event.transport) uniqueTransports.add(event.transport)
    })

    return Array.from(uniqueTransports)
      .sort((a, b) => formatTransportLabel(a).localeCompare(formatTransportLabel(b), "pt-BR"))
      .map((transport) => ({
        value: transport,
        label: formatTransportLabel(transport),
      }))
  }, [availableTransports, events])

  const handleSelectTransport = (value: string) => {
    const normalized = value === "all" ? "" : value
    setTransportValue(normalized)
    setTransportOpen(false)
    onFilterChange({
      ...filtersRef.current,
      transport: normalized,
      user_id: userIdValue,
      offset: 0,
    })
  }

  const handleDateFilterChange = (type: "from" | "to", date?: Date) => {
    const nextFilters: ArchiveListParams = {
      ...filtersRef.current,
      transport: transportValue,
      user_id: userIdValue,
      offset: 0,
    }

    if (type === "from") {
      if (date) {
        const start = startOfDay(date)
        nextFilters.from_date = start.toISOString()

        const currentToDate = parseArchiveDate(nextFilters.to_date)
        if (currentToDate && start.getTime() > currentToDate.getTime()) {
          const end = endOfDay(date)
          nextFilters.to_date = end.toISOString()
        }
      } else {
        nextFilters.from_date = undefined
      }
    } else {
      if (date) {
        const end = endOfDay(date)
        nextFilters.to_date = end.toISOString()

        const currentFromDate = parseArchiveDate(nextFilters.from_date)
        if (currentFromDate && end.getTime() < currentFromDate.getTime()) {
          const start = startOfDay(date)
          nextFilters.from_date = start.toISOString()
        }
      } else {
        nextFilters.to_date = undefined
      }
    }

    onFilterChange(nextFilters)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Eventos Arquivados</CardTitle>
            <CardDescription>{totalCount.toLocaleString()} eventos arquivados</CardDescription>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status-filter" className="text-xs">
                Status
              </Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(v) =>
                  onFilterChange({
                    ...filters,
                    transport: transportValue,
                    user_id: userIdValue,
                    status: v === "all" ? "" : (v as "dlq" | "success"),
                    offset: 0,
                  })
                }
              >
                <SelectTrigger id="status-filter" className="w-[140px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="success">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      Success
                    </div>
                  </SelectItem>
                  <SelectItem value="dlq">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-3 w-3 text-red-600" />
                      DLQ
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transport Filter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="transport-filter" className="text-xs">
                Transport
              </Label>
              <Popover open={transportOpen} onOpenChange={setTransportOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="transport-filter"
                    variant="outline"
                    role="combobox"
                    aria-expanded={transportOpen}
                    className="w-[240px] justify-between gap-2"
                    title={
                      transportValue ? formatTransportLabel(transportValue) : "Todos os transportes"
                    }
                  >
                    <span className="flex-1 truncate text-left">
                      {transportValue
                        ? formatTransportLabel(transportValue)
                        : "Todos os transportes"}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[260px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar transport..." />
                    <CommandList>
                      <CommandEmpty>Nenhum transport encontrado.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem value="all" onSelect={handleSelectTransport}>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              transportValue === "" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="truncate">Todos os transportes</span>
                        </CommandItem>
                        {transportOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={handleSelectTransport}
                            title={option.label}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                transportValue === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="truncate">{option.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* User ID Filter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user-filter" className="text-xs">
                User ID
              </Label>
              <Input
                id="user-filter"
                placeholder="user123..."
                value={userIdValue}
                onChange={(e) => setUserIdValue(e.target.value)}
                className="w-[120px]"
              />
            </div>

            {/* Event Type Filter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-type-filter" className="text-xs">
                Event Type
              </Label>
              <Select
                value={selectedEventType}
                onValueChange={(value) =>
                  onFilterChange({
                    ...filters,
                    transport: transportValue,
                    user_id: userIdValue,
                    event_type: value === "All" ? "" : value,
                    offset: 0,
                  })
                }
              >
                <SelectTrigger id="event-type-filter" className="w-[240px]">
                  <SelectValue placeholder="Todos os eventos" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {SUPPORTED_EVENTS.map((event) => (
                    <SelectItem key={event} value={event}>
                      {EVENT_LABELS[event]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Date Filter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="from-date-filter" className="text-xs">
                Data Inicial
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="from-date-filter"
                    variant="outline"
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                    title={fromDate ? formatDateFilterLabel(fromDate) : "Selecionar data inicial"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? formatDateFilterLabel(fromDate) : "Data inicial"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={fromDate ?? undefined}
                      onSelect={(date) => handleDateFilterChange("from", date ?? undefined)}
                      initialFocus
                      disabled={(date) => Boolean(toDate && date > toDate)}
                    />
                    {fromDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => handleDateFilterChange("from", undefined)}
                      >
                        Limpar data
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* To Date Filter */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="to-date-filter" className="text-xs">
                Data Final
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="to-date-filter"
                    variant="outline"
                    className={cn(
                      "w-[160px] justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                    title={toDate ? formatDateFilterLabel(toDate) : "Selecionar data final"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? formatDateFilterLabel(toDate) : "Data final"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <Calendar
                      mode="single"
                      selected={toDate ?? undefined}
                      onSelect={(date) => handleDateFilterChange("to", date ?? undefined)}
                      initialFocus
                      disabled={(date) => Boolean(fromDate && date < fromDate)}
                    />
                    {toDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => handleDateFilterChange("to", undefined)}
                      >
                        Limpar data
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Nenhum evento encontrado com os filtros atuais</p>
          </div>
        ) : (
          <>
            {/* Tabela Desktop (oculta em mobile) */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead className="w-[80px] text-center">Attempts</TableHead>
                    <TableHead>Archived At</TableHead>
                    <TableHead className="w-[180px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const config = statusConfig[event.status]
                    const StatusIcon = config.icon

                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-sm">{event.id}</TableCell>
                        <TableCell>
                          <Badge className={config.badge}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{event.transport}</TableCell>
                        <TableCell className="font-mono text-xs truncate max-w-[120px]">
                          {event.user_id}
                        </TableCell>
                        <TableCell>{event.event_type}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{event.attempts}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatArchiveEventDate(event)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedEvent(event)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReplay(event)}
                              disabled={actionLoading === event.id}
                              title="Replay Event"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(event)}
                              disabled={actionLoading === event.id}
                              title="Delete Event"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Cards Mobile (ocultos em desktop) */}
            <div className="md:hidden space-y-4">
              {events.map((event) => {
                const config = statusConfig[event.status]
                const StatusIcon = config.icon

                return (
                  <div key={event.id} className="rounded-lg border bg-card p-4 space-y-3">
                    {/* Header do Card */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">ID</span>
                          <span className="font-mono text-sm font-bold">{event.id}</span>
                        </div>
                        <Badge className={config.badge}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <Badge variant="outline">{event.attempts} tentativas</Badge>
                    </div>

                    {/* Informações do Evento */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transport:</span>
                        <span className="font-mono text-xs">{event.transport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Event Type:</span>
                        <span className="font-medium">{event.event_type}</span>
                      </div>
                      {event.user_id && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID:</span>
                          <span className="font-mono text-xs truncate max-w-[150px]">
                            {event.user_id}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Arquivado em:</span>
                        <span className="text-xs">{formatArchiveEventDate(event)}</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                        className="flex-1"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReplay(event)}
                        disabled={actionLoading === event.id}
                        className="flex-1"
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Replay
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event)}
                        disabled={actionLoading === event.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} ({totalCount.toLocaleString()} eventos)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <EventDetailsDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </Card>
  )
}
