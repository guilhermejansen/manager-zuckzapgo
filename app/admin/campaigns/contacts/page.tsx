/**
 * Contact Lists Page
 *
 * Página de listagem de listas de contatos com ações de importação e gerenciamento.
 */

"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import { Calendar, Eye, Hash, Plus, Trash2, Upload, Users } from "lucide-react"
import { toast } from "sonner"

import { deleteContactListAction, getContactListsAction } from "@/app/actions/contacts"
import { ImportApiDialog } from "@/components/campaign/import-api-dialog"
import { ImportCsvDialog } from "@/components/campaign/import-csv-dialog"
import { ImportExcelDialog } from "@/components/campaign/import-excel-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { logger } from "@/lib/logger"

/**
 * Contact Lists Page
 *
 * Página de listagem de listas de contatos com ações de importação e gerenciamento.
 */

/**
 * Contact Lists Page
 *
 * Página de listagem de listas de contatos com ações de importação e gerenciamento.
 */

/**
 * Contact Lists Page
 *
 * Página de listagem de listas de contatos com ações de importação e gerenciamento.
 */

// ============================================================================
// TYPES
// ============================================================================

interface ContactList {
  id: string
  name: string
  description: string | null
  totalContacts: number
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContactListsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [lists, setLists] = useState<ContactList[]>([])
  const [importDialogOpen, setImportDialogOpen] = useState<"csv" | "excel" | "api" | null>(null)

  useEffect(() => {
    loadLists()
  }, [])

  async function loadLists() {
    setLoading(true)
    try {
      const result = await getContactListsAction()
      if (result.success && result.data) {
        setLists(result.data as ContactList[])
        logger.debug("Contact lists loaded", null, {
          component: "ContactListsPage",
          action: "loadLists",
          metadata: { count: result.data.length },
        })
      } else {
        toast.error(result.error || "Erro ao carregar listas de contatos")
      }
    } catch (error) {
      logger.error("Error loading lists", error instanceof Error ? error : undefined, {
        component: "ContactListsPage",
        action: "loadLists",
      })
      toast.error("Erro ao carregar listas de contatos")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(listId: string, listName: string) {
    if (
      !confirm(
        `Tem certeza que deseja deletar a lista "${listName}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return
    }

    try {
      const result = await deleteContactListAction(listId)
      if (result.success) {
        toast.success("Lista deletada com sucesso")
        loadLists()
      } else {
        toast.error(result.error || "Erro ao deletar lista")
      }
    } catch (error) {
      logger.error("Error deleting list", error instanceof Error ? error : undefined, {
        component: "ContactListsPage",
        action: "handleDelete",
        metadata: { listId },
      })
      toast.error("Erro ao deletar lista")
    }
  }

  function handleImportSuccess() {
    toast.success("Importação concluída com sucesso!")
    setImportDialogOpen(null)
    loadLists()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listas de Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie suas listas de contatos para campanhas de WhatsApp
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportDialogOpen("csv")}>
            <Upload className="mr-2 h-4 w-4" />
            Importar CSV
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen("excel")}>
            <Upload className="mr-2 h-4 w-4" />
            Importar Excel
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen("api")}>
            <Upload className="mr-2 h-4 w-4" />
            Importar API
          </Button>
          <Button onClick={() => router.push("/admin/campaigns/contacts/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Lista
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Listas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lists.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Contatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {lists.reduce((sum, list) => sum + list.totalContacts, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Média por Lista</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {lists.length > 0
                ? Math.round(
                    lists.reduce((sum, list) => sum + list.totalContacts, 0) / lists.length
                  )
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suas Listas de Contatos</CardTitle>
          <CardDescription>
            {lists.length === 0
              ? "Nenhuma lista criada ainda. Crie sua primeira lista ou importe contatos."
              : `${lists.length} ${lists.length === 1 ? "lista" : "listas"} de contatos`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma lista de contatos</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Crie sua primeira lista de contatos ou importe contatos de um arquivo CSV/Excel ou
                API externa.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => router.push("/admin/campaigns/contacts/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Lista
                </Button>
                <Button variant="outline" onClick={() => setImportDialogOpen("csv")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-center">
                      <Hash className="h-4 w-4 inline mr-1" />
                      Contatos
                    </TableHead>
                    <TableHead>
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Criada em
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium">{list.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {list.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{list.totalContacts}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(list.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/campaigns/contacts/${list.id}`)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(list.id, list.name)}
                            title="Deletar lista"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Dialogs */}
      <ImportCsvDialog
        open={importDialogOpen === "csv"}
        onOpenChange={(open) => !open && setImportDialogOpen(null)}
        onSuccess={handleImportSuccess}
      />
      <ImportExcelDialog
        open={importDialogOpen === "excel"}
        onOpenChange={(open) => !open && setImportDialogOpen(null)}
        onSuccess={handleImportSuccess}
      />
      <ImportApiDialog
        open={importDialogOpen === "api"}
        onOpenChange={(open) => !open && setImportDialogOpen(null)}
        onSuccess={handleImportSuccess}
      />
    </div>
  )
}
