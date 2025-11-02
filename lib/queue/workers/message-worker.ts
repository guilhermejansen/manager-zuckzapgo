/**
 * Message Worker
 *
 * Envia mensagens via API ZuckZapGo com suporte a fallback entre instâncias.
 *
 * Responsabilidades:
 * - Enviar mensagem via API do ZuckZapGo
 * - Implementar lógica de fallback entre instâncias
 * - Respeitar delays entre mensagens
 * - Atualizar estatísticas em tempo real
 * - Registrar tentativas e erros
 */
import { JobStatus } from "@prisma/client"
import { Job, Worker } from "bullmq"

import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"
import { runWorkflow } from "@/lib/workflow/runtime"

import { MessageJobData, QueueNames, messageWorkerOptions } from "../config"

// ============================================================================
// ZUCKZAPGO API CLIENT
// ============================================================================

const ZUCKZAPGO_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface ZuckZapGoResponse {
  success: boolean
  message?: string
  error?: string
  data?: any
}

/**
 * Envia mensagem via API ZuckZapGo
 */
async function sendMessage(
  instanceToken: string,
  contactJid: string,
  messageType: string,
  messageContent: any
): Promise<ZuckZapGoResponse> {
  const endpoint = `${ZUCKZAPGO_API_URL}/api/send/${messageType}`

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: instanceToken,
    },
    body: JSON.stringify({
      jid: contactJid,
      ...messageContent,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API Error ${response.status}: ${errorText}`)
  }

  return response.json()
}

/**
 * Aguarda um delay (em milissegundos)
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================================================
// MESSAGE PROCESSING
// ============================================================================

/**
 * Processa um job de mensagem
 */
async function processMessage(job: Job<MessageJobData>) {
  const {
    campaignId,
    campaignJobId,
    workflow,
    campaign,
    contact,
    context: workflowContext,
    instanceId,
    instanceToken,
    attempt,
    maxAttempts,
    messageNodeCount,
    fallbackInstances,
  } = job.data

  const contactJid = contact.jid
  const contactDisplay = contact.name || contact.pushName || contactJid

  logger.info(`Processing message`, null, {
    component: "MessageWorker",
    action: "processMessage",
    metadata: {
      contact: contactDisplay,
      attempt,
      maxAttempts,
      campaignId,
    },
  })

  try {
    // 1. Atualizar status do job no banco
    await prisma.campaignJob.update({
      where: { id: campaignJobId },
      data: {
        status: JobStatus.PROCESSING,
        attempts: attempt,
        processedAt: new Date(),
      },
    })

    const execution = await runWorkflow({
      workflow,
      campaign,
      contact,
      context: workflowContext,
      delay,
      sendMessage: async ({ kind, payload }) => {
        const result = await sendMessage(instanceToken, contactJid, kind, payload)
        if (!result.success) {
          throw new Error(result.error || "Message failed")
        }
        return result
      },
      logger: (entry) => {
        logger.debug(entry.message, null, {
          component: "MessageWorker",
          action: "workflowExecution",
          metadata: {
            nodeId: entry.nodeId,
            type: entry.type,
            ...entry.metadata,
          },
        })
      },
    })

    const messagesSent = execution.messagesSent

    // 3. Atualizar job como completado
    await prisma.campaignJob.update({
      where: { id: campaignJobId },
      data: {
        status: JobStatus.COMPLETED,
        sentAt: new Date(),
        completedAt: new Date(),
      },
    })

    // 4. Atualizar estatísticas da campanha
    await prisma.campaignStats.update({
      where: { campaignId },
      data: {
        messagesSent: { increment: messagesSent },
        messagesPending: { decrement: messagesSent },
        lastMessageAt: new Date(),
      },
    })

    // 5. Atualizar estatísticas da instância
    await prisma.campaignInstance.update({
      where: {
        campaignId_instanceId: {
          campaignId,
          instanceId,
        },
      },
      data: {
        messagesSent: { increment: messagesSent },
        lastUsedAt: new Date(),
      },
    })

    logger.success(`All messages sent successfully`, null, {
      component: "MessageWorker",
      action: "processMessage",
      metadata: { contactJid, messagesSent },
    })

    return {
      success: true,
      contactJid,
      messagesSent,
    }
  } catch (error) {
    logger.error(`Error sending message`, error, {
      component: "MessageWorker",
      action: "processMessage",
      metadata: { contactJid, campaignId },
    })

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Verificar se há tentativas restantes ou instâncias de fallback
    const shouldRetry = attempt < maxAttempts

    if (shouldRetry && fallbackInstances.length > 0) {
      // Tentar próxima instância
      const nextAttempt = attempt + 1
      const instanceIndex = Math.floor((nextAttempt - 1) / 3) // 3 tentativas por instância
      const nextInstance = fallbackInstances[instanceIndex % fallbackInstances.length]

      logger.info(`Retrying with fallback instance`, null, {
        component: "MessageWorker",
        action: "processMessage",
        metadata: {
          instanceId: nextInstance.id,
          nextAttempt,
          contactJid,
        },
      })

      // Atualizar job para próxima tentativa
      await prisma.campaignJob.update({
        where: { id: campaignJobId },
        data: {
          status: JobStatus.RETRYING,
          attempts: nextAttempt,
          instanceId: nextInstance.id,
          lastError: errorMessage,
        },
      })

      // Atualizar stats da instância falhada
      await prisma.campaignInstance.update({
        where: {
          campaignId_instanceId: {
            campaignId,
            instanceId,
          },
        },
        data: {
          messagesFailed: { increment: 1 },
        },
      })

      // Re-throw para BullMQ retry
      throw error
    } else {
      // Sem mais tentativas - marcar como falha permanente
      await prisma.campaignJob.update({
        where: { id: campaignJobId },
        data: {
          status: JobStatus.FAILED,
          lastError: errorMessage,
          completedAt: new Date(),
        },
      })

      // Atualizar estatísticas
      await prisma.campaignStats.update({
        where: { campaignId },
        data: {
          messagesFailed: { increment: messageNodeCount },
          messagesPending: { decrement: messageNodeCount },
        },
      })

      await prisma.campaignInstance.update({
        where: {
          campaignId_instanceId: {
            campaignId,
            instanceId,
          },
        },
        data: {
          messagesFailed: { increment: 1 },
        },
      })

      logger.error(`All attempts exhausted`, error, {
        component: "MessageWorker",
        action: "processMessage",
        metadata: { contactJid, totalAttempts: maxAttempts, lastError: errorMessage },
      })

      throw error
    }
  }
}

// ============================================================================
// WORKER INITIALIZATION
// ============================================================================

let worker: Worker | null = null

/**
 * Inicia o worker de mensagens
 */
export function startMessageWorker() {
  if (worker) {
    logger.info("Message worker already running", null, {
      component: "MessageWorker",
      action: "startMessageWorker",
    })
    return worker
  }

  worker = new Worker<MessageJobData>(
    QueueNames.MESSAGE_SENDER,
    processMessage,
    messageWorkerOptions
  )

  worker.on("completed", (job) => {
    logger.success(`Job completed successfully`, null, {
      component: "MessageWorker",
      action: "workerEventHandler",
      metadata: { jobId: job.id },
    })
  })

  worker.on("failed", (job, err) => {
    logger.error(`Job failed`, err, {
      component: "MessageWorker",
      action: "workerEventHandler",
      metadata: { jobId: job?.id },
    })
  })

  worker.on("error", (err) => {
    logger.error("Worker error", err, {
      component: "MessageWorker",
      action: "workerEventHandler",
    })
  })

  logger.success("Message worker started", null, {
    component: "MessageWorker",
    action: "startMessageWorker",
  })

  return worker
}

/**
 * Para o worker de mensagens
 */
export async function stopMessageWorker() {
  if (!worker) {
    return
  }

  await worker.close()
  worker = null
  logger.info("Message worker stopped", null, {
    component: "MessageWorker",
    action: "stopMessageWorker",
  })
}

/**
 * Retorna o worker atual (se existir)
 */
export function getMessageWorker() {
  return worker
}
