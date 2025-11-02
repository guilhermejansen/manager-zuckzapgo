/**
 * Edit Campaign Page
 *
 * Página para editar campanha existente (apenas DRAFT).
 */

"use client"

import { useEffect, useMemo, useState } from "react"

import { useParams, useRouter } from "next/navigation"

import { ArrowLeft, Save } from "lucide-react"
import type { Edge, Node } from "reactflow"
import { toast } from "sonner"

import { getCampaignAction, updateCampaignAction } from "@/app/actions/campaigns"
import { NODE_DEFINITIONS, type WorkflowNodeType } from "@/components/campaign/workflow-definitions"
import { WorkflowEditor } from "@/components/campaign/workflow-editor"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"
import type { WorkflowFormData } from "@/lib/validations"

/**
 * Edit Campaign Page
 *
 * Página para editar campanha existente (apenas DRAFT).
 */

/**
 * Edit Campaign Page
 *
 * Página para editar campanha existente (apenas DRAFT).
 */

// ============================================================================
// TYPES
// ============================================================================

type CampaignType = "SINGLE" | "SCHEDULED" | "RECURRING"

type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"

interface CampaignFormData {
  name: string
  description: string
  type: CampaignType
  contactListId: string
  scheduledFor?: Date
  cronExpression?: string
}

// ============================================================================
// HELPERS
// ============================================================================

