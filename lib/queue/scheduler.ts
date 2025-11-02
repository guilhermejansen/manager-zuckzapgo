/**
 * Campaign Scheduler with Cron Support
 *
 * Sistema de agendamento para campanhas SCHEDULED e RECURRING.
 * Executa verificações periódicas e dispara campanhas no momento correto.
 *
 * @module lib/queue/scheduler
 */
import { CronJob } from "cron"

import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"

import { campaignQueue } from "./queues"

// ============================================================================
// TYPES
// ============================================================================

interface SchedulerConfig {
  /** Intervalo de verificação em segundos (padrão: 60s) */
  checkInterval?: number
  /** Timezone padrão para cron jobs (padrão: America/Sao_Paulo) */
  defaultTimezone?: string
  /** Habilitar logs de debug */
  debug?: boolean
}

interface ScheduledCampaign {
  id: string
  name: string
  type: "SCHEDULED" | "RECURRING"
  scheduledAt: Date | null
  cronExpression: string | null
  timezone: string | null
  userId: string
}

// ============================================================================
// SCHEDULER CLASS
// ============================================================================

export class CampaignScheduler {
  private checkJob: CronJob | null = null
  private recurringJobs: Map<string, CronJob> = new Map()
  private config: Required<SchedulerConfig>
  private isRunning = false

  constructor(config: SchedulerConfig = {}) {
    this.config = {
      checkInterval: config.checkInterval ?? 60,
      defaultTimezone: config.defaultTimezone ?? "America/Sao_Paulo",
      debug: config.debug ?? false,
    }

    logger.info("CampaignScheduler initialized", null, {
      component: "CampaignScheduler",
      action: "constructor",
      metadata: { config: this.config },
    })
  }

  // ==========================================================================
  // PUBLIC METHODS
  // ==========================================================================

