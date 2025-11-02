"use client"

import { useState } from "react"

import { AlertTriangle, CheckCircle2, Play, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminApi } from "@/lib/api"
import type { ArchiveDeleteBulkRequest, ArchiveReplayRequest, ArchiveStats } from "@/types"

interface MaintenanceTabProps {
  stats: ArchiveStats
  onRefresh: () => void
}

export function MaintenanceTab({ stats, onRefresh }: MaintenanceTabProps) {
  // Replay state
  const [replayStatus, setReplayStatus] = useState<"dlq" | "success" | "">("")
  const [replayTransport, setReplayTransport] = useState("")
  const [replayEventType, setReplayEventType] = useState("")
  const [replayUserId, setReplayUserId] = useState("")
  const [replayDryRun, setReplayDryRun] = useState(true)
  const [replayLoading, setReplayLoading] = useState(false)
  const [replayPreview, setReplayPreview] = useState<{ count: number } | null>(null)

  // Delete state
  const [deleteStatus, setDeleteStatus] = useState<"dlq" | "success" | "">("")
  const [deleteTransport, setDeleteTransport] = useState("")
  const [deleteEventType, setDeleteEventType] = useState("")
  const [deleteUserId, setDeleteUserId] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleReplayPreview = async () => {
    if (!replayStatus) {
      toast.error("Selecione um status para fazer replay")
      return
    }

    setReplayLoading(true)
    try {
      const request: ArchiveReplayRequest = {
        status: replayStatus,
        dry_run: true,
      }
      if (replayTransport) request.transport = replayTransport
      if (replayEventType) request.event_type = replayEventType
      if (replayUserId) request.user_id = replayUserId

      const response = await adminApi.archive.replay(request)
      if (response.success) {
        // Em dry_run, o backend retorna 'count', em execução real retorna 'replayed'
        const count = response.total ?? response.replayed ?? 0
        setReplayPreview({ count })
        toast.success(`Preview: ${count} eventos serão reprocessados`)
      }
    } catch (error) {
      toast.error("Erro ao gerar preview de replay")
      console.error(error)
    } finally {
      setReplayLoading(false)
    }
  }

  const handleReplayExecute = async () => {
    if (!replayStatus) {
      toast.error("Selecione um status para fazer replay")
      return
    }

    if (!replayPreview) {
      toast.error("Execute o preview primeiro")
      return
    }

    setReplayLoading(true)
    try {
      const request: ArchiveReplayRequest = {
        status: replayStatus,
        dry_run: false,
      }
      if (replayTransport) request.transport = replayTransport
      if (replayEventType) request.event_type = replayEventType
      if (replayUserId) request.user_id = replayUserId

      const response = await adminApi.archive.replay(request)
      if (response.success) {
        const count = response.replayed ?? 0
        toast.success(`${count} eventos reprocessados com sucesso`)
        setReplayPreview(null)
        setReplayStatus("")
        setReplayTransport("")
        setReplayEventType("")
        setReplayUserId("")
        setReplayDryRun(true)
        onRefresh()
      }
    } catch (error) {
      toast.error("Erro ao fazer replay dos eventos")
      console.error(error)
    } finally {
      setReplayLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!deleteStatus) {
      toast.error("Selecione um status para deletar")
      return
    }

    const confirmMessage = `Tem certeza que deseja deletar todos os eventos com status "${deleteStatus}"? Esta ação é IRREVERSÍVEL!`
    if (!confirm(confirmMessage)) return

    setDeleteLoading(true)
    try {
      const request: ArchiveDeleteBulkRequest = {
        status: deleteStatus,
      }
      if (deleteTransport) request.transport = deleteTransport
      if (deleteEventType) request.event_type = deleteEventType
      if (deleteUserId) request.user_id = deleteUserId

      const response = await adminApi.archive.bulkDelete(request)
      if (response.success) {
        const count = response.deleted ?? 0
        toast.success(`${count} eventos deletados com sucesso`)
        setDeleteStatus("")
        setDeleteTransport("")
        setDeleteEventType("")
        setDeleteUserId("")
        onRefresh()
      }
    } catch (error) {
      toast.error("Erro ao deletar eventos")
      console.error(error)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição do Archive</CardTitle>
          <CardDescription>Visão geral dos eventos arquivados por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* By Status */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Por Status</h4>
              <div className="space-y-2">
                {Object.entries(stats.by_status).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={
                        status === "success"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      }
                    >
                      {status}
                    </Badge>
                    <span className="text-sm font-medium">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By Transport */}
            <div>
              <h4 className="mb-3 text-sm font-medium">Por Transport</h4>
              <div className="space-y-2">
                {Object.entries(stats.by_transport)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([transport, count]) => (
                    <div key={transport} className="flex items-center justify-between">
                      <Badge variant="outline">{transport}</Badge>
                      <span className="text-sm font-medium">{count.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Replay */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Replay em Massa
          </CardTitle>
          <CardDescription>
            Reprocessar eventos arquivados enviando-os novamente para o dispatcher
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Eventos reprocessados serão enviados novamente para o sistema de dispatcher. Use com
              cuidado em produção.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="replay-status">Status *</Label>
              <Select value={replayStatus} onValueChange={(v) => setReplayStatus(v as any)}>
                <SelectTrigger id="replay-status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dlq">DLQ (Failed)</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="replay-transport">Transport (opcional)</Label>
              <Input
                id="replay-transport"
                placeholder="ex: webhook, rabbitmq"
                value={replayTransport}
                onChange={(e) => setReplayTransport(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replay-event-type">Event Type (opcional)</Label>
              <Input
                id="replay-event-type"
                placeholder="ex: message.new, call.offer"
                value={replayEventType}
                onChange={(e) => setReplayEventType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replay-user-id">User ID (opcional)</Label>
              <Input
                id="replay-user-id"
                placeholder="ex: 5521999999999"
                value={replayUserId}
                onChange={(e) => setReplayUserId(e.target.value)}
              />
            </div>
          </div>

          {replayPreview && (
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Preview:</strong> {replayPreview.count.toLocaleString()} eventos serão
                reprocessados
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleReplayPreview}
              disabled={replayLoading || !replayStatus}
              variant="outline"
            >
              {replayLoading ? "Carregando..." : "Preview"}
            </Button>
            <Button
              onClick={handleReplayExecute}
              disabled={replayLoading || !replayStatus || !replayPreview}
              variant="default"
            >
              {replayLoading ? "Processando..." : "Executar Replay"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Delete */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Deletar em Massa
          </CardTitle>
          <CardDescription>Remover permanentemente eventos arquivados do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>ATENÇÃO:</strong> Esta operação é IRREVERSÍVEL. Eventos deletados não podem
              ser recuperados.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="delete-status">Status *</Label>
              <Select value={deleteStatus} onValueChange={(v) => setDeleteStatus(v as any)}>
                <SelectTrigger id="delete-status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dlq">DLQ (Failed)</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-transport">Transport (opcional)</Label>
              <Input
                id="delete-transport"
                placeholder="ex: webhook, rabbitmq"
                value={deleteTransport}
                onChange={(e) => setDeleteTransport(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-event-type">Event Type (opcional)</Label>
              <Input
                id="delete-event-type"
                placeholder="ex: message.new, call.offer"
                value={deleteEventType}
                onChange={(e) => setDeleteEventType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delete-user-id">User ID (opcional)</Label>
              <Input
                id="delete-user-id"
                placeholder="ex: 5521999999999"
                value={deleteUserId}
                onChange={(e) => setDeleteUserId(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleBulkDelete}
            disabled={deleteLoading || !deleteStatus}
            variant="destructive"
          >
            {deleteLoading ? "Deletando..." : "Deletar Eventos"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
