/**
 * Add Contact to List Page
 *
 * Página para adicionar contato manualmente a uma lista com formulário inteligente de JID.
 * Suporta todos os 11 tipos de ContactType do whatsmeow com auto-formatação.
 */

"use client"

import { useEffect, useState } from "react"

import { useParams, useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  Bot,
  Check,
  Globe,
  Megaphone,
  MessageCircle,
  Plus,
  Radio,
  Server,
  UserSquare2,
  Users,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addContactAction, getContactListAction } from "@/app/actions/contacts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"
import { type AddContactFormData, addContactSchema } from "@/lib/validations"

/**
 * Add Contact to List Page
 *
 * Página para adicionar contato manualmente a uma lista com formulário inteligente de JID.
 * Suporta todos os 11 tipos de ContactType do whatsmeow com auto-formatação.
 */

/**
 * Add Contact to List Page
 *
 * Página para adicionar contato manualmente a uma lista com formulário inteligente de JID.
 * Suporta todos os 11 tipos de ContactType do whatsmeow com auto-formatação.
 */

/**
 * Add Contact to List Page
 *
 * Página para adicionar contato manualmente a uma lista com formulário inteligente de JID.
 * Suporta todos os 11 tipos de ContactType do whatsmeow com auto-formatação.
 */

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const CONTACT_TYPES: Array<{
  value: AddContactFormData["type"]
  label: string
  description: string
  suffix: string
  icon: any
  placeholder: string
  example: string
  fixed?: boolean
}> = [
  {
    value: "INDIVIDUAL" as const,
    label: "Contato Individual",
    description: "Usuário padrão do WhatsApp",
    suffix: "@s.whatsapp.net",
    icon: UserSquare2,
    placeholder: "5511999999999",
    example: "5511999999999@s.whatsapp.net",
  },
  {
    value: "LID" as const,
    label: "LID (Hidden User)",
    description: "Usuário com servidor oculto",
    suffix: "@lid",
    icon: UserSquare2,
    placeholder: "1234567890",
    example: "1234567890@lid",
  },
  {
    value: "GROUP" as const,
    label: "Grupo",
    description: "Grupo do WhatsApp",
    suffix: "@g.us",
    icon: Users,
    placeholder: "120363123456789012",
    example: "120363123456789012@g.us",
  },
  {
    value: "NEWSLETTER" as const,
    label: "Canal/Newsletter",
    description: "Canal ou Newsletter",
    suffix: "@newsletter",
    icon: Megaphone,
    placeholder: "1234567890",
    example: "1234567890@newsletter",
  },
  {
    value: "BROADCAST" as const,
    label: "Lista de Transmissão",
    description: "Lista de transmissão",
    suffix: "@broadcast",
    icon: Radio,
    placeholder: "1234567890",
    example: "1234567890@broadcast",
  },
  {
    value: "STATUS" as const,
    label: "Status/Broadcast Fixo",
    description: "Status do WhatsApp (fixo)",
    suffix: "@broadcast",
    icon: Radio,
    placeholder: "status",
    example: "status@broadcast",
    fixed: true,
  },
  {
    value: "BOT" as const,
    label: "Bot",
    description: "Bot do WhatsApp",
    suffix: "@bot",
    icon: Bot,
    placeholder: "1234567890",
    example: "1234567890@bot",
  },
  {
    value: "HOSTED" as const,
    label: "Hosted Server",
    description: "Servidor hospedado",
    suffix: "@hosted",
    icon: Server,
    placeholder: "1234567890",
    example: "1234567890@hosted",
  },
  {
    value: "HOSTED_LID" as const,
    label: "Hosted LID Server",
    description: "Servidor LID hospedado",
    suffix: "@hosted.lid",
    icon: Server,
    placeholder: "1234567890",
    example: "1234567890@hosted.lid",
  },
  {
    value: "MESSENGER" as const,
    label: "Messenger Interop",
    description: "Interoperabilidade Messenger",
    suffix: "@msgr",
    icon: MessageCircle,
    placeholder: "1234567890",
    example: "1234567890@msgr",
  },
  {
    value: "INTEROP" as const,
    label: "Interop Geral",
    description: "Interoperabilidade geral",
    suffix: "@interop",
    icon: Globe,
    placeholder: "1234567890",
    example: "1234567890@interop",
  },
] as const

