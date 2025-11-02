"use client"

/**
 * Step 5: Filters & Call Settings Configuration
 * Configuração completa de filtros de eventos e configurações de chamadas
 */
import { Filter, Info, Phone, PhoneOff } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Textarea } from "@/components/ui/textarea"
import { CreateInstanceWizardData } from "@/lib/validations"

interface FiltersStepProps {
  form: UseFormReturn<CreateInstanceWizardData>
}

export function FiltersStep({ form }: FiltersStepProps) {
  const skipCalls = form.watch("skipCalls") || false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Eventos
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure filtros de eventos e gerenciamento de chamadas para otimizar performance
        </p>
      </div>

      <Separator />

      {/* Skip Filters Section */}
      <div className="space-y-4">
        <h4 className="font-medium">Filtros de Eventos</h4>
        <p className="text-sm text-muted-foreground">
          Ative os filtros para ignorar eventos desnecessários e melhorar a performance
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Skip Media Download */}
          <FormField
            control={form.control}
            name="skipMedia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex-1">
                  <FormLabel className="text-base">Skip Media Download</FormLabel>
                  <FormDescription className="text-sm">
                    Não fazer download de mídias (imagens, vídeos, áudios, documentos). Apenas
                    metadados serão incluídos nos eventos.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Skip Groups */}
          <FormField
            control={form.control}
            name="skipGroups"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex-1">
                  <FormLabel className="text-base">Skip Groups</FormLabel>
                  <FormDescription className="text-sm">
                    Ignorar mensagens de grupos do WhatsApp. Processar apenas mensagens diretas.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Skip Newsletters */}
          <FormField
            control={form.control}
            name="skipNewsletters"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex-1">
                  <FormLabel className="text-base">Skip Newsletters</FormLabel>
                  <FormDescription className="text-sm">
                    Ignorar mensagens de newsletters/canais. Processar apenas mensagens diretas e
                    grupos.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Skip Broadcasts */}
          <FormField
            control={form.control}
            name="skipBroadcasts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex-1">
                  <FormLabel className="text-base">Skip Broadcasts</FormLabel>
                  <FormDescription className="text-sm">
                    Ignorar mensagens de listas de transmissão e status. Processar apenas mensagens
                    diretas, grupos e newsletters.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Skip Own Messages */}
          <FormField
            control={form.control}
            name="skipOwnMessages"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex-1">
                  <FormLabel className="text-base">Skip Own Messages</FormLabel>
                  <FormDescription className="text-sm">
                    Ignorar suas próprias mensagens enviadas (IsFromMe: true). Processar apenas
                    mensagens recebidas de outros.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Echo API Messages */}
          <FormField
            control={form.control}
            name="echoApiMessages"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4">
                <div className="space-y-0.5 flex-1">
                  <FormLabel className="text-base">Echo API Messages</FormLabel>
                  <FormDescription className="text-sm">
                    Emitir eventos para mensagens enviadas via API. Eventos incluirão{" "}
                    <code>Info.IsFromAPI: true</code>.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Call Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          <h4 className="font-medium">Configurações de Chamadas</h4>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure como lidar com chamadas recebidas do WhatsApp
        </p>

        {/* Skip Calls */}
        <FormField
          control={form.control}
          name="skipCalls"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start justify-between rounded-lg border p-4 bg-muted/50">
              <div className="space-y-0.5 flex-1">
                <FormLabel className="text-base flex items-center gap-2">
                  <PhoneOff className="h-4 w-4" />
                  Auto-Reject Calls
                </FormLabel>
                <FormDescription className="text-sm">
                  Rejeitar automaticamente todas as chamadas recebidas e enviar mensagem de resposta
                  personalizada.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Call Settings (mostrar apenas se skipCalls estiver ativo) */}
        {skipCalls && (
          <div className="space-y-4 ml-4 border-l-2 border-primary/20 pl-4">
            {/* Reject Message */}
            <FormField
              control={form.control}
              name="callRejectMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reject Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Sorry, I cannot take calls at the moment. Please send a message."
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Mensagem que será enviada ao usuário após rejeitar a chamada
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reject Type */}
            <FormField
              control={form.control}
              name="callRejectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reject Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de rejeição" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="busy">
                        <div className="flex flex-col">
                          <span className="font-medium">Busy</span>
                          <span className="text-xs text-muted-foreground">
                            Ocupado - Como se estivesse em outra chamada
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="decline">
                        <div className="flex flex-col">
                          <span className="font-medium">Decline</span>
                          <span className="text-xs text-muted-foreground">
                            Recusar - Rejeição ativa da chamada
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="unavailable">
                        <div className="flex flex-col">
                          <span className="font-medium">Unavailable</span>
                          <span className="text-xs text-muted-foreground">
                            Indisponível - Como se estivesse offline
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Como a chamada será rejeitada do ponto de vista do usuário
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Info sobre Performance */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <p>
            <strong>Performance:</strong> Ativar os filtros pode melhorar significativamente a
            performance do sistema, especialmente em ambientes com alto volume de mensagens.
          </p>
          <div className="text-xs space-y-1 mt-2">
            <p>
              • <strong>Skip Media:</strong> Economiza largura de banda e armazenamento
            </p>
            <p>
              • <strong>Skip Groups/Newsletters/Broadcasts:</strong> Reduz drasticamente o volume de
              eventos processados
            </p>
            <p>
              • <strong>Skip Own Messages:</strong> Evita processamento redundante de mensagens
              enviadas
            </p>
            <p>
              • <strong>Skip Calls:</strong> Automatiza gerenciamento de chamadas indesejadas
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Info sobre Call Settings */}
      {skipCalls && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <p>
              <strong>Nota:</strong> As chamadas serão automaticamente rejeitadas antes de tocar, e
              a mensagem configurada será enviada ao usuário. Isso é útil para automações que não
              devem receber chamadas.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
