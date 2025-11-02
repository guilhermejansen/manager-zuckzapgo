"use client"

import { useEffect, useState } from "react"

import { format } from "date-fns"
import { ChevronDown, Filter, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DLQListParams } from "@/types"
import { EVENT_LABELS, SUPPORTED_EVENTS } from "@/types/constants"

interface AdvancedFiltersProps {
  filters: DLQListParams
  onFilterChange: (filters: DLQListParams) => void
  className?: string
}

const TRANSPORTS = ["webhook", "rabbitmq", "s3", "sqs", "redis", "websocket"]

// Helper function to validate date strings (prevents "Invalid time value" errors)
const isValidDate = (dateStr: string | undefined): boolean => {
  if (!dateStr) return false
  if (dateStr === "0001-01-01T00:00:00Z") return false // Go zero time value
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

export function AdvancedFilters({ filters, onFilterChange, className = "" }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<DLQListParams>(filters)

  // Debounce user_id input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localFilters.user_id !== filters.user_id) {
        onFilterChange(localFilters)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [localFilters.user_id])

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

  const handleApplyFilter = (key: keyof DLQListParams, value: any) => {
    const newFilters = { ...localFilters, [key]: value, offset: 0 }
    setLocalFilters(newFilters)
    if (key !== "user_id") {
      onFilterChange(newFilters)
    }
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
            <Select
              value={localFilters.transport || "all"}
              onValueChange={(value) =>
                handleApplyFilter("transport", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger id="transport">
                <SelectValue placeholder="Todos os transports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os transports</SelectItem>
                {TRANSPORTS.map((transport) => (
                  <SelectItem key={transport} value={transport}>
                    {transport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Input
              id="from"
              type="datetime-local"
              value={
                localFilters.from && isValidDate(localFilters.from)
                  ? format(new Date(localFilters.from), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value ? new Date(e.target.value).toISOString() : undefined
                handleApplyFilter("from", value)
              }}
            />
          </div>

          {/* To Date Filter */}
          <div className="space-y-2">
            <Label htmlFor="to">Data Final</Label>
            <Input
              id="to"
              type="datetime-local"
              value={
                localFilters.to && isValidDate(localFilters.to)
                  ? format(new Date(localFilters.to), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value ? new Date(e.target.value).toISOString() : undefined
                handleApplyFilter("to", value)
              }}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
