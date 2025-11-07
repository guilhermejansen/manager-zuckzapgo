/**
 * Campaign Editor Client Component
 *
 * Componente cliente para edição de campanhas, separado do Server Component
 * para melhor performance e compatibilidade SSR.
 */

"use client"

import { useEffect, useMemo, useState } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

import { updateCampaignAction } from "@/app/actions/campaigns"
import { getContactListsAction } from "@/app/actions/contacts"
import { InstanceManager } from "@/components/campaign/instance-manager"
import { WorkflowErrorBoundary } from "@/components/campaign/workflow-error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"
import type { WorkflowFormData } from "@/lib/validations"

/**
 * Campaign Editor Client Component
 *
 * Componente cliente para edição de campanhas, separado do Server Component
 * para melhor performance e compatibilidade SSR.
 */

/**
 * Campaign Editor Client Component
 *
 * Componente cliente para edição de campanhas, separado do Server Component
 * para melhor performance e compatibilidade SSR.
 */

/**
 * Campaign Editor Client Component
 *
 * Componente cliente para edição de campanhas, separado do Server Component
 * para melhor performance e compatibilidade SSR.
 */

// Dynamic import do WorkflowEditorV2 para evitar SSR do ReactFlow
const WorkflowEditorV2 = dynamic(
  () => import("@/components/campaign/workflow-editor-v2").then((mod) => mod.WorkflowEditorV2),
  { ssr: false }
)

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

interface ContactListOption {
  id: string
  name: string
  totalContacts: number
}

