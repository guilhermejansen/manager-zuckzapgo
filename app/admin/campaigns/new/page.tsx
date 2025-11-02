/**
 * Create Campaign Page
 *
 * Página para criar nova campanha com workflow visual.
 */

"use client"

import { useEffect, useMemo, useState } from "react"

import { useRouter } from "next/navigation"

import { ArrowLeft, Save } from "lucide-react"
import type { Edge, Node } from "reactflow"
import { toast } from "sonner"

import { createCampaignAction } from "@/app/actions/campaigns"
import { getContactListsAction } from "@/app/actions/contacts"
import { NODE_DEFINITIONS, type WorkflowNodeType } from "@/components/campaign/workflow-definitions"
import { WorkflowEditor } from "@/components/campaign/workflow-editor"
import { WorkflowErrorBoundary } from "@/components/campaign/workflow-error-boundary"
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
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"
import type { WorkflowFormData } from "@/lib/validations"

/**
 * Create Campaign Page
 *
 * Página para criar nova campanha com workflow visual.
 */

/**
 * Create Campaign Page
 *
 * Página para criar nova campanha com workflow visual.
 */

/**
 * Create Campaign Page
 *
 * Página para criar nova campanha com workflow visual.
 */

/**
 * Create Campaign Page
 *
 * Página para criar nova campanha com workflow visual.
 */

// ============================================================================
// TYPES
// ============================================================================

type CampaignType = "SINGLE" | "SCHEDULED" | "RECURRING"

interface CampaignFormData {
  name: string
  description: string
  type: CampaignType
  contactListId: string
  workflow: WorkflowFormData
  scheduledFor?: Date
  cronExpression?: string
}

