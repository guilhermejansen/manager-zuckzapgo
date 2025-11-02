"use client"

import { useEffect, useState } from "react"

import {
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Crown,
  Eye,
  EyeOff,
  Key,
  Mail,
  RefreshCw,
  Shield,
  Users,
  XCircle,
} from "lucide-react"

import { AnimatedLink } from "@/components/ui/animated-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { adminApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { LicenseInfoResponse } from "@/types"

interface LicenseInfoCardProps {
  autoRefresh?: boolean
  refreshInterval?: number
}

export function LicenseInfoCard({
  autoRefresh = true,
  refreshInterval = 60000,
}: LicenseInfoCardProps) {
  const [license, setLicense] = useState<LicenseInfoResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showLicenseKey, setShowLicenseKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchLicense = async (isManual = false) => {
    try {
      if (isManual) {
        setIsRefreshing(true)
      }
      setError(null)
      const response = await adminApi.license()
      setLicense(response)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar informações da licença")
      setLicense(null)
    } finally {
      setIsLoading(false)
      if (isManual) {
        setIsRefreshing(false)
      }
    }
  }

  useEffect(() => {
    fetchLicense()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchLicense()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const copyLicenseKey = async () => {
    if (!license?.license_key) return

    try {
      await navigator.clipboard.writeText(license.license_key)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const maskLicenseKey = (key: string) => {
    if (key.length <= 8) return "****"
    return key.slice(0, 4) + "****" + key.slice(-4)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "expiring_soon":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "grace_period":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="size-4" />
      case "expired":
        return <XCircle className="size-4" />
      default:
        return <Clock className="size-4" />
    }
  }

  const getPlanIcon = (planType: string) => {
    switch (planType.toUpperCase()) {
      case "ENTERPRISE":
        return <Crown className="size-5 text-yellow-600" />
      case "PRO":
        return <Award className="size-5 text-blue-600" />
      default:
        return <Shield className="size-5 text-gray-600" />
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
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
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
                Informações Indisponíveis
              </CardTitle>
              <CardDescription>Não foi possível carregar os dados da licença</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchLicense(true)}
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
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!license) return null

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={cn("rounded-lg p-2.5", getStatusColor(license.status))}>
                {getStatusIcon(license.status)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Key className="size-5" />
                  Informações da Assinatura
                </CardTitle>
                <CardDescription>Detalhes completos da sua licença ZuckZapGo</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {license.plan_type && (
                <>
                  {getPlanIcon(license.plan_type)}
                  <Badge variant="default" className="text-xs font-mono">
                    {license.plan_type.toLowerCase()}
                  </Badge>
                </>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchLicense(true)}
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
            {/* Informações da Instalação */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Informações da Instalação</h4>
              <div className="grid gap-3 pl-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{license.installation_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID da Instalação:</span>
                  <span className="font-mono text-xs">{license.installation_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID do Cliente:</span>
                  <span className="font-mono text-xs">{license.customer_id}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Chave de Licença:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs">
                      {showLicenseKey ? license.license_key : maskLicenseKey(license.license_key)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={() => setShowLicenseKey(!showLicenseKey)}
                      title={showLicenseKey ? "Ocultar chave" : "Mostrar chave"}
                    >
                      {showLicenseKey ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      onClick={copyLicenseKey}
                      title={copied ? "Copiado!" : "Copiar chave"}
                    >
                      <Copy className={cn("size-3", copied && "text-green-600")} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Limites e Validade */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="size-4 text-muted-foreground" />
                  Limites
                </div>
                <div className="space-y-1 pl-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Máx. Instâncias:</span>
                    <span className="font-medium">{license.max_instances}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="size-4 text-muted-foreground" />
                  Validade
                </div>
                <div className="space-y-1 pl-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expira em:</span>
                    <span className="font-medium">{formatDate(license.expires_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última validação:</span>
                    <span className="font-mono text-xs">{formatDate(license.last_validation)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Features Incluídas */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recursos Incluídos</h4>
              <div className="grid gap-2 pl-4">
                {license.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Links Úteis */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Links Úteis</h4>
              <div className="flex flex-col gap-3 pl-4">
                <AnimatedLink href={license.documentation_url} className="text-sm">
                  📚 Documentação do Projeto
                </AnimatedLink>
                <AnimatedLink href={`mailto:${license.support_email}`} className="text-sm">
                  📧 Suporte Técnico
                </AnimatedLink>
              </div>
            </div>

            {/* Período de Graça (se aplicável) */}
            {license.is_in_grace_period && license.grace_period_end && (
              <>
                <Separator />
                <div className="rounded-lg border border-orange-500/20 bg-orange-50 dark:bg-orange-900/10 p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-400">
                        Período de Graça Ativo
                      </h4>
                      <p className="text-sm text-orange-800 dark:text-orange-500 mt-1">
                        Sua licença está em período de graça até{" "}
                        <strong>{formatDate(license.grace_period_end)}</strong>. Por favor, renove
                        sua licença o quanto antes para evitar interrupções no serviço.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Info Adicional */}
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  <span>Última atualização:</span>
                </div>
                <span className="font-mono">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
