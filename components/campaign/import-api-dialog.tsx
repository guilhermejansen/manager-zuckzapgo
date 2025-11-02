/**
 * Import API Dialog Component
 *
 * Dialog para importação de contatos via API externa com preview.
 */

"use client"

import { useState } from "react"

import { AlertCircle, CheckCircle, Download, Link2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { importContactsAction } from "@/app/actions/contacts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"

/**
 * Import API Dialog Component
 *
 * Dialog para importação de contatos via API externa com preview.
 */

/**
 * Import API Dialog Component
 *
 * Dialog para importação de contatos via API externa com preview.
 */

/**
 * Import API Dialog Component
 *
 * Dialog para importação de contatos via API externa com preview.
 */

// ============================================================================
// TYPES
// ============================================================================

interface ImportApiDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface ApiContact {
  jid: string
  name?: string
  phone?: string
  [key: string]: any
}

interface ValidationResult {
  valid: ApiContact[]
  invalid: { row: ApiContact; errors: string[] }[]
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function validateJid(jid: string): boolean {
  // Suporta todos os tipos de JID do WhatsApp conforme whatsmeow:
  // - s.whatsapp.net (indivíduos)
  // - lid (usuários com LID)
  // - g.us (grupos)
  // - newsletter (canais/newsletters)
  // - broadcast (listas de transmissão)
  // - c.us (legado)
  // - bot (bots)
  // - hosted (servidor hospedado)
  // - hosted.lid (servidor LID hospedado)
  // - msgr (messenger interop)
  // - interop (interop geral)
  const jidRegex =
    /^\d{10,15}@(s\.whatsapp\.net|lid|g\.us|newsletter|broadcast|c\.us|bot|hosted|hosted\.lid|msgr|interop)$/
  return jidRegex.test(jid)
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^\d{10,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

function validateApiData(data: any[]): ValidationResult {
  const valid: ApiContact[] = []
  const invalid: { row: ApiContact; errors: string[] }[] = []

  data.forEach((row) => {
    const errors: string[] = []

    // Verificar se tem JID
    if (!row.jid || typeof row.jid !== "string") {
      errors.push("JID é obrigatório")
    } else if (!validateJid(row.jid)) {
      errors.push("JID inválido (formato esperado: número@s.whatsapp.net)")
    }

    // Validar telefone se fornecido
    if (row.phone && !validatePhone(row.phone)) {
      errors.push("Formato de telefone inválido")
    }

    if (errors.length > 0) {
      invalid.push({ row, errors })
    } else {
      valid.push(row)
    }
  })

  return { valid, invalid }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ImportApiDialog({ open, onOpenChange, onSuccess }: ImportApiDialogProps) {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [listName, setListName] = useState("")
  const [apiUrl, setApiUrl] = useState("")
  const [apiHeaders, setApiHeaders] = useState("")
  const [apiData, setApiData] = useState<ApiContact[]>([])
  const [validation, setValidation] = useState<ValidationResult | null>(null)

  const handleFetchData = async () => {
    if (!apiUrl.trim()) {
      toast.error("URL da API é obrigatória")
      return
    }

    try {
      new URL(apiUrl)
    } catch {
      toast.error("URL inválida")
      return
    }

    setFetching(true)

    try {
      logger.debug("Fetching data from API", null, {
        component: "ImportApiDialog",
        action: "handleFetchData",
        metadata: { apiUrl },
      })

      // Parse headers
      let headers: Record<string, string> = {}
      if (apiHeaders.trim()) {
        try {
          headers = JSON.parse(apiHeaders)
        } catch {
          toast.error("Headers inválidos (formato JSON esperado)")
          setFetching(false)
          return
        }
      }

      // Fetch data
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Validar se é um array
      if (!Array.isArray(data)) {
        toast.error("A API deve retornar um array de contatos")
        return
      }

      setApiData(data)
      const validationResult = validateApiData(data)
      setValidation(validationResult)

      logger.debug("API data fetched", null, {
        component: "ImportApiDialog",
        action: "handleFetchData",
        metadata: {
          totalRows: data.length,
          validRows: validationResult.valid.length,
          invalidRows: validationResult.invalid.length,
        },
      })

      if (validationResult.valid.length === 0) {
        toast.error("Nenhum contato válido encontrado na resposta da API")
      } else {
        toast.success(
          `${validationResult.valid.length} contatos válidos encontrados${
            validationResult.invalid.length > 0
              ? ` (${validationResult.invalid.length} inválidos)`
              : ""
          }`
        )
      }
    } catch (error) {
      logger.error("API fetch error", error instanceof Error ? error : undefined, {
        component: "ImportApiDialog",
        action: "handleFetchData",
      })
      toast.error(error instanceof Error ? error.message : "Erro ao buscar dados da API")
    } finally {
      setFetching(false)
    }
  }

  const handleImport = async () => {
    if (!listName.trim()) {
      toast.error("Nome da lista é obrigatório")
      return
    }

    if (!validation || validation.valid.length === 0) {
      toast.error("Nenhum contato válido para importar")
      return
    }

    setLoading(true)

    try {
      logger.debug("Importing contacts from API", null, {
        component: "ImportApiDialog",
        action: "handleImport",
        metadata: {
          listName,
          contactCount: validation.valid.length,
          apiUrl,
        },
      })

      const result = await importContactsAction({
        listName,
        contacts: validation.valid,
      })

      if (result.success) {
        toast.success(`${validation.valid.length} contatos importados com sucesso!`)
        logger.success("Contacts imported successfully", null, {
          component: "ImportApiDialog",
          action: "handleImport",
          metadata: { listId: result.data?.listId, count: validation.valid.length },
        })
        handleReset()
        onSuccess()
      } else {
        toast.error(result.error || "Erro ao importar contatos")
      }
    } catch (error) {
      logger.error("Error importing contacts", error instanceof Error ? error : undefined, {
        component: "ImportApiDialog",
        action: "handleImport",
      })
      toast.error("Erro ao importar contatos")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setListName("")
    setApiUrl("")
    setApiHeaders("")
    setApiData([])
    setValidation(null)
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Contatos via API</DialogTitle>
          <DialogDescription>
            Busque contatos de uma API externa. A API deve retornar um array JSON com objetos
            contendo no mínimo o campo "jid".
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Nome da Lista */}
          <div className="space-y-2">
            <Label htmlFor="listName">Nome da Lista *</Label>
            <Input
              id="listName"
              placeholder="Ex: Clientes VIP, Leads 2024..."
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              disabled={loading || fetching}
            />
          </div>

          {/* API URL */}
          <div className="space-y-2">
            <Label htmlFor="apiUrl">URL da API *</Label>
            <div className="flex gap-2">
              <Input
                id="apiUrl"
                type="url"
                placeholder="https://api.exemplo.com/contatos"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                disabled={loading || fetching}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleFetchData}
                disabled={loading || fetching || !apiUrl.trim()}
              >
                {fetching ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              A API deve retornar um array JSON com objetos {`{ jid, name?, phone?, ... }`}
            </p>
          </div>

          {/* API Headers */}
          <div className="space-y-2">
            <Label htmlFor="apiHeaders">Headers da API (JSON) - opcional</Label>
            <Textarea
              id="apiHeaders"
              placeholder={`{\n  "Authorization": "Bearer seu-token",\n  "X-Custom-Header": "valor"\n}`}
              value={apiHeaders}
              onChange={(e) => setApiHeaders(e.target.value)}
              rows={4}
              disabled={loading || fetching}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Formato JSON. Ex: {`{"Authorization": "Bearer token"}`}
            </p>
          </div>

          {/* Example */}
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
            <Link2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Exemplo de resposta da API:</strong>
              <pre className="mt-2 text-xs bg-white dark:bg-gray-900 p-2 rounded">
                {`[\n  {\n    "jid": "5511999999999@s.whatsapp.net",\n    "name": "João Silva",\n    "phone": "5511999999999",\n    "email": "joao@exemplo.com"\n  }\n]`}
              </pre>
            </AlertDescription>
          </Alert>

          {/* Validation Summary */}
          {validation && (
            <div className="space-y-2">
              <div className="flex gap-2">
                {validation.valid.length > 0 && (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      {validation.valid.length} contatos válidos
                    </AlertDescription>
                  </Alert>
                )}
                {validation.invalid.length > 0 && (
                  <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      {validation.invalid.length} contatos inválidos
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Preview Table */}
          {validation && validation.valid.length > 0 && (
            <div className="flex-1 overflow-hidden">
              <Label className="mb-2 block">Preview dos Contatos Válidos (primeiros 10)</Label>
              <ScrollArea className="h-64 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>JID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Campos Extras</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validation.valid.slice(0, 10).map((contact, index) => {
                      const extraFields = Object.keys(contact).filter(
                        (key) => !["jid", "name", "phone"].includes(key)
                      )
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">{contact.jid}</TableCell>
                          <TableCell>{contact.name || "—"}</TableCell>
                          <TableCell>{contact.phone || "—"}</TableCell>
                          <TableCell>
                            {extraFields.length > 0 ? (
                              <Badge variant="outline">{extraFields.length} campo(s)</Badge>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
              {validation.valid.length > 10 && (
                <p className="text-xs text-muted-foreground mt-2">
                  + {validation.valid.length - 10} contatos adicionais
                </p>
              )}
            </div>
          )}

          {/* Invalid Contacts */}
          {validation && validation.invalid.length > 0 && (
            <div className="flex-1 overflow-hidden">
              <Label className="mb-2 block text-red-600 dark:text-red-400">
                Contatos Inválidos (primeiros 5)
              </Label>
              <ScrollArea className="h-48 border rounded-md border-red-200 dark:border-red-900">
                <div className="p-4 space-y-2">
                  {validation.invalid.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded text-sm"
                    >
                      <div className="font-mono text-xs mb-1">{item.row.jid || "JID ausente"}</div>
                      <div className="text-red-600 dark:text-red-400 text-xs">
                        {item.errors.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {validation.invalid.length > 5 && (
                <p className="text-xs text-muted-foreground mt-2">
                  + {validation.invalid.length - 5} erros adicionais
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading || fetching}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || fetching || !validation || validation.valid.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Importando..." : "Importar Contatos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
