/**
 * Campaigns List Page
 *
 * Lista e gerencia campanhas WhatsApp com tabela interativa, filtros e ações.
 */

"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import type { ColumnDef } from "@tanstack/react-table"
import {
  Calendar,
  Eye,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  cancelCampaignAction,
  deleteCampaignAction,
  listCampaignsAction,
  pauseCampaignAction,
  startCampaignAction,
} from "@/app/actions/campaigns"
import { DataTable } from "@/components/custom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { logger } from "@/lib/logger"

/**
 * Campaigns List Page
 *
 * Lista e gerencia campanhas WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Campaigns List Page
 *
 * Lista e gerencia campanhas WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Campaigns List Page
 *
 * Lista e gerencia campanhas WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Campaigns List Page
 *
 * Lista e gerencia campanhas WhatsApp com tabela interativa, filtros e ações.
 */

// ============================================================================
// TYPES
// ============================================================================

type CampaignStatus =
  | "DRAFT"
  | "PENDING"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"

type CampaignType = "SINGLE" | "SCHEDULED" | "RECURRING"

interface Campaign {
  id: string
  name: string
  description: string | null
  type: CampaignType
  status: CampaignStatus
  userId: string
  contactListId: string | null
  workflow: any
  scheduledFor: Date | null
  cronExpression: string | null
  createdAt: Date
  updatedAt: Date
  _count?: {
    instances: number
    messages: number
    jobs: number
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getStatusBadge(status: CampaignStatus) {
  const variants: Record<
    CampaignStatus,
    { variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
  > = {
    DRAFT: { variant: "outline" },
    PENDING: { variant: "secondary", className: "bg-yellow-600 text-white" },
    RUNNING: { variant: "default", className: "bg-green-600 text-white" },
    PAUSED: { variant: "secondary", className: "bg-blue-600 text-white" },
    COMPLETED: { variant: "secondary", className: "bg-gray-600 text-white" },
    CANCELLED: { variant: "outline" },
    FAILED: { variant: "destructive" },
  }

  const labels: Record<CampaignStatus, string> = {
    DRAFT: "Rascunho",
    PENDING: "Pendente",
    RUNNING: "Em execução",
    PAUSED: "Pausada",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
    FAILED: "Falhou",
  }

  const config = variants[status]
  return (
    <Badge variant={config.variant} className={config.className}>
      {labels[status]}
    </Badge>
  )
}

function getTypeBadge(type: CampaignType) {
  const labels: Record<CampaignType, string> = {
    SINGLE: "Imediata",
    SCHEDULED: "Agendada",
    RECURRING: "Recorrente",
  }

  const colors: Record<CampaignType, string> = {
    SINGLE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    SCHEDULED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    RECURRING: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  }

  return (
    <Badge variant="outline" className={colors[type]}>
      {labels[type]}
    </Badge>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  async function loadCampaigns() {
    setLoading(true)
    try {
      const result = await listCampaignsAction()
      if (result.success && result.data) {
        setCampaigns(result.data)
        toast.success("Campanhas carregadas com sucesso")
      } else {
        toast.error(result.error || "Erro ao carregar campanhas")
      }
    } catch (error) {
      logger.error("Erro ao carregar campanhas", error instanceof Error ? error : undefined, {
        component: "CampaignsPage",
        action: "loadCampaigns",
      })
      toast.error("Erro ao carregar campanhas")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja deletar a campanha "${name}"?`)) {
      return
    }

    try {
      const result = await deleteCampaignAction(id)
      if (result.success) {
        toast.success("Campanha deletada com sucesso")
        loadCampaigns()
      } else {
        toast.error(result.error || "Erro ao deletar campanha")
      }
    } catch (error) {
      logger.error("Erro ao deletar campanha", error instanceof Error ? error : undefined, {
        component: "CampaignsPage",
        action: "deleteCampaign",
        metadata: { id },
      })
      toast.error("Erro ao deletar campanha")
    }
  }

  async function handleStart(id: string, name: string) {
    if (!confirm(`Iniciar a campanha "${name}"?`)) {
      return
    }

    try {
      const result = await startCampaignAction(id)
      if (result.success) {
        toast.success("Campanha iniciada com sucesso")
        loadCampaigns()
      } else {
        toast.error(result.error || "Erro ao iniciar campanha")
      }
    } catch (error) {
      logger.error("Erro ao iniciar campanha", error instanceof Error ? error : undefined, {
        component: "CampaignsPage",
        action: "startCampaign",
        metadata: { id },
      })
      toast.error("Erro ao iniciar campanha")
    }
  }

  async function handlePause(id: string, name: string) {
    if (!confirm(`Pausar a campanha "${name}"?`)) {
      return
    }

    try {
      const result = await pauseCampaignAction(id)
      if (result.success) {
        toast.success("Campanha pausada com sucesso")
        loadCampaigns()
      } else {
        toast.error(result.error || "Erro ao pausar campanha")
      }
    } catch (error) {
      logger.error("Erro ao pausar campanha", error instanceof Error ? error : undefined, {
        component: "CampaignsPage",
        action: "pauseCampaign",
        metadata: { id },
      })
      toast.error("Erro ao pausar campanha")
    }
  }

  async function handleCancel(id: string, name: string) {
    if (!confirm(`Cancelar a campanha "${name}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const result = await cancelCampaignAction(id)
      if (result.success) {
        toast.success("Campanha cancelada com sucesso")
        loadCampaigns()
      } else {
        toast.error(result.error || "Erro ao cancelar campanha")
      }
    } catch (error) {
      logger.error("Erro ao cancelar campanha", error instanceof Error ? error : undefined, {
        component: "CampaignsPage",
        action: "cancelCampaign",
        metadata: { id },
      })
      toast.error("Erro ao cancelar campanha")
    }
  }

  useEffect(() => {
    loadCampaigns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredCampaigns = campaigns.filter((campaign) => {
    const term = searchTerm.toLowerCase()
    return (
      campaign.name.toLowerCase().includes(term) ||
      (campaign.description && campaign.description.toLowerCase().includes(term)) ||
      campaign.status.toLowerCase().includes(term) ||
      campaign.type.toLowerCase().includes(term)
    )
  })

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => {
        const campaign = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium leading-tight">{campaign.name}</span>
            {campaign.description && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {campaign.description}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => getTypeBadge(row.original.type),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "scheduledFor",
      header: "Agendamento",
      cell: ({ row }) => {
        const campaign = row.original
        if (campaign.type === "SCHEDULED" && campaign.scheduledFor) {
          return (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(campaign.scheduledFor).toLocaleString("pt-BR")}</span>
            </div>
          )
        }
        if (campaign.type === "RECURRING" && campaign.cronExpression) {
          return (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-xs">{campaign.cronExpression}</span>
            </div>
          )
        }
        return <span className="text-xs text-muted-foreground">-</span>
      },
    },
    {
      id: "stats",
      header: "Progresso",
      cell: ({ row }) => {
        const campaign = row.original
        const total = campaign._count?.jobs || 0
        return (
          <div className="text-sm">
            <span className="font-mono">{total} jobs</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const campaign = row.original
        const canStart = campaign.status === "DRAFT" || campaign.status === "PAUSED"
        const canPause = campaign.status === "RUNNING"
        const canCancel =
          campaign.status === "RUNNING" ||
          campaign.status === "PAUSED" ||
          campaign.status === "PENDING"

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Dashboard
              </DropdownMenuItem>
              {campaign.status === "DRAFT" && (
                <DropdownMenuItem
                  onClick={() => router.push(`/admin/campaigns/${campaign.id}/edit`)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {canStart && (
                <DropdownMenuItem onClick={() => handleStart(campaign.id, campaign.name)}>
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </DropdownMenuItem>
              )}
              {canPause && (
                <DropdownMenuItem onClick={() => handlePause(campaign.id, campaign.name)}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pausar
                </DropdownMenuItem>
              )}
              {canCancel && (
                <DropdownMenuItem onClick={() => handleCancel(campaign.id, campaign.name)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {campaign.status === "DRAFT" && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => handleDelete(campaign.id, campaign.name)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const noCampaigns = !loading && campaigns.length === 0
  const noFilteredResults = !loading && campaigns.length > 0 && filteredCampaigns.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie campanhas de envio WhatsApp em massa</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            onClick={loadCampaigns}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={() => router.push("/admin/campaigns/new")} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, descrição, status ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        {searchTerm && (
          <Button variant="ghost" onClick={() => setSearchTerm("")} className="w-full sm:w-auto">
            Limpar
          </Button>
        )}
      </div>

      <div className="hidden md:block">
        <DataTable
          data={filteredCampaigns}
          columns={columns}
          loading={loading}
          onRowClick={(row) => router.push(`/admin/campaigns/${row.id}`)}
        />
      </div>

      <div className="space-y-4 md:hidden">
        {loading
          ? [1, 2, 3].map((index) => (
              <Card key={`campaign-skeleton-${index}`}>
                <CardContent className="space-y-4 py-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          : filteredCampaigns.length > 0
            ? filteredCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader className="space-y-3">
                    <div>
                      <CardTitle className="text-lg font-semibold leading-tight">
                        {campaign.name}
                      </CardTitle>
                      {campaign.description && (
                        <CardDescription className="text-sm text-muted-foreground">
                          {campaign.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(campaign.type)}
                      {getStatusBadge(campaign.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver dashboard
                      </Button>
                      {campaign.status === "DRAFT" && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/admin/campaigns/${campaign.id}/edit`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar campanha
                          </Button>
                          <Button
                            variant="default"
                            onClick={() => handleStart(campaign.id, campaign.name)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Iniciar campanha
                          </Button>
                        </>
                      )}
                      {campaign.status === "RUNNING" && (
                        <Button
                          variant="outline"
                          onClick={() => handlePause(campaign.id, campaign.name)}
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pausar campanha
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            : null}
      </div>

      {noCampaigns && (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">Nenhuma campanha cadastrada</h3>
          <p className="mb-4 text-muted-foreground">
            Comece criando sua primeira campanha de envio em massa
          </p>
          <Button onClick={() => router.push("/admin/campaigns/new")} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Campanha
          </Button>
        </div>
      )}

      {noFilteredResults && (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">Nenhum resultado encontrado</h3>
          <p className="mb-4 text-muted-foreground">Tente ajustar sua busca ou limpe os filtros</p>
          <Button variant="outline" onClick={() => setSearchTerm("")} className="w-full sm:w-auto">
            Limpar Busca
          </Button>
        </div>
      )}
    </div>
  )
}
