"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, Loader2, TestTube2, Trash2 } from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sessionApi } from "@/lib/api"
import { type RabbitMQConfigFormData, rabbitmqConfigSchema } from "@/lib/validations"
import {
  DELIVERY_MODES,
  DELIVERY_MODE_DESCRIPTIONS,
  EVENT_LABELS,
  EXCHANGE_TYPES,
  EXCHANGE_TYPE_DESCRIPTIONS,
  EXCHANGE_TYPE_LABELS,
  QUEUE_TYPES,
  QUEUE_TYPE_LABELS,
  SUPPORTED_EVENTS,
} from "@/types"

interface RabbitMQFormProps {
  initialValues?: Partial<RabbitMQConfigFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  instanceToken?: string
}

export function RabbitMQForm({
  initialValues,
  onSuccess,
  onError,
  instanceToken,
}: RabbitMQFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const canDeleteConfig = Boolean(
    instanceToken ||
      initialValues?.rabbitmq_url ||
      initialValues?.rabbitmq_exchange_name ||
      initialValues?.rabbitmq_queue_name
  )

  const form = useForm<RabbitMQConfigFormData>({
    resolver: zodResolver(rabbitmqConfigSchema) as any,
    defaultValues: {
      rabbitmq_url: initialValues?.rabbitmq_url || "",
      rabbitmq_exchange_name: initialValues?.rabbitmq_exchange_name || "",
      rabbitmq_exchange_type: initialValues?.rabbitmq_exchange_type || "topic",
      rabbitmq_queue_name: initialValues?.rabbitmq_queue_name || "",
      rabbitmq_queue_type: initialValues?.rabbitmq_queue_type || "classic",
      rabbitmq_routing_key: initialValues?.rabbitmq_routing_key || "",
      rabbitmq_events: initialValues?.rabbitmq_events || [],
      rabbitmq_durable: initialValues?.rabbitmq_durable ?? true,
      rabbitmq_auto_delete: initialValues?.rabbitmq_auto_delete ?? false,
      rabbitmq_exclusive: initialValues?.rabbitmq_exclusive ?? false,
      rabbitmq_no_wait: initialValues?.rabbitmq_no_wait ?? false,
      rabbitmq_delivery_mode: initialValues?.rabbitmq_delivery_mode || ("2" as any),
      rabbitmq_pool_size: initialValues?.rabbitmq_pool_size || 10,
      rabbitmq_worker_count: initialValues?.rabbitmq_worker_count || 50,
      rabbitmq_queue_buffer_size: initialValues?.rabbitmq_queue_buffer_size || 10000,
      rabbitmq_batch_size: initialValues?.rabbitmq_batch_size || 100,
    },
  })

  const selectedEvents = form.watch("rabbitmq_events") || []

  const handleSelectAll = () => {
    if (selectedEvents.length === SUPPORTED_EVENTS.length) {
      form.setValue("rabbitmq_events", [])
    } else {
      form.setValue("rabbitmq_events", [...SUPPORTED_EVENTS])
    }
  }

  const handleTestConnection = async () => {
    const url = form.getValues("rabbitmq_url")

    if (!url) {
      toast.error("Insira a URL do RabbitMQ antes de testar")
      return
    }

    setIsTesting(true)
    try {
      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await sessionApi.rabbitmq.test(requestOptions)
      toast.success("Conexão RabbitMQ testada com sucesso!")
    } catch (error: any) {
      toast.error(error.getUserMessage?.() || "Erro ao testar conexão RabbitMQ")
    } finally {
      setIsTesting(false)
    }
  }

  async function onSubmit(data: RabbitMQConfigFormData) {
    setIsSubmitting(true)
    try {
      const payload = {
        enabled: true,
        url: data.rabbitmq_url,
        exchange: data.rabbitmq_exchange_name,
        exchange_type: data.rabbitmq_exchange_type,
        queue: data.rabbitmq_queue_name || "",
        queue_type: data.rabbitmq_queue_type,
        routing_key: data.rabbitmq_routing_key || "",
        events: data.rabbitmq_events.join(","),
        durable: data.rabbitmq_durable,
        auto_delete: data.rabbitmq_auto_delete,
        exclusive: data.rabbitmq_exclusive,
        no_wait: data.rabbitmq_no_wait,
        delivery_mode:
          typeof data.rabbitmq_delivery_mode === "string"
            ? parseInt(data.rabbitmq_delivery_mode)
            : data.rabbitmq_delivery_mode,
      }

      const requestOptions = instanceToken ? { token: instanceToken } : undefined

      await sessionApi.rabbitmq.set(payload as any, requestOptions)
      toast.success("Configuração RabbitMQ salva com sucesso!")
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error.getUserMessage?.() || error.message || "Erro ao salvar configuração RabbitMQ"
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
        "Remover configuração RabbitMQ? Eventos deixarão de ser enviados para a fila."
      )
      if (!confirmed) {
        return
      }
    }

    setIsDeleting(true)
    try {
      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await sessionApi.rabbitmq.delete(requestOptions)
      toast.success("Configuração RabbitMQ removida com sucesso!")
      form.reset({
        rabbitmq_url: "",
        rabbitmq_exchange_name: "",
        rabbitmq_exchange_type: "topic",
        rabbitmq_queue_name: "",
        rabbitmq_queue_type: "classic",
        rabbitmq_routing_key: "",
        rabbitmq_events: [],
        rabbitmq_durable: true,
        rabbitmq_auto_delete: false,
        rabbitmq_exclusive: false,
        rabbitmq_no_wait: false,
        rabbitmq_delivery_mode: "2" as any,
        rabbitmq_pool_size: 10,
        rabbitmq_worker_count: 50,
        rabbitmq_queue_buffer_size: 10000,
        rabbitmq_batch_size: 100,
      })
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error.getUserMessage?.() || error.message || "Erro ao remover configuração RabbitMQ"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Connection */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Conexão</h3>
            <p className="text-sm text-muted-foreground">Configure a URL de conexão ao RabbitMQ</p>
          </div>

          <FormField
            control={form.control}
            name="rabbitmq_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do RabbitMQ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="amqp://user:pass@localhost:5672"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>URL de conexão (amqp:// ou amqps://)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={isTesting || isSubmitting}
          >
            {isTesting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <TestTube2 className="mr-2 h-4 w-4" />
                Testar Conexão
              </>
            )}
          </Button>
        </div>

        {/* Exchange Configuration */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Exchange</h3>
            <p className="text-sm text-muted-foreground">Configure a exchange RabbitMQ</p>
          </div>

          <FormField
            control={form.control}
            name="rabbitmq_exchange_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Exchange</FormLabel>
                <FormControl>
                  <Input placeholder="whatsapp.events" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rabbitmq_exchange_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo da Exchange</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXCHANGE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{EXCHANGE_TYPE_LABELS[type]}</span>
                          <span className="text-xs text-muted-foreground">
                            {EXCHANGE_TYPE_DESCRIPTIONS[type]}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Queue Configuration */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Fila (Queue)</h3>
            <p className="text-sm text-muted-foreground">Configure a fila RabbitMQ (opcional)</p>
          </div>

          <FormField
            control={form.control}
            name="rabbitmq_queue_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Fila (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="whatsapp.messages" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormDescription>Deixe vazio para criar fila temporária</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="rabbitmq_queue_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo da Fila</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QUEUE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {QUEUE_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rabbitmq_routing_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Key (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="message.#" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="rabbitmq_durable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">Durable</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rabbitmq_auto_delete"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">Auto Delete</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rabbitmq_exclusive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">Exclusive</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rabbitmq_no_wait"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">No Wait</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Events Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Eventos</h3>
              <p className="text-sm text-muted-foreground">
                Selecione quais eventos serão enviados
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
            name="rabbitmq_events"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SUPPORTED_EVENTS.map((event) => (
                    <FormField
                      key={event}
                      control={form.control}
                      name="rabbitmq_events"
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
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {EVENT_LABELS[event]}
                            </FormLabel>
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

        {/* Performance Settings */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>Configurações de Performance</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  advancedOpen ? "transform rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="rabbitmq_delivery_mode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Modo de Entrega</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                      className="flex flex-col space-y-1"
                      disabled={isSubmitting}
                    >
                      {DELIVERY_MODES.map((mode) => (
                        <FormItem
                          key={mode.value}
                          className="flex items-start space-x-3 space-y-0 rounded-md border p-3"
                        >
                          <FormControl>
                            <RadioGroupItem value={String(mode.value)} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">
                              {mode.label}
                            </FormLabel>
                            <FormDescription className="text-xs">
                              {DELIVERY_MODE_DESCRIPTIONS[mode.value]}
                            </FormDescription>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rabbitmq_pool_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho do Pool</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Número de conexões (1-100)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rabbitmq_worker_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Workers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={200}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Workers paralelos (1-200)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rabbitmq_queue_buffer_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho do Buffer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={100}
                        max={1000000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Eventos em buffer (100-1000000)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rabbitmq_batch_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho do Batch</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Eventos por lote (1-10000)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Submit Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {canDeleteConfig && (
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
                  Remover Configuração
                </>
              )}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isDeleting} className="sm:ml-auto">
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