interface ContactList {
  id: string
  name: string
  description: string | null
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AddContactPage() {
  const router = useRouter()
  const params = useParams()
  const listId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [list, setList] = useState<ContactList | null>(null)
  const [jidPreview, setJidPreview] = useState("")

  // Form setup
  const form = useForm<AddContactFormData>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      jid: "",
      name: "",
      pushName: "",
      type: "INDIVIDUAL",
      customFields: undefined,
    },
  })

  const selectedType = form.watch("type")
  const jidInput = form.watch("jid")

  // Load contact list
  useEffect(() => {
    loadContactList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId])

  // Auto-format JID preview
  useEffect(() => {
    const contactType = CONTACT_TYPES.find((t) => t.value === selectedType)
    if (!contactType) return

    if (contactType.fixed) {
      // STATUS type is always "status@broadcast"
      setJidPreview("status@broadcast")
      form.setValue("jid", "status@broadcast")
    } else {
      // Extract just the number/ID part from jidInput
      const numberPart = jidInput.replace(/@.*$/, "").trim()

      if (numberPart) {
        const fullJid = `${numberPart}${contactType.suffix}`
        setJidPreview(fullJid)
      } else {
        setJidPreview(`${contactType.placeholder}${contactType.suffix}`)
      }
    }
  }, [selectedType, jidInput, form])

  async function loadContactList() {
    setLoading(true)
    try {
      const result = await getContactListAction(listId)

      if (result.success && result.data) {
        setList(result.data as ContactList)
        logger.debug("Contact list loaded", null, {
          component: "AddContactPage",
          action: "loadContactList",
          metadata: { listId },
        })
      } else {
        toast.error(result.error || "Erro ao carregar lista")
        router.push("/admin/campaigns/contacts")
      }
    } catch (error) {
      logger.error("Error loading contact list", error instanceof Error ? error : undefined, {
        component: "AddContactPage",
        action: "loadContactList",
        metadata: { listId },
      })
      toast.error("Erro ao carregar lista")
      router.push("/admin/campaigns/contacts")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(data: AddContactFormData) {
    setSubmitting(true)

    try {
      // Auto-format JID if needed
      const contactType = CONTACT_TYPES.find((t) => t.value === data.type)
      let finalJid = data.jid.trim()

      if (contactType) {
        if (contactType.fixed) {
          finalJid = "status@broadcast"
        } else {
          // Remove any existing suffix
          const numberPart = finalJid.replace(/@.*$/, "")
          // Add correct suffix
          finalJid = `${numberPart}${contactType.suffix}`
        }
      }

      const result = await addContactAction(listId, {
        ...data,
        jid: finalJid,
        customFields: data.customFields ? JSON.parse(data.customFields as any) : undefined,
      })

      if (result.success) {
        toast.success("Contato adicionado com sucesso!")
        logger.success("Contact added", null, {
          component: "AddContactPage",
          action: "onSubmit",
          metadata: { listId, contactId: result.data?.id },
        })
        router.push(`/admin/campaigns/contacts/${listId}`)
      } else {
        toast.error(result.error || "Erro ao adicionar contato")
      }
    } catch (error) {
      logger.error("Error adding contact", error instanceof Error ? error : undefined, {
        component: "AddContactPage",
        action: "onSubmit",
        metadata: { listId },
      })
      toast.error("Erro ao adicionar contato")
    } finally {
      setSubmitting(false)
    }
  }

  async function onSubmitAndAddAnother(data: AddContactFormData) {
    setSubmitting(true)

    try {
      // Auto-format JID if needed
      const contactType = CONTACT_TYPES.find((t) => t.value === data.type)
      let finalJid = data.jid.trim()

      if (contactType) {
        if (contactType.fixed) {
          finalJid = "status@broadcast"
        } else {
          const numberPart = finalJid.replace(/@.*$/, "")
          finalJid = `${numberPart}${contactType.suffix}`
        }
      }

      const result = await addContactAction(listId, {
        ...data,
        jid: finalJid,
        customFields: data.customFields ? JSON.parse(data.customFields as any) : undefined,
      })

      if (result.success) {
        toast.success("Contato adicionado! Adicione outro.")
        logger.success("Contact added (add another)", null, {
          component: "AddContactPage",
          action: "onSubmitAndAddAnother",
          metadata: { listId, contactId: result.data?.id },
        })
        // Reset form but keep the type selected
        form.reset({
          jid: "",
          name: "",
          pushName: "",
          type: data.type,
          customFields: undefined,
        })
      } else {
        toast.error(result.error || "Erro ao adicionar contato")
      }
    } catch (error) {
      logger.error("Error adding contact", error instanceof Error ? error : undefined, {
        component: "AddContactPage",
        action: "onSubmitAndAddAnother",
        metadata: { listId },
      })
      toast.error("Erro ao adicionar contato")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!list) return null

  const selectedContactType = CONTACT_TYPES.find((t) => t.value === selectedType)
  const Icon = selectedContactType?.icon || UserSquare2

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/campaigns/contacts/${listId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adicionar Contato</h1>
          <p className="text-muted-foreground">
            Lista: <span className="font-medium">{list.name}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Contato</CardTitle>
          <CardDescription>
            Preencha os dados do contato. O JID será formatado automaticamente com base no tipo
            selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Type Selector */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contato *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de contato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTACT_TYPES.map((type) => {
                          const TypeIcon = type.icon
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4" />
                                <span>{type.label}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {type.suffix}
                                </Badge>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    {selectedContactType && (
                      <FormDescription>{selectedContactType.description}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* JID Input with Auto-Format */}
              <FormField
                control={form.control}
                name="jid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      WhatsApp JID * <Icon className="inline h-4 w-4 ml-1" />
                    </FormLabel>
                    <FormControl>
                      {selectedContactType?.fixed ? (
                        <Input
                          placeholder="status@broadcast"
                          value="status@broadcast"
                          disabled
                          className="font-mono"
                        />
                      ) : (
                        <Input
                          placeholder={selectedContactType?.placeholder || "Digite o ID"}
                          {...field}
                          className="font-mono"
                          onChange={(e) => {
                            // Remove any @ symbols from input
                            const value = e.target.value.replace(/@.*$/, "")
                            field.onChange(value)
                          }}
                        />
                      )}
                    </FormControl>
                    {jidPreview && (
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">Preview:</span>
                        <code className="font-mono font-semibold text-green-600">{jidPreview}</code>
                      </div>
                    )}
                    <FormDescription>
                      {selectedContactType?.fixed
                        ? "JID fixo para status do WhatsApp"
                        : `Digite apenas o número/ID. Exemplo: ${selectedContactType?.example}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Optional Fields */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do contato" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Nome para identificação do contato</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pushName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Push Name (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome de exibição" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Nome de exibição no WhatsApp</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customFields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campos Personalizados (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{"department": "Sales", "region": "SP"}'
                        className="font-mono text-sm"
                        rows={3}
                        {...field}
                        value={field.value as any}
                      />
                    </FormControl>
                    <FormDescription>
                      JSON com metadados extras (ex: departamento, região, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/campaigns/contacts/${listId}`)}
                  disabled={submitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <div className="flex-1" />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={form.handleSubmit(onSubmitAndAddAnother)}
                  disabled={submitting}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar e Criar Outro
                </Button>
                <Button type="submit" disabled={submitting}>
                  <Check className="mr-2 h-4 w-4" />
                  {submitting ? "Adicionando..." : "Adicionar Contato"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tipos de JID Suportados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {CONTACT_TYPES.map((type) => {
              const TypeIcon = type.icon
              return (
                <div key={type.value} className="flex items-start gap-2 text-sm">
                  <TypeIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <code className="text-xs text-muted-foreground">{type.example}</code>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
