"use client"

/**
 * Step 6: Proxy Configuration
 * Configuração completa de proxy para conexão WhatsApp
 */
import { Globe, Info, Shield } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { CreateInstanceWizardData } from "@/lib/validations"

interface ProxyStepProps {
  form: UseFormReturn<CreateInstanceWizardData>
}

export function ProxyStep({ form }: ProxyStepProps) {
  const isEnabled = form.watch("proxyConfig.enabled") || false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Configuração de Proxy
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure proxy para rotear conexões do WhatsApp através de servidor intermediário
        </p>
      </div>

      <Separator />

      {/* Enable Switch */}
      <FormField
        control={form.control}
        name="proxyConfig.enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Habilitar Proxy</FormLabel>
              <FormDescription>
                Ative para rotear conexões WhatsApp através de proxy
              </FormDescription>
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
            A configuração de proxy é <strong>opcional</strong>. Você pode pular este step e
            configurar depois se necessário.
          </AlertDescription>
        </Alert>
      )}

      {/* Configurações de Proxy (somente se habilitado) */}
      {isEnabled && (
        <>
          {/* Proxy URL */}
          <FormField
            control={form.control}
            name="proxyConfig.proxyURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proxy URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="http://proxy.example.com:8080" type="url" />
                </FormControl>
                <FormDescription>
                  URL completa do servidor proxy (suporta HTTP, HTTPS, SOCKS4, SOCKS5)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Info sobre formatos suportados */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>
                <strong>Formatos Suportados:</strong>
              </p>
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <strong>HTTP/HTTPS:</strong>
                  <p className="ml-2 text-muted-foreground">http://proxy.example.com:8080</p>
                  <p className="ml-2 text-muted-foreground">https://proxy.example.com:443</p>
                </div>
                <div>
                  <strong>SOCKS4:</strong>
                  <p className="ml-2 text-muted-foreground">socks4://proxy.example.com:1080</p>
                </div>
                <div>
                  <strong>SOCKS5:</strong>
                  <p className="ml-2 text-muted-foreground">socks5://proxy.example.com:1080</p>
                </div>
                <div>
                  <strong>Com autenticação:</strong>
                  <p className="ml-2 text-muted-foreground">
                    http://user:password@proxy.example.com:8080
                  </p>
                  <p className="ml-2 text-muted-foreground">
                    socks5://user:password@proxy.example.com:1080
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Use Cases */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>
                <strong>Quando usar Proxy:</strong>
              </p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>
                  <strong>Firewall Corporativo:</strong> Ambientes que requerem proxy para acesso
                  externo
                </li>
                <li>
                  <strong>Rotação de IP:</strong> Evitar bloqueios por múltiplas conexões do mesmo
                  IP
                </li>
                <li>
                  <strong>Localização Geográfica:</strong> Simular conexões de diferentes regiões
                </li>
                <li>
                  <strong>Segurança Adicional:</strong> Camada extra de isolamento entre servidor e
                  WhatsApp
                </li>
                <li>
                  <strong>Monitoramento:</strong> Inspecionar tráfego para debugging e auditoria
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Security Warning */}
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <p>
                <strong>Atenção:</strong> Use apenas proxies confiáveis. Proxies maliciosos podem
                interceptar suas comunicações e comprometer a segurança da conta.
              </p>
            </AlertDescription>
          </Alert>

          {/* Performance Note */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p>
                <strong>Performance:</strong> O uso de proxy pode adicionar latência às conexões.
                Certifique-se de que o servidor proxy tem boa conectividade e largura de banda
                adequada.
              </p>
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  )
}