  /**
   * Inicia o scheduler
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn("Scheduler already running", null, {
        component: "CampaignScheduler",
        action: "start",
      })
      return
    }

    try {
      // Inicia job de verificação de campanhas agendadas (SCHEDULED)
      this.startScheduledCampaignCheck()

      // Carrega e inicia jobs recorrentes (RECURRING)
      await this.loadRecurringCampaigns()

      this.isRunning = true

      logger.success("CampaignScheduler started successfully", null, {
        component: "CampaignScheduler",
        action: "start",
        metadata: {
          recurringJobsCount: this.recurringJobs.size,
          checkInterval: this.config.checkInterval,
        },
      })
    } catch (error) {
      logger.error("Failed to start scheduler", error instanceof Error ? error : undefined, {
        component: "CampaignScheduler",
        action: "start",
      })
      throw error
    }
  }

  /**
   * Para o scheduler
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      logger.warn("Scheduler not running", null, {
        component: "CampaignScheduler",
        action: "stop",
      })
      return
    }

    try {
      // Para job de verificação
      if (this.checkJob) {
        this.checkJob.stop()
        this.checkJob = null
      }

      // Para todos os jobs recorrentes
      for (const [campaignId, job] of this.recurringJobs.entries()) {
        job.stop()
        this.recurringJobs.delete(campaignId)
      }

      this.isRunning = false

      logger.success("CampaignScheduler stopped successfully", null, {
        component: "CampaignScheduler",
        action: "stop",
      })
    } catch (error) {
      logger.error("Failed to stop scheduler", error instanceof Error ? error : undefined, {
        component: "CampaignScheduler",
        action: "stop",
      })
      throw error
    }
  }

  /**
   * Registra uma nova campanha recorrente
   */
  async registerRecurringCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          scheduledAt: true,
          cronExpression: true,
          timezone: true,
          userId: true,
        },
      })

      if (!campaign) {
        throw new Error(`Campaign ${campaignId} not found`)
      }

      if (campaign.type !== "RECURRING") {
        throw new Error(`Campaign ${campaignId} is not RECURRING type`)
      }

      if (campaign.status !== "SCHEDULED" && campaign.status !== "RUNNING") {
        logger.warn("Cannot register non-active recurring campaign", null, {
          component: "CampaignScheduler",
          action: "registerRecurringCampaign",
          metadata: { campaignId, status: campaign.status },
        })
        return
      }

      if (!campaign.cronExpression) {
        throw new Error(`Campaign ${campaignId} has no cron expression`)
      }

      // Remove job anterior se existir
      if (this.recurringJobs.has(campaignId)) {
        this.recurringJobs.get(campaignId)!.stop()
        this.recurringJobs.delete(campaignId)
      }

      // Cria novo cron job
      const timezone = campaign.timezone || this.config.defaultTimezone
      const cronJob = new CronJob(
        campaign.cronExpression,
        async () => {
          await this.executeCampaign(campaign as ScheduledCampaign)
        },
        null,
        true,
        timezone
      )

      this.recurringJobs.set(campaignId, cronJob)

      logger.success("Recurring campaign registered", null, {
        component: "CampaignScheduler",
        action: "registerRecurringCampaign",
        metadata: {
          campaignId,
          campaignName: campaign.name,
          cronExpression: campaign.cronExpression,
          timezone,
        },
      })
    } catch (error) {
      logger.error(
        "Failed to register recurring campaign",
        error instanceof Error ? error : undefined,
        {
          component: "CampaignScheduler",
          action: "registerRecurringCampaign",
          metadata: { campaignId },
        }
      )
      throw error
    }
  }

  /**
   * Remove uma campanha recorrente do scheduler
   */
  async unregisterRecurringCampaign(campaignId: string): Promise<void> {
    try {
      if (!this.recurringJobs.has(campaignId)) {
        logger.warn("Campaign not registered", null, {
          component: "CampaignScheduler",
          action: "unregisterRecurringCampaign",
          metadata: { campaignId },
        })
        return
      }

      const job = this.recurringJobs.get(campaignId)!
      job.stop()
      this.recurringJobs.delete(campaignId)

      logger.success("Recurring campaign unregistered", null, {
        component: "CampaignScheduler",
        action: "unregisterRecurringCampaign",
        metadata: { campaignId },
      })
    } catch (error) {
      logger.error(
        "Failed to unregister recurring campaign",
        error instanceof Error ? error : undefined,
        {
          component: "CampaignScheduler",
          action: "unregisterRecurringCampaign",
          metadata: { campaignId },
        }
      )
      throw error
    }
  }

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  /**
   * Inicia verificação periódica de campanhas agendadas (SCHEDULED)
   */
  private startScheduledCampaignCheck(): void {
    // Cron para rodar a cada N segundos (ex: */60 * * * * * = a cada 60s)
    const cronPattern = `*/${this.config.checkInterval} * * * * *`

    this.checkJob = new CronJob(
      cronPattern,
      async () => {
        await this.checkScheduledCampaigns()
      },
      null,
      true,
      this.config.defaultTimezone
    )

    if (this.config.debug) {
      logger.debug("Scheduled campaign check started", null, {
        component: "CampaignScheduler",
        action: "startScheduledCampaignCheck",
        metadata: { cronPattern, interval: this.config.checkInterval },
      })
    }
  }

  /**
   * Carrega e registra todas as campanhas recorrentes ativas
   */
  private async loadRecurringCampaigns(): Promise<void> {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
          type: "RECURRING",
          status: { in: ["SCHEDULED", "RUNNING"] },
          cronExpression: { not: null },
        },
        select: {
          id: true,
          name: true,
          type: true,
          cronExpression: true,
          timezone: true,
          userId: true,
          scheduledAt: true,
        },
      })

      for (const campaign of campaigns) {
        try {
          await this.registerRecurringCampaign(campaign.id)
        } catch (error) {
          logger.error(
            "Failed to load recurring campaign",
            error instanceof Error ? error : undefined,
            {
              component: "CampaignScheduler",
              action: "loadRecurringCampaigns",
              metadata: { campaignId: campaign.id, campaignName: campaign.name },
            }
          )
        }
      }

      logger.info("Recurring campaigns loaded", null, {
        component: "CampaignScheduler",
        action: "loadRecurringCampaigns",
        metadata: { count: campaigns.length, loaded: this.recurringJobs.size },
      })
    } catch (error) {
      logger.error(
        "Failed to load recurring campaigns",
        error instanceof Error ? error : undefined,
        {
          component: "CampaignScheduler",
          action: "loadRecurringCampaigns",
        }
      )
      throw error
    }
  }

  /**
   * Verifica e executa campanhas agendadas (SCHEDULED) que devem rodar agora
   */
  private async checkScheduledCampaigns(): Promise<void> {
    try {
      const now = new Date()

      const campaigns = await prisma.campaign.findMany({
        where: {
          type: "SCHEDULED",
          status: "SCHEDULED",
          scheduledAt: {
            lte: now,
          },
        },
        select: {
          id: true,
          name: true,
          type: true,
          scheduledAt: true,
          cronExpression: true,
          timezone: true,
          userId: true,
        },
      })

      if (campaigns.length === 0) {
        if (this.config.debug) {
          logger.debug("No scheduled campaigns to execute", null, {
            component: "CampaignScheduler",
            action: "checkScheduledCampaigns",
          })
        }
        return
      }

      logger.info("Found scheduled campaigns to execute", null, {
        component: "CampaignScheduler",
        action: "checkScheduledCampaigns",
        metadata: { count: campaigns.length },
      })

      for (const campaign of campaigns) {
        await this.executeCampaign(campaign as ScheduledCampaign)
      }
    } catch (error) {
      logger.error(
        "Failed to check scheduled campaigns",
        error instanceof Error ? error : undefined,
        {
          component: "CampaignScheduler",
          action: "checkScheduledCampaigns",
        }
      )
    }
  }

  /**
   * Executa uma campanha (adiciona job na fila do BullMQ)
   */
  private async executeCampaign(campaign: ScheduledCampaign): Promise<void> {
    try {
      // Adiciona job na fila de campanhas
      await campaignQueue.add(
        `campaign-${campaign.id}`,
        {
          campaignId: campaign.id,
          userId: campaign.userId,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
        }
      )

      logger.success("Campaign queued for execution", null, {
        component: "CampaignScheduler",
        action: "executeCampaign",
        metadata: {
          campaignId: campaign.id,
          campaignName: campaign.name,
          type: campaign.type,
          userId: campaign.userId,
        },
      })

      // Se for SCHEDULED (disparo único), marca como COMPLETED após adicionar na fila
      if (campaign.type === "SCHEDULED") {
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: "RUNNING" }, // Será marcado como COMPLETED pelo worker
        })

        logger.info("Scheduled campaign status updated to RUNNING", null, {
          component: "CampaignScheduler",
          action: "executeCampaign",
          metadata: { campaignId: campaign.id },
        })
      }
    } catch (error) {
      logger.error("Failed to execute campaign", error instanceof Error ? error : undefined, {
        component: "CampaignScheduler",
        action: "executeCampaign",
        metadata: {
          campaignId: campaign.id,
          campaignName: campaign.name,
          type: campaign.type,
        },
      })

      // Marca campanha como FAILED
      await prisma.campaign
        .update({
          where: { id: campaign.id },
          data: { status: "FAILED" },
        })
        .catch((updateError) => {
          logger.error(
            "Failed to update campaign status to FAILED",
            updateError instanceof Error ? updateError : undefined,
            {
              component: "CampaignScheduler",
              action: "executeCampaign",
              metadata: { campaignId: campaign.id },
            }
          )
        })
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let schedulerInstance: CampaignScheduler | null = null

/**
 * Retorna instância singleton do scheduler
 */
export function getScheduler(config?: SchedulerConfig): CampaignScheduler {
  if (!schedulerInstance) {
    schedulerInstance = new CampaignScheduler(config)
  }
  return schedulerInstance
}

/**
 * Inicia o scheduler global
 */
export async function startScheduler(config?: SchedulerConfig): Promise<CampaignScheduler> {
  const scheduler = getScheduler(config)
  await scheduler.start()
  return scheduler
}

/**
 * Para o scheduler global
 */
export async function stopScheduler(): Promise<void> {
  if (schedulerInstance) {
    await schedulerInstance.stop()
    schedulerInstance = null
  }
}
