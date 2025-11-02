"use client"

import { useEffect, useState } from "react"

import {
  Activity,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  Database,
  Globe,
  RefreshCw,
  Server,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { adminApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { ApiHealthResponse } from "@/types"

interface ApiHealthCardProps {
  autoRefresh?: boolean
  refreshInterval?: number
}

export function ApiHealthCard({ autoRefresh = true, refreshInterval = 30000 }: ApiHealthCardProps) {
  const [health, setHealth] = useState<ApiHealthResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchHealth = async (isManual = false) => {
    try {
      if (isManual) {
        setIsRefreshing(true)
      }
      setError(null)
      const response = await adminApi.health()
      setHealth(response)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao conectar com a API")
      setHealth(null)
    } finally {
      setIsLoading(false)
      if (isManual) {
        setIsRefreshing(false)
      }
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchHealth()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100 dark:bg-green-900/30"
      case "degraded":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
      case "unhealthy":
        return "text-red-600 bg-red-100 dark:bg-red-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="size-4" />
      case "unhealthy":
        return <XCircle className="size-4" />
      default:
        return <Activity className="size-4" />
    }
  }

  if (isLoading) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
            <Skeleton className="size-10 rounded-lg" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="card-elevated border-destructive/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="size-5" />
                API Desconectada
              </CardTitle>
              <CardDescription>Não foi possível conectar com o backend</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchHealth(true)}
              disabled={isRefreshing}
              className="size-10"
            >
              <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              API URL:{" "}
              <code className="rounded bg-muted px-1 py-0.5">
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!health) return null

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={cn("rounded-lg p-2.5", getStatusColor(health.status))}>
                {getStatusIcon(health.status)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Server className="size-5" />
                  API Conectada
                </CardTitle>
                <CardDescription>Monitoramento em tempo real do backend ZuckZapGo</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant={health.status === "healthy" ? "default" : "destructive"}
                className="text-xs font-mono"
              >
                {health.version}
              </Badge>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchHealth(true)}
                disabled={isRefreshing}
                className="size-9"
              >
                <RefreshCw className={cn("size-3.5", isRefreshing && "animate-spin")} />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Informações do Sistema */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Ambiente */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="size-4 text-muted-foreground" />
                  Ambiente
                </div>
                <div className="space-y-1 pl-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Região:</span>
                    <span className="font-mono text-xs">{health.environment.app_region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modo:</span>
                    <span className="font-mono text-xs">{health.environment.app_env}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Container:</span>
                    <span className="font-mono text-xs">
                      {health.environment.containerized ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Métricas */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Cpu className="size-4 text-muted-foreground" />
                  Recursos
                </div>
                <div className="space-y-1 pl-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPUs:</span>
                    <span className="font-mono text-xs">
                      {health.metrics.cpu_count} cores ({health.metrics.go_max_procs} GOMAXPROCS)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Goroutines:</span>
                    <span className="font-mono text-xs">{health.metrics.goroutines}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Go Version:</span>
                    <span className="font-mono text-xs">{health.metrics.go_version}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Banco de Dados */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className="size-4 text-muted-foreground" />
                Banco de Dados
              </div>
              <div className="grid gap-4 pl-6 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Driver:</span>
                    <span className="font-mono text-xs">{health.services.database.driver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={health.services.database.status === "up" ? "default" : "destructive"}
                      className="h-5 text-xs"
                    >
                      {health.services.database.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latência:</span>
                    <span
                      className={cn(
                        "font-mono text-xs",
                        health.services.database.latency_ms < 10
                          ? "text-green-600"
                          : health.services.database.latency_ms < 50
                            ? "text-yellow-600"
                            : "text-red-600"
                      )}
                    >
                      {health.services.database.latency_ms.toFixed(1)}ms
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conexões:</span>
                    <span className="font-mono text-xs">
                      {health.services.database.open_connections}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Em uso:</span>
                    <span className="font-mono text-xs">{health.services.database.in_use}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idle:</span>
                    <span className="font-mono text-xs">{health.services.database.idle}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Informações Adicionais */}
            <div className="grid gap-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>Uptime:</span>
                </div>
                <span className="font-mono">{formatUptime(health.uptime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="size-3" />
                  <span>Última atualização:</span>
                </div>
                <span className="font-mono">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="size-3" />
                  <span>Hostname:</span>
                </div>
                <span className="truncate font-mono">{health.environment.hostname}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="size-3" />
                  <span>API URL:</span>
                </div>
                <span className="truncate font-mono text-xs">
                  {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}
                </span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
