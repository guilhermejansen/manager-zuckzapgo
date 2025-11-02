"use client"

import { useEffect, useState } from "react"

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DLQDeleteParams, DLQEvent, DLQReplayParams } from "@/types"

interface DryRunPreviewProps {
  action: "replay" | "delete"
  params: DLQReplayParams | DLQDeleteParams | null
  selectedIds?: number[]
  onConfirm: () => Promise<void>
  onCancel: () => void
  onDryRun: (params: any) => Promise<{ affected: number; events?: DLQEvent[] }>
}

export function DryRunPreview({
  action,
  params,
  selectedIds,
  onConfirm,
  onCancel,
  onDryRun,
}: DryRunPreviewProps) {
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [affectedCount, setAffectedCount] = useState(0)
  const [affectedEvents, setAffectedEvents] = useState<DLQEvent[]>([])

  useEffect(() => {
    if (params) {
      performDryRun()
    }
  }, [params])

  const performDryRun = async () => {
    if (!params) return

    setLoading(true)
    try {
      // Para ações individuais com IDs selecionados
      if (selectedIds && selectedIds.length > 0) {
        setAffectedCount(selectedIds.length)
        setAffectedEvents([])
      } else {
        // Para bulk operations com filtros
        const dryRunParams = { ...params, dry_run: true }
        const result = await onDryRun(dryRunParams)
        setAffectedCount(result.affected)
        setAffectedEvents(result.events || [])
      }
    } catch (error: any) {
      toast.error(`Erro no dry-run: ${error.message}`)
      onCancel()
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await onConfirm()
      toast.success(
        action === "replay"
          ? `${affectedCount} evento(s) reprocessado(s) com sucesso`
          : `${affectedCount} evento(s) deletado(s) com sucesso`
      )
      onCancel()
    } catch (error: any) {
      toast.error(`Erro: ${error.message}`)
    } finally {
      setConfirming(false)
    }
  }

  if (!params) return null

  const actionText = action === "replay" ? "Reprocessar" : "Deletar"
  const actionVerb = action === "replay" ? "reprocessados" : "deletados"

  return (
    <Dialog open={!!params} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Confirmar {actionText}
          </DialogTitle>
          <DialogDescription>Preview dos eventos que serão {actionVerb}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold">{affectedCount} evento(s)</span> serão {actionVerb}
              </AlertDescription>
            </Alert>

            {affectedEvents.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Eventos que serão afetados:</p>
                <ScrollArea className="h-[200px] rounded-md border p-3">
                  <div className="space-y-2">
                    {affectedEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">
                            #{event.id}
                          </span>
                          <Badge variant="outline">{event.transport}</Badge>
                          <Badge variant="secondary">{event.event_type}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {event.user_id}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {selectedIds && selectedIds.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">IDs selecionados:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIds.map((id) => (
                    <Badge key={id} variant="outline" className="font-mono">
                      #{id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {action === "delete" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Atenção:</strong> Esta ação é irreversível. Os eventos serão
                  permanentemente removidos da DLQ.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={confirming}>
            Cancelar
          </Button>
          <Button
            variant={action === "replay" ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={loading || confirming || affectedCount === 0}
          >
            {confirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
