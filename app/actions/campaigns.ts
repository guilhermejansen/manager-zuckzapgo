// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { getRole, getToken } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"
import { addCampaignToQueue } from "@/lib/queue/queues"
import {
  type AddCampaignInstanceFormData,
  type CreateCampaignFormData,
  type UpdateCampaignFormData,
  type WorkflowFormData,
  addCampaignInstanceSchema,
  campaignSchema,
  updateCampaignSchema,
  workflowSchema,
} from "@/lib/validations"
import { countMessageNodes } from "@/lib/workflow/runtime"

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// Manager ZuckZapGo - Campaign Server Actions
// Server Actions para CRUD de campanhas

// ============================================================================
// TYPES
// ============================================================================

interface ActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

// ============================================================================
// CAMPAIGN CRUD
// ============================================================================

/**
 * Criar nova campanha
 */
export async function createCampaignAction(data: CreateCampaignFormData): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Validar dados
    const validated = campaignSchema.parse(data)

    const contactList = await prisma.contactList.findUnique({
      where: { id: validated.contactListId },
    })

    if (!contactList) {
      return {
        success: false,
        error: "Lista de contatos não encontrada",
      }
    }

    // Criar campanha
    const campaign = await prisma.campaign.create({
      data: {
        name: validated.name,
        description: validated.description || null,
        type: validated.type as any,
        status: "DRAFT",
        workflow: validated.workflow as any,
        scheduledAt: validated.scheduledAt ? new Date(validated.scheduledAt) : null,
        cronExpression: validated.cronExpression || null,
        timezone: validated.timezone || "America/Sao_Paulo",
        enableFallback: validated.enableFallback,
        randomizeInstances: validated.randomizeInstances,
        maxRetriesPerInstance: validated.maxRetriesPerInstance,
        userId,
        contactLists: {
          connect: { id: validated.contactListId },
        },
        userRole: role.toUpperCase() as any,
      },
      include: {
        instances: true,
        contactLists: true,
        messages: true,
        stats: true,
      },
    })

    // Criar stats iniciais
    await prisma.campaignStats.create({
      data: {
        campaignId: campaign.id,
      },
    })

    logger.success("Campaign created successfully", null, {
      component: "CampaignActions",
      action: "createCampaignAction",
      metadata: { campaignId: campaign.id, userId, contactListId: validated.contactListId },
    })

    revalidatePath("/campaigns")
    revalidatePath("/admin/campaigns")

    return {
      success: true,
      data: campaign,
    }
  } catch (error) {
    logger.error("Failed to create campaign", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "createCampaignAction",
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar campanha",
    }
  }
}

/**
 * Atualizar campanha existente
 */
export async function updateCampaignAction(
  campaignId: string,
  data: UpdateCampaignFormData
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const existing = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        contactLists: {
          select: { id: true },
        },
      },
    })

    if (!existing) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && existing.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para editar esta campanha",
      }
    }

    // Validar dados
    const validated = updateCampaignSchema.parse(data)

    if (validated.contactListId) {
      const contactList = await prisma.contactList.findUnique({
        where: { id: validated.contactListId },
      })

      if (!contactList) {
        return {
          success: false,
          error: "Lista de contatos não encontrada",
        }
      }
    }

    // Não permitir edição de campanha em execução (apenas pausar/cancelar)
    if (
      existing.status === "RUNNING" &&
      validated.status !== "PAUSED" &&
      validated.status !== "CANCELLED"
    ) {
      return {
        success: false,
        error: "Não é possível editar campanha em execução. Pause primeiro.",
      }
    }

    // Atualizar campanha
    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description || null }),
        ...(validated.status && { status: validated.status as any }),
        ...(validated.type && { type: validated.type as any }),
        ...(validated.workflow && { workflow: validated.workflow as any }),
        ...(validated.contactListId && {
          contactLists: {
            set: [{ id: validated.contactListId }],
          },
        }),
        ...(validated.scheduledAt !== undefined && {
          scheduledAt: validated.scheduledAt ? new Date(validated.scheduledAt) : null,
        }),
        ...(validated.cronExpression !== undefined && {
          cronExpression: validated.cronExpression || null,
        }),
        ...(validated.timezone && { timezone: validated.timezone }),
        ...(validated.enableFallback !== undefined && { enableFallback: validated.enableFallback }),
        ...(validated.randomizeInstances !== undefined && {
          randomizeInstances: validated.randomizeInstances,
        }),
        ...(validated.maxRetriesPerInstance !== undefined && {
          maxRetriesPerInstance: validated.maxRetriesPerInstance,
        }),
      },
      include: {
        instances: true,
        contactLists: true,
        messages: true,
        stats: true,
      },
    })

    logger.success("Campaign updated successfully", null, {
      component: "CampaignActions",
      action: "updateCampaignAction",
      metadata: {
        campaignId,
        userId,
        contactListId: validated.contactListId || (campaign as any).contactLists?.[0]?.id,
      },
    })

    revalidatePath("/campaigns")
    revalidatePath("/admin/campaigns")
    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
      data: campaign,
    }
  } catch (error) {
    logger.error("Failed to update campaign", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "updateCampaignAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar campanha",
    }
  }
}

