/**
 * Stats Dashboard Component
 *
 * Dashboard principal de estatísticas com gráficos e métricas.
 * Atualização automática via polling.
 *
 * @module components/campaign/stats-dashboard
 */

"use client"

import { useEffect, useState } from "react"

import { Activity, BarChart3, PieChart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logger } from "@/lib/logger"

import { InstancePerformance } from "./charts/instance-performance"
import { MessagesTimeline } from "./charts/messages-timeline"
import { StatusDistribution } from "./charts/status-distribution"

/**
 * Stats Dashboard Component
 *
 * Dashboard principal de estatísticas com gráficos e métricas.
 * Atualização automática via polling.
 *
 * @module components/campaign/stats-dashboard
 */

/**
 * Stats Dashboard Component
 *
 * Dashboard principal de estatísticas com gráficos e métricas.
 * Atualização automática via polling.
 *
 * @module components/campaign/stats-dashboard
 */

/**
 * Stats Dashboard Component
 *
 * Dashboard principal de estatísticas com gráficos e métricas.
 * Atualização automática via polling.
 *
 * @module components/campaign/stats-dashboard
 */

// ============================================================================
// TYPES
// ============================================================================

interface CampaignStats {
  overview: {
    totalCampaigns: number
    activeCampaigns: number
    completedCampaigns: number
    failedCampaigns: number
    totalMessagesSent: number
    totalMessagesDelivered: number
    totalMessagesFailed: number
    averageDeliveryRate: number
    averageResponseRate: number
  }
  timeline: Array<{
    date: string
    sent: number
    delivered: number
    failed: number
  }>
  statusDistribution: Array<{
    name: string
    value: number
    fill: string
  }>
  instancePerformance: Array<{
    instance: string
    sent: number
    delivered: number
    rate: number
  }>
}

interface StatsDashboardProps {
  stats: CampaignStats
  pollingInterval?: number
  onRefresh?: () => Promise<CampaignStats>
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function StatsDashboard({
  stats: initialStats,
  pollingInterval = 30000,
  onRefresh,
}: StatsDashboardProps) {
  const [stats, setStats] = useState(initialStats)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Auto-refresh data via polling
  useEffect(() => {
    if (!onRefresh) return

    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true)
        const newStats = await onRefresh()
        setStats(newStats)
        setLastUpdate(new Date())

        logger.debug("Stats: Data refreshed", null, {
          component: "StatsDashboard",
          action: "autoRefresh",
        })
      } catch (error: any) {
        logger.error("Stats: Failed to refresh data", error, {
          component: "StatsDashboard",
          action: "autoRefresh",
        })
      } finally {
        setIsRefreshing(false)
      }
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [onRefresh, pollingInterval])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Status indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${isRefreshing ? "animate-pulse" : ""}`} />
          <span className="text-sm text-muted-foreground">
            Última atualização:{" "}
            {lastUpdate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          {isRefreshing && <Badge variant="secondary">Atualizando...</Badge>}
        </div>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="status">
            <PieChart className="h-4 w-4 mr-2" />
            Status
          </TabsTrigger>
          <TabsTrigger value="instances">
            <Activity className="h-4 w-4 mr-2" />
            Instâncias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <MessagesTimeline data={stats.timeline} />
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <StatusDistribution data={stats.statusDistribution} />
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <InstancePerformance data={stats.instancePerformance} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
