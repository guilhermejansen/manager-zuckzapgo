"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import { webhookApi } from "@/lib/api"
import { type WebhookConfigFormData, webhookConfigSchema } from "@/lib/validations"
import { EVENT_DESCRIPTIONS, EVENT_LABELS, SUPPORTED_EVENTS } from "@/types"

interface WebhookFormProps {
  initialValues?: Partial<WebhookConfigFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  instanceToken?: string
}

export function WebhookForm({
  initialValues,
  onSuccess,
  onError,
  instanceToken,
}: WebhookFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<WebhookConfigFormData>({
    resolver: zodResolver(webhookConfigSchema) as any,
    defaultValues: {
      webhook_url: initialValues?.webhook_url || "",
      webhook_events: initialValues?.webhook_events || [],
      webhook_timeout: initialValues?.webhook_timeout || 60000,
      webhook_max_retries: initialValues?.webhook_max_retries || 3,
      webhook_retry_delay: initialValues?.webhook_retry_delay || 3000,
      webhook_backoff_factor: initialValues?.webhook_backoff_factor || 2,
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

  async function onSubmit(data: WebhookConfigFormData) {
    setIsSubmitting(true)
    try {
      const payload = {
        webhookurl: data.webhook_url,
        events: data.webhook_events,
      }

      const requestOptions = instanceToken ? { token: instanceToken } : undefined

      await webhookApi.create(payload, requestOptions)
      toast.success("Webhook configurado com sucesso!")
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error.getUserMessage?.() || error.message || "Erro ao configurar webhook"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (isSubmitting || isDeleting) {
      return
    }

    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Remover configuração de webhook? Os eventos deixarão de ser enviados imediatamente."
      )
      if (!confirmed) {
        return
      }
    }

    setIsDeleting(true)
    try {
      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await webhookApi.delete(requestOptions)
      toast.success("Webhook removido com sucesso!")
      form.reset({
        webhook_url: "",
        webhook_events: [],
        webhook_timeout: 60000,
        webhook_max_retries: 3,
        webhook_retry_delay: 3000,
        webhook_backoff_factor: 2,
      })
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error.getUserMessage?.() || error.message || "Erro ao remover webhook"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Configuration */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Configuração Básica</h3>
            <p className="text-sm text-muted-foreground">
              Configure o endpoint do webhook e os eventos que serão enviados
            </p>
          </div>

          <FormField
            control={form.control}
            name="webhook_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Webhook</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://seu-servidor.com/webhook"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Endpoint HTTP/HTTPS que receberá os eventos via POST
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Events Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Eventos</h3>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUPPORTED_EVENTS.map((event) => (
                    <FormField
                      key={event}
                      control={form.control}
                      name="webhook_events"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={event}
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
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
                              <FormLabel className="font-medium cursor-pointer">
                                {EVENT_LABELS[event]}
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {EVENT_DESCRIPTIONS[event]}
                              </FormDescription>
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

        {/* Advanced Settings */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>Configurações Avançadas</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  advancedOpen ? "transform rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="webhook_timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (ms)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1000}
                        max={60000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Tempo máximo de espera pela resposta (1000-60000ms)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="webhook_max_retries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Máximo de Tentativas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Número de tentativas em caso de falha (0-10)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="webhook_retry_delay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delay entre Tentativas (ms)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={100}
                        max={30000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Tempo de espera antes de retentar (100-30000ms)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="webhook_backoff_factor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fator de Backoff</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        step={0.1}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Multiplicador de delay exponencial (1-5)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Submit Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {(instanceToken ||
            initialValues?.webhook_url ||
            initialValues?.webhook_events?.length) && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removendo...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover Webhook
                </>
              )}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="sm:ml-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Configuração"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
