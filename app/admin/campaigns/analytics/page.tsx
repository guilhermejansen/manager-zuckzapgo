/**
 * Campaign Analytics Page
 *
 * Página de análise e estatísticas de campanhas.
 * Dashboard com métricas, gráficos e filtros avançados.
 *
 * @module app/admin/campaigns/analytics/page
 */
import { BarChart3, Download, Filter, RefreshCw, TrendingUp } from "lucide-react"

import { ExportData } from "@/components/campaign/export-data"
import { AdvancedFilters } from "@/components/campaign/filters/advanced-filters"
import { StatsDashboard } from "@/components/campaign/stats-dashboard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// ============================================================================
// METADATA
// ============================================================================

export const metadata = {
  title: "Analytics - Campanhas",
  description: "Análise e estatísticas detalhadas das campanhas",
}

// ============================================================================
// MOCK DATA (Replace with real API calls)
// ============================================================================

const mockStats = {
  overview: {
    totalCampaigns: 45,
    activeCampaigns: 12,
    completedCampaigns: 28,
    failedCampaigns: 5,
    totalMessagesSent: 125000,
    totalMessagesDelivered: 118500,
    totalMessagesFailed: 6500,
    averageDeliveryRate: 94.8,
    averageResponseRate: 12.3,
  },
  timeline: [
    { date: "2025-10-01", sent: 4200, delivered: 3950, failed: 250 },
    { date: "2025-10-02", sent: 5100, delivered: 4850, failed: 250 },
    { date: "2025-10-03", sent: 3800, delivered: 3600, failed: 200 },
    { date: "2025-10-04", sent: 4500, delivered: 4300, failed: 200 },
    { date: "2025-10-05", sent: 3200, delivered: 3050, failed: 150 },
    { date: "2025-10-06", sent: 2800, delivered: 2700, failed: 100 },
    { date: "2025-10-07", sent: 3600, delivered: 3450, failed: 150 },
  ],
  statusDistribution: [
    { name: "Entregue", value: 118500, fill: "#22c55e" },
    { name: "Falhou", value: 6500, fill: "#ef4444" },
  ],
  instancePerformance: [
    { instance: "Instance 1", sent: 45000, delivered: 42500, rate: 94.4 },
    { instance: "Instance 2", sent: 38000, delivered: 36100, rate: 95.0 },
    { instance: "Instance 3", sent: 42000, delivered: 39900, rate: 95.0 },
  ],
  topCampaigns: [
    {
      id: "1",
      name: "Black Friday 2025",
      sent: 15000,
      delivered: 14250,
      rate: 95.0,
      status: "completed",
    },
    {
      id: "2",
      name: "Newsletter Semanal",
      sent: 8500,
      delivered: 8075,
      rate: 95.0,
      status: "active",
    },
    {
      id: "3",
      name: "Promoção Verão",
      sent: 12000,
      delivered: 11400,
      rate: 95.0,
      status: "completed",
    },
  ],
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function CampaignAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Análise detalhada e estatísticas das suas campanhas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <ExportData
            data={mockStats}
            filename="campaign-analytics"
            formats={["csv", "excel", "json"]}
          />
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.overview.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{mockStats.overview.activeCampaigns} ativas</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.overview.totalMessagesSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                {mockStats.overview.totalMessagesDelivered.toLocaleString()} entregues
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Entrega</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.overview.averageDeliveryRate}%</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.overview.totalMessagesFailed.toLocaleString()} falhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.overview.averageResponseRate}%</div>
            <p className="text-xs text-muted-foreground">Média geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        onFilterChange={(filters) => {
          console.log("Filters changed:", filters)
        }}
      />

      {/* Main Dashboard */}
      <StatsDashboard stats={mockStats} />

      {/* Top Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Campanhas</CardTitle>
          <CardDescription>Campanhas com melhor desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.topCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {campaign.sent.toLocaleString()} enviadas •{" "}
                    {campaign.delivered.toLocaleString()} entregues
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                    {campaign.status === "active" ? "Ativa" : "Concluída"}
                  </Badge>
                  <div className="text-right">
                    <div className="font-medium">{campaign.rate}%</div>
                    <div className="text-xs text-muted-foreground">Taxa de entrega</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-2">Sobre as métricas</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • <strong>Taxa de Entrega:</strong> Percentual de mensagens entregues com sucesso
          </li>
          <li>
            • <strong>Taxa de Resposta:</strong> Percentual de contatos que responderam
          </li>
          <li>
            • <strong>Dados em tempo real:</strong> Atualização automática a cada 30 segundos
          </li>
          <li>
            • <strong>Exportação:</strong> Disponível em CSV, Excel e JSON
          </li>
          <li>
            • <strong>Filtros avançados:</strong> Por data, status, instância e campanha
          </li>
        </ul>
      </div>
    </div>
  )
}
