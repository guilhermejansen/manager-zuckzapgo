/**
 * Worker Startup Script
 *
 * Script standalone para rodar os workers BullMQ.
 * Pode ser executado separadamente do Next.js com: npm run workers
 */
import { logger } from "@/lib/logger"

import { setupQueueEventListeners } from "./queues"
import { startScheduler, stopScheduler } from "./scheduler"
import { startAllWorkers, stopAllWorkers } from "./workers"

async function main() {
  logger.info("=".repeat(60), null, {
    component: "WorkerStartup",
    action: "main",
  })
  logger.info("BullMQ Workers - Campaign Message System", null, {
    component: "WorkerStartup",
    action: "main",
  })
  logger.info("=".repeat(60), null, {
    component: "WorkerStartup",
    action: "main",
  })

  try {
    // Setup event listeners
    setupQueueEventListeners()

    // Start all workers
    await startAllWorkers()

    // Start campaign scheduler
    await startScheduler({
      checkInterval: 60, // Check every 60 seconds
      defaultTimezone: "America/Sao_Paulo",
      debug: process.env.NODE_ENV === "development",
    })

    logger.success("Workers and Scheduler are running!", null, {
      component: "WorkerStartup",
      action: "main",
    })
    logger.info("Press Ctrl+C to stop", null, {
      component: "WorkerStartup",
      action: "main",
    })

    // Graceful shutdown
    process.on("SIGINT", async () => {
      logger.warn("Shutting down workers and scheduler...", null, {
        component: "WorkerStartup",
        action: "shutdown",
      })
      await stopScheduler()
      await stopAllWorkers()
      process.exit(0)
    })

    process.on("SIGTERM", async () => {
      logger.warn("Shutting down workers and scheduler...", null, {
        component: "WorkerStartup",
        action: "shutdown",
      })
      await stopScheduler()
      await stopAllWorkers()
      process.exit(0)
    })
  } catch (error) {
    logger.error("Failed to start workers", error, {
      component: "WorkerStartup",
      action: "main",
    })
    process.exit(1)
  }
}

main()