interface ContactListOption {
  id: string
  name: string
  totalContacts: number
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

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contactListsLoading, setContactListsLoading] = useState(true)
  const [contactLists, setContactLists] = useState<ContactListOption[]>([])
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    type: "SINGLE",
    contactListId: "",
    workflow: { metadata: { version: "1.0.0" }, nodes: [], edges: [] },
  })

  // Memoize the workflow conversion to prevent unnecessary re-renders
  // React Flow will handle the internal updates efficiently
  const workflowForEditor = useMemo(
    () => workflowFormDataToEditor(formData.workflow),
    [formData.workflow]
  )

  useEffect(() => {
    void loadContactLists()
  }, [])

  async function loadContactLists() {
    setContactListsLoading(true)

    try {
      const result = await getContactListsAction()
      if (result.success && Array.isArray(result.data)) {
        const lists = (result.data as any[]).map((list) => ({
          id: list.id as string,
          name: list.name as string,
          totalContacts:
            typeof list._count?.contacts === "number"
              ? list._count.contacts
              : Array.isArray(list.contacts)
                ? list.contacts.length
                : 0,
        }))

        setContactLists(lists)
        setFormData((prev) => {
          if (prev.contactListId || lists.length === 0) {
            return prev
          }
          return { ...prev, contactListId: lists[0].id }
        })
      } else {
        const message = result.error || "Erro ao carregar listas de contatos"
        toast.error(message)
        setContactLists([])
      }
    } catch (error) {
      logger.error("Error loading contact lists", error instanceof Error ? error : undefined, {
        component: "NewCampaignPage",
        action: "loadContactLists",
      })
      toast.error("Erro ao carregar listas de contatos")
      setContactLists([])
    } finally {
      setContactListsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleWorkflowChange = (workflow: WorkflowFormData) => {
    setFormData((prev) => ({
      ...prev,
      workflow,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Nome da campanha é obrigatório")
      return false
    }

    if (!formData.contactListId) {
      toast.error("Selecione uma lista de contatos")
      return false
    }

    if (!formData.workflow.nodes || formData.workflow.nodes.length === 0) {
      toast.error("O workflow não pode estar vazio")
      return false
    }

    const startNodes = formData.workflow.nodes.filter((n) => n.type === "trigger.start")
    if (startNodes.length === 0) {
      toast.error("O workflow precisa ter um node de início")
      return false
    }

    const endNodes = formData.workflow.nodes.filter((n) => n.type === "control.end")
    if (endNodes.length === 0) {
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

    setLoading(true)

    try {
      logger.debug("Creating campaign", null, {
        component: "NewCampaignPage",
        action: "handleSubmit",
        metadata: {
          name: formData.name,
          type: formData.type,
          contactListId: formData.contactListId,
          nodeCount: formData.workflow.nodes.length,
          edgeCount: formData.workflow.edges.length,
        },
      })

      const result = await createCampaignAction({
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        scheduledAt: formData.scheduledFor?.toISOString() || undefined,
        cronExpression: formData.cronExpression || undefined,
        timezone: "America/Sao_Paulo",
        enableFallback: true,
        randomizeInstances: true,
        maxRetriesPerInstance: 3,
        contactListId: formData.contactListId,
        workflow: formData.workflow,
      })

      if (result.success && result.data) {
        toast.success("Campanha criada com sucesso!")
        logger.success("Campaign created successfully", null, {
          component: "NewCampaignPage",
          action: "handleSubmit",
          metadata: { campaignId: result.data.id },
        })
        router.push(`/admin/campaigns/${result.data.id}`)
      } else {
        toast.error(result.error || "Erro ao criar campanha")
        logger.error("Failed to create campaign", new Error(result.error || "Unknown error"), {
          component: "NewCampaignPage",
          action: "handleSubmit",
        })
      }
    } catch (error) {
      logger.error("Error creating campaign", error instanceof Error ? error : undefined, {
        component: "NewCampaignPage",
        action: "handleSubmit",
      })
      toast.error("Erro ao criar campanha")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Campanha</h1>
          <p className="text-muted-foreground">Crie uma nova campanha de envio em massa</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Campanha</CardTitle>
          <CardDescription>Configure os detalhes básicos da sua campanha de envio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Campanha *</Label>
            <Input
              id="name"
              placeholder="Ex: Campanha Black Friday 2024"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo da campanha..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Campanha *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value as CampaignType)}
              disabled={loading}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Imediata - Envia assim que iniciar</SelectItem>
                <SelectItem value="SCHEDULED">Agendada - Envia em data/hora específica</SelectItem>
                <SelectItem value="RECURRING">
                  Recorrente - Envia em intervalos programados
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "SCHEDULED" && (
            <div className="space-y-2">
              <Label htmlFor="scheduledFor">Data e Hora de Envio *</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={
                  formData.scheduledFor
                    ? new Date(formData.scheduledFor).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => handleInputChange("scheduledFor", new Date(e.target.value))}
                disabled={loading}
              />
            </div>
          )}

          {formData.type === "RECURRING" && (
            <div className="space-y-2">
              <Label htmlFor="cronExpression">Expressão Cron *</Label>
              <Input
                id="cronExpression"
                placeholder="Ex: 0 9 * * 1-5 (todo dia útil às 9h)"
                value={formData.cronExpression || ""}
                onChange={(e) => handleInputChange("cronExpression", e.target.value)}
                disabled={loading}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Use{" "}
                <a
                  href="https://crontab.guru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  crontab.guru
                </a>{" "}
                para ajuda
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="contactListId">Lista de Contatos *</Label>
            <Select
              value={formData.contactListId}
              onValueChange={(value) => handleInputChange("contactListId", value)}
              disabled={loading || contactListsLoading || contactLists.length === 0}
            >
              <SelectTrigger id="contactListId">
                <SelectValue placeholder="Selecione uma lista de contatos" />
              </SelectTrigger>
              <SelectContent>
                {contactListsLoading ? (
                  <SelectItem value="loading" disabled>
                    Carregando listas...
                  </SelectItem>
                ) : contactLists.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    Nenhuma lista disponível - crie uma antes
                  </SelectItem>
                ) : (
                  contactLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                      {list.totalContacts ? ` (${list.totalContacts})` : ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {contactListsLoading
                ? "Carregando listas de contatos..."
                : contactLists.length > 0
                  ? `${contactLists.length} lista(s) disponível(is)`
                  : "Nenhuma lista cadastrada"}
              <Button
                type="button"
                variant="link"
                className="px-0"
                onClick={() => router.push("/admin/campaigns/contacts/new")}
              >
                Criar nova lista
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editor de Workflow</CardTitle>
          <CardDescription>
            Monte o fluxo de mensagens que será enviado para os contatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[600px]">
            <WorkflowErrorBoundary>
              <WorkflowEditor
                initialNodes={workflowForEditor.nodes}
                initialEdges={workflowForEditor.edges}
                onChange={handleWorkflowChange}
                readOnly={loading}
              />
            </WorkflowErrorBoundary>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Salvando..." : "Criar Campanha"}
        </Button>
      </div>
    </div>
  )
}
