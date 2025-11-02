/**
 * BullMQ Queue Instances
 *
 * Instâncias singleton das filas para uso em toda aplicação.
 */
import { Queue } from "bullmq"

import { logger } from "@/lib/logger"

import { CampaignJobData, MessageJobData, QueueNames, defaultQueueOptions } from "./config"

// ============================================================================
// QUEUE INSTANCES
// ============================================================================

/**
 * Fila para processamento de campanhas
 * - Recebe: campaignId
 * - Produz: Múltiplos jobs na fila MESSAGE_SENDER
 */
export const campaignQueue = new Queue<CampaignJobData>(
  QueueNames.CAMPAIGN_PROCESSOR,
  defaultQueueOptions
)

/**
 * Fila para envio de mensagens individuais
 * - Recebe: dados da mensagem + contato + instância
 * - Processa: Envio via API ZuckZapGo com fallback
 */
export const messageQueue = new Queue<MessageJobData>(
  QueueNames.MESSAGE_SENDER,
  defaultQueueOptions
)

// ============================================================================
// QUEUE HELPERS
// ============================================================================

/**
 * Adiciona uma campanha à fila de processamento
 */
export async function addCampaignToQueue(data: CampaignJobData) {
  const job = await campaignQueue.add("process-campaign", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  })

  logger.info("Campaign added to queue", null, {
    component: "CampaignQueue",
    action: "addCampaignToQueue",
    metadata: { jobId: job.id, campaignId: data.campaignId },
  })

  return job
}

/**
 * Adiciona uma mensagem à fila de envio
 */
export async function addMessageToQueue(data: MessageJobData) {
  const job = await messageQueue.add("send-message", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  })

  return job
}

// ============================================================================
// QUEUE MANAGEMENT
// ============================================================================

/**
 * Obtém estatísticas de todas as filas
 */
export async function getQueueStats() {
  const [campaignStats, messageStats] = await Promise.all([
    campaignQueue.getJobCounts(),
    messageQueue.getJobCounts(),
  ])

  return {
    campaign: campaignStats,
    message: messageStats,
  }
}

/**
 * Limpa jobs completados de todas as filas
 */
export async function cleanCompletedJobs() {
  const results = await Promise.all([
    campaignQueue.clean(24 * 3600 * 1000, 1000, "completed"),
    messageQueue.clean(24 * 3600 * 1000, 1000, "completed"),
  ])

  return {
    campaign: results[0],
    message: results[1],
  }
}

/**
 * Pausa todas as filas (útil para manutenção)
 */
export async function pauseAllQueues() {
  await Promise.all([campaignQueue.pause(), messageQueue.pause()])
}

/**
 * Resume todas as filas
 */
export async function resumeAllQueues() {
  await Promise.all([campaignQueue.resume(), messageQueue.resume()])
}

/**
 * Fecha todas as conexões (graceful shutdown)
 */
export async function closeAllQueues() {
  await Promise.all([campaignQueue.close(), messageQueue.close()])
}

// ============================================================================
// QUEUE EVENTS
// ============================================================================

/**
 * Setup de event listeners para monitoramento
 */
export function setupQueueEventListeners() {
  // Campaign Queue Events
  campaignQueue.on("error", (err) => {
    logger.error("Campaign queue error", err, {
      component: "CampaignQueue",
      action: "setupQueueEventListeners",
    })
  })

  campaignQueue.on("waiting", (jobId) => {
    logger.debug(`Job is waiting`, null, {
      component: "CampaignQueue",
      action: "setupQueueEventListeners",
      metadata: { jobId },
    })
  })
  ;(campaignQueue as any).on("active", (job: any) => {
    logger.info(`Job started processing`, null, {
      component: "CampaignQueue",
      action: "setupQueueEventListeners",
      metadata: { jobId: job.id },
    })
  })
  ;(campaignQueue as any).on("completed", (job: any) => {
    logger.success(`Job completed`, null, {
      component: "CampaignQueue",
      action: "setupQueueEventListeners",
      metadata: { jobId: job.id },
    })
  })
  ;(campaignQueue as any).on("failed", (job: any, err: any) => {
    logger.error(`Job failed`, err, {
      component: "CampaignQueue",
      action: "setupQueueEventListeners",
      metadata: { jobId: job?.id },
    })
  })

  // Message Queue Events
  ;(messageQueue as any).on("error", (err: any) => {
    logger.error("Message queue error", err, {
      component: "MessageQueue",
      action: "setupQueueEventListeners",
    })
  })
  ;(messageQueue as any).on("completed", (job: any) => {
    logger.success(`Message sent`, null, {
      component: "MessageQueue",
      action: "setupQueueEventListeners",
      metadata: { jobId: job.id },
    })
  })
  ;(messageQueue as any).on("failed", (job: any, err: any) => {
    logger.error(`Message failed`, err, {
      component: "MessageQueue",
      action: "setupQueueEventListeners",
      metadata: { jobId: job?.id },
    })
  })
}
