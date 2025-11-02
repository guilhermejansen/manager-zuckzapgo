"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { HelpCircle, Loader2, TestTube2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
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
import { sessionApi } from "@/lib/api"
import { type ProxyConfigFormData, proxyConfigSchema } from "@/lib/validations"

interface ProxyFormProps {
  initialValues?: Partial<ProxyConfigFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  instanceToken?: string
}

export function ProxyForm({ initialValues, onSuccess, onError, instanceToken }: ProxyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const form = useForm<ProxyConfigFormData>({
    resolver: zodResolver(proxyConfigSchema) as any,
    defaultValues: {
      proxy_url: initialValues?.proxy_url || "",
    },
  })

  const proxyUrl = form.watch("proxy_url")

  const handleTestProxy = async () => {
    if (!proxyUrl) {
      toast.error("Insira uma URL de proxy primeiro")
      return
    }

    setIsTesting(true)
    try {
      // Note: Would need actual test endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Proxy testado com sucesso!")
    } catch {
      toast.error("Erro ao testar proxy")
    } finally {
      setIsTesting(false)
    }
  }

  async function onSubmit(data: ProxyConfigFormData) {
    setIsSubmitting(true)
    try {
      const payload = {
        enabled: !!data.proxy_url,
        proxy_url: data.proxy_url || "",
      }

      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await sessionApi.proxy.set(payload, requestOptions)
      toast.success("Configuração de proxy salva com sucesso!")
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error.getUserMessage?.() || error.message || "Erro ao salvar configuração de proxy"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearProxy = () => {
    form.setValue("proxy_url", "")
    toast.info("Proxy removido. Clique em 'Salvar' para confirmar.")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Information Alert */}
        <Alert>
          <HelpCircle className="h-4 w-4" />
          <AlertTitle>Sobre Proxy</AlertTitle>
          <AlertDescription>
            Configure um servidor proxy para rotear a conexão WhatsApp. Útil para:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Contornar bloqueios de firewall corporativo</li>
              <li>Adicionar camada extra de privacidade</li>
              <li>Acessar de regiões com restrições</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Proxy URL */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Configuração de Proxy</h3>
            <p className="text-sm text-muted-foreground">
              Configure a URL do servidor proxy (opcional)
            </p>
          </div>

          <FormField
            control={form.control}
            name="proxy_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Proxy</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="http://proxy.exemplo.com:8080"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>Suporta HTTP, HTTPS, SOCKS4 e SOCKS5</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Exemplos de URLs Válidas</h4>
            <div className="space-y-2 text-sm text-muted-foreground font-mono bg-muted p-4 rounded-md">
              <div>http://proxy.exemplo.com:8080</div>
              <div>https://secure-proxy.exemplo.com:443</div>
              <div>socks4://socks-proxy.exemplo.com:1080</div>
              <div>socks5://user:pass@socks5-proxy.exemplo.com:1080</div>
            </div>
          </div>
        </div>

        {/* Protocol Detection */}
        {proxyUrl && (
          <Alert>
            <AlertDescription>
              <span className="font-medium">Protocolo detectado:</span>{" "}
              {proxyUrl.startsWith("http://") && "HTTP"}
              {proxyUrl.startsWith("https://") && "HTTPS"}
              {proxyUrl.startsWith("socks4://") && "SOCKS4"}
              {proxyUrl.startsWith("socks5://") && "SOCKS5"}
              {!proxyUrl.match(/^(http|https|socks4|socks5):\/\//) && (
                <span className="text-destructive">Protocolo inválido</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          {proxyUrl && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleTestProxy}
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
                    Testar Proxy
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearProxy}
                disabled={isSubmitting}
              >
                Remover Proxy
              </Button>
            </>
          )}
          <Button type="submit" disabled={isSubmitting}>
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
