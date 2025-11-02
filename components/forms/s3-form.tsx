"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Copy, Eye, EyeOff, Loader2, TestTube2, Trash2 } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { sessionApi } from "@/lib/api"
import { type S3ConfigFormData, s3ConfigSchema } from "@/lib/validations"
import { MEDIA_DELIVERY_DESCRIPTIONS, MEDIA_DELIVERY_LABELS, MEDIA_DELIVERY_MODES } from "@/types"

interface S3FormProps {
  initialValues?: Partial<S3ConfigFormData>
  onSuccess?: () => void
  onError?: (error: Error) => void
  instanceToken?: string
}

export function S3Form({ initialValues, onSuccess, onError, instanceToken }: S3FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [copiedAccessKey, setCopiedAccessKey] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const canDeleteConfig = Boolean(
    instanceToken ||
      initialValues?.s3_endpoint ||
      initialValues?.s3_bucket ||
      initialValues?.s3_access_key
  )

  const form = useForm<S3ConfigFormData>({
    resolver: zodResolver(s3ConfigSchema) as any,
    defaultValues: {
      s3_endpoint: initialValues?.s3_endpoint || "",
      s3_region: initialValues?.s3_region || "us-east-1",
      s3_bucket: initialValues?.s3_bucket || "",
      s3_access_key: initialValues?.s3_access_key || "",
      s3_secret_key: initialValues?.s3_secret_key || "",
      s3_public_url: initialValues?.s3_public_url || "",
      s3_path_style: initialValues?.s3_path_style || false,
      s3_media_delivery: initialValues?.s3_media_delivery || "base64",
      s3_retention_days: initialValues?.s3_retention_days || 0,
      s3_disable_acl: initialValues?.s3_disable_acl ?? true,
    },
  })

  const handleTestConnection = async () => {
    const values = form.getValues()

    if (
      !values.s3_endpoint ||
      !values.s3_bucket ||
      !values.s3_access_key ||
      !values.s3_secret_key
    ) {
      toast.error("Preencha todos os campos obrigatórios antes de testar")
      return
    }

    setIsTesting(true)
    try {
      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await sessionApi.s3.test(requestOptions)
      toast.success("Conexão S3 testada com sucesso!")
    } catch (error: any) {
      toast.error(error.getUserMessage?.() || "Erro ao testar conexão S3")
    } finally {
      setIsTesting(false)
    }
  }

  const handleCopyAccessKey = async () => {
    const accessKey = form.getValues("s3_access_key")
    if (accessKey) {
      await navigator.clipboard.writeText(accessKey)
      setCopiedAccessKey(true)
      toast.success("Access Key copiada!")
      setTimeout(() => setCopiedAccessKey(false), 2000)
    }
  }

  async function onSubmit(data: S3ConfigFormData) {
    setIsSubmitting(true)
    try {
      const payload = {
        enabled: true,
        endpoint: data.s3_endpoint,
        region: data.s3_region,
        bucket: data.s3_bucket,
        access_key: data.s3_access_key,
        secret_key: data.s3_secret_key,
        path_style: data.s3_path_style,
        public_url: data.s3_public_url || "",
        media_delivery: data.s3_media_delivery,
        retention_days: data.s3_retention_days,
        disable_acl: data.s3_disable_acl,
      }

      const requestOptions = instanceToken ? { token: instanceToken } : undefined

      await sessionApi.s3.set(payload as any, requestOptions)
      toast.success("Configuração S3 salva com sucesso!")
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error.getUserMessage?.() || error.message || "Erro ao salvar configuração S3"
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
        "Remover configuração S3? Mídias voltarão a ser entregues como base64."
      )
      if (!confirmed) {
        return
      }
    }

    setIsDeleting(true)
    try {
      const requestOptions = instanceToken ? { token: instanceToken } : undefined
      await sessionApi.s3.delete(requestOptions)
      toast.success("Configuração S3 removida com sucesso!")
      form.reset({
        s3_endpoint: "",
        s3_region: "us-east-1",
        s3_bucket: "",
        s3_access_key: "",
        s3_secret_key: "",
        s3_public_url: "",
        s3_path_style: false,
        s3_media_delivery: "base64",
        s3_retention_days: 0,
        s3_disable_acl: true,
      })
      onSuccess?.()
    } catch (error: any) {
      const errorMessage =
        error.getUserMessage?.() || error.message || "Erro ao remover configuração S3"
      toast.error(errorMessage)
      onError?.(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Connection Settings */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Configuração de Conexão</h3>
            <p className="text-sm text-muted-foreground">
              Configure os dados de acesso ao S3/MinIO
            </p>
          </div>

          <FormField
            control={form.control}
            name="s3_endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint S3</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://s3.amazonaws.com ou https://minio.exemplo.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>URL do servidor S3 (AWS ou compatível como MinIO)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="s3_region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Região</FormLabel>
                  <FormControl>
                    <Input placeholder="us-east-1" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>Região AWS ou equivalente</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="s3_bucket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Bucket</FormLabel>
                  <FormControl>
                    <Input placeholder="meu-bucket" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>Nome do bucket onde as mídias serão armazenadas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="s3_path_style"
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
                  <FormLabel>Usar Path Style</FormLabel>
                  <FormDescription>
                    Necessário para MinIO e alguns provedores S3 alternativos
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Authentication */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Autenticação</h3>
            <p className="text-sm text-muted-foreground">Credenciais de acesso ao S3</p>
          </div>

          <FormField
            control={form.control}
            name="s3_access_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Key</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="AKIA..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleCopyAccessKey}
                    disabled={!field.value}
                  >
                    {copiedAccessKey ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="s3_secret_key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Key</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      type={showSecretKey ? "text" : "password"}
                      placeholder="••••••••••••••••••••"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="s3_public_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Pública (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://cdn.exemplo.com"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>URL CDN alternativa para acesso às mídias</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Delivery Configuration */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Entrega de Mídia</h3>
            <p className="text-sm text-muted-foreground">
              Como as mídias serão entregues nos eventos
            </p>
          </div>

          <FormField
            control={form.control}
            name="s3_media_delivery"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Modo de Entrega</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                    disabled={isSubmitting}
                  >
                    {MEDIA_DELIVERY_MODES.map((mode) => (
                      <FormItem
                        key={mode}
                        className="flex items-start space-x-3 space-y-0 rounded-md border p-3"
                      >
                        <FormControl>
                          <RadioGroupItem value={mode} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium cursor-pointer">
                            {MEDIA_DELIVERY_LABELS[mode]}
                          </FormLabel>
                          <FormDescription className="text-xs">
                            {MEDIA_DELIVERY_DESCRIPTIONS[mode]}
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

        {/* Retention & ACL */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Retenção e ACL</h3>
            <p className="text-sm text-muted-foreground">Políticas de armazenamento e permissões</p>
          </div>

          <FormField
            control={form.control}
            name="s3_retention_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dias de Retenção</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={3650}
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Dias antes de expirar as mídias (0 = sem expiração)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="s3_disable_acl"
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
                  <FormLabel>Desabilitar ACL</FormLabel>
                  <FormDescription>
                    Recomendado para AWS S3 com "Bucket owner enforced" habilitado
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {canDeleteConfig && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting || isTesting}
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting || isSubmitting || isDeleting}
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
            <Button type="submit" disabled={isSubmitting || isDeleting} className="sm:ml-2">
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
        </div>
      </form>
    </Form>
  )
}
