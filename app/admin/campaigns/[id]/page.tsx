/**
 * Campaign Dashboard Page
 *
 * Dashboard de campanha com estatísticas em tempo real via SSE.
 */

"use client"

import { useEffect, useMemo, useState } from "react"

import { useParams, useRouter } from "next/navigation"

import { ArrowLeft, Calendar, Edit, Pause, Play, RefreshCw, X } from "lucide-react"
import type { Edge, Node } from "reactflow"
import { toast } from "sonner"

import {
  cancelCampaignAction,
  getCampaignAction,
  pauseCampaignAction,
  startCampaignAction,
} from "@/app/actions/campaigns"
import { WorkflowEditor } from "@/components/campaign/workflow-editor"
import { NODE_DEFINITIONS, type WorkflowNodeType } from "@/components/campaign/workflow-definitions"
import type { WorkflowFormData } from "@/lib/validations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { logger } from "@/lib/logger"

/**
 * Campaign Dashboard Page
 *
 * Dashboard de campanha com estatísticas em tempo real via SSE.
 */

/**
 * Campaign Dashboard Page
 *
 * Dashboard de campanha com estatísticas em tempo real via SSE.
 */

/**
 * Campaign Dashboard Page
 *
 * Dashboard de campanha com estatísticas em tempo real via SSE.
 */

// ============================================================================
// TYPES
// ============================================================================

type CampaignStatus =
  | "DRAFT"
  | "PENDING"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"

type CampaignType = "SINGLE" | "SCHEDULED" | "RECURRING"

interface Campaign {
  id: string
  name: string
  description: string | null
  type: CampaignType
  status: CampaignStatus
  workflow: WorkflowFormData
  scheduledFor: Date | null
  cronExpression: string | null
  createdAt: Date
  updatedAt: Date
}

