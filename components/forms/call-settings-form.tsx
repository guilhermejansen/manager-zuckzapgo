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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { sessionApi } from "@/lib/api"
import { type CallSettingsFormData, callSettingsSchema } from "@/lib/validations"

interface CallSettingsFormProps {
  initialValues?: Partial<CallSettingsFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  instanceToken?: string
}

export function CallSettingsForm({
  initialValues,
  onSuccess,
  onError,
  instanceToken,
}: CallSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const rawInitial = initialValues as any
  const defaultAutoReject = initialValues?.call_auto_reject ?? rawInitial?.skip_calls ?? false
  const defaultMessage = initialValues?.call_reject_message ?? rawInitial?.call_reject_message ?? ""
  const defaultTypeRaw = initialValues?.call_reject_type ?? rawInitial?.call_reject_type ?? "busy"
  const defaultType =
    defaultTypeRaw === "busy" || defaultTypeRaw === "declined" || defaultTypeRaw === "unavailable"
      ? (defaultTypeRaw as "busy" | "declined" | "unavailable")
      : "busy"

  const form = useForm<CallSettingsFormData>({
    resolver: zodResolver(callSettingsSchema) as any,
    defaultValues: {
      call_auto_reject: defaultAutoReject,
      call_reject_message: defaultMessage,
      call_reject_type: defaultType,
    },
  })

  const autoReject = form.watch("call_auto_reject")
  const rejectMessage = form.watch("call_reject_message")

  const rejectTypeOptions = [
    {
      value: "busy",
      label: "Ocupado",
      description: "Retorna sinal de ocupado para o chamador",
    },
    {
      value: "declined",
      label: "Chamada recusada",
      description: "Simula que o usuário rejeitou manualmente",
    },
    {
      value: "unavailable",
      label: "Indisponível",
      description: "Informa que o usuário está indisponível no momento",
    },
  ] as const

  async function onSubmit(data: CallSettingsFormData) {
    setIsSubmitting(true)
    try {
      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await sessionApi.skipFilters.calls.set(
        {
          enabled: data.call_auto_reject,
          reject_message: data.call_reject_message?.trim() || undefined,
          reject_type: data.call_reject_type,
        },
        requestOptions
      )

      toast.success("Configurações de chamada salvas com sucesso!")
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error.getUserMessage?.() || error.message || "Erro ao salvar configurações"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const messageLength = rejectMessage?.length || 0
  const maxLength = 500

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Auto Reject Toggle */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Rejeição Automática de Chamadas</h3>
            <p className="text-sm text-muted-foreground">
              Configure se deseja rejeitar chamadas automaticamente
            </p>
          </div>

          <FormField
            control={form.control}
            name="call_auto_reject"
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
                  <FormLabel>Rejeitar Chamadas Automaticamente</FormLabel>
                  <FormDescription>
                    Quando ativado, todas as chamadas recebidas serão rejeitadas automaticamente
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Conditional Settings */}
        {autoReject && (
          <>
            {/* Reject Type */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Tipo de Rejeição</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha como as chamadas serão rejeitadas
                </p>
              </div>

              <FormField
                control={form.control}
                name="call_reject_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={isSubmitting}
                      >
                        {rejectTypeOptions.map((option) => (
                          <FormItem
                            key={option.value}
                            className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
                          >
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-medium cursor-pointer">
                                {option.label}
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {option.description}
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
            </div>

            {/* Reject Message */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Mensagem de Rejeição</h3>
                <p className="text-sm text-muted-foreground">
                  Mensagem que será enviada quando uma chamada for rejeitada
                </p>
              </div>

              <FormField
                control={form.control}
                name="call_reject_message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Digite sua mensagem de rejeição de chamada..."
                        className="min-h-[100px] resize-none"
                        maxLength={maxLength}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormDescription>
                        Personalize a mensagem enviada ao rejeitar chamadas
                      </FormDescription>
                      <span
                        className={`text-xs ${
                          messageLength > maxLength * 0.9
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {messageLength}/{maxLength}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview */}
            <div className="rounded-md border p-4 bg-muted/50">
              <h4 className="text-sm font-medium mb-2">Preview do Comportamento</h4>
              <p className="text-sm text-muted-foreground">Quando uma chamada for recebida:</p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                <li>A chamada será automaticamente rejeitada</li>
                {rejectMessage && (
                  <li>
                    Uma mensagem de texto será enviada:{" "}
                    <span className="italic">"{rejectMessage}"</span>
                  </li>
                )}
                {!rejectMessage && (
                  <li className="text-muted-foreground/60">
                    Nenhuma mensagem será enviada (campo vazio)
                  </li>
                )}
              </ol>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Configurações"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
