"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { type CreateUserRequest, adminApi } from "@/lib/api"
import { generateToken } from "@/lib/utils"
import { type CreateInstanceFormData, createInstanceSchema } from "@/lib/validations"
import { EVENT_LABELS, SUPPORTED_EVENTS } from "@/types"

interface UserFormProps {
  initialValues?: Partial<CreateInstanceFormData>
  onSuccess?: (user: any) => void
  onError?: (error: Error) => void
  mode?: "create" | "edit"
  userId?: string
}

export function UserForm({
  initialValues,
  onSuccess,
  onError,
  mode = "create",
  userId,
}: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateInstanceFormData>({
    resolver: zodResolver(createInstanceSchema) as any,
    defaultValues: {
      name: initialValues?.name || "",
      webhook_url: initialValues?.webhook_url || "",
      webhook_events: initialValues?.webhook_events || [],
    },
  })

  const selectedEvents = form.watch("webhook_events") || []

  const handleSelectAll = () => {
    if (selectedEvents.length === SUPPORTED_EVENTS.length) {
      form.setValue("webhook_events", [])
    } else {
      form.setValue("webhook_events", [...SUPPORTED_EVENTS])
    }
  }

  async function onSubmit(data: CreateInstanceFormData) {
    setIsSubmitting(true)
    try {
      let result

      if (mode === "create") {
        const createData: CreateUserRequest = {
          name: data.name,
          token: generateToken(32),
          webhook: data.webhook_url || undefined,
          events: data.webhook_events?.join(",") || undefined,
        }
        result = await adminApi.users.create(createData)
        toast.success("Instância criada com sucesso!")
      } else {
        // Edit mode - would need update endpoint
        toast.success("Instância atualizada com sucesso!")
      }

      onSuccess?.(result)
      form.reset()
    } catch (error: any) {
      const errorMessage = error.getUserMessage?.() || error.message || "Erro ao salvar instância"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            <p className="text-sm text-muted-foreground">
              Configure os dados básicos da instância WhatsApp
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Instância</FormLabel>
                <FormControl>
                  <Input placeholder="minha-instancia" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>
                  Use apenas letras, números, underline (_) e hífen (-)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="webhook_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Webhook (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://seu-servidor.com/webhook"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>Endpoint que receberá os eventos do WhatsApp</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Webhook Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Eventos do Webhook</h3>
              <p className="text-sm text-muted-foreground">
                Selecione quais eventos serão enviados para o webhook
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={isSubmitting}
            >
              {selectedEvents.length === SUPPORTED_EVENTS.length
                ? "Desmarcar Todos"
                : "Selecionar Todos"}
            </Button>
          </div>

          <FormField
            control={form.control}
            name="webhook_events"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SUPPORTED_EVENTS.map((event) => (
                    <FormField
                      key={event}
                      control={form.control}
                      name="webhook_events"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={event}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(event)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), event])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== event)
                                      )
                                }}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal">{EVENT_LABELS[event]}</FormLabel>
                            </div>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Criando..." : "Salvando..."}
              </>
            ) : (
              <>{mode === "create" ? "Criar Instância" : "Salvar Alterações"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