interface CampaignStats {
  total: number
  completed: number
  failed: number
  pending: number
  sent: number
  delivered: number
  read: number
  replied: number
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStatusBadge(status: CampaignStatus) {
  const variants: Record<
    CampaignStatus,
    { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
  > = {
    DRAFT: { variant: "outline" },
    PENDING: { variant: "secondary", className: "bg-yellow-600 text-white" },
    RUNNING: { variant: "default", className: "bg-green-600 text-white" },
    PAUSED: { variant: "secondary", className: "bg-blue-600 text-white" },
    COMPLETED: { variant: "secondary", className: "bg-gray-600 text-white" },
    CANCELLED: { variant: "outline" },
    FAILED: { variant: "destructive" },
  }

  const labels: Record<CampaignStatus, string> = {
    DRAFT: "Rascunho",
    PENDING: "Pendente",
    RUNNING: "Em execução",
    PAUSED: "Pausada",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
    FAILED: "Falhou",
  }

  const config = variants[status]
  return (
    <Badge variant={config.variant} className={config.className}>
      {labels[status]}
    </Badge>
  )
}


// ============================================================================
// HELPERS
// ============================================================================

function workflowFormDataToEditor(workflow: WorkflowFormData): { nodes: Node[]; edges: Edge[] } {
  const fallback = { metadata: { version: "1.0.0" }, nodes: [], edges: [] }
  const safeWorkflow = workflow ?? (fallback as WorkflowFormData)
  return {
    nodes: safeWorkflow.nodes.map((node) => {
      const definition = NODE_DEFINITIONS[node.type as WorkflowNodeType]
      return {
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label ?? definition?.label ?? node.type,
          description: definition?.description ?? "",
          icon: definition?.icon,
          theme: definition?.theme ?? {
            border: "from-slate-500 to-slate-700",
            background: "bg-slate-900",
            accent: "bg-slate-700",
          },
          active: node.data.active ?? true,
          config: node.data.config ?? definition?.defaultConfig ?? {},
          outputs: node.data.outputs ?? definition?.defaultOutputs ?? [],
          inputs: node.data.inputs ?? [],
        },
      }
    }),
    edges: safeWorkflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
      animated: edge.animated,
    })),
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CampaignDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [stats, setStats] = useState<CampaignStats>({
    total: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
  })

  const transformedWorkflow = useMemo(
    () =>
      workflowFormDataToEditor(
        (campaign?.workflow ?? { metadata: { version: "1.0.0" }, nodes: [], edges: [] }) as WorkflowFormData
      ),
    [campaign?.workflow]
  )

  useEffect(() => {
    loadCampaign()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId])

  useEffect(() => {
    if (!campaign) return

    // Conectar ao SSE apenas se campanha estiver em execução
    if (campaign.status !== "RUNNING" && campaign.status !== "PENDING") {
      return
    }

    const eventSource = new EventSource(`/api/campaigns/${campaignId}/stats?stream=true`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setStats(data)
        logger.debug("Stats updated", null, {
          component: "CampaignDashboardPage",
          action: "onStatsUpdate",
          metadata: { campaignId, stats: data },
        })
      } catch (error) {
        logger.error("Error parsing SSE data", error instanceof Error ? error : undefined, {
          component: "CampaignDashboardPage",
          action: "onSSEMessage",
        })
      }
    }

    eventSource.onerror = (error) => {
      logger.error("SSE connection error", undefined, {
        component: "CampaignDashboardPage",
        action: "onSSEError",
        metadata: { campaignId },
      })
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [campaign, campaignId])

  async function loadCampaign() {
    setLoading(true)
    try {
      const result = await getCampaignAction(campaignId)
      if (result.success && result.data) {
        setCampaign(result.data as Campaign)
        toast.success("Campanha carregada com sucesso")
      } else {
        toast.error(result.error || "Erro ao carregar campanha")
        router.push("/admin/campaigns")
      }
    } catch (error) {
      logger.error("Error loading campaign", error instanceof Error ? error : undefined, {
        component: "CampaignDashboardPage",
        action: "loadCampaign",
        metadata: { campaignId },
      })
      toast.error("Erro ao carregar campanha")
      router.push("/admin/campaigns")
    } finally {
      setLoading(false)
    }
  }

  async function handleStart() {
    if (!campaign) return
    if (!confirm(`Iniciar a campanha "${campaign.name}"?`)) return

    try {
      const result = await startCampaignAction(campaignId)
      if (result.success) {
        toast.success("Campanha iniciada com sucesso")
        loadCampaign()
      } else {
        toast.error(result.error || "Erro ao iniciar campanha")
      }
    } catch (error) {
      logger.error("Error starting campaign", error instanceof Error ? error : undefined, {
        component: "CampaignDashboardPage",
        action: "startCampaign",
        metadata: { campaignId },
      })
      toast.error("Erro ao iniciar campanha")
    }
  }

  async function handlePause() {
    if (!campaign) return
    if (!confirm(`Pausar a campanha "${campaign.name}"?`)) return

    try {
      const result = await pauseCampaignAction(campaignId)
      if (result.success) {
        toast.success("Campanha pausada com sucesso")
        loadCampaign()
      } else {
        toast.error(result.error || "Erro ao pausar campanha")
      }
    } catch (error) {
      logger.error("Error pausing campaign", error instanceof Error ? error : undefined, {
        component: "CampaignDashboardPage",
        action: "pauseCampaign",
        metadata: { campaignId },
      })
      toast.error("Erro ao pausar campanha")
    }
  }

  async function handleCancel() {
    if (!campaign) return
    if (!confirm(`Cancelar a campanha "${campaign.name}"? Esta ação não pode ser desfeita.`)) return

    try {
      const result = await cancelCampaignAction(campaignId)
      if (result.success) {
        toast.success("Campanha cancelada com sucesso")
        loadCampaign()
      } else {
        toast.error(result.error || "Erro ao cancelar campanha")
      }
    } catch (error) {
      logger.error("Error cancelling campaign", error instanceof Error ? error : undefined, {
        component: "CampaignDashboardPage",
        action: "cancelCampaign",
        metadata: { campaignId },
      })
      toast.error("Erro ao cancelar campanha")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!campaign) return null

  const canStart = campaign.status === "DRAFT" || campaign.status === "PAUSED"
  const canPause = campaign.status === "RUNNING"
  const canCancel =
    campaign.status === "RUNNING" || campaign.status === "PAUSED" || campaign.status === "PENDING"
  const canEdit = campaign.status === "DRAFT"

  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              {getStatusBadge(campaign.status)}
            </div>
            {campaign.description && (
              <p className="text-muted-foreground">{campaign.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Criada em {new Date(campaign.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
              {campaign.type === "SCHEDULED" && campaign.scheduledFor && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Agendada para {new Date(campaign.scheduledFor).toLocaleString("pt-BR")}
                  </span>
                </div>
              )}
              {campaign.type === "RECURRING" && campaign.cronExpression && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono text-xs">{campaign.cronExpression}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCampaign}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/campaigns/${campaignId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
          {canStart && (
            <Button onClick={handleStart}>
              <Play className="mr-2 h-4 w-4" />
              Iniciar
            </Button>
          )}
          {canPause && (
            <Button variant="outline" onClick={handlePause}>
              <Pause className="mr-2 h-4 w-4" />
              Pausar
            </Button>
          )}
          {canCancel && (
            <Button variant="destructive" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Contatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Concluídos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">{progressPercentage}% do total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Falhas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      {(campaign.status === "RUNNING" || campaign.status === "COMPLETED") && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Enviadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Entregues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.delivered}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Lidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.read}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Respondidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.replied}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Bar */}
      {campaign.status === "RUNNING" && (
        <Card>
          <CardHeader>
            <CardTitle>Progresso da Campanha</CardTitle>
            <CardDescription>
              {stats.completed} de {stats.total} mensagens processadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {progressPercentage}% concluído
            </p>
          </CardContent>
        </Card>
      )}

      {/* Workflow Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow da Campanha</CardTitle>
          <CardDescription>Visualização do fluxo de mensagens configurado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px]">
            <WorkflowEditor
              initialNodes={transformedWorkflow.nodes}
              initialEdges={transformedWorkflow.edges}
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
