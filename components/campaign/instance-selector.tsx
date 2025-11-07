/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

"use client"

import { useEffect, useState } from "react"

import { GripVertical, Plus, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminApi } from "@/lib/api"
import { logger } from "@/lib/logger"
import type { User } from "@/types"

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

/**
 * Instance Selector Component
 *
 * Multi-select component for selecting WhatsApp instances for campaigns.
 * Features: search, filter, drag & drop reorder, priority management.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SelectedInstance {
  instanceId: string
  token: string
  name: string
  priority: number
  maxRetries: number
  fallbackOrder?: number
}

interface InstanceSelectorProps {
  value: SelectedInstance[]
  onChange: (instances: SelectedInstance[]) => void
  enablePriority?: boolean
  enableFallback?: boolean
  readonly?: boolean
}

interface AvailableInstance extends User {
  id: string
  name: string
  token: string
  connected: boolean
  jid: string
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

export function InstanceSelector({
  value,
  onChange,
  enablePriority = true,
  enableFallback = false,
  readonly = false,
}: InstanceSelectorProps) {
  const [loading, setLoading] = useState(true)
  const [availableInstances, setAvailableInstances] = useState<AvailableInstance[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONNECTED" | "DISCONNECTED">("ALL")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    void loadInstances()
  }, [])

  async function loadInstances() {
    setLoading(true)
    try {
      const response = await adminApi.users.list()
      setAvailableInstances(response.data || [])
    } catch (error) {
      logger.error("Error loading instances", error instanceof Error ? error : undefined, {
        component: "InstanceSelector",
        action: "loadInstances",
      })
      toast.error("Erro ao carregar instâncias")
      setAvailableInstances([])
    } finally {
      setLoading(false)
    }
  }

  const filteredInstances = availableInstances.filter((inst) => {
    // Já selecionadas
    if (value.some((v) => v.instanceId === inst.id)) {
      return false
    }

    // Search
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      const matchesName = inst.name.toLowerCase().includes(search)
      const matchesToken = inst.token.toLowerCase().includes(search)
      const matchesJid = inst.jid?.toLowerCase().includes(search)
      if (!matchesName && !matchesToken && !matchesJid) {
        return false
      }
    }

    // Status filter
    if (statusFilter === "CONNECTED" && !inst.connected) {
      return false
    }
    if (statusFilter === "DISCONNECTED" && inst.connected) {
      return false
    }

    return true
  })

  function handleAddInstance(instance: AvailableInstance) {
    const newInstance: SelectedInstance = {
      instanceId: instance.id,
      token: instance.token,
      name: instance.name,
      priority: value.length, // Auto-incrementa priority
      maxRetries: 3,
      fallbackOrder: enableFallback ? value.length : undefined,
    }

    onChange([...value, newInstance])
    toast.success(`Instância "${instance.name}" adicionada`)
  }

  function handleRemoveInstance(instanceId: string) {
    const updated = value.filter((inst) => inst.instanceId !== instanceId)

    // Reajusta priorities para ficar sequencial
    const reordered = updated.map((inst, index) => ({
      ...inst,
      priority: index,
      fallbackOrder: enableFallback ? index : undefined,
    }))

    onChange(reordered)
    toast.success("Instância removida")
  }

  function handleUpdateInstance(instanceId: string, updates: Partial<SelectedInstance>) {
    const updated = value.map((inst) =>
      inst.instanceId === instanceId ? { ...inst, ...updates } : inst
    )
    onChange(updated)
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const items = [...value]
    const [draggedItem] = items.splice(draggedIndex, 1)
    items.splice(index, 0, draggedItem)

    // Reajusta priorities
    const reordered = items.map((inst, idx) => ({
      ...inst,
      priority: idx,
      fallbackOrder: enableFallback ? idx : undefined,
    }))

    onChange(reordered)
    setDraggedIndex(index)
  }

  function handleDragEnd() {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-4">
      {/* Selected Instances */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Instâncias Selecionadas ({value.length})</CardTitle>
              <CardDescription>
                {value.length === 0
                  ? "Nenhuma instância selecionada"
                  : enablePriority
                    ? "Arraste para reordenar prioridade"
                    : "Clique em Adicionar para selecionar instâncias"}
              </CardDescription>
            </div>
            {!readonly && (
              <Button onClick={() => setAddDialogOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {value.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Clique em "Adicionar" para selecionar instâncias
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {value.map((instance, index) => {
                const matchingInstance = availableInstances.find(
                  (inst) => inst.id === instance.instanceId
                )

                return (
                  <div
                    key={instance.instanceId}
                    draggable={!readonly && enablePriority}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex flex-col gap-3 rounded-lg border p-3 transition-colors ${
                      draggedIndex === index ? "opacity-50" : ""
                    } ${!readonly && enablePriority ? "cursor-move hover:bg-accent" : ""}`}
                  >
                    {/* Linha 1: Avatar + Info */}
                    <div className="flex items-start gap-3 min-w-0">
                      {enablePriority && !readonly && (
                        <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                      )}

                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={matchingInstance?.avatar_url} alt={instance.name} />
                        <AvatarFallback>{getInitials(instance.name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm sm:text-base">{instance.name}</p>
                          {matchingInstance?.connected ? (
                            <Badge variant="default" className="bg-green-600 text-xs flex-shrink-0">
                              Conectado
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              Desconectado
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground break-all">
                          {matchingInstance?.jid || "JID não disponível"}
                        </p>
                      </div>
                    </div>

                    {/* Linha 2: Badges e Ações */}
                    <div className="flex items-center justify-between gap-2 pl-0 sm:pl-[52px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        {enablePriority && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Prioridade</span>
                            <Badge variant="outline" className="text-xs">
                              {instance.priority}
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">Tentativas</span>
                          {readonly ? (
                            <Badge variant="outline" className="text-xs">
                              {instance.maxRetries}
                            </Badge>
                          ) : (
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              value={instance.maxRetries}
                              onChange={(e) =>
                                handleUpdateInstance(instance.instanceId, {
                                  maxRetries: parseInt(e.target.value) || 3,
                                })
                              }
                              className="h-7 w-14 text-xs"
                            />
                          )}
                        </div>

                        {enableFallback && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">Fallback</span>
                            <Badge variant="outline" className="text-xs">
                              {instance.fallbackOrder}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {!readonly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveInstance(instance.instanceId)}
                          className="h-8 w-8 p-0 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Instance Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Instância</DialogTitle>
            <DialogDescription>Selecione uma instância para adicionar à campanha</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, token ou JID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="CONNECTED">Conectadas</SelectItem>
                  <SelectItem value="DISCONNECTED">Desconectadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available Instances */}
            <ScrollArea className="h-96">
              {loading ? (
                <div className="flex h-32 items-center justify-center">
                  <p className="text-sm text-muted-foreground">Carregando instâncias...</p>
                </div>
              ) : filteredInstances.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? "Nenhuma instância encontrada"
                      : "Todas as instâncias já foram selecionadas"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredInstances.map((instance) => (
                    <div
                      key={instance.id}
                      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={instance.avatar_url} alt={instance.name} />
                        <AvatarFallback>{getInitials(instance.name)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{instance.name}</p>
                          {instance.connected ? (
                            <Badge variant="default" className="bg-green-600">
                              Conectado
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Desconectado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {instance.jid || "JID não disponível"}
                        </p>
                      </div>

                      <Button size="sm" onClick={() => handleAddInstance(instance)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
