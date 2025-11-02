/**
 * Workers Index
 *
 * Gerenciamento centralizado de todos os workers BullMQ.
 */
import { logger } from "@/lib/logger"

import { getCampaignWorker, startCampaignWorker, stopCampaignWorker } from "./campaign-worker"
import { getMessageWorker, startMessageWorker, stopMessageWorker } from "./message-worker"

// ============================================================================
// WORKER MANAGEMENT
// ============================================================================

/**
 * Inicia todos os workers
 */
export async function startAllWorkers() {
  logger.info("Starting all workers", null, {
    component: "Workers",
    action: "startAllWorkers",
  })

  try {
    startCampaignWorker()
    startMessageWorker()

    logger.success("All workers started successfully", null, {
      component: "Workers",
      action: "startAllWorkers",
    })
  } catch (error) {
    logger.error("Error starting workers", error, {
      component: "Workers",
      action: "startAllWorkers",
    })
    throw error
  }
}

/**
 * Para todos os workers (graceful shutdown)
 */
export async function stopAllWorkers() {
  logger.info("Stopping all workers", null, {
    component: "Workers",
    action: "stopAllWorkers",
  })

  try {
    await Promise.all([stopCampaignWorker(), stopMessageWorker()])

    logger.success("All workers stopped successfully", null, {
      component: "Workers",
      action: "stopAllWorkers",
    })
  } catch (error) {
    logger.error("Error stopping workers", error, {
      component: "Workers",
      action: "stopAllWorkers",
    })
    throw error
  }
}

/**
 * Verifica se todos os workers estão rodando
 */
export function areWorkersRunning(): boolean {
  const campaignWorker = getCampaignWorker()
  const messageWorker = getMessageWorker()

  return campaignWorker !== null && messageWorker !== null
}

/**
 * Obtém status de todos os workers
 */
export function getWorkersStatus() {
  return {
    campaign: getCampaignWorker() !== null,
    message: getMessageWorker() !== null,
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  startCampaignWorker,
  stopCampaignWorker,
  getCampaignWorker,
  startMessageWorker,
  stopMessageWorker,
  getMessageWorker,
}
