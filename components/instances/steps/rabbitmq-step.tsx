"use client"

/**
 * Step 3: RabbitMQ Configuration
 * Configuração completa de RabbitMQ com seleção de eventos por categoria
 */
import { AlertTriangle, CheckSquare, ChevronDown, Info, Network, Square } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CreateInstanceWizardData } from "@/lib/validations"
import { EVENT_CATEGORIES, EVENT_DESCRIPTIONS, WHATSAPP_EVENT_TYPES } from "@/types/events"

interface RabbitMQStepProps {
  form: UseFormReturn<CreateInstanceWizardData>
}

export function RabbitMQStep({ form }: RabbitMQStepProps) {
  const isEnabled = form.watch("rabbitmqConfig.enabled") || false
  const selectedEvents = form.watch("rabbitmqConfig.events") || []
  const rabbitmqUrl = form.watch("rabbitmqConfig.url")

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
      form.setValue("rabbitmqConfig.events", currentEvents)
    } else {
      form.setValue("rabbitmqConfig.events", [...currentEvents, ...(categoryEvents as string[])])
    }
  }

  // Toggle individual event
  const toggleEvent = (event: string) => {
    const currentEvents = selectedEvents
    if (currentEvents.includes(event)) {
      form.setValue(
        "rabbitmqConfig.events",
        currentEvents.filter((e) => e !== event)
      )
    } else {
      form.setValue("rabbitmqConfig.events", [...currentEvents, event])
    }
  }

  // Selecionar todos os eventos
  const selectAllEvents = () => {
    form.setValue("rabbitmqConfig.events", [...WHATSAPP_EVENT_TYPES])
  }

  // Limpar seleção
  const clearSelection = () => {
    form.setValue("rabbitmqConfig.events", [])
  }

  const isAllSelected = selectedEvents.length === WHATSAPP_EVENT_TYPES.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Network className="h-5 w-5" />
          RabbitMQ Configuration
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure RabbitMQ para publicação de eventos em filas AMQP
        </p>
      </div>

      <Separator />

      {/* Enable Switch */}
      <FormField
        control={form.control}
        name="rabbitmqConfig.enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Habilitar RabbitMQ</FormLabel>
              <FormDescription>Ative para publicar eventos em filas RabbitMQ</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Info sobre configuração opcional */}
      {!isEnabled && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            A configuração de RabbitMQ é <strong>opcional</strong>. Você pode pular este step e
            configurar depois se necessário.
          </AlertDescription>
        </Alert>
      )}

      {/* Configurações RabbitMQ (somente se habilitado) */}
      {isEnabled && (
        <>
          {/* Connection Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Configurações de Conexão</h4>

            {/* URL */}
            <FormField
              control={form.control}
              name="rabbitmqConfig.url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RabbitMQ URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="amqp://guest:guest@localhost:5672/" type="url" />
                  </FormControl>
                  <FormDescription>
                    URL de conexão AMQP completa (amqp://user:pass@host:port/)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Exchange Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Configurações de Exchange</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exchange Name */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.exchange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="whatsapp.events" />
                    </FormControl>
                    <FormDescription>Nome do exchange</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Exchange Type */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.exchangeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="direct">Direct</SelectItem>
                        <SelectItem value="fanout">Fanout</SelectItem>
                        <SelectItem value="topic">Topic</SelectItem>
                        <SelectItem value="headers">Headers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Tipo de exchange</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Queue Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Configurações de Queue</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Queue Name */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.queue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queue Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="whatsapp.user.{user_id}" />
                    </FormControl>
                    <FormDescription className="space-y-2">
                      <div>Nome da fila com suporte a placeholders dinâmicos:</div>
                      <div className="space-y-1 text-xs">
                        <div>
                          • <code className="bg-muted px-1 rounded">{"{user_id}"}</code> = ID da
                          instância
                        </div>
                        <div>
                          • <code className="bg-muted px-1 rounded">{"{event_type}"}</code> = Tipo
                          do evento
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div>
                          <strong>Exemplos:</strong>
                        </div>
                        <div>
                          1.{" "}
                          <code className="bg-muted px-1 rounded">whatsapp.user.{"{user_id}"}</code>{" "}
                          → Uma fila por instância (ex: <code>whatsapp.user.abc123</code>)
                        </div>
                        <div>
                          2.{" "}
                          <code className="bg-muted px-1 rounded">
                            whatsapp.event.{"{event_type}"}
                          </code>{" "}
                          → Uma fila por tipo de evento (ex: <code>whatsapp.event.Message</code>)
                        </div>
                        <div>
                          3.{" "}
                          <code className="bg-muted px-1 rounded">
                            whatsapp.{"{user_id}"}.{"{event_type}"}
                          </code>{" "}
                          → Ambos combinados (ex: <code>whatsapp.abc123.Message</code>)
                        </div>
                        <div>
                          4. <code className="bg-muted px-1 rounded">whatsapp.all</code> → Fila
                          estática sem placeholders
                        </div>
                      </div>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Queue Type */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.queueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queue Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="quorum">Quorum</SelectItem>
                        <SelectItem value="stream">Stream</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Tipo de fila</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Routing Key */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.routingKey"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Routing Key</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="whatsapp.{event_type}" />
                    </FormControl>
                    <FormDescription className="space-y-2">
                      <div>Chave de roteamento com suporte a placeholders dinâmicos:</div>
                      <div className="space-y-1 text-xs">
                        <div>
                          • <code className="bg-muted px-1 rounded">{"{user_id}"}</code> = ID da
                          instância
                        </div>
                        <div>
                          • <code className="bg-muted px-1 rounded">{"{event_type}"}</code> = Tipo
                          do evento
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div>
                          <strong>Exemplos:</strong>
                        </div>
                        <div>
                          1.{" "}
                          <code className="bg-muted px-1 rounded">whatsapp.{"{event_type}"}</code> →
                          Roteamento por tipo (ex: <code>whatsapp.Message</code>,{" "}
                          <code>whatsapp.Connected</code>)
                        </div>
                        <div>
                          2. <code className="bg-muted px-1 rounded">user.{"{user_id}"}</code> →
                          Roteamento por instância (ex: <code>user.abc123</code>)
                        </div>
                        <div>
                          3.{" "}
                          <code className="bg-muted px-1 rounded">
                            {"{user_id}"}.{"{event_type}"}
                          </code>{" "}
                          → Ambos combinados (ex: <code>abc123.Message</code>)
                        </div>
                        <div>
                          4. <code className="bg-muted px-1 rounded">whatsapp.all</code> → Routing
                          key estática
                        </div>
                      </div>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Opções Avançadas</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Durable */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.durable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Durable</FormLabel>
                      <FormDescription className="text-xs">
                        Recursos sobrevivem a reinicializações
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Auto Delete */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.autoDelete"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Auto Delete</FormLabel>
                      <FormDescription className="text-xs">
                        Deletar quando não usado
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Exclusive */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.exclusive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Exclusive</FormLabel>
                      <FormDescription className="text-xs">
                        Fila exclusiva desta conexão
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* No Wait */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.noWait"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>No Wait</FormLabel>
                      <FormDescription className="text-xs">Operações assíncronas</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Delivery Mode */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.deliveryMode"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Delivery Mode</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Non-Persistent (mais rápido)</SelectItem>
                        <SelectItem value="2">2 - Persistent (mais seguro)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Modo de entrega de mensagens</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Event Selection */}
          {rabbitmqUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>Eventos para RabbitMQ</FormLabel>
                  <FormDescription>Selecione quais eventos serão publicados</FormDescription>
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
                              id={`rabbitmq-${event}`}
                              checked={selectedEvents.includes(event)}
                              onCheckedChange={() => toggleEvent(event)}
                            />
                            <label
                              htmlFor={`rabbitmq-${event}`}
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
              {rabbitmqUrl && selectedEvents.length === 0 && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Você configurou RabbitMQ mas não selecionou nenhum evento. Selecione pelo menos
                    um evento.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </>
      )}

      {/* Configurações Avançadas de Performance (Opcional) */}
      {isEnabled && (
        <Collapsible className="space-y-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between">
                <span className="font-medium">
                  ⚙️ Configurações Avançadas de Performance (Opcional)
                </span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 ui-expanded:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> Altere estas configurações apenas se souber exatamente o
                que está fazendo. Valores incorretos podem causar sobrecarga ou perda de eventos.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              {/* Pool Size */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.poolSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho do Pool de Conexões</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                        placeholder="10"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Número de conexões simultâneas com RabbitMQ (padrão: 10, máx: 100)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Worker Count */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.workerCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Workers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 50)}
                        placeholder="50"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Workers concorrentes para processar eventos (padrão: 50, máx: 200)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Queue Buffer Size */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.queueBufferSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho do Buffer de Fila</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 10000)}
                        placeholder="10000"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Eventos em memória antes de envio (padrão: 10000, máx: 1000000)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Batch Size */}
              <FormField
                control={form.control}
                name="rabbitmqConfig.batchSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho do Lote (Batch)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                        placeholder="100"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Eventos enviados por lote para otimização (padrão: 100, máx: 10000)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs space-y-1">
                <p>
                  <strong>Pool Size:</strong> Mais conexões = maior throughput, mas mais recursos
                </p>
                <p>
                  <strong>Workers:</strong> Mais workers = maior paralelismo, mas maior uso de CPU
                </p>
                <p>
                  <strong>Buffer:</strong> Buffer maior = menos perdas em picos, mas mais memória
                </p>
                <p>
                  <strong>Batch:</strong> Lotes maiores = mais eficiência, mas maior latência
                </p>
              </AlertDescription>
            </Alert>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Info adicional */}
      {isEnabled && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p>
              <strong>Nota:</strong> RabbitMQ oferece alta performance e confiabilidade para
              processamento de eventos em grande escala.
            </p>
            <p className="text-xs">
              Certifique-se de que o servidor RabbitMQ está acessível e as credenciais estão
              corretas.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