function workflowFormDataToEditor(workflow: WorkflowFormData): { nodes: Node[]; edges: Edge[] } {
  return {
    nodes: workflow.nodes.map((node) => {
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
    edges: workflow.edges.map((edge) => ({
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

export default function EditCampaignPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatus | null>(null)
  const [formData, setFormData] = useState<CampaignFormData | null>(null)
  const [workflowDraft, setWorkflowDraft] = useState<WorkflowFormData>({
    metadata: { version: "1.0.0" },
    nodes: [],
    edges: [],
  })

  const workflowForEditor = useMemo(() => workflowFormDataToEditor(workflowDraft), [workflowDraft])

  useEffect(() => {
    void loadCampaign()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId])

  async function loadCampaign() {
    setLoading(true)
    try {
      const result = await getCampaignAction(campaignId)
      if (result.success && result.data) {
        const campaign = result.data
        setCampaignStatus(campaign.status as CampaignStatus)

        if (campaign.status !== "DRAFT") {
          toast.error("Apenas campanhas em rascunho podem ser editadas")
          router.push(`/admin/campaigns/${campaignId}`)
          return
        }

        const workflow = (campaign.workflow as WorkflowFormData) ?? {
          metadata: { version: "1.0.0" },
          nodes: [],
          edges: [],
        }

        setWorkflowDraft(workflow)
        setFormData({
          name: campaign.name,
          description: campaign.description ?? "",
          type: campaign.type as CampaignType,
          contactListId: campaign.contactListId ?? "",
          scheduledFor: campaign.scheduledAt ? new Date(campaign.scheduledAt) : undefined,
          cronExpression: campaign.cronExpression ?? undefined,
        })

        toast.success("Campanha carregada com sucesso")
      } else {
        toast.error(result.error || "Erro ao carregar campanha")
        router.push("/admin/campaigns")
      }
    } catch (error) {
      logger.error("Error loading campaign", error instanceof Error ? error : undefined, {
        component: "EditCampaignPage",
        action: "loadCampaign",
        metadata: { campaignId },
      })
      toast.error("Erro ao carregar campanha")
      router.push("/admin/campaigns")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleWorkflowChange = (workflow: WorkflowFormData) => {
    setWorkflowDraft(workflow)
  }

  const validateForm = (): boolean => {
    if (!formData) {
      toast.error("Dados indisponíveis")
      return false
    }

    if (!formData.name.trim()) {
      toast.error("Nome da campanha é obrigatório")
      return false
    }

    if (!formData.contactListId) {
      toast.error("Selecione uma lista de contatos")
      return false
    }

    if (!workflowDraft.nodes.length) {
      toast.error("O workflow não pode estar vazio")
      return false
    }

    const startNodes = workflowDraft.nodes.filter((n) => n.type === "trigger.start")
    if (!startNodes.length) {
      toast.error("O workflow precisa ter um node de início")
      return false
    }

    const endNodes = workflowDraft.nodes.filter((n) => n.type === "control.end")
    if (!endNodes.length) {
      toast.error("O workflow precisa ter um node de fim")
      return false
    }

    if (formData.type === "SCHEDULED" && !formData.scheduledFor) {
      toast.error("Data de agendamento é obrigatória para campanhas agendadas")
      return false
    }

    if (formData.type === "RECURRING" && !formData.cronExpression) {
      toast.error("Expressão cron é obrigatória para campanhas recorrentes")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      logger.debug("Updating campaign", null, {
        component: "EditCampaignPage",
        action: "handleSubmit",
        metadata: {
          campaignId,
          type: formData?.type,
          nodeCount: workflowDraft.nodes.length,
          edgeCount: workflowDraft.edges.length,
        },
      })

      const result = await updateCampaignAction(campaignId, {
        name: formData!.name,
        description: formData!.description || undefined,
        scheduledAt: formData!.scheduledFor?.toISOString(),
        cronExpression: formData!.cronExpression || undefined,
        contactListId: formData!.contactListId,
        type: formData!.type,
        workflow: workflowDraft,
      } as any)

      if (result.success) {
        toast.success("Campanha atualizada com sucesso")
        router.push(`/admin/campaigns/${campaignId}`)
      } else {
        toast.error(result.error || "Erro ao atualizar campanha")
      }
    } catch (error) {
      logger.error("Error updating campaign", error instanceof Error ? error : undefined, {
        component: "EditCampaignPage",
        action: "handleSubmit",
        metadata: { campaignId },
      })
      toast.error("Erro ao atualizar campanha")
    } finally {
      setSaving(false)
    }
  }

  if (loading && !formData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!formData) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Campanha</h1>
          <p className="text-muted-foreground">Atualize os detalhes antes de enviar sua campanha</p>
        </div>
        <div className="ml-auto text-xs text-muted-foreground">Status: {campaignStatus}</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Campanha</CardTitle>
          <CardDescription>Edite os detalhes básicos e de agendamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(event) => handleInputChange("name", event.target.value)}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(event) => handleInputChange("description", event.target.value)}
              rows={3}
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value as CampaignType)}
                disabled={saving}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Imediata</SelectItem>
                  <SelectItem value="SCHEDULED">Agendada</SelectItem>
                  <SelectItem value="RECURRING">Recorrente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactList">Lista de contatos *</Label>
              <Input
                id="contactList"
                value={formData.contactListId}
                onChange={(event) => handleInputChange("contactListId", event.target.value)}
                disabled={saving}
                placeholder="ID da lista"
              />
            </div>
          </div>

          {formData.type === "SCHEDULED" ? (
            <div className="space-y-2">
              <Label htmlFor="scheduledFor">Data/Hora *</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={
                  formData.scheduledFor
                    ? new Date(formData.scheduledFor).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(event) =>
                  handleInputChange("scheduledFor", new Date(event.target.value))
                }
                disabled={saving}
              />
            </div>
          ) : null}

          {formData.type === "RECURRING" ? (
            <div className="space-y-2">
              <Label htmlFor="cronExpression">Expressão cron *</Label>
              <Input
                id="cronExpression"
                value={formData.cronExpression ?? ""}
                onChange={(event) => handleInputChange("cronExpression", event.target.value)}
                disabled={saving}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
          <CardDescription>Altere o fluxo de mensagens e integrações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[600px]">
            <WorkflowEditor
              initialNodes={workflowForEditor.nodes}
              initialEdges={workflowForEditor.edges}
              onChange={handleWorkflowChange}
              readOnly={saving}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  )
}
