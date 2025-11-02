"use client"

import { useState } from "react"

import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PruneSectionProps {
  totalEvents: number
  onPrune: () => Promise<{ pruned: number }>
  onRefresh: () => void
}

export function PruneSection({ totalEvents, onPrune, onRefresh }: PruneSectionProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [pruning, setPruning] = useState(false)

  const handlePrune = async () => {
    setPruning(true)
    try {
      const result = await onPrune()
      toast.success(`${result.pruned} evento(s) removido(s) com sucesso`)
      setShowConfirm(false)
      onRefresh()
    } catch (error: any) {
      toast.error(`Erro ao executar prune: ${error.message}`)
    } finally {
      setPruning(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Limpeza da DLQ (Prune)
          </CardTitle>
          <CardDescription>
            Remove permanentemente todos os eventos da Dead Letter Queue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> Esta operação é irreversível e remove TODOS os eventos da
              DLQ. Use com cautela.
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Total de eventos na DLQ: <span className="font-bold">{totalEvents}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Todos estes eventos serão permanentemente removidos
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowConfirm(true)}
              disabled={totalEvents === 0 || pruning}
            >
              {pruning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Executar Prune
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Prune da DLQ
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a remover <strong>{totalEvents} evento(s)</strong> da Dead Letter
              Queue de forma permanente.
              <br />
              <br />
              Esta ação <strong>não pode ser desfeita</strong>. Todos os eventos falhados serão
              permanentemente excluídos do sistema.
              <br />
              <br />
              Tem certeza que deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pruning}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePrune}
              disabled={pruning}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {pruning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sim, Executar Prune
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
