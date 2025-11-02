"use client"

import { useCallback, useEffect, useState } from "react"

import {
  Activity,
  Cloud,
  Database,
  Loader2,
  Megaphone,
  Rabbit,
  RefreshCw,
  Server,
  TestTube2,
  Webhook,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { adminApi } from "@/lib/api"
import type { GlobalConfiguration, GlobalStats, GlobalTestResults } from "@/types"

import { BufferTab } from "./_components/buffer-tab"
import { EnvironmentTab } from "./_components/environment-tab"
import { FiltersTab } from "./_components/filters-tab"
import { OverviewTab } from "./_components/overview-tab"
import { RabbitMQTab } from "./_components/rabbitmq-tab"
import { S3Tab } from "./_components/s3-tab"
import { TestSystemsDialog } from "./_components/test-systems-dialog"
import { WebhookTab } from "./_components/webhook-tab"

function getErrorMessage(error: any, fallback: string) {
  return error?.getUserMessage?.() || error?.message || fallback
}

export default function GlobalConfigPage() {
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<GlobalConfiguration | null>(null)
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [testResult, setTestResult] = useState<GlobalTestResults | null>(null)
  const [testing, setTesting] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [configResponse, statsResponse] = await Promise.all([
        adminApi.global.getConfig(),
        adminApi.global.getStats(),
      ])

      setConfig(configResponse.data ?? null)
      setStats(statsResponse.data ?? null)
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível carregar as configurações globais."))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      void loadData()
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [autoRefresh, loadData])

  const handleTestSystems = async () => {
    setTesting(true)
    try {
      const response = await adminApi.global.testSystems()
      setTestResult(response.data ?? null)
      setTestDialogOpen(true)
      toast.success("Teste executado com sucesso")
    } catch (error) {
      toast.error(getErrorMessage(error, "Falha ao testar os sistemas globais."))
    } finally {
      setTesting(false)
    }
  }

  const handleReloadConfig = async () => {
    setReloading(true)
    try {
      await adminApi.global.reloadConfig()
      toast.success("Configurações globais recarregadas")
      await loadData()
    } catch (error) {
      toast.error(getErrorMessage(error, "Falha ao recarregar as configurações."))
    } finally {
      setReloading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!config || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Configurações Globais</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie configurações globais do sistema ZuckZapGo
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
            <Activity className={`mr-2 h-4 w-4 ${autoRefresh ? "animate-pulse" : ""}`} />
            Auto-refresh {autoRefresh ? "ON" : "OFF"}
          </Button>

          <Button variant="outline" onClick={() => void handleReloadConfig()} disabled={reloading}>
            {reloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recarregando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Recarregar Config
              </>
            )}
          </Button>

          <Button onClick={() => void handleTestSystems()} disabled={testing}>
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube2 className="mr-2 h-4 w-4" />
                Testar Sistemas
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex w-auto min-w-full h-auto flex-wrap gap-1 p-1">
            <TabsTrigger
              value="overview"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Visão Geral</span>
              <span className="md:hidden">Geral</span>
            </TabsTrigger>

            <TabsTrigger
              value="webhook"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Webhook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Webhook</span>
            </TabsTrigger>

            <TabsTrigger
              value="rabbitmq"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Rabbit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>RabbitMQ</span>
            </TabsTrigger>

            <TabsTrigger
              value="s3"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Cloud className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>S3</span>
            </TabsTrigger>

            <TabsTrigger
              value="buffer"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Buffer</span>
            </TabsTrigger>

            <TabsTrigger
              value="filters"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Megaphone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Filtros</span>
            </TabsTrigger>

            <TabsTrigger
              value="environment"
              className="flex-shrink-0 gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Server className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Variáveis</span>
              <span className="md:hidden">Vars</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="overview" className="m-0">
            <OverviewTab stats={stats} />
          </TabsContent>

          <TabsContent value="webhook" className="m-0">
            <WebhookTab config={config} stats={stats} />
          </TabsContent>

          <TabsContent value="rabbitmq" className="m-0">
            <RabbitMQTab config={config} stats={stats} />
          </TabsContent>

          <TabsContent value="s3" className="m-0">
            <S3Tab config={config} stats={stats} />
          </TabsContent>

          <TabsContent value="buffer" className="m-0">
            <BufferTab stats={stats} />
          </TabsContent>

          <TabsContent value="filters" className="m-0">
            <FiltersTab config={config} />
          </TabsContent>

          <TabsContent value="environment" className="m-0">
            <EnvironmentTab config={config} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Test Results Dialog */}
      <TestSystemsDialog
        open={testDialogOpen}
        results={testResult}
        onClose={() => setTestDialogOpen(false)}
      />
    </div>
  )
}
