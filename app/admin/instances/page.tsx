/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { DataTable } from "@/components/custom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { adminApi } from "@/lib/api"
import { logger } from "@/lib/logger"
import type { User } from "@/types"

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

/**
 * Instances List Page
 *
 * Lista e gerencia instâncias WhatsApp com tabela interativa, filtros e ações.
 */

function getInitials(name: string) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() || "?"
  }
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase() || "?"
}

export default function InstancesPage() {
  const [instances, setInstances] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  async function loadInstances() {
    setLoading(true)
    try {
      const response = await adminApi.users.list()
      setInstances(response.data || [])
      toast.success("Instâncias carregadas com sucesso")
    } catch (error) {
      logger.error("Erro ao carregar instâncias", error instanceof Error ? error : undefined, {
        component: "InstancesPage",
        action: "loadInstances",
      })
      toast.error("Erro ao carregar instâncias")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja deletar a instância "${name}"?`)) {
      return
    }

    try {
      await adminApi.users.delete(id)
      toast.success("Instância deletada com sucesso")
      loadInstances()
    } catch (error) {
      logger.error("Erro ao deletar instância", error instanceof Error ? error : undefined, {
        component: "InstancesPage",
        action: "deleteInstance",
        metadata: { id },
      })
      toast.error("Erro ao deletar instância")
    }
  }

  useEffect(() => {
    loadInstances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredInstances = instances.filter((instance) => {
    const term = searchTerm.toLowerCase()
    return (
      instance.name.toLowerCase().includes(term) ||
      (instance.jid && instance.jid.toLowerCase().includes(term)) ||
      instance.token.toLowerCase().includes(term)
    )
  })

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => {
        const instance = row.original
        const initials = getInitials(instance.name)

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={instance.avatar_url} alt={instance.name} />
              <AvatarFallback className="text-xs font-semibold uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium leading-tight">{instance.name}</span>
              <span className="text-xs text-muted-foreground">{instance.id}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "jid",
      header: "JID",
      cell: ({ row }) => (
        <div className="font-mono text-xs text-muted-foreground">
          {row.original.jid || "Não conectado"}
        </div>
      ),
    },
    {
      accessorKey: "connected",
      header: "Status",
      cell: ({ row }) => {
        const connected = row.original.connected
        return (
          <Badge
            className={connected ? "bg-green-600 text-white" : ""}
            variant={connected ? "default" : "destructive"}
          >
            {connected ? "Conectado" : "Desconectado"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const instance = row.original

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
              <DropdownMenuItem onClick={() => router.push(`/admin/instances/${instance.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/instances/${instance.id}`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(instance.id, instance.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const noInstances = !loading && instances.length === 0
  const noFilteredResults = !loading && instances.length > 0 && filteredInstances.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Instâncias</h1>
          <p className="text-muted-foreground">Gerencie todas as instâncias WhatsApp do sistema</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            onClick={loadInstances}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button
            onClick={() => router.push("/admin/instances/create")}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Instância
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, JID ou token..."
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
          data={filteredInstances}
          columns={columns}
          loading={loading}
          onRowClick={(row) => router.push(`/admin/instances/${row.id}`)}
        />
      </div>

      <div className="space-y-4 md:hidden">
        {loading
          ? [1, 2, 3].map((index) => (
              <Card key={`instance-skeleton-${index}`}>
                <CardContent className="space-y-4 py-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          : filteredInstances.length > 0
            ? filteredInstances.map((instance) => {
                const isConnected = instance.connected
                const hasWebhook = !!instance.webhook
                const initials = getInitials(instance.name)

                return (
                  <Card key={instance.id}>
                    <CardHeader className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-12">
                          <AvatarImage src={instance.avatar_url} alt={instance.name} />
                          <AvatarFallback className="text-sm font-semibold uppercase">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg font-semibold leading-tight">
                            {instance.name}
                          </CardTitle>
                          <CardDescription className="font-mono text-xs text-muted-foreground break-all">
                            {instance.id || "Não conectado"}
                          </CardDescription>
                          <CardDescription className="font-mono text-xs text-muted-foreground break-all">
                            {instance.jid || "Não conectado"}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={isConnected ? "bg-green-600 text-white" : undefined}
                          variant={isConnected ? "default" : "destructive"}
                        >
                          {isConnected ? "Conectado" : "Desconectado"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/admin/instances/${instance.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/admin/instances/${instance.id}`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar instância
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(instance.id, instance.name)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar instância
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            : null}
      </div>

      {noInstances && (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">Nenhuma instância cadastrada</h3>
          <p className="mb-4 text-muted-foreground">
            Comece criando sua primeira instância WhatsApp
          </p>
          <Button
            onClick={() => router.push("/admin/instances/create")}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Instância
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
