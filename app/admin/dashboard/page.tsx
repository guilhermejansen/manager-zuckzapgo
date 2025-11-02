/**
 * Admin Dashboard Page
 *
 * Página inicial do painel administrativo com:
 * - Estatísticas gerais do sistema
 * - Ações rápidas
 * - Atividade recente
 */
import { Suspense } from "react"

import Link from "next/link"

import { Activity, Database, Plus, Settings, Users, Wifi, WifiOff, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { adminApi } from "@/lib/api"

import { ApiHealthCard } from "./_components/api-health-card"
import { LicenseInfoCard } from "./_components/license-info-card"

// Componente de estatísticas
async function StatsCards() {
  const response = await adminApi.users.list().catch(() => null)

  if (!response) {
    return <StatsError />
  }

  const users = response.data || []
  const totalCount = users.length
  const connectedCount = users.filter((u) => u.connected).length
  const disconnectedCount = totalCount - connectedCount
  const connectionRate = totalCount > 0 ? Math.round((connectedCount / totalCount) * 100) : 0

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total de Instâncias */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Instâncias</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-muted-foreground">Instâncias cadastradas</p>
        </CardContent>
      </Card>

      {/* Instâncias Conectadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conectadas</CardTitle>
          <Wifi className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
          <p className="text-xs text-muted-foreground">Instâncias online</p>
        </CardContent>
      </Card>

      {/* Instâncias Desconectadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Desconectadas</CardTitle>
          <WifiOff className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{disconnectedCount}</div>
          <p className="text-xs text-muted-foreground">Instâncias offline</p>
        </CardContent>
      </Card>

      {/* Taxa de Conexão */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conexão</CardTitle>
          <Activity className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{connectionRate}%</div>
          <p className="text-xs text-muted-foreground">Disponibilidade geral</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de erro
function StatsError() {
  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
      <div className="flex items-start gap-3">
        <Activity className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive">Erro ao carregar estatísticas</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Não foi possível conectar ao backend ou você não está autenticado. Verifique suas
            credenciais e tente novamente.
          </p>
          <form action="/admin/dashboard" className="mt-3">
            <Button variant="outline" size="sm" type="submit">
              Tentar Novamente
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Skeleton de loading para stats
function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema ZuckZapGo</p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Quick Actions */}
      <Card className="card-elevated border-muted/40">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="size-4" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
            <Link href="/admin/instances/create" className="group">
              <Button className="w-full h-auto py-3 flex-col gap-2 shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-[1.02]">
                <Plus className="size-5" />
                <span className="text-xs font-medium">Nova Instância</span>
              </Button>
            </Link>

            <Link href="/admin/instances" className="group">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex-col gap-2 hover:bg-accent hover:border-primary/50 hover:shadow-sm transition-all duration-200 group-hover:scale-[1.02]"
              >
                <Users className="size-5" />
                <span className="text-xs font-medium">Ver Instâncias</span>
              </Button>
            </Link>

            <Link href="/admin/monitoring" className="group">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex-col gap-2 hover:bg-accent hover:border-primary/50 hover:shadow-sm transition-all duration-200 group-hover:scale-[1.02]"
              >
                <Settings className="size-5" />
                <span className="text-xs font-medium">Monitorar Eventos</span>
              </Button>
            </Link>

            <Link href="/admin/dlq" className="group">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex-col gap-2 hover:bg-accent hover:border-primary/50 hover:shadow-sm transition-all duration-200 group-hover:scale-[1.02]"
              >
                <Database className="size-5" />
                <span className="text-xs font-medium">Monitorar DLQ</span>
              </Button>
            </Link>

            <Link href="/admin/archive" className="group">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex-col gap-2 hover:bg-accent hover:border-primary/50 hover:shadow-sm transition-all duration-200 group-hover:scale-[1.02]"
              >
                <Activity className="size-5" />
                <span className="text-xs font-medium">Eventos Arquivados</span>
              </Button>
            </Link>

            <Link href="/admin/global" className="group">
              <Button
                variant="outline"
                className="w-full h-auto py-3 flex-col gap-2 hover:bg-accent hover:border-primary/50 hover:shadow-sm transition-all duration-200 group-hover:scale-[1.02]"
              >
                <Settings className="size-5" />
                <span className="text-xs font-medium">Configurações Globais</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* API Health Card - Client Component */}
        <ApiHealthCard autoRefresh refreshInterval={30000} />

        {/* License Info Card - Client Component */}
        <LicenseInfoCard autoRefresh refreshInterval={60000} />
      </div>
    </div>
  )
}
