/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

"use client"

import { useEffect, useState } from "react"

import { MoreHorizontal, Plus, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  addCampaignInstanceAction,
  getCampaignAction,
  removeCampaignInstanceAction,
} from "@/app/actions/campaigns"
import type { SelectedInstance } from "@/components/campaign/instance-selector"
import { InstanceSelector } from "@/components/campaign/instance-selector"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { adminApi } from "@/lib/api"
import { logger } from "@/lib/logger"

/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

/**
 * Instance Manager Component
 *
 * Manages campaign instances with add/remove/reorder functionality.
 * Used in campaign edit page.
 */

// ============================================================================
// TYPES
// ============================================================================

interface CampaignInstance {
  id: string
  campaignId: string
  instanceId: string
  token: string
  name: string | null
  priority: number
  maxRetries: number
  fallbackOrder: number | null
  messagesSent: number
  messagesFailed: number
  lastUsedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

interface InstanceManagerProps {
  campaignId: string
  readonly?: boolean
}

// ============================================================================
// HELPERS
// ============================================================================

function getInitials(name: string) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || "?"
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase() || "?"
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function InstanceManager({ campaignId, readonly = false }: InstanceManagerProps) {
  const [loading, setLoading] = useState(true)
  const [instances, setInstances] = useState<CampaignInstance[]>([])
  const [instancesData, setInstancesData] = useState<Map<string, { avatar_url?: string }>>(
    new Map()
  )
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [selectedInstances, setSelectedInstances] = useState<SelectedInstance[]>([])
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    instanceId: string | null
    instanceName: string | null
  }>({
    open: false,
    instanceId: null,
    instanceName: null,
  })

  useEffect(() => {
    void loadInstances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId])

  async function loadInstances() {
    setLoading(true)
    try {
      const result = await getCampaignAction(campaignId)
      if (result.success && result.data) {
        const campaign = result.data as any
        const campaignInstances = campaign.instances || []
        setInstances(campaignInstances)

        // Buscar dados das instâncias (Users) para obter avatar_url
        if (campaignInstances.length > 0) {
          try {
            const usersResponse = await adminApi.users.list()
            const usersMap = new Map<string, { avatar_url?: string }>()

            usersResponse.data?.forEach((user: any) => {
              usersMap.set(user.id, { avatar_url: user.avatar_url })
            })

            setInstancesData(usersMap)
          } catch (err) {
            logger.error("Error loading users data", err instanceof Error ? err : undefined, {
              component: "InstanceManager",
              action: "loadInstances",
            })
          }
        }
      } else {
        toast.error(result.error || "Erro ao carregar instâncias")
        setInstances([])
      }
    } catch (error) {
      logger.error("Error loading instances", error instanceof Error ? error : undefined, {
        component: "InstanceManager",
        action: "loadInstances",
        metadata: { campaignId },
      })
      toast.error("Erro ao carregar instâncias")
      setInstances([])
    } finally {
      setLoading(false)
    }
  }

  async function handleAddInstances() {
    if (selectedInstances.length === 0) {
      toast.error("Selecione pelo menos uma instância")
      return
    }

    setLoading(true)
    try {
      // Adiciona todas as instâncias selecionadas
      for (const instance of selectedInstances) {
        const result = await addCampaignInstanceAction(campaignId, instance)
        if (!result.success) {
          toast.error(result.error || `Erro ao adicionar ${instance.name}`)
          logger.error("Error adding instance", new Error(result.error), {
            component: "InstanceManager",
            action: "handleAddInstances",
            metadata: { campaignId, instanceId: instance.instanceId },
          })
        }
      }

      toast.success(`${selectedInstances.length} instância(s) adicionada(s) com sucesso`)
      setSelectedInstances([])
      setAddDialogOpen(false)
      await loadInstances()
    } catch (error) {
      logger.error("Error adding instances", error instanceof Error ? error : undefined, {
        component: "InstanceManager",
        action: "handleAddInstances",
        metadata: { campaignId },
      })
      toast.error("Erro ao adicionar instâncias")
    } finally {
      setLoading(false)
    }
  }

