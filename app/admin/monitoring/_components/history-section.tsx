"use client"

import { ChangeEvent } from "react"

import { formatDistanceToNow, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Database, Filter, RefreshCw, RotateCcw, Calendar as CalendarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { EVENT_LABELS, SUPPORTED_EVENTS, type SupportedEvent } from "@/types/constants"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getInterpretedStatus, getStatusBadgeClass } from "@/lib/monitoring-status"
import { cn } from "@/lib/utils"
import type { MonitoringEvent, MonitoringHistoryParams } from "@/types"

interface MonitoringHistorySectionProps {
  events: MonitoringEvent[]
  loading?: boolean
  filters: MonitoringHistoryParams
  totalCount?: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  canGoPrevious: boolean
  canGoNext: boolean
  onFiltersChange: (filters: MonitoringHistoryParams) => void
  onResetFilters: () => void
  onRefresh: () => void
  onViewEvent: (event: MonitoringEvent) => void
  onNextPage: () => void
  onPreviousPage: () => void
}

const STATUS_ALL_VALUE = "all"

const STATUS_OPTIONS = [
  { label: "Todos", value: STATUS_ALL_VALUE },
  { label: "Entregues", value: "delivered" },
  { label: "Processando", value: "processing" },
  { label: "Pendentes", value: "pending" },
  { label: "Falhos", value: "failed" },
]

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

function parseDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function formatTimeValue(date: Date | null) {
  if (!date) return ""
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

export function HistorySection({
  events,
  loading = false,
  filters,
  totalCount,
  hasMore,
  currentPage,
  totalPages,
  canGoPrevious,
  canGoNext,
  onFiltersChange,
  onResetFilters,
  onRefresh,
  onViewEvent,
  onNextPage,
  onPreviousPage,
}: MonitoringHistorySectionProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const nextFilters: MonitoringHistoryParams = { ...filters }

    if (name !== "before_id") {
      nextFilters.before_id = undefined
    }

    if (!value) {
      delete (nextFilters as Record<string, unknown>)[name]
    } else if (name === "before_id" || name === "limit") {
      const parsed = Number(value)
      if (!Number.isNaN(parsed)) {
        ;(nextFilters as Record<string, unknown>)[name] = parsed
      }
    } else {
      ;(nextFilters as Record<string, unknown>)[name] = value
    }

    onFiltersChange(nextFilters)
  }

  const handleStatusChange = (value: string) => {
    const next = { ...filters }
    if (!value || value === STATUS_ALL_VALUE) {
      next.status = undefined
    } else {
      next.status = value
    }
    next.before_id = undefined
    onFiltersChange(next)
  }

  const handleToggleFailed = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      only_failed: checked ? true : undefined,
      before_id: undefined,
    })
  }

  const sinceDate = parseDate(filters.since_time)

  const handleSinceDateChange = (date?: Date) => {
    if (!date) {
      onFiltersChange({ ...filters, since_time: undefined, before_id: undefined })
      return
    }

    const current = sinceDate ?? startOfDay(date)
    const next = new Date(date)
    next.setHours(current.getHours(), current.getMinutes(), 0, 0)

    onFiltersChange({
      ...filters,
      since_time: next.toISOString(),
      before_id: undefined,
    })
  }

  const handleSinceTimeChange = (timeValue: string) => {
    if (!timeValue) {
      if (sinceDate) {
        const reset = startOfDay(sinceDate)
        onFiltersChange({ ...filters, since_time: reset.toISOString(), before_id: undefined })
      }
      return
    }

    const [hours, minutes] = timeValue.split(":").map((part) => Number(part))
    const base = sinceDate ? new Date(sinceDate) : startOfDay(new Date())
    base.setHours(hours || 0, minutes || 0, 0, 0)

    onFiltersChange({ ...filters, since_time: base.toISOString(), before_id: undefined })
  }

  const selectedEventType: SupportedEvent =
    filters.event_type && SUPPORTED_EVENTS.includes(filters.event_type as SupportedEvent)
      ? (filters.event_type as SupportedEvent)
      : "All"


  const limitValue = filters.limit ?? 50
  const showPagination =
    !loading &&
    events.length > 0 &&
    (totalPages > 1 || currentPage > 1 || canGoNext || canGoPrevious)
  const renderRelativeDate = (timestamp: string, className?: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("underline decoration-dotted underline-offset-2", className)}>
            {formatDistanceToNow(new Date(timestamp), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </TooltipTrigger>
        <TooltipContent>{new Date(timestamp).toLocaleString("pt-BR")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Filter className="h-4 w-4 text-muted-foreground" /> Filtros avançados
              </CardTitle>
              <CardDescription>
                Combine filtros por usuário, tipo e janela temporal para investigar eventos em lote.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" /> Limpar filtros
              </Button>
              <Button size="sm" onClick={onRefresh} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-3.5 w-3.5" /> Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="user_id" className="text-xs font-medium text-muted-foreground">
                User ID
              </Label>
              <Input
                id="user_id"
                name="user_id"
                placeholder="ex: acct-01"
                value={filters.user_id ?? ""}
                onChange={handleInputChange}
                className="w-[200px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-type-filter" className="text-xs font-medium text-muted-foreground">
                Tipo de evento
              </Label>
              <Select
                value={selectedEventType}
                onValueChange={(value) => {
                  const nextValue = value as SupportedEvent
                  onFiltersChange({
                    ...filters,
                    event_type: nextValue === "All" ? undefined : nextValue,
                    before_id: undefined,
                  })
                }}
              >
                <SelectTrigger id="event-type-filter" className="w-[220px]">
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
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select value={filters.status ?? STATUS_ALL_VALUE} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="limit" className="text-xs font-medium text-muted-foreground">
                Limite
              </Label>
              <Input
                id="limit"
                name="limit"
                type="number"
                min={1}
                max={1000}
                value={limitValue}
                onChange={handleInputChange}
                className="w-[120px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="before_id" className="text-xs font-medium text-muted-foreground">
                Before ID
              </Label>
              <Input
                id="before_id"
                name="before_id"
                type="number"
                min={0}
                value={filters.before_id ?? ""}
                onChange={handleInputChange}
                className="w-[160px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="since_time" className="text-xs font-medium text-muted-foreground">
                Since time
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="since_time"
                    variant="outline"
                    className={cn(
                      "w-[220px] justify-start text-left font-normal",
                      !sinceDate && "text-muted-foreground"
                    )}
                    title={sinceDate ? DATE_TIME_FORMATTER.format(sinceDate) : "Selecionar data"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {sinceDate ? DATE_TIME_FORMATTER.format(sinceDate) : "Data e horário"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="space-y-3 p-3">
                    <Calendar
                      mode="single"
                      selected={sinceDate ?? undefined}
                      onSelect={(date) => handleSinceDateChange(date ?? undefined)}
                      initialFocus
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={formatTimeValue(sinceDate)}
                        onChange={(event) => handleSinceTimeChange(event.target.value)}
                        disabled={!sinceDate}
                      />
                      {sinceDate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onFiltersChange({
                              ...filters,
                              since_time: undefined,
                              before_id: undefined,
                            })
                          }
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex w-full items-center gap-3 rounded-lg border p-3 md:w-auto">
              <Switch
                id="only_failed"
                checked={Boolean(filters.only_failed)}
                onCheckedChange={handleToggleFailed}
              />
              <div className="space-y-0.5">
                <Label htmlFor="only_failed" className="text-sm font-semibold">
                  Somente eventos com falha
                </Label>
                <p className="text-xs text-muted-foreground">Ignora status diferentes de failed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Database className="h-4 w-4 text-muted-foreground" /> Eventos encontrados
              </CardTitle>
              <CardDescription>
                Exibindo {events.length.toLocaleString("pt-BR")} evento{events.length === 1 ? "" : "s"}
                {typeof totalCount === "number" && totalCount > events.length
                  ? ` · Total estimado ${totalCount.toLocaleString("pt-BR")}`
                  : ""}
              </CardDescription>
            </div>
            {hasMore && (
              <Badge variant="outline" className="w-full whitespace-nowrap text-xs md:w-auto">
                Paginação via cursor ({limitValue} por vez)
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Carregando histórico de eventos...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
              Nenhum evento encontrado com os filtros atuais.
            </div>
          ) : (
            <>
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">ID</TableHead>
                      <TableHead className="w-[220px]">User</TableHead>
                      <TableHead className="w-[160px]">Tipo</TableHead>
                      <TableHead className="w-[130px]">Status</TableHead>
                      <TableHead className="w-[110px] text-center">Tentativas</TableHead>
                      <TableHead>Criado</TableHead>
                      <TableHead>Atualizado</TableHead>
                      <TableHead className="w-[120px] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => {
                      const interpreted = getInterpretedStatus(event)

                      return (
                        <TableRow key={`${event.id}-${event.updated_at}`}>
                          <TableCell className="font-mono text-xs">{event.id}</TableCell>
                          <TableCell className="font-mono text-xs max-w-[220px] truncate">
                            {event.user_id || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {event.event_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge className={cn("text-xs font-medium", getStatusBadgeClass(interpreted))}>
                                    <span className="mr-1">{interpreted.icon}</span>
                                    {interpreted.label}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="space-y-1">
                                    <p className="font-medium text-xs">{interpreted.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Confiança: {interpreted.confidence === "high" ? "Alta" : interpreted.confidence === "medium" ? "Média" : "Baixa"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Status DB: {event.status}
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-xs font-semibold">
                              {event.attempts}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {renderRelativeDate(event.created_at)}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {renderRelativeDate(event.updated_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewEvent(event)}
                              >
                                Ver detalhes
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-4 md:hidden">
                {events.map((event) => {
                  const interpreted = getInterpretedStatus(event)

                  return (
                    <div
                      key={`${event.id}-${event.updated_at}`}
                      className="space-y-3 rounded-lg border bg-card p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">ID</span>
                            <span className="font-mono text-sm font-semibold">{event.id}</span>
                          </div>
                          <span className="font-mono text-xs text-muted-foreground break-all">
                            {event.user_id || "—"}
                          </span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className={cn("text-xs font-medium", getStatusBadgeClass(interpreted))}>
                                <span className="mr-1">{interpreted.icon}</span>
                                {interpreted.label}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-1">
                                <p className="font-medium text-xs">{interpreted.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Confiança: {interpreted.confidence === "high" ? "Alta" : interpreted.confidence === "medium" ? "Média" : "Baixa"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Status DB: {event.status}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <Badge variant="outline" className="text-xs">
                            {event.event_type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tentativas:</span>
                          <span className="font-medium">
                            {event.attempts} tentativa{event.attempts !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Criado:</span>
                          {renderRelativeDate(event.created_at, "text-right")}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Atualizado:</span>
                          {renderRelativeDate(event.updated_at, "text-right")}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => onViewEvent(event)}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {showPagination && (
            <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground">
                Página {currentPage.toLocaleString("pt-BR")}
                {totalPages > currentPage ? ` de ${totalPages.toLocaleString("pt-BR")}` : ""} (
                {events.length.toLocaleString("pt-BR")} evento{events.length === 1 ? "" : "s"}
                {typeof totalCount === "number" && totalCount > events.length
                  ? ` · ${totalCount.toLocaleString("pt-BR")} no total`
                  : ""}
                )
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPreviousPage}
                  disabled={!canGoPrevious || loading}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextPage}
                  disabled={!canGoNext || loading}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
