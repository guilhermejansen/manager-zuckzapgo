/**
 * New Contact List Page
 *
 * Página para criar nova lista de contatos manualmente.
 */

"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { ArrowLeft, Save, Users } from "lucide-react"
import { toast } from "sonner"

import { createContactListAction } from "@/app/actions/contacts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { logger } from "@/lib/logger"

/**
 * New Contact List Page
 *
 * Página para criar nova lista de contatos manualmente.
 */

/**
 * New Contact List Page
 *
 * Página para criar nova lista de contatos manualmente.
 */

/**
 * New Contact List Page
 *
 * Página para criar nova lista de contatos manualmente.
 */

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  name: string
  description: string
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function NewContactListPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Nome da lista é obrigatório")
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      logger.debug("Creating contact list", null, {
        component: "NewContactListPage",
        action: "handleSubmit",
        metadata: {
          name: formData.name,
        },
      })

      const result = await createContactListAction({
        name: formData.name,
        description: formData.description || undefined,
        source: "MANUAL",
        type: "INDIVIDUAL",
      })

      if (result.success && result.data) {
        toast.success("Lista criada com sucesso!")
        logger.success("Contact list created successfully", null, {
          component: "NewContactListPage",
          action: "handleSubmit",
          metadata: { listId: result.data.id },
        })
        router.push(`/admin/campaigns/contacts/${result.data.id}`)
      } else {
        toast.error(result.error || "Erro ao criar lista")
        logger.error("Failed to create contact list", new Error(result.error || "Unknown error"), {
          component: "NewContactListPage",
          action: "handleSubmit",
        })
      }
    } catch (error) {
      logger.error("Error creating contact list", error instanceof Error ? error : undefined, {
        component: "NewContactListPage",
        action: "handleSubmit",
      })
      toast.error("Erro ao criar lista")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Lista de Contatos</h1>
          <p className="text-muted-foreground">Crie uma nova lista para organizar seus contatos</p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Como funciona?
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Crie uma lista vazia e depois adicione contatos manualmente ou importe de arquivos
                CSV/Excel. Você também pode usar nossa API para sincronizar contatos
                automaticamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Lista</CardTitle>
          <CardDescription>Configure os detalhes básicos da sua lista de contatos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Lista *</Label>
            <Input
              id="name"
              placeholder="Ex: Clientes VIP, Leads 2024, Newsletter..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Escolha um nome descritivo para facilitar a identificação
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o propósito desta lista, critérios de segmentação, etc..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Adicione detalhes sobre o tipo de contatos ou segmentação aplicada
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Criando..." : "Criar Lista"}
        </Button>
      </div>
    </div>
  )
}
