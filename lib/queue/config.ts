/**
 * BullMQ Configuration
 *
 * Configuração centralizada para filas, workers e conexão Redis.
 */
import { ConnectionOptions, QueueOptions, WorkerOptions } from "bullmq"
import IORedis from "ioredis"

import { logger } from "@/lib/logger"
import type { WorkflowFormData } from "@/lib/validations"
import type {
  CampaignRuntimeMeta,
  ContactRuntimeData,
  WorkflowExecutionContext,
} from "@/lib/workflow/runtime"

// ============================================================================
// REDIS CONNECTION
// ============================================================================

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

/**
 * Cria uma conexão Redis otimizada para BullMQ
 */
export function createRedisConnection(): IORedis {
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null, // Required for BullMQ
    enableReadyCheck: false,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
  })

  connection.on("error", (err) => {
    logger.error("Redis connection error", err, {
      component: "BullMQ",
      action: "createRedisConnection",
    })
  })

  connection.on("connect", () => {
    logger.success("Redis connected successfully", null, {
      component: "BullMQ",
      action: "createRedisConnection",
    })
  })

  return connection
}

// ============================================================================
// QUEUE NAMES
// ============================================================================

export const QueueNames = {
  CAMPAIGN_PROCESSOR: "campaign-processor", // Processa campanhas
  MESSAGE_SENDER: "message-sender", // Envia mensagens individuais
} as const

// ============================================================================
// QUEUE OPTIONS
// ============================================================================

export const defaultQueueOptions: QueueOptions = {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000, // 2s, 4s, 8s
    },
    removeOnComplete: {
      age: 24 * 3600, // Remove jobs completados após 24h
      count: 1000, // Mantém no máximo 1000 jobs completados
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Remove jobs falhados após 7 dias
    },
  },
}

// ============================================================================
// WORKER OPTIONS
// ============================================================================

/**
 * Worker para processar campanhas (menos concorrência)
 */
export const campaignWorkerOptions: WorkerOptions = {
  connection: createRedisConnection(),
  concurrency: parseInt(process.env.CAMPAIGN_WORKER_CONCURRENCY || "5", 10),
  limiter: {
    max: 10, // Máximo 10 jobs
    duration: 1000, // Por segundo
  },
}

/**
 * Worker para enviar mensagens (alta concorrência)
 */
export const messageWorkerOptions: WorkerOptions = {
  connection: createRedisConnection(),
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || "50", 10),
  limiter: {
    max: parseInt(process.env.MESSAGE_RATE_LIMIT_MAX || "100", 10),
    duration: parseInt(process.env.MESSAGE_RATE_LIMIT_DURATION || "1000", 10),
  },
}

// ============================================================================
// JOB DATA TYPES
// ============================================================================

/**
 * Payload do job de processamento de campanha
 */
export interface CampaignJobData {
  campaignId: string
  userId: string
  scheduledAt?: string // ISO string
}

/**
 * Payload do job de envio de mensagem
 */
export interface MessageJobData {
  campaignId: string
  campaignJobId: string
  workflow: WorkflowFormData
  campaign: CampaignRuntimeMeta
  contact: ContactRuntimeData
  context: WorkflowExecutionContext
  instanceId: string
  instanceToken: string
  attempt: number
  maxAttempts: number
  messageNodeCount: number
  fallbackInstances: {
    id: string
    token: string
    priority: number
  }[]
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gera um job ID único baseado na campanha e contato
 */
export function generateJobId(campaignId: string, contactJid: string): string {
  return `${campaignId}:${contactJid}`
}

/**
 * Health check da conexão Redis
 */
export async function checkRedisConnection(): Promise<boolean> {
  try {
    const redis = createRedisConnection()
    const result = await redis.ping()
    await redis.quit()
    return result === "PONG"
  } catch (error) {
    logger.error("Redis health check failed", error, {
      component: "BullMQ",
      action: "checkRedisConnection",
    })
    return false
  }
}
