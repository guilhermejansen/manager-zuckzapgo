/**
 * Campaigns List Page
 *
 * Lista e gerencia campanhas WhatsApp com tabela interativa, filtros e ações.
 */

"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  const [typeFilter, setTypeFilter] = useState<CampaignType | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL")
  const [offset, setOffset] = useState(0)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })
  const router = useRouter()
  const limit = 50

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
    setConfirmDialog({
      open: true,
      title: "Deletar Campanha",
      description: `Tem certeza que deseja deletar a campanha "${name}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          await executeDelete(id)
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }))
        }
      },
    })
  }

  async function executeDelete(id: string) {
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
    setConfirmDialog({
      open: true,
      title: "Iniciar Campanha",
      description: `Deseja iniciar a campanha "${name}"?`,
      onConfirm: async () => {
        try {
          await executeStart(id)
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }))
        }
      },
    })
  }

  async function executeStart(id: string) {
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
    setConfirmDialog({
      open: true,
      title: "Pausar Campanha",
      description: `Deseja pausar a campanha "${name}"?`,
      onConfirm: async () => {
        try {
          await executePause(id)
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }))
        }
      },
    })
  }

  async function executePause(id: string) {
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
    setConfirmDialog({
      open: true,
      title: "Cancelar Campanha",
      description: `Tem certeza que deseja cancelar a campanha "${name}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          await executeCancel(id)
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }))
        }
      },
    })
  }

  async function executeCancel(id: string) {
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
    const matchesSearch =
      campaign.name.toLowerCase().includes(term) ||
      (campaign.description && campaign.description.toLowerCase().includes(term))
    const matchesType = typeFilter === "ALL" || campaign.type === typeFilter
    const matchesStatus = statusFilter === "ALL" || campaign.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const paginatedCampaigns = filteredCampaigns.slice(offset, offset + limit)
  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / limit))
  const currentPage = Math.floor(offset / limit) + 1
  const canGoPrevious = offset > 0
  const canGoNext = offset + limit < filteredCampaigns.length

  const handleNextPage = () => {
    if (canGoNext) {
      setOffset(offset + limit)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      setOffset(Math.max(0, offset - limit))
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleFilterChange = () => {
    setOffset(0) // Reset to first page when filters change
  }

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Filter */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-filter"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleFilterChange()
              }}
              className="h-9 w-[200px] pl-9 sm:w-[240px]"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value as CampaignType | "ALL")
              handleFilterChange()
            }}
          >
            <SelectTrigger id="type-filter" className="h-9 w-[140px]">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os tipos</SelectItem>
              <SelectItem value="SINGLE">Imediata</SelectItem>
              <SelectItem value="SCHEDULED">Agendada</SelectItem>
              <SelectItem value="RECURRING">Recorrente</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as CampaignStatus | "ALL")
              handleFilterChange()
            }}
          >
            <SelectTrigger id="status-filter" className="h-9 w-[140px]">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="DRAFT">Rascunho</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="RUNNING">Em execução</SelectItem>
              <SelectItem value="PAUSED">Pausada</SelectItem>
              <SelectItem value="COMPLETED">Concluída</SelectItem>
              <SelectItem value="CANCELLED">Cancelada</SelectItem>
              <SelectItem value="FAILED">Falhou</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || typeFilter !== "ALL" || statusFilter !== "ALL") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("")
              setTypeFilter("ALL")
              setStatusFilter("ALL")
              handleFilterChange()
            }}
            className="h-9"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <Card className="py-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[140px]">Tipo</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="w-[200px]">Agendamento</TableHead>
                  <TableHead className="w-[80px] text-center">Jobs</TableHead>
                  <TableHead className="w-[80px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12 mx-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Nenhuma campanha encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCampaigns.map((campaign) => (
                    <TableRow
                      key={campaign.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium leading-tight">{campaign.name}</span>
                          {campaign.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[400px]">
                              {campaign.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(campaign.type)}</TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        {campaign.type === "SCHEDULED" && campaign.scheduledFor ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">
                              {new Date(campaign.scheduledFor).toLocaleDateString("pt-BR")}
                              {" "}
                              {new Date(campaign.scheduledFor).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ) : campaign.type === "RECURRING" && campaign.cronExpression ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-mono text-xs">{campaign.cronExpression}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {campaign._count?.jobs || 0}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Dashboard
                            </DropdownMenuItem>
                            {campaign.status === "DRAFT" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/admin/campaigns/${campaign.id}/edit`)
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {(campaign.status === "DRAFT" || campaign.status === "PAUSED") && (
                              <DropdownMenuItem
                                onClick={() => handleStart(campaign.id, campaign.name)}
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Iniciar
                              </DropdownMenuItem>
                            )}
                            {campaign.status === "RUNNING" && (
                              <DropdownMenuItem
                                onClick={() => handlePause(campaign.id, campaign.name)}
                              >
                                <Pause className="mr-2 h-4 w-4" />
                                Pausar
                              </DropdownMenuItem>
                            )}
                            {(campaign.status === "RUNNING" ||
                              campaign.status === "PAUSED" ||
                              campaign.status === "PENDING") && (
                              <DropdownMenuItem
                                onClick={() => handleCancel(campaign.id, campaign.name)}
                              >
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4 md:hidden p-4">
            {loading
              ? [1, 2, 3].map((index) => (
                  <div key={`skeleton-${index}`} className="rounded-lg border bg-card p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))
              : paginatedCampaigns.length === 0
                ? null
                : paginatedCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="rounded-lg border bg-card p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium leading-tight">{campaign.name}</span>
                          </div>
                          {campaign.description && (
                            <span className="text-xs text-muted-foreground">
                              {campaign.description}
                            </span>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getTypeBadge(campaign.type)}
                            {getStatusBadge(campaign.status)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {(campaign.type === "SCHEDULED" && campaign.scheduledFor) ||
                        (campaign.type === "RECURRING" && campaign.cronExpression) ? (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Agendamento:</span>
                            {campaign.type === "SCHEDULED" && campaign.scheduledFor ? (
                              <span className="text-xs">
                                {new Date(campaign.scheduledFor).toLocaleString("pt-BR")}
                              </span>
                            ) : (
                              <span className="font-mono text-xs">
                                {campaign.cronExpression}
                              </span>
                            )}
                          </div>
                        ) : null}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Jobs:</span>
                          <span className="font-mono text-sm">
                            {campaign._count?.jobs || 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                        {campaign.status === "DRAFT" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => router.push(`/admin/campaigns/${campaign.id}/edit`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStart(campaign.id, campaign.name)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {campaign.status === "RUNNING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePause(campaign.id, campaign.name)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
          </div>

          {!loading && filteredCampaigns.length > 0 && (
            <div className="flex flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {paginatedCampaigns.length} de {filteredCampaigns.length.toLocaleString()}{" "}
                {filteredCampaigns.length === 1 ? "campanha" : "campanhas"}
                {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={!canGoPrevious || loading}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!canGoNext || loading}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDialog.onConfirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
