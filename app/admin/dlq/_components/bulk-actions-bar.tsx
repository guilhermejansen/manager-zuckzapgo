"use client"

import { RotateCcw, Trash2, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BulkActionsBarProps {
  selectedCount: number
  onReplayAll: () => void
  onDeleteAll: () => void
  onClearSelection: () => void
}

export function BulkActionsBar({
  selectedCount,
  onReplayAll,
  onDeleteAll,
  onClearSelection,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant="secondary" className="text-xs sm:text-sm">
        {selectedCount} {selectedCount === 1 ? "evento" : "eventos"}
      </Badge>

      <Button variant="outline" size="sm" onClick={onClearSelection}>
        <X className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Limpar</span>
      </Button>

      <Button variant="default" size="sm" onClick={onReplayAll}>
        <RotateCcw className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Reprocessar</span>
      </Button>

      <Button variant="destructive" size="sm" onClick={onDeleteAll}>
        <Trash2 className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Deletar</span>
      </Button>
    </div>
  )
}
