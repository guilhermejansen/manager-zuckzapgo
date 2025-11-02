"use client"

/**
 * Step 2: Webhook Configuration
 * Configuração completa de webhook com seleção de eventos por categoria
 */
import { AlertTriangle, CheckSquare, ChevronDown, Info, Square, Webhook } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CreateInstanceWizardData } from "@/lib/validations"
import { EVENT_CATEGORIES, EVENT_DESCRIPTIONS, WHATSAPP_EVENT_TYPES } from "@/types/events"

interface WebhookStepProps {
  form: UseFormReturn<CreateInstanceWizardData>
}

export function WebhookStep({ form }: WebhookStepProps) {
  const selectedEvents = form.watch("webhook.events") || []
  const webhookUrl = form.watch("webhook.webhook")

  // Helper para verificar se todos os eventos de uma categoria estão selecionados
  const isCategoryFullySelected = (categoryEvents: readonly string[]) => {
    return categoryEvents.every((event) => selectedEvents.includes(event))
  }

  // Helper para verificar se algum evento de uma categoria está selecionado
  const isCategoryPartiallySelected = (categoryEvents: readonly string[]) => {
    return (
      categoryEvents.some((event) => selectedEvents.includes(event)) &&
      !isCategoryFullySelected(categoryEvents)
    )
  }

  // Toggle categoria completa
  const toggleCategory = (categoryEvents: readonly string[]) => {
    const isFullySelected = isCategoryFullySelected(categoryEvents)
    const currentEvents = selectedEvents.filter((e) => !categoryEvents.includes(e))

    if (isFullySelected) {
      // Remove todos da categoria
      form.setValue("webhook.events", currentEvents)
    } else {
      // Adiciona todos da categoria
      form.setValue("webhook.events", [...currentEvents, ...(categoryEvents as string[])])
    }
  }

  // Toggle individual event
  const toggleEvent = (event: string) => {
    const currentEvents = selectedEvents
    if (currentEvents.includes(event)) {
      form.setValue(
        "webhook.events",
        currentEvents.filter((e) => e !== event)
      )
    } else {
      form.setValue("webhook.events", [...currentEvents, event])
    }
  }

  // Selecionar todos os eventos
  const selectAllEvents = () => {
    form.setValue("webhook.events", [...WHATSAPP_EVENT_TYPES])
  }

  // Limpar seleção
  const clearSelection = () => {
    form.setValue("webhook.events", [])
  }

  const isAllSelected = selectedEvents.length === WHATSAPP_EVENT_TYPES.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Configuração de Webhook
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure webhook URL para receber eventos do WhatsApp em tempo real
        </p>
      </div>

      <Separator />

      {/* Webhook URL */}
      <FormField
        control={form.control}
        name="webhook.webhook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Webhook URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://seu-dominio.com/webhook" type="url" />
            </FormControl>
            <FormDescription>URL completa onde os eventos serão enviados via POST</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Info sobre configuração opcional */}
      {!webhookUrl && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            A configuração de webhook é <strong>opcional</strong>. Você pode pular este step e
            configurar depois se necessário.
          </AlertDescription>
        </Alert>
      )}

      {/* Seleção de Eventos */}
      {webhookUrl && (
        <>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <FormLabel>Eventos para Webhook</FormLabel>
                <FormDescription>
                  Selecione quais eventos serão enviados para o webhook
                </FormDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedEvents.length} de {WHATSAPP_EVENT_TYPES.length} eventos
                </Badge>
                {!isAllSelected && (
                  <Button type="button" variant="outline" size="sm" onClick={selectAllEvents}>
                    Selecionar Todos
                  </Button>
                )}
                {selectedEvents.length > 0 && (
                  <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Event Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(EVENT_CATEGORIES).map(([key, category]) => {
                const isFullySelected = isCategoryFullySelected(category.events)
                const isPartiallySelected = isCategoryPartiallySelected(category.events)

                return (
                  <div
                    key={key}
                    className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
                  >
                    {/* Category Header */}
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => toggleCategory(category.events)}
                    >
                      {isFullySelected ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : isPartiallySelected ? (
                        <div className="h-5 w-5 border-2 border-primary rounded flex items-center justify-center">
                          <div className="h-2 w-2 bg-primary rounded-sm" />
                        </div>
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="font-medium text-sm">{category.label}</span>
                      <Badge variant="outline" className="ml-auto">
                        {category.events.filter((e) => selectedEvents.includes(e)).length}/
                        {category.events.length}
                      </Badge>
                    </div>

                    {/* Events List */}
                    <div className="space-y-2 ml-7">
                      {category.events.map((event) => (
                        <div key={event} className="flex items-start gap-2 text-sm group">
                          <Checkbox
                            id={`webhook-${event}`}
                            checked={selectedEvents.includes(event)}
                            onCheckedChange={() => toggleEvent(event)}
                          />
                          <label
                            htmlFor={`webhook-${event}`}
                            className="cursor-pointer flex-1 leading-tight group-hover:text-primary transition-colors"
                            title={EVENT_DESCRIPTIONS[event as keyof typeof EVENT_DESCRIPTIONS]}
                          >
                            <span className="font-mono text-xs">{event}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {EVENT_DESCRIPTIONS[event as keyof typeof EVENT_DESCRIPTIONS]}
                            </p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Validation Alert */}
            {webhookUrl && selectedEvents.length === 0 && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Você configurou uma URL de webhook mas não selecionou nenhum evento. Selecione
                  pelo menos um evento ou remova a URL do webhook.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </>
      )}

      {/* Configurações Avançadas (Opcional) */}
      {webhookUrl && (
        <Collapsible className="space-y-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="font-medium">⚙️ Configurações Avançadas (Opcional)</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-expanded:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> Altere estas configurações apenas se souber exatamente o
                que está fazendo. Valores incorretos podem causar falhas na entrega de eventos.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              {/* Timeout */}
              <FormField
                control={form.control}
                name="webhook.timeout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeout (ms)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 30000)}
                        placeholder="30000"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Tempo máximo de espera por resposta (padrão: 30000ms)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Retries */}
              <FormField
                control={form.control}
                name="webhook.maxRetries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tentativas Máximas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                        placeholder="3"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Número de retentativas em caso de falha (padrão: 3)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Retry Delay */}
              <FormField
                control={form.control}
                name="webhook.retryDelay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delay entre Retentativas (ms)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1000)}
                        placeholder="1000"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Tempo de espera antes de retentar (padrão: 1000ms)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Backoff Factor */}
              <FormField
                control={form.control}
                name="webhook.backoffFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fator de Backoff</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 2)}
                        placeholder="2"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Multiplicador para delay exponencial (padrão: 2)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Info adicional */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <p>
            <strong>Dica:</strong> Você pode usar serviços como{" "}
            <a
              href="https://webhook.site"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              webhook.site
            </a>{" "}
            para testar seus webhooks durante o desenvolvimento.
          </p>
          <p className="text-xs">
            Os eventos serão enviados via POST com JSON payload. Certifique-se de que sua URL está
            acessível publicamente.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
