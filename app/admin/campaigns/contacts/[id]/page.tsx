/**
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
 */

"use client"

import { useEffect, useState } from "react"

import { useParams, useRouter } from "next/navigation"

import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { getContactListAction, removeContactAction } from "@/app/actions/contacts"
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
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
 */

/**
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
 */

/**
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
 */

/**
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
 */

/**
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
 */

/**
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
 */

/**
 * Contact List Details Page
 *
 * Página de detalhes de uma lista de contatos com todos os contatos e filtros.
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

interface Contact {
  id: string
  jid: string
  name: string | null
  phone: string | null
  metadata: Record<string, any> | null
  createdAt: Date
  listId: string
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContactListDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const listId = params.id as string

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<ContactList | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadListAndContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId])

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.jid.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredContacts(filtered)
    } else {
      setFilteredContacts(contacts)
    }
  }, [searchTerm, contacts])

  async function loadListAndContacts() {
    setLoading(true)
    try {
      const listResult = await getContactListAction(listId)

      if (listResult.success && listResult.data) {
        const listWithContacts = listResult.data as ContactList & { contacts: Contact[] }
        setList(listWithContacts)
        setContacts(listWithContacts.contacts || [])
        setFilteredContacts(listWithContacts.contacts || [])
        logger.debug("Contacts loaded", null, {
          component: "ContactListDetailsPage",
          action: "loadListAndContacts",
          metadata: { listId, count: listWithContacts.contacts?.length || 0 },
        })
      } else {
        toast.error(listResult.error || "Erro ao carregar lista")
        router.push("/admin/campaigns/contacts")
        return
      }
    } catch (error) {
      logger.error("Error loading list and contacts", error instanceof Error ? error : undefined, {
        component: "ContactListDetailsPage",
        action: "loadListAndContacts",
        metadata: { listId },
      })
      toast.error("Erro ao carregar lista e contatos")
      router.push("/admin/campaigns/contacts")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteContact(contactId: string, contactName: string) {
    if (
      !confirm(
        `Tem certeza que deseja remover o contato "${contactName || "sem nome"}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return
    }

    try {
      const result = await removeContactAction(contactId)
      if (result.success) {
        toast.success("Contato removido com sucesso")
        loadListAndContacts()
      } else {
        toast.error(result.error || "Erro ao remover contato")
      }
    } catch (error) {
      logger.error("Error deleting contact", error instanceof Error ? error : undefined, {
        component: "ContactListDetailsPage",
        action: "handleDeleteContact",
        metadata: { contactId },
      })
      toast.error("Erro ao remover contato")
    }
  }

  function handleExportCsv() {
    if (filteredContacts.length === 0) {
      toast.error("Nenhum contato para exportar")
      return
    }

    const headers = ["JID", "Nome", "Telefone", "Metadados", "Data de Criação"]
    const rows = filteredContacts.map((contact) => [
      contact.jid,
      contact.name || "",
      contact.phone || "",
      JSON.stringify(contact.metadata || {}),
      new Date(contact.createdAt).toISOString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `contatos_${list?.name}_${Date.now()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("CSV exportado com sucesso!")
  }

  function handleDownloadTemplate(templateType: string) {
    const templates: Record<string, string> = {
      individual: "/templates/contacts-individual.csv",
      groups: "/templates/contacts-groups.csv",
      channels: "/templates/contacts-channels.csv",
      complete: "/templates/contacts-complete.csv",
    }

    const templateUrl = templates[templateType]
    if (!templateUrl) {
      toast.error("Template não encontrado")
      return
    }

    const link = document.createElement("a")
    link.href = templateUrl
    link.download = templateUrl.split("/").pop() || "template.csv"
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Template baixado com sucesso!")
    logger.debug("Template downloaded", null, {
      component: "ContactListDetailsPage",
      action: "handleDownloadTemplate",
      metadata: { templateType },
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!list) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{list.name}</h1>
          {list.description && <p className="text-muted-foreground">{list.description}</p>}
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Criada em {new Date(list.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Contatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Contatos Filtrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredContacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Última Atualização</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {new Date(list.updatedAt).toLocaleDateString("pt-BR")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Contatos da Lista</CardTitle>
              <CardDescription>
                {filteredContacts.length === 0
                  ? "Nenhum contato nesta lista"
                  : `${filteredContacts.length} ${filteredContacts.length === 1 ? "contato" : "contatos"}`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 lg:flex-initial lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Export CSV Button */}
              <Button variant="outline" onClick={handleExportCsv}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>

              {/* Download Templates Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Templates
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Baixar Template CSV</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDownloadTemplate("individual")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Contatos Individuais
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadTemplate("groups")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Grupos do WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadTemplate("channels")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Canais/Newsletters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDownloadTemplate("complete")}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-primary" />
                    <span className="font-medium">Template Completo</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Add Contact Button */}
              <Button onClick={() => router.push(`/admin/campaigns/contacts/${listId}/add`)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Phone className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "Nenhum contato encontrado" : "Nenhum contato nesta lista"}
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {searchTerm
                  ? "Tente buscar com outros termos ou limpe o filtro."
                  : "Adicione contatos manualmente ou importe de um arquivo."}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push(`/admin/campaigns/contacts/${listId}/add`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Contato
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp JID</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Metadados</TableHead>
                    <TableHead>
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Adicionado em
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name || "—"}</TableCell>
                      <TableCell className="font-mono text-sm">{contact.jid}</TableCell>
                      <TableCell>{contact.phone || "—"}</TableCell>
                      <TableCell>
                        {contact.metadata && Object.keys(contact.metadata).length > 0 ? (
                          <Badge variant="secondary">
                            {Object.keys(contact.metadata).length} campo(s)
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteContact(contact.id, contact.name || "sem nome")
                          }
                          title="Remover contato"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
