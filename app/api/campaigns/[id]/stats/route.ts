/**
 * Campaign Stats API Route
 *
 * GET /api/campaigns/[id]/stats - Retorna estatísticas da campanha
 * GET /api/campaigns/[id]/stats?stream=true - Server-Sent Events para atualizações em tempo real
 *
 * @module app/api/campaigns/[id]/stats/route
 */
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { getRole, getToken } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"

// ============================================================================
// TYPES
// ============================================================================

interface StatsResponse {
  campaignId: string
  campaignName: string
  campaignStatus: string
  stats: {
    totalMessages: number
    messagesSent: number
    messagesFailed: number
    messagesPending: number
    successRate: number
    startedAt: string | null
    completedAt: string | null
    lastUpdatedAt: string
  }
  instances: Array<{
    instanceToken: string
    priority: number
    messagesSent: number
    messagesFailed: number
    successRate: number
  }>
}

// ============================================================================
// GET HANDLER
// ============================================================================

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: campaignId } = await params
  const { searchParams } = new URL(request.url)
  const stream = searchParams.get("stream") === "true"

  try {
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      logger.warn("Unauthorized access attempt to campaign stats", null, {
        component: "CampaignStatsAPI",
        action: "GET",
        metadata: { campaignId },
      })
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Buscar campanha com estatísticas
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        stats: true,
        instances: {
          orderBy: { priority: "asc" },
        },
      },
    })

    if (!campaign) {
      logger.warn("Campaign not found", null, {
        component: "CampaignStatsAPI",
        action: "GET",
        metadata: { campaignId, userId },
      })
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 })
    }

    // Verificar permissões (user só pode ver suas próprias campanhas)
    if (role.toUpperCase() !== "ADMIN" && campaign.userId !== userId) {
      logger.warn("Forbidden access to campaign stats", null, {
        component: "CampaignStatsAPI",
        action: "GET",
        metadata: { campaignId, userId, campaignUserId: campaign.userId },
      })
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Se não for streaming, retornar stats imediatamente
    if (!stream) {
      const stats = buildStatsResponse(campaign)

      logger.info("Campaign stats retrieved", null, {
        component: "CampaignStatsAPI",
        action: "GET",
        metadata: { campaignId, userId, stream: false },
      })

      return NextResponse.json(stats)
    }

    // Server-Sent Events (SSE) para atualizações em tempo real
    logger.info("Starting SSE stream for campaign stats", null, {
      component: "CampaignStatsAPI",
      action: "GET",
      metadata: { campaignId, userId, stream: true },
    })

    const encoder = new TextEncoder()
    let intervalId: NodeJS.Timeout | null = null

    const sseStream = new ReadableStream({
      async start(controller) {
        // Função para enviar dados
        const sendStats = async () => {
          try {
            const updatedCampaign = await prisma.campaign.findUnique({
              where: { id: campaignId },
              include: {
                stats: true,
                instances: {
                  orderBy: { priority: "asc" },
                },
              },
            })

            if (!updatedCampaign) {
              controller.close()
              if (intervalId) clearInterval(intervalId)
              return
            }

            const stats = buildStatsResponse(updatedCampaign)
            const data = `data: ${JSON.stringify(stats)}\n\n`
            controller.enqueue(encoder.encode(data))

            // Se a campanha foi concluída ou cancelada, fechar stream
            if (
              updatedCampaign.status === "COMPLETED" ||
              updatedCampaign.status === "CANCELLED" ||
              updatedCampaign.status === "FAILED"
            ) {
              logger.info("Campaign finished, closing SSE stream", null, {
                component: "CampaignStatsAPI",
                action: "SSE",
                metadata: { campaignId, status: updatedCampaign.status },
              })
              controller.close()
              if (intervalId) clearInterval(intervalId)
            }
          } catch (error) {
            logger.error("Error in SSE stream", error instanceof Error ? error : undefined, {
              component: "CampaignStatsAPI",
              action: "SSE",
              metadata: { campaignId },
            })
            controller.close()
            if (intervalId) clearInterval(intervalId)
          }
        }

        // Enviar dados iniciais
        await sendStats()

        // Atualizar a cada 2 segundos
        intervalId = setInterval(sendStats, 2000)
      },
      cancel() {
        if (intervalId) {
          clearInterval(intervalId)
        }
        logger.info("SSE stream cancelled", null, {
          component: "CampaignStatsAPI",
          action: "SSE",
          metadata: { campaignId },
        })
      },
    })

    return new NextResponse(sseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    logger.error("Failed to get campaign stats", error instanceof Error ? error : undefined, {
      component: "CampaignStatsAPI",
      action: "GET",
      metadata: { campaignId },
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar estatísticas" },
      { status: 500 }
    )
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Constrói resposta de estatísticas a partir dos dados da campanha
 */
function buildStatsResponse(campaign: any): StatsResponse {
  const stats = campaign.stats || {
    totalMessages: 0,
    messagesSent: 0,
    messagesFailed: 0,
    messagesPending: 0,
    startedAt: null,
    completedAt: null,
    updatedAt: new Date(),
  }

  // Calcular taxa de sucesso
  const successRate = stats.totalMessages > 0 ? (stats.messagesSent / stats.totalMessages) * 100 : 0

  // Estatísticas por instância
  const instanceStats = campaign.instances.map((instance: any) => {
    const instanceSuccessRate =
      instance.totalMessages > 0 ? (instance.messagesSent / instance.totalMessages) * 100 : 0

    return {
      instanceToken: instance.instanceToken,
      priority: instance.priority,
      messagesSent: instance.messagesSent,
      messagesFailed: instance.messagesFailed,
      successRate: Math.round(instanceSuccessRate * 100) / 100,
    }
  })

  return {
    campaignId: campaign.id,
    campaignName: campaign.name,
    campaignStatus: campaign.status,
    stats: {
      totalMessages: stats.totalMessages,
      messagesSent: stats.messagesSent,
      messagesFailed: stats.messagesFailed,
      messagesPending: stats.messagesPending,
      successRate: Math.round(successRate * 100) / 100,
      startedAt: stats.startedAt ? stats.startedAt.toISOString() : null,
      completedAt: stats.completedAt ? stats.completedAt.toISOString() : null,
      lastUpdatedAt: stats.updatedAt.toISOString(),
    },
    instances: instanceStats,
  }
}