interface CampaignEditorProps {
  campaignId: string
  initialData: {
    name: string
    description: string
    type: CampaignType
    contactListId: string
    scheduledAt?: string | null
    cronExpression?: string | null
    status: CampaignStatus
    workflow: WorkflowFormData
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function getStatusBadge(status: CampaignStatus) {
  const variants: Record<
    CampaignStatus,
    { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
  > = {
    DRAFT: { variant: "outline" },
    SCHEDULED: { variant: "secondary", className: "bg-yellow-600 text-white" },
    RUNNING: { variant: "default", className: "bg-green-600 text-white" },
    PAUSED: { variant: "secondary", className: "bg-blue-600 text-white" },
    COMPLETED: { variant: "secondary", className: "bg-gray-600 text-white" },
    CANCELLED: { variant: "outline" },
    FAILED: { variant: "destructive" },
  }

  const labels: Record<CampaignStatus, string> = {
    DRAFT: "Rascunho",
    SCHEDULED: "Pendente",
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
// MAIN COMPONENT
// ============================================================================

export function CampaignEditor({ campaignId, initialData }: CampaignEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [contactListsLoading, setContactListsLoading] = useState(true)
  const [contactLists, setContactLists] = useState<ContactListOption[]>([])

  const [formData, setFormData] = useState<CampaignFormData>({
    name: initialData.name,
    description: initialData.description,
    type: initialData.type,
    contactListId: initialData.contactListId,
    scheduledFor: initialData.scheduledAt ? new Date(initialData.scheduledAt) : undefined,
    cronExpression: initialData.cronExpression ?? undefined,
  })

  const [workflowDraft, setWorkflowDraft] = useState<WorkflowFormData>(initialData.workflow)

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
      } else {
        const message = result.error || "Erro ao carregar listas de contatos"
        toast.error(message)
        setContactLists([])
      }
    } catch (error) {
      logger.error("Error loading contact lists", error instanceof Error ? error : undefined, {
        component: "CampaignEditor",
        action: "loadContactLists",
      })
      toast.error("Erro ao carregar listas de contatos")
      setContactLists([])
    } finally {
      setContactListsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleWorkflowChange = (workflow: WorkflowFormData) => {
    setWorkflowDraft(workflow)
  }

  const handleExitFullscreen = () => {
    setIsFullscreen(false)
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
        component: "CampaignEditor",
        action: "handleSubmit",
        metadata: {
          campaignId,
          type: formData.type,
          nodeCount: workflowDraft.nodes.length,
          edgeCount: workflowDraft.edges.length,
        },
      })

      const result = await updateCampaignAction(campaignId, {
        name: formData.name,
        description: formData.description || undefined,
        scheduledAt: formData.scheduledFor?.toISOString(),
        cronExpression: formData.cronExpression || undefined,
        contactListId: formData.contactListId,
        type: formData.type,
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
        component: "CampaignEditor",
        action: "handleSubmit",
        metadata: { campaignId },
      })
      toast.error("Erro ao atualizar campanha")
    } finally {
      setSaving(false)
    }
  }

  // Render fullscreen workflow editor
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <WorkflowErrorBoundary>
          <WorkflowEditorV2
            className="h-full w-full"
            onExitFullscreen={handleExitFullscreen}
            isFullscreen={true}
            onChange={handleWorkflowChange}
            initialWorkflow={workflowDraft}
            readOnly={saving}
          />
        </WorkflowErrorBoundary>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Editar Campanha</h1>
            {getStatusBadge(initialData.status)}
          </div>
          <p className="text-muted-foreground">Atualize os detalhes antes de enviar sua campanha</p>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6 mt-6">
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      <SelectItem value="SINGLE">Imediata - Envia assim que iniciar</SelectItem>
                      <SelectItem value="SCHEDULED">
                        Agendada - Envia em data/hora específica
                      </SelectItem>
                      <SelectItem value="RECURRING">
                        Recorrente - Envia em intervalos programados
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactList">Lista de contatos *</Label>
                  <Select
                    value={formData.contactListId}
                    onValueChange={(value) => handleInputChange("contactListId", value)}
                    disabled={saving || contactListsLoading}
                  >
                    <SelectTrigger id="contactList">
                      <SelectValue placeholder="Selecione uma lista">
                        {contactListsLoading
                          ? "Carregando..."
                          : contactLists.find((list) => list.id === formData.contactListId)
                            ? `${contactLists.find((list) => list.id === formData.contactListId)?.name} (${contactLists.find((list) => list.id === formData.contactListId)?.totalContacts} contatos)`
                            : "Selecione uma lista"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {contactLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name} ({list.totalContacts} contatos)
                        </SelectItem>
                      ))}
                      {contactLists.length === 0 && !contactListsLoading && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Nenhuma lista disponível
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.type === "SCHEDULED" && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Data e Hora de Envio *</Label>
                  <DateTimePicker
                    date={formData.scheduledFor}
                    setDate={(date) => handleInputChange("scheduledFor", date || null)}
                    disabled={saving}
                    placeholder="Selecione a data e hora do envio"
                  />
                </div>
              )}

              {formData.type === "RECURRING" && (
                <div className="space-y-2">
                  <Label htmlFor="cronExpression">Expressão Cron *</Label>
                  <Input
                    id="cronExpression"
                    placeholder="Ex: 0 9 * * 1-5 (todo dia útil às 9h)"
                    value={formData.cronExpression ?? ""}
                    onChange={(event) => handleInputChange("cronExpression", event.target.value)}
                    disabled={saving}
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
                    para ajuda com expressões cron
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
              <CardDescription>Altere o fluxo de mensagens e integrações</CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6 pt-0 pb-0">
              <div className="min-h-[500px] sm:min-h-[600px] w-full overflow-hidden">
                <WorkflowErrorBoundary>
                  <WorkflowEditorV2
                    className="border rounded-lg w-full h-full"
                    onToggleFullscreen={() => setIsFullscreen(true)}
                    isFullscreen={false}
                    onChange={handleWorkflowChange}
                    initialWorkflow={workflowDraft}
                    readOnly={saving}
                  />
                </WorkflowErrorBoundary>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instances" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Instâncias WhatsApp</CardTitle>
              <CardDescription>Gerencie as instâncias que executarão esta campanha</CardDescription>
            </CardHeader>
            <CardContent>
              <InstanceManager campaignId={campaignId} readonly={initialData.status !== "DRAFT"} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
