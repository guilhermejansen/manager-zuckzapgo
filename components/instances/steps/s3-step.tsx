"use client"

/**
 * Step 4: S3 Storage Configuration
 * Configuração completa de armazenamento S3 para mídia
 */
import { HardDrive, Info } from "lucide-react"
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
import { CreateInstanceWizardData } from "@/lib/validations"

interface S3StepProps {
  form: UseFormReturn<CreateInstanceWizardData>
}

export function S3Step({ form }: S3StepProps) {
  const isEnabled = form.watch("s3Config.enabled") || false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Configuração do Armazenamento S3
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configure armazenamento S3 para upload automático de mídias (imagens, vídeos, áudios,
          documentos)
        </p>
      </div>

      <Separator />

      {/* Enable Switch */}
      <FormField
        control={form.control}
        name="s3Config.enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Habilitar S3 Storage</FormLabel>
              <FormDescription>
                Ative para fazer upload automático de mídias para S3
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
            A configuração de S3 é <strong>opcional</strong>. Você pode pular este step e configurar
            depois se necessário.
          </AlertDescription>
        </Alert>
      )}

      {/* Configurações S3 (somente se habilitado) */}
      {isEnabled && (
        <>
          {/* Connection Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Credenciais de Acesso</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Endpoint */}
              <FormField
                control={form.control}
                name="s3Config.endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://s3.amazonaws.com" type="url" />
                    </FormControl>
                    <FormDescription>URL do servidor S3 (AWS, MinIO, etc.)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Region */}
              <FormField
                control={form.control}
                name="s3Config.region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="us-east-1" />
                    </FormControl>
                    <FormDescription>Região do bucket S3</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bucket */}
              <FormField
                control={form.control}
                name="s3Config.bucket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bucket Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="whatsapp-media" />
                    </FormControl>
                    <FormDescription>Nome do bucket S3</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Public URL (obrigatório) */}
              <FormField
                control={form.control}
                name="s3Config.publicURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public URL (obrigatório)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://s3.amazonaws.com" type="url" />
                    </FormControl>
                    <FormDescription>URL pública para acesso aos arquivos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Access Key */}
              <FormField
                control={form.control}
                name="s3Config.accessKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Key ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="AKIAIOSFODNN7EXAMPLE" />
                    </FormControl>
                    <FormDescription>Chave de acesso S3</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Secret Key */}
              <FormField
                control={form.control}
                name="s3Config.secretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Access Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      />
                    </FormControl>
                    <FormDescription>Chave secreta S3</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Delivery Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Configurações de Entrega</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Media Delivery */}
              <FormField
                control={form.control}
                name="s3Config.mediaDelivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media Delivery Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="base64">Base64 (incluir no evento)</SelectItem>
                        <SelectItem value="url">URL (apenas link S3)</SelectItem>
                        <SelectItem value="both">Both (Base64 + URL)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Como entregar mídia nos eventos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Retention Days */}
              <FormField
                control={form.control}
                name="s3Config.retentionDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retention Days</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="30"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Dias para reter arquivos (0 = sem expiração)</FormDescription>
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
              {/* Path Style */}
              <FormField
                control={form.control}
                name="s3Config.pathStyle"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Path Style</FormLabel>
                      <FormDescription className="text-xs">
                        Usar path-style URLs (necessário para MinIO)
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Disable ACL */}
              <FormField
                control={form.control}
                name="s3Config.disableACL"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Disable ACL</FormLabel>
                      <FormDescription className="text-xs">
                        Desabilitar ACL (requerido por alguns buckets AWS)
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

          {/* Info adicional */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>
                <strong>Estrutura de Arquivos:</strong> Os arquivos serão organizados em{" "}
                <code className="text-xs">
                  global/{"{userID}"}/{"{inbox|outbox}"}/{"{contactType}"}/{"{contactJID}"}/
                  {"{year}/{month}/{day}"}/{"{mediaType}"}/{"{filename}"}
                </code>
              </p>
              <p className="text-xs">
                Certifique-se de que o bucket tem as permissões corretas para upload (PutObject,
                GetObject).
              </p>
            </AlertDescription>
          </Alert>

          {/* Examples */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>
                <strong>Exemplos de Configuração:</strong>
              </p>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>AWS S3:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    <li>Endpoint: https://s3.amazonaws.com</li>
                    <li>Region: us-east-1, sa-east-1, etc.</li>
                    <li>Path Style: Desabilitado</li>
                    <li>Disable ACL: Habilitado (bucket ownership enforced)</li>
                  </ul>
                </div>
                <div>
                  <strong>MinIO:</strong>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    <li>Endpoint: https://minio.example.com</li>
                    <li>Region: us-east-1 (padrão)</li>
                    <li>Path Style: Habilitado</li>
                    <li>Disable ACL: Conforme configuração do servidor</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  )
}