/**
 * Deletar campanha
 */
export async function deleteCampaignAction(campaignId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const existing = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        contactLists: {
          select: { id: true },
        },
      },
    })

    if (!existing) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && existing.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para deletar esta campanha",
      }
    }

    // Não permitir deletar campanha em execução
    if (existing.status === "RUNNING") {
      return {
        success: false,
        error: "Não é possível deletar campanha em execução. Pause ou cancele primeiro.",
      }
    }

    // Deletar campanha (cascade delete)
    await prisma.campaign.delete({
      where: { id: campaignId },
    })

    logger.success("Campaign deleted successfully", null, {
      component: "CampaignActions",
      action: "deleteCampaignAction",
      metadata: {
        campaignId,
        userId,
        contactListId: existing.contactLists?.[0]?.id,
      },
    })

    revalidatePath("/campaigns")
    revalidatePath("/admin/campaigns")

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to delete campaign", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "deleteCampaignAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao deletar campanha",
    }
  }
}

/**
 * Obter campanha por ID
 */
export async function getCampaignAction(campaignId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        instances: true,
        contactLists: {
          include: {
            contacts: true,
          },
        },
        messages: {
          orderBy: { order: "asc" },
        },
        stats: true,
      },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    // Verificar permissão
    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para visualizar esta campanha",
      }
    }

    return {
      success: true,
      data: campaign,
    }
  } catch (error) {
    logger.error("Failed to get campaign", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "getCampaignAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: "Erro ao buscar campanha",
    }
  }
}

/**
 * Listar campanhas do usuário
 */
export async function listCampaignsAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    const campaigns = await prisma.campaign.findMany({
      where: role === "admin" ? {} : { userId },
      include: {
        instances: true,
        contactLists: true,
        stats: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return {
      success: true,
      data: campaigns,
    }
  } catch (error) {
    logger.error("Failed to list campaigns", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "listCampaignsAction",
    })

    return {
      success: false,
      error: "Erro ao listar campanhas",
    }
  }
}

// ============================================================================
// CAMPAIGN INSTANCES
// ============================================================================

/**
 * Adicionar instância à campanha
 */
export async function addCampaignInstanceAction(
  campaignId: string,
  data: AddCampaignInstanceFormData
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para editar esta campanha",
      }
    }

    // Validar dados
    const validated = addCampaignInstanceSchema.parse(data)

    // Criar instância
    const instance = await prisma.campaignInstance.create({
      data: {
        campaignId,
        instanceId: validated.instanceId,
        token: validated.token,
        name: validated.name || null,
        priority: validated.priority,
        maxRetries: validated.maxRetries,
        fallbackOrder: validated.fallbackOrder || null,
      },
    })

    logger.success("Campaign instance added", null, {
      component: "CampaignActions",
      action: "addCampaignInstanceAction",
      metadata: { campaignId, instanceId: instance.id },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
      data: instance,
    }
  } catch (error) {
    logger.error("Failed to add campaign instance", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "addCampaignInstanceAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao adicionar instância",
    }
  }
}

/**
 * Remover instância da campanha
 */
export async function removeCampaignInstanceAction(
  campaignId: string,
  instanceId: string
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para editar esta campanha",
      }
    }

    // Remover instância
    await prisma.campaignInstance.delete({
      where: { id: instanceId },
    })

    logger.success("Campaign instance removed", null, {
      component: "CampaignActions",
      action: "removeCampaignInstanceAction",
      metadata: { campaignId, instanceId },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to remove campaign instance", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "removeCampaignInstanceAction",
      metadata: { campaignId, instanceId },
    })

    return {
      success: false,
      error: "Erro ao remover instância",
    }
  }
}

/**
 * Buscar instâncias da campanha
 */
