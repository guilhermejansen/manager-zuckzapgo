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
} from "@/components/ui/form"
import { sessionApi } from "@/lib/api"
import { type SkipFiltersFormData, skipFiltersSchema } from "@/lib/validations"

interface SkipFiltersFormProps {
  initialValues?: Partial<SkipFiltersFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  instanceToken?: string
}

export function SkipFiltersForm({
  initialValues,
  onSuccess,
  onError,
  instanceToken,
}: SkipFiltersFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SkipFiltersFormData>({
    resolver: zodResolver(skipFiltersSchema) as any,
    defaultValues: {
      skip_media_download: initialValues?.skip_media_download ?? false,
      skip_groups: initialValues?.skip_groups ?? false,
      skip_newsletters: initialValues?.skip_newsletters ?? false,
      skip_broadcasts: initialValues?.skip_broadcasts ?? false,
      skip_own_messages: initialValues?.skip_own_messages ?? false,
      skip_calls: initialValues?.skip_calls ?? false,
    },
  })

  const handleSkipAll = () => {
    const allChecked = Object.values(form.getValues()).every((val) => val === true)

    form.setValue("skip_media_download", !allChecked)
    form.setValue("skip_groups", !allChecked)
    form.setValue("skip_newsletters", !allChecked)
    form.setValue("skip_broadcasts", !allChecked)
    form.setValue("skip_own_messages", !allChecked)
    form.setValue("skip_calls", !allChecked)
  }

  async function onSubmit(data: SkipFiltersFormData) {
    setIsSubmitting(true)
    try {
      // Update each filter individually
      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await Promise.all([
        sessionApi.skipFilters.media.set(data.skip_media_download, requestOptions),
        sessionApi.skipFilters.groups.set(data.skip_groups, requestOptions),
        sessionApi.skipFilters.newsletters.set(data.skip_newsletters, requestOptions),
        sessionApi.skipFilters.broadcasts.set(data.skip_broadcasts, requestOptions),
        sessionApi.skipFilters.own.set(data.skip_own_messages, requestOptions),
        sessionApi.skipFilters.calls.set({ enabled: data.skip_calls }, requestOptions),
      ])

      toast.success("Filtros salvos com sucesso!")
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error.getUserMessage?.() || error.message || "Erro ao salvar filtros"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const allChecked = Object.values(form.watch()).every((val) => val === true)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header with Toggle All */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Filtros de Eventos</h3>
            <p className="text-sm text-muted-foreground">
              Configure quais eventos serão ignorados/filtrados
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSkipAll}
            disabled={isSubmitting}
          >
            {allChecked ? "Habilitar Todos" : "Ignorar Todos"}
          </Button>
        </div>

        {/* Media Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Mídia</h4>
            <FormField
              control={form.control}
              name="skip_media_download"
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
                    <FormLabel>Ignorar Download de Mídia</FormLabel>
                    <FormDescription>
                      Não faz download automático de imagens, vídeos, áudios e documentos. Economiza
                      banda e armazenamento.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Conversations Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Conversas</h4>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="skip_groups"
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
                      <FormLabel>Ignorar Grupos</FormLabel>
                      <FormDescription>Não processa mensagens de grupos WhatsApp</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skip_newsletters"
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
                      <FormLabel>Ignorar Newsletters</FormLabel>
                      <FormDescription>
                        Não processa mensagens de newsletters/canais
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skip_broadcasts"
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
                      <FormLabel>Ignorar Transmissões (Status Broadcast)</FormLabel>
                      <FormDescription>
                        Não processa mensagens de listas de transmissão
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Communication Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Comunicação</h4>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="skip_own_messages"
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
                      <FormLabel>Ignorar Próprias Mensagens</FormLabel>
                      <FormDescription>
                        Não processa mensagens enviadas por você mesmo
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skip_calls"
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
                      <FormLabel>Ignorar Chamadas</FormLabel>
                      <FormDescription>
                        Não processa eventos de chamadas de voz e vídeo
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Filtros"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
