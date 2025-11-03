"use client"

import { useState } from "react"

import { toast } from "sonner"

import { adminApi } from "@/lib/api"
import type { DLQEvent, DLQListParams } from "@/types"

import { AdvancedFilters } from "./advanced-filters"
import { BulkActionsBar } from "./bulk-actions-bar"
import { DryRunPreview } from "./dry-run-preview"
import { EventDetailsDialog } from "./event-details-dialog"
import { EventsCards } from "./events-cards"
import { EventsTable } from "./events-table"
import { Pagination } from "./pagination"

interface EventsTabProps {
  events: DLQEvent[]
  filters: DLQListParams
  onFilterChange: (filters: DLQListParams) => void
  onRefresh: () => void
  totalCount: number
  availableTransports: string[]
}

export function EventsTab({
  events,
  filters,
  onFilterChange,
  onRefresh,
  totalCount,
  availableTransports,
}: EventsTabProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [selectedEvent, setSelectedEvent] = useState<DLQEvent | null>(null)
  const [dryRunParams, setDryRunParams] = useState<{
    action: "replay" | "delete"
    params: any
    selectedIds?: number[]
  } | null>(null)

  const handleViewDetails = (event: DLQEvent) => {
    setSelectedEvent(event)
  }

  const handleReplaySingle = async (event: DLQEvent) => {
    setDryRunParams({
      action: "replay",
      params: { id: event.id, dry_run: false, remove_after: true },
      selectedIds: [event.id],
    })
  }

  const handleDeleteSingle = async (event: DLQEvent) => {
    setDryRunParams({
      action: "delete",
      params: { confirm: true },
      selectedIds: [event.id],
    })
  }

  const handleReplaySelected = () => {
    if (selectedIds.size === 0) return
    setDryRunParams({
      action: "replay",
      params: { dry_run: false, remove_after: true },
      selectedIds: Array.from(selectedIds),
    })
  }

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return
    setDryRunParams({
      action: "delete",
      params: { confirm: true },
      selectedIds: Array.from(selectedIds),
    })
  }

  const executeDryRun = async (params: any) => {
    if (dryRunParams?.action === "replay") {
      const response = await adminApi.dlq.replay(params)
      return {
        affected: response.replayed_count ?? 0,
        events: response.events_affected?.map((id) => ({ id }) as any) ?? [],
      }
    } else {
      const response = await adminApi.dlq.bulkDelete(params)
      return {
        affected: response.deleted_count ?? 0,
        events: [],
      }
    }
  }

  const executeAction = async () => {
    if (!dryRunParams) return

    const { action, selectedIds: ids } = dryRunParams

    try {
      if (action === "replay") {
        if (ids && ids.length === 1) {
          await adminApi.dlq.replay({
            id: ids[0],
            remove_after: true,
          })
          toast.success("Evento reenviado com sucesso")
        } else if (ids && ids.length > 1) {
          for (const id of ids) {
            await adminApi.dlq.replay({
              id,
              remove_after: true,
            })
          }
          toast.success(`${ids.length} eventos reenviados com sucesso`)
        }
      } else if (action === "delete") {
        if (ids && ids.length === 1) {
          await adminApi.dlq.deleteEvent(ids[0])
          toast.success("Evento deletado com sucesso")
        } else if (ids && ids.length > 1) {
          for (const id of ids) {
            await adminApi.dlq.deleteEvent(id)
          }
          toast.success(`${ids.length} eventos deletados com sucesso`)
        }
      }

      setDryRunParams(null)
      setSelectedIds(new Set())
      onRefresh()
    } catch (error: any) {
      toast.error(`Erro na operação: ${error.message}`)
    }
  }

  return (
    <div className="space-y-4 w-full overflow-x-hidden">
      {/* Filtros Avançados e Bulk Actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <AdvancedFilters
          filters={filters}
          onFilterChange={onFilterChange}
          events={events}
          availableTransports={availableTransports}
        />
        <BulkActionsBar
          selectedCount={selectedIds.size}
          onReplayAll={handleReplaySelected}
          onDeleteAll={handleDeleteSelected}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      </div>

      {/* Desktop: Tabela (apenas telas muito grandes ≥1280px) */}
      <div className="hidden xl:block">
        <EventsTable
          events={events}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onViewDetails={handleViewDetails}
          onReplay={handleReplaySingle}
          onDelete={handleDeleteSingle}
          loading={false}
        />
      </div>

      {/* Mobile/Tablet/Desktop pequeno: Cards (<1280px) */}
      <div className="xl:hidden">
        <EventsCards
          events={events}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onViewDetails={handleViewDetails}
          onReplay={handleReplaySingle}
          onDelete={handleDeleteSingle}
          loading={false}
        />
      </div>

      {/* Paginação */}
      {events.length > 0 && (
        <Pagination
          total={totalCount}
          limit={filters.limit || 50}
          offset={filters.offset || 0}
          onChange={(limit, offset) => onFilterChange({ ...filters, limit, offset })}
        />
      )}

      {/* Dialogs */}
      <EventDetailsDialog
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onReplay={handleReplaySingle}
        onDelete={handleDeleteSingle}
      />

      {dryRunParams && (
        <DryRunPreview
          action={dryRunParams.action}
          params={dryRunParams.params}
          selectedIds={dryRunParams.selectedIds}
          onConfirm={executeAction}
          onCancel={() => setDryRunParams(null)}
          onDryRun={executeDryRun}
        />
      )}
    </div>
  )
}
