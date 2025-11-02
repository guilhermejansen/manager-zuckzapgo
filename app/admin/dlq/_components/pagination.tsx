"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PaginationProps {
  total: number
  limit: number
  offset: number
  onChange: (limit: number, offset: number) => void
}

export function Pagination({ total, limit, offset, onChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const canGoBack = offset > 0
  const canGoForward = offset + limit < total

  const handleFirst = () => {
    onChange(limit, 0)
  }

  const handlePrevious = () => {
    if (canGoBack) {
      onChange(limit, Math.max(0, offset - limit))
    }
  }

  const handleNext = () => {
    if (canGoForward) {
      onChange(limit, offset + limit)
    }
  }

  const handleLast = () => {
    const lastOffset = Math.floor((total - 1) / limit) * limit
    onChange(limit, lastOffset)
  }

  const handleLimitChange = (newLimit: string) => {
    const limitNum = parseInt(newLimit)
    // Maintain approximate position when changing limit
    const currentItem = offset
    const newOffset = Math.floor(currentItem / limitNum) * limitNum
    onChange(limitNum, newOffset)
  }

  if (total === 0) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Nenhum evento encontrado</p>
      </div>
    )
  }

  const startItem = offset + 1
  const endItem = Math.min(offset + limit, total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Results info */}
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium">{startItem}</span> até{" "}
          <span className="font-medium">{endItem}</span> de{" "}
          <span className="font-medium">{total}</span> eventos
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Limit selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Por página:</span>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFirst}
            disabled={!canGoBack}
            title="Primeira página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={!canGoBack}
            title="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center min-w-[100px] text-sm">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={!canGoForward}
            title="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleLast}
            disabled={!canGoForward}
            title="Última página"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
