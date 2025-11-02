/**
 * Advanced Filters Component
 *
 * Filtros avançados para análise de campanhas.
 * Permite filtrar por data, status, instância, campanha, etc.
 *
 * @module components/campaign/filters/advanced-filters
 */

"use client"

import { useCallback, useState } from "react"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, Filter, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { logger } from "@/lib/logger"
import { cn } from "@/lib/utils"

/**
 * Advanced Filters Component
 *
 * Filtros avançados para análise de campanhas.
 * Permite filtrar por data, status, instância, campanha, etc.
 *
 * @module components/campaign/filters/advanced-filters
 */

/**
 * Advanced Filters Component
 *
 * Filtros avançados para análise de campanhas.
 * Permite filtrar por data, status, instância, campanha, etc.
 *
 * @module components/campaign/filters/advanced-filters
 */

// ============================================================================
// TYPES
// ============================================================================

export interface FilterState {
  dateFrom?: Date
  dateTo?: Date
  status?: string
  instanceId?: string
  campaignId?: string
  searchTerm?: string
}

interface AdvancedFiltersProps {
  onFilterChange?: (filters: FilterState) => void
  onReset?: () => void
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AdvancedFilters({ onFilterChange, onReset }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({})
  const [isExpanded, setIsExpanded] = useState(false)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      const newFilters = { ...filters, [key]: value }
      setFilters(newFilters)

      if (onFilterChange) {
        onFilterChange(newFilters)
      }

      logger.debug("Filters: Changed", null, {
        component: "AdvancedFilters",
        action: "handleFilterChange",
        metadata: { key, value },
      })
    },
    [filters, onFilterChange]
  )

  const handleReset = useCallback(() => {
    setFilters({})

    if (onReset) {
      onReset()
    }

    if (onFilterChange) {
      onFilterChange({})
    }

    logger.debug("Filters: Reset", null, {
      component: "AdvancedFilters",
      action: "handleReset",
    })
  }, [onFilterChange, onReset])

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} ativo(s)</Badge>
              )}
            </CardTitle>
            <CardDescription>Refine sua análise com filtros personalizados</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Ocultar" : "Expandir"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date From */}
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom
                      ? format(filters.dateFrom, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleFilterChange("dateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo
                      ? format(filters.dateTo, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleFilterChange("dateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="scheduled">Agendado</SelectItem>
                  <SelectItem value="running">Em execução</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instance */}
            <div className="space-y-2">
              <Label>Instância</Label>
              <Select
                value={filters.instanceId}
                onValueChange={(value) => handleFilterChange("instanceId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as instâncias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">Instance 1</SelectItem>
                  <SelectItem value="2">Instance 2</SelectItem>
                  <SelectItem value="3">Instance 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaign */}
            <div className="space-y-2">
              <Label>Campanha</Label>
              <Select
                value={filters.campaignId}
                onValueChange={(value) => handleFilterChange("campaignId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as campanhas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="1">Black Friday 2025</SelectItem>
                  <SelectItem value="2">Newsletter Semanal</SelectItem>
                  <SelectItem value="3">Promoção Verão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input
                placeholder="Nome da campanha..."
                value={filters.searchTerm || ""}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
