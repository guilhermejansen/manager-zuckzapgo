/**
 * Import CSV Dialog Component
 *
 * Dialog para importação de contatos via arquivo CSV com preview.
 */

"use client"

import { useCallback, useState } from "react"

import { AlertCircle, CheckCircle, FileText, Upload, X } from "lucide-react"
import Papa from "papaparse"
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
import { logger } from "@/lib/logger"

/**
 * Import CSV Dialog Component
 *
 * Dialog para importação de contatos via arquivo CSV com preview.
 */

/**
 * Import CSV Dialog Component
 *
 * Dialog para importação de contatos via arquivo CSV com preview.
 */

/**
 * Import CSV Dialog Component
 *
 * Dialog para importação de contatos via arquivo CSV com preview.
 */

// ============================================================================
// TYPES
// ============================================================================

interface ImportCsvDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

interface CsvRow {
  jid: string
  name?: string
  phone?: string
  [key: string]: any
}

interface ValidationResult {
  valid: CsvRow[]
  invalid: { row: CsvRow; errors: string[] }[]
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
  // Basic phone validation: 10-15 digits
  const phoneRegex = /^\d{10,15}$/
  return phoneRegex.test(phone.replace(/\D/g, ""))
}

function validateCsvData(data: any[]): ValidationResult {
  const valid: CsvRow[] = []
  const invalid: { row: CsvRow; errors: string[] }[] = []

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

export function ImportCsvDialog({ open, onOpenChange, onSuccess }: ImportCsvDialogProps) {
  const [loading, setLoading] = useState(false)
  const [listName, setListName] = useState("")
  const [csvData, setCsvData] = useState<CsvRow[]>([])
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CsvRow[]
        setCsvData(data)
        const validationResult = validateCsvData(data)
        setValidation(validationResult)

        logger.debug("CSV parsed", null, {
          component: "ImportCsvDialog",
          action: "handleFileChange",
          metadata: {
            totalRows: data.length,
            validRows: validationResult.valid.length,
            invalidRows: validationResult.invalid.length,
          },
        })

        if (validationResult.valid.length === 0) {
          toast.error("Nenhum contato válido encontrado no arquivo")
        } else {
          toast.success(
            `${validationResult.valid.length} contatos válidos encontrados${
              validationResult.invalid.length > 0
                ? ` (${validationResult.invalid.length} inválidos)`
                : ""
            }`
          )
        }
      },
      error: (error) => {
        logger.error("CSV parse error", error instanceof Error ? error : undefined, {
          component: "ImportCsvDialog",
          action: "handleFileChange",
        })
        toast.error("Erro ao processar arquivo CSV")
      },
    })
  }, [])

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
      logger.debug("Importing contacts from CSV", null, {
        component: "ImportCsvDialog",
        action: "handleImport",
        metadata: {
          listName,
          contactCount: validation.valid.length,
        },
      })

      const result = await importContactsAction({
        listName,
        contacts: validation.valid,
      })

      if (result.success) {
        toast.success(`${validation.valid.length} contatos importados com sucesso!`)
        logger.success("Contacts imported successfully", null, {
          component: "ImportCsvDialog",
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
        component: "ImportCsvDialog",
        action: "handleImport",
      })
      toast.error("Erro ao importar contatos")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setListName("")
    setCsvData([])
    setValidation(null)
    setFileName("")
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Contatos CSV</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV com os contatos. O arquivo deve conter no mínimo uma
            coluna "jid" com o WhatsApp JID dos contatos.
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
              disabled={loading}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csvFile">Arquivo CSV *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={loading}
                className="flex-1"
              />
              {fileName && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {fileName}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Formato esperado: jid, name (opcional), phone (opcional), outros campos customizados
            </p>
          </div>

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
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || !validation || validation.valid.length === 0}
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Importando..." : "Importar Contatos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