  async function handleRemoveInstance(instanceId: string) {
    // Validar: não pode remover última instância
    if (instances.length === 1) {
      toast.error("Campanha precisa ter pelo menos 1 instância")
      setDeleteDialog({ open: false, instanceId: null, instanceName: null })
      return
    }

    setLoading(true)
    try {
      const result = await removeCampaignInstanceAction(campaignId, instanceId)
      if (result.success) {
        toast.success("Instância removida com sucesso")
        await loadInstances()
      } else {
        toast.error(result.error || "Erro ao remover instância")
      }
    } catch (error) {
      logger.error("Error removing instance", error instanceof Error ? error : undefined, {
        component: "InstanceManager",
        action: "handleRemoveInstance",
        metadata: { campaignId, instanceId },
      })
      toast.error("Erro ao remover instância")
    } finally {
      setLoading(false)
      setDeleteDialog({ open: false, instanceId: null, instanceName: null })
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Instâncias Associadas ({instances.length})</h3>
          <p className="text-sm text-muted-foreground">
            {readonly
              ? "Gerenciar instâncias está disponível apenas para campanhas em rascunho"
              : "Gerencie as instâncias que vão executar esta campanha"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadInstances} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          {!readonly && (
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Instância
            </Button>
          )}
        </div>
      </div>

      {/* Instances Table */}
      <Card>
        <CardContent className="p-0">
          {loading && instances.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-muted-foreground">Carregando instâncias...</p>
            </div>
          ) : instances.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Nenhuma instância associada</p>
                {!readonly && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setAddDialogOpen(true)}
                    className="mt-2"
                  >
                    Adicionar primeira instância
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Max Tentativas</TableHead>
                  <TableHead>Fallback Order</TableHead>
                  <TableHead>Mensagens Enviadas</TableHead>
                  <TableHead>Mensagens Falhas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instances.map((instance, index) => (
                  <TableRow key={instance.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={instancesData.get(instance.instanceId)?.avatar_url}
                            alt={instance.name || "Instance"}
                          />
                          <AvatarFallback>
                            {getInitials(instance.name || "Instance")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{instance.name || "Sem nome"}</p>
                          <p className="text-xs text-muted-foreground">{instance.instanceId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{instance.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{instance.maxRetries}</Badge>
                    </TableCell>
                    <TableCell>
                      {instance.fallbackOrder !== null ? (
                        <Badge variant="outline">{instance.fallbackOrder}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">
                        {instance.messagesSent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {instance.messagesFailed > 0 ? (
                        <Badge variant="destructive">{instance.messagesFailed}</Badge>
                      ) : (
                        <Badge variant="secondary">0</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!readonly && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  instanceId: instance.id,
                                  instanceName: instance.name || "Instância",
                                })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Instance Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Adicionar Instâncias à Campanha</DialogTitle>
            <DialogDescription>
              Selecione as instâncias que vão executar esta campanha. Você pode configurar a
              prioridade e ordem de fallback.
            </DialogDescription>
          </DialogHeader>

          <InstanceSelector
            value={selectedInstances}
            onChange={setSelectedInstances}
            enablePriority
            enableFallback
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddInstances} disabled={selectedInstances.length === 0}>
              Adicionar {selectedInstances.length > 0 ? `(${selectedInstances.length})` : ""}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, instanceId: null, instanceName: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Instância</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a instância &quot;{deleteDialog.instanceName}&quot;
              desta campanha?
              {instances.length === 1 && (
                <span className="mt-2 block font-semibold text-destructive">
                  Atenção: Esta é a última instância. A campanha precisa ter pelo menos uma
                  instância.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.instanceId && handleRemoveInstance(deleteDialog.instanceId)
              }
              disabled={instances.length === 1}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
