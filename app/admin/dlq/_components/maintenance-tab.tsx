"use client"

import { useState } from "react"

import { AlertTriangle, Database, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

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
import { adminApi } from "@/lib/api"
import { safeDateFormat } from "@/lib/date-utils"
import type { DLQStats } from "@/types"

interface MaintenanceTabProps {
  stats: DLQStats | null
  onRefresh: () => void
}

export function MaintenanceTab({ stats, onRefresh }: MaintenanceTabProps) {
  const [pruning, setPruning] = useState(false)
  const [showPruneDialog, setShowPruneDialog] = useState(false)

  const handlePrune = async () => {
    setPruning(true)
    try {
      const response = await adminApi.dlq.prune()

      // DLQPruneResponse já vem direto
      if (response.success) {
        toast.success(response.message || "DLQ limpa com sucesso")
        onRefresh()
      } else {
        toast.error("Falha ao limpar a DLQ")
      }
    } catch (error: any) {
      toast.error(`Erro ao limpar DLQ: ${error.message}`)
    } finally {
      setPruning(false)
      setShowPruneDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Prune Section */}
      <Card className="border-red-500/50">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-red-500/10 p-3">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle>Limpeza da DLQ</CardTitle>
              <CardDescription>
                Remove TODOS os eventos da Dead Letter Queue permanentemente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estatísticas */}
          {stats && stats.total_count > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total de Eventos</span>
                <span className="text-sm font-bold">{stats.total_count}</span>
              </div>
              {stats.oldest_event && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Evento Mais Antigo</span>
                  <span className="text-sm">
                    {safeDateFormat(
                      stats.oldest_event,
                      (date) => date.toLocaleString("pt-BR"),
                      "-"
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Avisos */}
          <div className="flex items-start gap-3 rounded-lg border border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⚠️ Operação Destrutiva
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                <li>Esta ação é irreversível e não pode ser desfeita</li>
                <li>Todos os eventos serão permanentemente removidos</li>
                <li>Considere fazer backup antes de prosseguir</li>
                <li>Certifique-se de que os problemas que causaram as falhas foram corrigidos</li>
              </ul>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {stats?.total_count || 0} evento(s) será(ão) removido(s)
              </span>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowPruneDialog(true)}
              disabled={pruning || !stats || stats.total_count === 0}
            >
              {pruning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Limpando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar DLQ
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre a Limpeza da DLQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Quando usar a limpeza?</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Após corrigir problemas de configuração que causaram as falhas</li>
              <li>Quando os eventos na DLQ não são mais relevantes</li>
              <li>Para limpar eventos de testes ou desenvolvimento</li>
              <li>Quando a DLQ está com muitos eventos antigos</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Alternativas à limpeza total:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Use a aba "Eventos" para deletar eventos específicos</li>
              <li>Use filtros para deletar apenas eventos de um transport específico</li>
              <li>Considere fazer replay dos eventos antes de deletar</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showPruneDialog} onOpenChange={setShowPruneDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar Limpeza da DLQ
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Você está prestes a deletar permanentemente{" "}
                <span className="font-bold text-foreground">
                  {stats?.total_count || 0} evento(s)
                </span>{" "}
                da Dead Letter Queue.
              </p>
              <p className="font-semibold text-red-600 dark:text-red-400">
                Esta ação NÃO pode ser desfeita!
              </p>
              <p>Tem certeza de que deseja continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pruning}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePrune}
              disabled={pruning}
              className="bg-red-500 hover:bg-red-600"
            >
              {pruning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Limpando...
                </>
              ) : (
                "Sim, Limpar DLQ"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
