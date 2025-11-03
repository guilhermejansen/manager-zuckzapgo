"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { endOfDay, startOfDay } from "date-fns"
import { Calendar as CalendarIcon, Check, ChevronDown, ChevronsUpDown, Filter, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { DLQEvent, DLQListParams } from "@/types"
import { EVENT_LABELS, SUPPORTED_EVENTS } from "@/types/constants"
import { formatTransportLabel } from "@/app/admin/shared/transport-utils"

interface AdvancedFiltersProps {
  filters: DLQListParams
  onFilterChange: (filters: DLQListParams) => void
  className?: string
  events: DLQEvent[]
  availableTransports?: string[]
}

// Helper function to validate date strings (prevents "Invalid time value" errors)
const isValidDate = (dateStr: string | undefined): boolean => {
  if (!dateStr) return false
  if (dateStr === "0001-01-01T00:00:00Z") return false // Go zero time value
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const formatTimeValue = (date: Date | null) => {
  if (!date) return ""
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

export function AdvancedFilters({
  filters,
  onFilterChange,
  className = "",
  events,
  availableTransports = [],
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<DLQListParams>(filters)
  const [transportOpen, setTransportOpen] = useState(false)
  const filtersRef = useRef(localFilters)

  useEffect(() => {
    filtersRef.current = localFilters
  }, [localFilters])

  // Debounce user_id input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filtersRef.current.user_id !== filters.user_id) {
        onFilterChange(filtersRef.current)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [filters.user_id, onFilterChange, localFilters.user_id])

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value !== undefined && value !== "" && key !== "limit" && key !== "offset"
  ).length

  const handleClearFilters = () => {
    const clearedFilters: DLQListParams = {
      limit: filters.limit,
      offset: 0,
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const applyFilters = (updates: Partial<DLQListParams>, emit = true) => {
    const newFilters = { ...localFilters, ...updates, offset: 0 }
    setLocalFilters(newFilters)
    if (emit) {
      onFilterChange(newFilters)
    }
  }

  const handleApplyFilter = (key: keyof DLQListParams, value: any) => {
    applyFilters({ [key]: value })
  }

  const transportValue = localFilters.transport ?? ""

  const transportOptions = useMemo(() => {
    const unique = new Set<string>()
    availableTransports.forEach((transport) => transport && unique.add(transport))
    events.forEach((event) => {
      if (event.transport) unique.add(event.transport)
    })
    if (localFilters.transport) unique.add(localFilters.transport)

    return Array.from(unique)
      .sort((a, b) => formatTransportLabel(a).localeCompare(formatTransportLabel(b), "pt-BR"))
      .map((value) => ({ value, label: formatTransportLabel(value) }))
  }, [availableTransports, events, localFilters.transport])

  const handleSelectTransport = (value: string) => {
    const normalized = value === "all" ? undefined : value
    setTransportOpen(false)
    applyFilters({ transport: normalized })
  }

  const fromDate = isValidDate(localFilters.from) ? new Date(localFilters.from!) : null
  const toDate = isValidDate(localFilters.to) ? new Date(localFilters.to!) : null

  const handleFromDateChange = (date?: Date) => {
    if (!date) {
      applyFilters({ from: undefined })
      return
    }

    const reference = fromDate ?? startOfDay(date)
    const next = new Date(date)
    next.setHours(reference.getHours(), reference.getMinutes(), 0, 0)

    const updates: Partial<DLQListParams> = { from: next.toISOString() }

    if (toDate && next.getTime() > toDate.getTime()) {
      const end = endOfDay(next)
      updates.to = end.toISOString()
    }

    applyFilters(updates)
  }

  const handleFromTimeChange = (timeValue: string) => {
    if (!fromDate) return

    if (!timeValue) {
      const reset = startOfDay(fromDate)
      applyFilters({ from: reset.toISOString() })
      return
    }

    const [hours, minutes] = timeValue.split(":").map((part) => Number(part))
    const next = new Date(fromDate)
    next.setHours(hours || 0, minutes || 0, 0, 0)
    applyFilters({ from: next.toISOString() })
  }

  const handleToDateChange = (date?: Date) => {
    if (!date) {
      applyFilters({ to: undefined })
      return
    }

    const reference = toDate ?? endOfDay(date)
    const next = new Date(date)
    next.setHours(reference.getHours(), reference.getMinutes(), 0, 0)
    const updates: Partial<DLQListParams> = { to: next.toISOString() }

    const currentFrom = fromDate
    if (currentFrom && next.getTime() < currentFrom.getTime()) {
      const start = startOfDay(date)
      updates.from = start.toISOString()
    }

    applyFilters(updates)
  }

  const handleToTimeChange = (timeValue: string) => {
    if (!toDate) return

    if (!timeValue) {
      const reset = endOfDay(toDate)
      applyFilters({ to: reset.toISOString() })
      return
    }

    const [hours, minutes] = timeValue.split(":").map((part) => Number(part))
    const next = new Date(toDate)
    next.setHours(hours || 0, minutes || 0, 0, 0)
    applyFilters({ to: next.toISOString() })
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros Avançados
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      <CollapsibleContent className="mt-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Transport Filter */}
          <div className="space-y-2">
            <Label htmlFor="transport">Transport</Label>
            <Popover open={transportOpen} onOpenChange={setTransportOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="transport"
                  variant="outline"
                  role="combobox"
                  aria-expanded={transportOpen}
                  className="w-full justify-between gap-2"
                  title={
                    transportValue
                      ? formatTransportLabel(transportValue, "Todos os transportes")
                      : "Todos os transportes"
                  }
                >
                  <span className="flex-1 truncate text-left">
                    {transportValue
                      ? formatTransportLabel(transportValue, "Todos os transportes")
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
          <div className="space-y-2">
            <Label htmlFor="user_id">User ID</Label>
            <Input
              id="user_id"
              placeholder="Filtrar por user_id"
              value={localFilters.user_id || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  user_id: e.target.value || undefined,
                  offset: 0,
                })
              }
            />
          </div>

          {/* Event Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="event_type">Tipo de Evento</Label>
            <Select
              value={localFilters.event_type || "all"}
              onValueChange={(value) =>
                handleApplyFilter("event_type", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger id="event_type">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {SUPPORTED_EVENTS.map((eventType) => (
                  <SelectItem key={eventType} value={eventType}>
                    {EVENT_LABELS[eventType]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* From Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="from">Data Inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="from"
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    fromDate ? "w-full" : "w-full text-muted-foreground"
                  )}
                  title={fromDate ? DATE_TIME_FORMATTER.format(fromDate) : "Selecionar data inicial"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? DATE_TIME_FORMATTER.format(fromDate) : "Data inicial"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="space-y-3 p-3">
                  <Calendar
                    mode="single"
                    selected={fromDate ?? undefined}
                    onSelect={(date) => handleFromDateChange(date ?? undefined)}
                    initialFocus
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formatTimeValue(fromDate)}
                      onChange={(event) => handleFromTimeChange(event.target.value)}
                      disabled={!fromDate}
                    />
                    {fromDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFilters({ from: undefined })}
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="to">Data Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="to"
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    toDate ? "w-full" : "w-full text-muted-foreground"
                  )}
                  title={toDate ? DATE_TIME_FORMATTER.format(toDate) : "Selecionar data final"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? DATE_TIME_FORMATTER.format(toDate) : "Data final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="space-y-3 p-3">
                  <Calendar
                    mode="single"
                    selected={toDate ?? undefined}
                    onSelect={(date) => handleToDateChange(date ?? undefined)}
                    initialFocus
                    disabled={(date) => Boolean(fromDate && date < fromDate)}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formatTimeValue(toDate)}
                      onChange={(event) => handleToTimeChange(event.target.value)}
                      disabled={!toDate}
                    />
                    {toDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyFilters({ to: undefined })}
                      >
                        Limpar
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
