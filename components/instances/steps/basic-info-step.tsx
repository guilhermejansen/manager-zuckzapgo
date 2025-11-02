/**
 * Basic Info Step - Step 1
 *
 * Campos obrigatórios para criação de instância:
 * - Nome da instância
 * - Token de autenticação (com gerador aleatório)
 */

"use client"

import { useState } from "react"

import { Copy, Dices, Eye, EyeOff, Info } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { generateToken } from "@/lib/utils"

/**
 * Basic Info Step - Step 1
 *
 * Campos obrigatórios para criação de instância:
 * - Nome da instância
 * - Token de autenticação (com gerador aleatório)
 */

/**
 * Basic Info Step - Step 1
 *
 * Campos obrigatórios para criação de instância:
 * - Nome da instância
 * - Token de autenticação (com gerador aleatório)
 */

/**
 * Basic Info Step - Step 1
 *
 * Campos obrigatórios para criação de instância:
 * - Nome da instância
 * - Token de autenticação (com gerador aleatório)
 */

/**
 * Basic Info Step - Step 1
 *
 * Campos obrigatórios para criação de instância:
 * - Nome da instância
 * - Token de autenticação (com gerador aleatório)
 */

/**
 * Basic Info Step - Step 1
 *
 * Campos obrigatórios para criação de instância:
 * - Nome da instância
 * - Token de autenticação (com gerador aleatório)
 */

/**
 * Basic Info Step - Step 1
 *
 * Campos obrigatórios para criação de instância:
 * - Nome da instância
 * - Token de autenticação (com gerador aleatório)
 */

export function BasicInfoStep() {
  const form = useFormContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const [showToken, setShowToken] = useState(false)

  const handleGenerateToken = () => {
    setIsGenerating(true)
    // Pequeno delay para dar feedback visual
    setTimeout(() => {
      const newToken = generateToken(32)
      form.setValue("token", newToken, { shouldValidate: true })
      toast.success("Token gerado com sucesso!")
      setIsGenerating(false)
      // Ao gerar novo token, mantém oculto
      setShowToken(false)
    }, 300)
  }

  const handleCopyToken = async () => {
    const token = form.getValues("token")
    if (token) {
      try {
        await navigator.clipboard.writeText(token)
        toast.success("Token copiado para a área de transferência!")
      } catch {
        toast.error("Erro ao copiar token")
      }
    }
  }

  const toggleShowToken = () => {
    setShowToken(!showToken)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Informações Básicas</h2>
        <p className="text-muted-foreground mt-1">
          Configure os dados essenciais da sua nova instância WhatsApp
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Campos Obrigatórios</AlertTitle>
        <AlertDescription>
          Estes são os únicos campos obrigatórios. Você pode configurar opções avançadas (webhook,
          RabbitMQ, S3, etc.) nos próximos steps ou fazer isso depois.
        </AlertDescription>
      </Alert>

      {/* Nome da Instância */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Instância</FormLabel>
            <FormControl>
              <Input
                placeholder="minha-instancia"
                {...field}
                className="font-mono"
                autoComplete="off"
              />
            </FormControl>
            <FormDescription>
              Use apenas letras, números, underline (_) e hífen (-). Este nome será usado para
              identificar a instância.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Token de Autenticação */}
      <FormField
        control={form.control}
        name="token"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Token de Autenticação</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showToken ? "text" : "password"}
                    placeholder="Token de autenticação (mínimo 10 caracteres)"
                    {...field}
                    className="font-mono pr-20"
                    autoComplete="off"
                  />
                  {field.value && (
                    <div className="absolute right-1 top-1 flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={toggleShowToken}
                        title={showToken ? "Ocultar token" : "Mostrar token"}
                      >
                        {showToken ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleCopyToken}
                        title="Copiar token"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateToken}
                  disabled={isGenerating}
                  className="shrink-0"
                >
                  <Dices className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                  Gerar Token
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Token seguro para autenticar requisições à API. Clique em "Gerar Token" para criar um
              token aleatório de 32 caracteres.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Security Note */}
      <Alert variant="destructive" className="border-yellow-600 bg-yellow-50 dark:bg-yellow-950">
        <Info className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-900 dark:text-yellow-100">
          Guarde o Token com Segurança
        </AlertTitle>
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          O token de autenticação é como uma senha. Não compartilhe com terceiros e guarde em local
          seguro. Você precisará dele para fazer requisições à API da instância.
        </AlertDescription>
      </Alert>

      {/* Next Steps Info */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <h3 className="font-medium mb-2">Próximos Passos</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Webhook - Configure endpoint para receber eventos (opcional)</li>
          <li>• RabbitMQ - Envie eventos para fila de mensagens (opcional)</li>
          <li>• S3 Storage - Armazene mídias na nuvem (opcional)</li>
          <li>• Filtros - Escolha quais eventos processar (opcional)</li>
          <li>• Proxy - Configure proxy se necessário (opcional)</li>
        </ul>
      </div>
    </div>
  )
}
