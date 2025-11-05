/**
 * Create Campaign Page
 *
 * Página para criar nova campanha com workflow visual.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"

import { addCampaignInstanceAction, createCampaignAction } from "@/app/actions/campaigns"
import { getContactListsAction } from "@/app/actions/contacts"
import type { SelectedInstance } from "@/components/campaign/instance-selector"
import { InstanceSelector } from "@/components/campaign/instance-selector"
import { WorkflowErrorBoundary } from "@/components/campaign/workflow-error-boundary"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"
import type { WorkflowFormData } from "@/lib/validations"
import { validateWorkflowStructure } from "@/lib/workflow/serialization"

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

// Dynamic import do WorkflowEditorV2 para evitar SSR do ReactFlow
const WorkflowEditorV2 = dynamic(
  () =>
    import("@/components/campaign/workflow-editor-v2").then((mod) => ({
      default: mod.WorkflowEditorV2,
    })),
  { ssr: false }
)

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
// (Removido workflowFormDataToEditor - agora usa deserializeWorkflow da lib)

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contactListsLoading, setContactListsLoading] = useState(true)
  const [contactLists, setContactLists] = useState<ContactListOption[]>([])
  const [selectedInstances, setSelectedInstances] = useState<SelectedInstance[]>([])
  const [enableFallback, setEnableFallback] = useState(true)
  const [randomizeInstances, setRandomizeInstances] = useState(true)
  const [maxRetriesPerInstance, setMaxRetriesPerInstance] = useState(3)
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    type: "SINGLE",
    contactListId: "",
    workflow: { metadata: { version: "1.0.0" }, nodes: [], edges: [] },
  })

  // onChange handler para atualizar formData quando workflow mudar
  const handleWorkflowChange = useCallback((workflow: WorkflowFormData) => {
    setFormData((prev) => ({
      ...prev,
      workflow,
    }))
  }, [])

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

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Nome da campanha é obrigatório")
      return false
    }

    if (!formData.contactListId) {
      toast.error("Selecione uma lista de contatos")
      return false
    }

    if (selectedInstances.length === 0) {
      toast.error("Selecione pelo menos 1 instância para executar a campanha")
      return false
    }

    // Validar estrutura do workflow
    const workflowValidation = validateWorkflowStructure(formData.workflow)
    if (!workflowValidation.valid) {
      const errorMessage = workflowValidation.errors[0] || "Workflow inválido"
      toast.error(errorMessage)

      // Mostrar todos os erros no console para debug
      if (workflowValidation.errors.length > 1) {
        console.error("Erros de validação do workflow:", workflowValidation.errors)
        toast.error(`${workflowValidation.errors.length} erros encontrados no workflow`)
      }
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
        enableFallback,
        randomizeInstances,
        maxRetriesPerInstance,
        contactListId: formData.contactListId,
        workflow: formData.workflow,
      })

      if (result.success && result.data) {
        // Adicionar instâncias à campanha
        for (const instance of selectedInstances) {
          const instanceResult = await addCampaignInstanceAction(result.data.id, instance)
          if (!instanceResult.success) {
            logger.error("Failed to add instance", new Error(instanceResult.error), {
              component: "NewCampaignPage",
              action: "handleSubmit",
              metadata: { campaignId: result.data.id, instanceId: instance.instanceId },
            })
          }
        }

        toast.success(`Campanha criada com ${selectedInstances.length} instância(s)!`)
        logger.success("Campaign created successfully", null, {
          component: "NewCampaignPage",
          action: "handleSubmit",
          metadata: { campaignId: result.data.id, instanceCount: selectedInstances.length },
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

  const [isFullscreen, setIsFullscreen] = useState(false)
  const workflowCardRef = useRef<HTMLDivElement>(null)

  const handleExitFullscreen = () => {
    setIsFullscreen(false)
    // Scroll suave até o workflow após sair do fullscreen
    setTimeout(() => {
      workflowCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 100)
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <WorkflowErrorBoundary>
          <WorkflowEditorV2
            className="h-full w-full"
            onExitFullscreen={handleExitFullscreen}
            isFullscreen={true}
            onChange={handleWorkflowChange}
            initialWorkflow={formData.workflow}
          />
        </WorkflowErrorBoundary>
      </div>
    )
  }

  return (
    <div className="space-y-4">
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
              <DateTimePicker
                date={formData.scheduledFor ? new Date(formData.scheduledFor) : undefined}
                setDate={(date) => handleInputChange("scheduledFor", date || null)}
                disabled={loading}
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
                para ajuda com expressões cron
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

      {/* Instances Card */}
      <Card>
        <CardHeader>
          <CardTitle>Instâncias</CardTitle>
          <CardDescription>
            Selecione as instâncias WhatsApp que vão executar esta campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InstanceSelector
            value={selectedInstances}
            onChange={setSelectedInstances}
            enablePriority
            enableFallback
          />
        </CardContent>
      </Card>

      {/* Advanced Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Avançadas</CardTitle>
          <CardDescription>Configure o comportamento de execução da campanha</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex-1">
              <Label htmlFor="enableFallback" className="text-base font-medium">
                Fallback Automático
              </Label>
              <p className="text-sm text-muted-foreground">
                Se uma instância falhar, tenta automaticamente a próxima na ordem de prioridade
              </p>
            </div>
            <Switch
              id="enableFallback"
              checked={enableFallback}
              onCheckedChange={setEnableFallback}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex-1">
              <Label htmlFor="randomizeInstances" className="text-base font-medium">
                Randomizar Instâncias
              </Label>
              <p className="text-sm text-muted-foreground">
                Distribui a carga aleatoriamente entre as instâncias selecionadas
              </p>
            </div>
            <Switch
              id="randomizeInstances"
              checked={randomizeInstances}
              onCheckedChange={setRandomizeInstances}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxRetries">Tentativas por Instância</Label>
            <Input
              id="maxRetries"
              type="number"
              min={1}
              max={10}
              value={maxRetriesPerInstance}
              onChange={(e) => setMaxRetriesPerInstance(parseInt(e.target.value) || 3)}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Número de tentativas antes de marcar envio como falho (1-10)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card ref={workflowCardRef} className="mb-0 pb-0 gap-0">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Editor de Workflow</CardTitle>
            <CardDescription>
              Monte o fluxo de mensagens que será enviado para os contatos
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
            Fullscreen
          </Button>
        </CardHeader>
        <CardContent className="p-2 sm:p-6 pt-0 pb-0">
          <div className="min-h-[500px] sm:min-h-[600px] w-full overflow-hidden">
            <WorkflowErrorBoundary>
              <WorkflowEditorV2
                className="border rounded-lg w-full h-full"
                onToggleFullscreen={() => setIsFullscreen(true)}
                isFullscreen={false}
                onChange={handleWorkflowChange}
                initialWorkflow={formData.workflow}
              />
            </WorkflowErrorBoundary>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 -mt-2">
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