export async function getCampaignInstancesAction(campaignId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para visualizar esta campanha",
      }
    }

    // Buscar instâncias
    const instances = await prisma.campaignInstance.findMany({
      where: { campaignId },
      orderBy: { priority: "asc" },
    })

    return {
      success: true,
      data: instances,
    }
  } catch (error) {
    logger.error("Failed to get campaign instances", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "getCampaignInstancesAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: "Erro ao buscar instâncias",
    }
  }
}

// ============================================================================
// CAMPAIGN EXECUTION
// ============================================================================

/**
 * Iniciar campanha
 */
export async function startCampaignAction(campaignId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Buscar campanha
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        instances: true,
        contactLists: {
          include: {
            contacts: true,
          },
        },
      },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    // Verificar permissão
    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para iniciar esta campanha",
      }
    }

    // Validar se pode iniciar
    if (campaign.status === "RUNNING") {
      return {
        success: false,
        error: "Campanha já está em execução",
      }
    }

    if (campaign.instances.length === 0) {
      return {
        success: false,
        error: "Adicione pelo menos uma instância antes de iniciar",
      }
    }

    if (campaign.contactLists.length === 0) {
      return {
        success: false,
        error: "Adicione pelo menos uma lista de contatos antes de iniciar",
      }
    }

    const workflow = workflowSchema.parse(campaign.workflow)
    const messageNodeCount = countMessageNodes(workflow)

    if (messageNodeCount === 0) {
      return {
        success: false,
        error: "Configure ao menos um passo de mensagem no workflow antes de iniciar",
      }
    }

    // Atualizar status e adicionar à fila
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "RUNNING",
        startedAt: new Date(),
      },
    })

    // Adicionar campanha à fila do BullMQ
    await addCampaignToQueue({
      campaignId: campaign.id,
      userId: campaign.userId,
    })

    logger.success("Campaign started", null, {
      component: "CampaignActions",
      action: "startCampaignAction",
      metadata: { campaignId, userId, contactListId: campaign.contactLists?.[0]?.id },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to start campaign", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "startCampaignAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao iniciar campanha",
    }
  }
}

/**
 * Pausar campanha
 */
export async function pauseCampaignAction(campaignId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para pausar esta campanha",
      }
    }

    if (campaign.status !== "RUNNING") {
      return {
        success: false,
        error: "Campanha não está em execução",
      }
    }

    // Atualizar status
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "PAUSED",
      },
    })

    logger.success("Campaign paused", null, {
      component: "CampaignActions",
      action: "pauseCampaignAction",
      metadata: {
        campaignId,
        userId,
      },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to pause campaign", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "pauseCampaignAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: "Erro ao pausar campanha",
    }
  }
}

/**
 * Cancelar campanha
 */
export async function cancelCampaignAction(campaignId: string): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para cancelar esta campanha",
      }
    }

    // Atualizar status
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "CANCELLED",
        completedAt: new Date(),
      },
    })

    logger.success("Campaign cancelled", null, {
      component: "CampaignActions",
      action: "cancelCampaignAction",
      metadata: {
        campaignId,
        userId,
      },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to cancel campaign", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "cancelCampaignAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: "Erro ao cancelar campanha",
    }
  }
}

// ============================================================================
// WORKFLOW MANAGEMENT
// ============================================================================

/**
 * Atualizar workflow da campanha
 */
export async function updateWorkflowAction(
  campaignId: string,
  workflow: WorkflowFormData
): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return {
        success: false,
        error: "Não autenticado",
      }
    }

    // Verificar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    })

    if (!campaign) {
      return {
        success: false,
        error: "Campanha não encontrada",
      }
    }

    if (role !== "admin" && campaign.userId !== userId) {
      return {
        success: false,
        error: "Sem permissão para editar esta campanha",
      }
    }

    if (campaign.status === "RUNNING") {
      return {
        success: false,
        error: "Não é possível editar workflow de campanha em execução",
      }
    }

    // Validar workflow
    const validated = workflowSchema.parse(workflow)

    // Atualizar workflow
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        workflow: validated as any,
      },
    })

    logger.success("Workflow updated", null, {
      component: "CampaignActions",
      action: "updateWorkflowAction",
      metadata: { campaignId, nodeCount: validated.nodes.length },
    })

    revalidatePath(`/campaigns/${campaignId}`)

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Failed to update workflow", error instanceof Error ? error : undefined, {
      component: "CampaignActions",
      action: "updateWorkflowAction",
      metadata: { campaignId },
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar workflow",
    }
  }
}
