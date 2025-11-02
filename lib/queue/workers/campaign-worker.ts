/**
 * Campaign Worker
 *
 * Processa campanhas e cria jobs individuais de envio de mensagens.
 *
 * Responsabilidades:
 * - Carregar dados da campanha do banco
 * - Validar instâncias ativas
 * - Carregar listas de contatos
 * - Criar jobs na fila MESSAGE_SENDER para cada contato
 * - Atualizar estatísticas da campanha
 */
import { CampaignStatus, JobStatus } from "@prisma/client"
import { Job, Worker } from "bullmq"

import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"
import { workflowSchema } from "@/lib/validations"
import { countMessageNodes } from "@/lib/workflow/runtime"

import {
  CampaignJobData,
  MessageJobData,
  QueueNames,
  campaignWorkerOptions,
  generateJobId,
} from "../config"
import { messageQueue } from "../queues"

/**
 * Processa um job de campanha
 */
async function processCampaign(job: Job<CampaignJobData>) {
  const { campaignId, userId } = job.data

  logger.info(`Processing campaign`, null, {
    component: "CampaignWorker",
    action: "processCampaign",
    metadata: { campaignId, userId },
  })

  try {
    // 1. Carregar campanha com relações
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        instances: true,
        contactLists: {
          include: {
            contacts: true,
          },
        },
        stats: true,
      },
    })

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`)
    }

    // Verificar permissões
    if (campaign.userId !== userId && campaign.userRole !== "ADMIN") {
      throw new Error(`User ${userId} not authorized for campaign ${campaignId}`)
    }

    const workflow = workflowSchema.parse(campaign.workflow)
    const messageNodeCount = countMessageNodes(workflow)

    if (messageNodeCount === 0) {
      throw new Error(`Campaign ${campaignId} workflow has no message nodes`)
    }

    // Verificar status
    if (campaign.status !== CampaignStatus.SCHEDULED && campaign.status !== CampaignStatus.DRAFT) {
      throw new Error(`Campaign ${campaignId} is not in valid status: ${campaign.status}`)
    }

    // 2. Validar instâncias
    if (campaign.instances.length === 0) {
      throw new Error(`Campaign ${campaignId} has no instances configured`)
    }

    // 3. Coletar todos os contatos
    const allContacts = campaign.contactLists.flatMap((list) => list.contacts)

    if (allContacts.length === 0) {
      throw new Error(`Campaign ${campaignId} has no contacts`)
    }

    logger.info(`Found contacts for campaign`, null, {
      component: "CampaignWorker",
      action: "processCampaign",
      metadata: { campaignId, contactCount: allContacts.length },
    })

    // 4. Preparar instâncias com ordem de fallback
    const instances = campaign.randomizeInstances
      ? shuffleArray([...campaign.instances])
      : [...campaign.instances].sort((a, b) => (a.fallbackOrder || 0) - (b.fallbackOrder || 0))

    // Primeira instância (principal)
    const primaryInstance = instances[0]

    // Instâncias de fallback
    const fallbackInstances = instances.slice(1).map((inst) => ({
      id: inst.instanceId,
      token: inst.token,
      priority: inst.priority,
    }))

    // 5. Atualizar status da campanha
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.RUNNING,
        startedAt: new Date(),
      },
    })

    // 6. Criar ou atualizar estatísticas
    const totalMessages = allContacts.length * messageNodeCount

    if (campaign.stats) {
      await prisma.campaignStats.update({
        where: { campaignId },
        data: {
          totalContacts: allContacts.length,
          totalMessages,
          messagesPending: totalMessages,
          startedAt: new Date(),
        },
      })
    } else {
      await prisma.campaignStats.create({
        data: {
          campaignId,
          totalContacts: allContacts.length,
          totalMessages,
          messagesPending: totalMessages,
          startedAt: new Date(),
        },
      })
    }

    // 7. Criar jobs de mensagem para cada contato
    const messageJobs = await Promise.all(
      allContacts.map(async (contact, index) => {
        // Criar registro CampaignJob no banco
        const campaignJob = await prisma.campaignJob.create({
          data: {
            bullJobId: generateJobId(campaignId, contact.jid),
            campaignId,
            contactJid: contact.jid,
            contactName: contact.name || contact.pushName || undefined,
            instanceId: primaryInstance.instanceId,
            status: JobStatus.PENDING,
            maxAttempts: campaign.maxRetriesPerInstance * instances.length,
          },
        })

        // Preparar payload do job
        const customFields =
          contact.customFields && typeof contact.customFields === "object"
            ? (contact.customFields as Record<string, any>)
            : {}

        const jobData: MessageJobData = {
          campaignId,
          campaignJobId: campaignJob.id,
          workflow,
          campaign: {
            id: campaign.id,
            name: campaign.name,
            type: campaign.type,
            timezone: campaign.timezone,
          },
          contact: {
            jid: contact.jid,
            name: contact.name,
            pushName: contact.pushName,
            type: contact.type,
            custom: customFields,
          },
          context: {
            batchIndex: index,
            totalContacts: allContacts.length,
          },
          instanceId: primaryInstance.instanceId,
          instanceToken: primaryInstance.token,
          attempt: 1,
          maxAttempts: campaign.maxRetriesPerInstance * instances.length,
          messageNodeCount,
          fallbackInstances,
        }

        return {
          name: generateJobId(campaignId, contact.jid),
          data: jobData,
          opts: {
            jobId: generateJobId(campaignId, contact.jid),
          },
        }
      })
    )

    // 8. Adicionar jobs em batch na fila de mensagens
    await messageQueue.addBulk(messageJobs)

    logger.success(`Created message jobs for campaign`, null, {
      component: "CampaignWorker",
      action: "processCampaign",
      metadata: { campaignId, jobsCreated: messageJobs.length },
    })

    return {
      success: true,
      campaignId,
      contactsProcessed: allContacts.length,
      messagesCreated: messageJobs.length,
    }
  } catch (error) {
    logger.error(`Error processing campaign`, error, {
      component: "CampaignWorker",
      action: "processCampaign",
      metadata: { campaignId },
    })

    // Atualizar status da campanha para FAILED
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.FAILED,
      },
    })

    throw error
  }
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// ============================================================================
// WORKER INITIALIZATION
// ============================================================================

let worker: Worker | null = null

/**
 * Inicia o worker de campanhas
 */
export function startCampaignWorker() {
  if (worker) {
    logger.info("Campaign worker already running", null, {
      component: "CampaignWorker",
      action: "startCampaignWorker",
    })
    return worker
  }

  worker = new Worker<CampaignJobData>(
    QueueNames.CAMPAIGN_PROCESSOR,
    processCampaign,
    campaignWorkerOptions
  )

  worker.on("completed", (job) => {
    logger.success(`Job completed successfully`, null, {
      component: "CampaignWorker",
      action: "workerEventHandler",
      metadata: { jobId: job.id },
    })
  })

  worker.on("failed", (job, err) => {
    logger.error(`Job failed`, err, {
      component: "CampaignWorker",
      action: "workerEventHandler",
      metadata: { jobId: job?.id },
    })
  })

  worker.on("error", (err) => {
    logger.error("Worker error", err, {
      component: "CampaignWorker",
      action: "workerEventHandler",
    })
  })

  logger.success("Campaign worker started", null, {
    component: "CampaignWorker",
    action: "startCampaignWorker",
  })

  return worker
}

/**
 * Para o worker de campanhas
 */
export async function stopCampaignWorker() {
  if (!worker) {
    return
  }

  await worker.close()
  worker = null
  logger.info("Campaign worker stopped", null, {
    component: "CampaignWorker",
    action: "stopCampaignWorker",
  })
}

/**
 * Retorna o worker atual (se existir)
 */
export function getCampaignWorker() {
  return worker
}
