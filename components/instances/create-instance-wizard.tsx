/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ArrowRight, Loader2, Save, SkipForward } from "lucide-react"
import { type Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { type CreateUserRequest, adminApi } from "@/lib/api"
import { formatPayload } from "@/lib/utils"
import type { CreateInstanceWizardData } from "@/lib/validations"
import { createInstanceWizardSchema } from "@/lib/validations"

import { type Step, StepIndicator } from "./step-indicator-v2"
import { AdvancedStep } from "./steps/advanced-step"
import { BasicInfoStep } from "./steps/basic-info-step"
import { ConnectionStep } from "./steps/connection-step"
import { FiltersStep } from "./steps/filters-step"
import { ProxyStep } from "./steps/proxy-step"
import { RabbitMQStep } from "./steps/rabbitmq-step"
import { S3Step } from "./steps/s3-step"
import { WebhookStep } from "./steps/webhook-step"

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

/**
 * Create Instance Wizard - Orquestrador Principal
 *
 * Wizard multi-step completo para criação de instância WhatsApp.
 * Gerencia navegação, validação e submit de todos os 9 steps.
 */

const WIZARD_STEPS: Step[] = [
  { id: 1, name: "Básico", description: "Nome e Token", optional: false },
  { id: 2, name: "Webhook", description: "Configurar webhook", optional: true },
  { id: 3, name: "RabbitMQ", description: "Fila de mensagens", optional: true },
  { id: 4, name: "S3", description: "Armazenamento", optional: true },
  { id: 5, name: "Filtros", description: "Eventos e chamadas", optional: true },
  { id: 6, name: "Proxy", description: "Configuração de proxy", optional: true },
  { id: 7, name: "Avançado", description: "WhatsApp config", optional: true },
  { id: 8, name: "Revisão", description: "Confirmar dados", optional: false },
  { id: 9, name: "Conexão", description: "QR Code ou Phone", optional: false },
]

interface CreateInstanceWizardProps {
  onSuccess?: (instanceId: string) => void
}

export function CreateInstanceWizard({ onSuccess }: CreateInstanceWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdInstanceId, setCreatedInstanceId] = useState<string | null>(null)
  const [createdInstanceToken, setCreatedInstanceToken] = useState<string | null>(null)

  const form = useForm<CreateInstanceWizardData>({
    resolver: zodResolver(createInstanceWizardSchema) as Resolver<CreateInstanceWizardData>,
    mode: "onChange",
    defaultValues: {
      name: "",
      token: "",
      webhook: {
        webhook: "",
        events: [],
        timeout: 60000,
        maxRetries: 3,
        retryDelay: 1000,
        backoffFactor: 2,
      },
      rabbitmqConfig: {
        enabled: false,
        url: "",
        exchange: "whatsapp.events",
        exchangeType: "topic",
        queue: "whatsapp.user.{user_id}",
        queueType: "classic",
        routingKey: "whatsapp.{event_type}",
        events: [],
        durable: true,
        autoDelete: false,
        exclusive: false,
        noWait: false,
        deliveryMode: 2,
        poolSize: 10,
        workerCount: 50,
        queueBufferSize: 10000,
        batchSize: 100,
      },
      s3Config: {
        enabled: false,
        endpoint: "",
        region: "us-east-1",
        bucket: "",
        accessKey: "",
        secretKey: "",
        pathStyle: false,
        publicURL: "",
        mediaDelivery: "both",
        retentionDays: 30,
        disableACL: true,
      },
      skipMedia: false,
      skipGroups: false,
      skipNewsletters: false,
      skipBroadcasts: false,
      skipOwnMessages: false,
      skipCalls: false,
      echoApiMessages: false,
      callRejectMessage: "Sorry, I cannot take calls at the moment. Please send a message.",
      callRejectType: "busy",
      proxyConfig: {
        enabled: false,
        proxyURL: "",
      },
      whatsappConfig: {
        waVersion: "",
        waPlatform: "WEB",
        waReleaseChannel: "RELEASE",
        waWebSubPlatform: "WEB_BROWSER",
        waOSName: "",
        waOSVersion: "",
        waDeviceName: "",
        waManufacturer: "",
        waDeviceBoard: "",
        waLocaleLanguage: "",
        waLocaleCountry: "",
        waMCC: "",
        waMNC: "",
        waConnectType: "WIFI_UNKNOWN",
        waPlatformType: "DESKTOP",
      },
    },
  })

  const handleStepClick = (stepId: number) => {
    if (completedSteps.includes(stepId - 1) || stepId === currentStep) {
      setCurrentStep(stepId)
    }
  }

  const handleNext = async () => {
    let isValid = true

    // Validação específica por step
    if (currentStep === 1) {
      isValid = await form.trigger(["name", "token"])
    }

    if (isValid) {
      // Marca step como completo
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep])
      }

      // Avança para próximo step
      if (currentStep < WIZARD_STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      toast.error("Corrija os erros antes de continuar")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    const step = WIZARD_STEPS[currentStep - 1]
    if (step?.optional) {
      handleNext()
    }
  }

  const handleCreateInstance = async () => {
    // Previne criação duplicada
    if (createdInstanceId) {
      console.log("⚠️ Instância já foi criada, avançando para step 9")
      setCurrentStep(9)
      return
    }

    setIsSubmitting(true)

    try {
      const data = form.getValues()

      // Formata eventos para API
      const webhookEvents =
        data.webhook.events && data.webhook.events.length > 0
          ? data.webhook.events.join(",")
          : undefined
      const rabbitmqEvents =
        data.rabbitmqConfig.enabled &&
        data.rabbitmqConfig.events &&
        data.rabbitmqConfig.events.length > 0
          ? data.rabbitmqConfig.events.join(",")
          : undefined

      // Sanitiza e formata payload removendo campos vazios
      const rawPayload: CreateUserRequest = {
        name: data.name,
        token: data.token,
        webhook: data.webhook.webhook || undefined,
        events: webhookEvents,
        // Webhook Advanced Configuration
        webhookTimeout: data.webhook.webhook ? data.webhook.timeout : undefined,
        webhookMaxRetries: data.webhook.webhook ? data.webhook.maxRetries : undefined,
        webhookRetryDelay: data.webhook.webhook ? data.webhook.retryDelay : undefined,
        webhookBackoffFactor: data.webhook.webhook ? data.webhook.backoffFactor : undefined,
        proxyConfig: data.proxyConfig.enabled
          ? {
              enabled: true,
              proxyURL: data.proxyConfig.proxyURL,
            }
          : undefined,
        s3Config: data.s3Config.enabled
          ? {
              enabled: true,
              endpoint: data.s3Config.endpoint,
              region: data.s3Config.region,
              bucket: data.s3Config.bucket,
              accessKey: data.s3Config.accessKey,
              secretKey: data.s3Config.secretKey,
              pathStyle: data.s3Config.pathStyle,
              publicURL: data.s3Config.publicURL || undefined,
              mediaDelivery: data.s3Config.mediaDelivery,
              retentionDays: data.s3Config.retentionDays,
              disableACL: data.s3Config.disableACL,
            }
          : undefined,
        rabbitmqConfig: data.rabbitmqConfig.enabled
          ? {
              enabled: true,
              url: data.rabbitmqConfig.url,
              exchange: data.rabbitmqConfig.exchange,
              exchange_type: data.rabbitmqConfig.exchangeType,
              queue: data.rabbitmqConfig.queue,
              queue_type: data.rabbitmqConfig.queueType,
              routing_key: data.rabbitmqConfig.routingKey,
              events: rabbitmqEvents,
              durable: data.rabbitmqConfig.durable,
              auto_delete: data.rabbitmqConfig.autoDelete,
              exclusive: data.rabbitmqConfig.exclusive,
              no_wait: data.rabbitmqConfig.noWait,
              delivery_mode: data.rabbitmqConfig.deliveryMode,
              // Advanced Performance Configuration
              connection_pool_size: data.rabbitmqConfig.poolSize,
              worker_count: data.rabbitmqConfig.workerCount,
              queue_buffer_size: data.rabbitmqConfig.queueBufferSize,
              batch_size: data.rabbitmqConfig.batchSize,
            }
          : undefined,
        skipMedia: data.skipMedia,
        skipGroups: data.skipGroups,
        skipNewsletters: data.skipNewsletters,
        skipBroadcasts: data.skipBroadcasts,
        skipOwnMessages: data.skipOwnMessages,
        skipCalls: data.skipCalls,
        echoApiMessages: data.echoApiMessages,
        callRejectMessage: data.skipCalls ? data.callRejectMessage : undefined,
        callRejectType: data.skipCalls ? data.callRejectType : undefined,
        whatsappConfig: data.whatsappConfig.waVersion
          ? {
              waVersion: data.whatsappConfig.waVersion || undefined,
              waPlatform: data.whatsappConfig.waPlatform || undefined,
              waReleaseChannel: data.whatsappConfig.waReleaseChannel || undefined,
              waWebSubPlatform: data.whatsappConfig.waWebSubPlatform || undefined,
              waOSName: data.whatsappConfig.waOSName || undefined,
              waOSVersion: data.whatsappConfig.waOSVersion || undefined,
              waDeviceName: data.whatsappConfig.waDeviceName || undefined,
              waManufacturer: data.whatsappConfig.waManufacturer || undefined,
              waDeviceBoard: data.whatsappConfig.waDeviceBoard || undefined,
              waLocaleLanguage: data.whatsappConfig.waLocaleLanguage || undefined,
              waLocaleCountry: data.whatsappConfig.waLocaleCountry || undefined,
              waMCC: data.whatsappConfig.waMCC || undefined,
              waMNC: data.whatsappConfig.waMNC || undefined,
              waConnectType: data.whatsappConfig.waConnectType || undefined,
              waPlatformType: data.whatsappConfig.waPlatformType || undefined,
            }
          : undefined,
      }

      const payload = formatPayload<CreateUserRequest>(rawPayload)

      const response = await adminApi.users.create(payload as CreateUserRequest)

      console.log("✅ Response completa:", response)
      console.log("📦 Response.data:", response.data)

      toast.success("Instância criada com sucesso!")

      // Salva ID e token para step de conexão
      // API retorna estrutura dupla: response.data.data (não response.data)
      const createdUser = (response as any)?.data?.data ?? response ?? null
      const instanceId = createdUser?.id ?? null
      const instanceToken = createdUser?.token ?? data.token

      console.log("🆔 Instance ID extraído:", instanceId)
      console.log("🔑 Instance Token:", instanceToken)

      if (!instanceId) {
        console.error("❌ ID da instância não encontrado na resposta!")
        console.error("📦 Response completa:", JSON.stringify(response, null, 2))
        toast.error(
          "Instância criada, mas não foi possível obter o ID. Verifique a lista de instâncias."
        )
        setIsSubmitting(false)
        return
      }

      setCreatedInstanceId(instanceId)
      setCreatedInstanceToken(instanceToken)

      // Marca step 8 como completo e vai para step 9 (conexão)
      setCompletedSteps((prev) => (prev.includes(8) ? prev : [...prev, 8]))
      setCurrentStep(9)

      console.log("✅ Avançando para step 9 (Conexão)")
    } catch (error: any) {
      // Extrai mensagem de erro detalhada da resposta
      let errorMessage = "Erro ao criar instância"

      // A resposta vem em error.data.data.error (estrutura aninhada)
      if (error.data?.data?.error) {
        errorMessage = error.data.data.error
      } else if (error.data?.error) {
        errorMessage = error.data.error
      } else if (error.response?.data?.data?.error) {
        errorMessage = error.response.data.data.error
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipConnection = () => {
    if (createdInstanceId) {
      router.push(`/admin/instances/${createdInstanceId}`)
    } else {
      router.push("/admin/instances")
    }
  }

  const stepsWithCompletion = WIZARD_STEPS.map((step) => ({
    ...step,
    completed: completedSteps.includes(step.id),
  }))

  const currentStepData = WIZARD_STEPS[currentStep - 1]
  const isReviewStep = currentStep === 8
  const isConnectionStep = currentStep === 9

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <Card>
        <CardContent className="pt-6">
          <StepIndicator
            steps={stepsWithCompletion}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </CardContent>
      </Card>

      {/* Main Form */}
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Card>
            {!isConnectionStep && (
              <CardHeader>
                <CardTitle>
                  Step {currentStep}: {currentStepData?.name}
                </CardTitle>
                <CardDescription>{currentStepData?.description}</CardDescription>
              </CardHeader>
            )}
            <CardContent className="space-y-6">
              {/* Renderiza step atual */}
              {currentStep === 1 && <BasicInfoStep />}
              {currentStep === 2 && <WebhookStep form={form} />}
              {currentStep === 3 && <RabbitMQStep form={form} />}
              {currentStep === 4 && <S3Step form={form} />}
              {currentStep === 5 && <FiltersStep form={form} />}
              {currentStep === 6 && <ProxyStep form={form} />}
              {currentStep === 7 && <AdvancedStep form={form} />}
              {currentStep === 8 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Revisão das Configurações</h3>
                  <div className="rounded-lg border p-4 bg-muted/50 space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Informações Básicas</h4>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Nome:</dt>
                          <dd className="font-mono">{form.watch("name")}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Token:</dt>
                          <dd className="font-mono text-xs">
                            {form.watch("token")?.slice(0, 20)}...
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {form.watch("webhook.webhook") && (
                      <div className="pt-3 border-t">
                        <h4 className="font-medium text-sm mb-2">Webhook</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">URL:</dt>
                            <dd className="font-mono text-xs truncate max-w-xs">
                              {form.watch("webhook.webhook")}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Eventos:</dt>
                            <dd>{form.watch("webhook.events")?.length || 0} eventos</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Timeout:</dt>
                            <dd>{form.watch("webhook.timeout")}ms</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Max Retries:</dt>
                            <dd>{form.watch("webhook.maxRetries")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Retry Delay:</dt>
                            <dd>{form.watch("webhook.retryDelay")}ms</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Backoff Factor:</dt>
                            <dd>{form.watch("webhook.backoffFactor")}x</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {form.watch("rabbitmqConfig.enabled") && (
                      <div className="pt-3 border-t">
                        <h4 className="font-medium text-sm mb-2">RabbitMQ</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Exchange:</dt>
                            <dd className="font-mono text-xs">
                              {form.watch("rabbitmqConfig.exchange")}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Queue:</dt>
                            <dd className="font-mono text-xs">
                              {form.watch("rabbitmqConfig.queue")}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Eventos:</dt>
                            <dd>{form.watch("rabbitmqConfig.events")?.length || 0} eventos</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Pool Size:</dt>
                            <dd>{form.watch("rabbitmqConfig.poolSize")} conexões</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Workers:</dt>
                            <dd>{form.watch("rabbitmqConfig.workerCount")} workers</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Buffer:</dt>
                            <dd>{form.watch("rabbitmqConfig.queueBufferSize")} eventos</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Batch Size:</dt>
                            <dd>{form.watch("rabbitmqConfig.batchSize")} eventos</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {form.watch("s3Config.enabled") && (
                      <div className="pt-3 border-t">
                        <h4 className="font-medium text-sm mb-2">S3 Storage</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Bucket:</dt>
                            <dd className="font-mono text-xs">{form.watch("s3Config.bucket")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Region:</dt>
                            <dd className="font-mono text-xs">{form.watch("s3Config.region")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Delivery:</dt>
                            <dd>{form.watch("s3Config.mediaDelivery")}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {form.watch("proxyConfig.enabled") && (
                      <div className="pt-3 border-t">
                        <h4 className="font-medium text-sm mb-2">Proxy</h4>
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">URL:</dt>
                            <dd className="font-mono text-xs truncate max-w-xs">
                              {form.watch("proxyConfig.proxyURL")}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Filtros e Configurações de Chamadas */}
                    {(form.watch("skipMedia") ||
                      form.watch("skipGroups") ||
                      form.watch("skipNewsletters") ||
                      form.watch("skipBroadcasts") ||
                      form.watch("skipOwnMessages") ||
                      form.watch("skipCalls") ||
                      form.watch("echoApiMessages")) && (
                      <div className="pt-3 border-t">
                        <h4 className="font-medium text-sm mb-2">Filtros Ativos</h4>
                        <dl className="space-y-1 text-sm">
                          {form.watch("skipMedia") && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              <span>Pular download de mídia</span>
                            </div>
                          )}
                          {form.watch("skipGroups") && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              <span>Ignorar grupos</span>
                            </div>
                          )}
                          {form.watch("skipNewsletters") && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              <span>Ignorar newsletters</span>
                            </div>
                          )}
                          {form.watch("skipBroadcasts") && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              <span>Ignorar broadcasts</span>
                            </div>
                          )}
                          {form.watch("skipOwnMessages") && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              <span>Ignorar próprias mensagens</span>
                            </div>
                          )}
                          {form.watch("skipCalls") && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-orange-500" />
                              <span>Rejeitar chamadas automaticamente</span>
                            </div>
                          )}
                          {form.watch("echoApiMessages") && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              <span>Echo de mensagens enviadas via API</span>
                            </div>
                          )}
                          {form.watch("skipCalls") && form.watch("callRejectMessage") && (
                            <div className="mt-2 pt-2 border-t">
                              <dt className="text-muted-foreground text-xs mb-1">
                                Mensagem de rejeição:
                              </dt>
                              <dd className="text-xs italic">
                                "{form.watch("callRejectMessage")}"
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Revise os dados antes de criar a instância. Você poderá editar posteriormente.
                  </p>
                </div>
              )}
              {currentStep === 9 && createdInstanceId && createdInstanceToken && (
                <ConnectionStep
                  instanceId={createdInstanceId}
                  instanceToken={createdInstanceToken}
                  instanceName={form.watch("name")}
                  onConnectionSuccess={() => {
                    router.push(`/admin/instances/${createdInstanceId}`)
                  }}
                  onSkip={handleSkipConnection}
                />
              )}

              {/* Navigation Buttons - Hidden on Connection Step */}
              {!isConnectionStep && (
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex gap-2">
                    {currentStepData?.optional && !isReviewStep && (
                      <Button type="button" variant="ghost" onClick={handleSkip}>
                        <SkipForward className="h-4 w-4 mr-2" />
                        Pular
                      </Button>
                    )}

                    {isReviewStep ? (
                      <Button type="button" onClick={handleCreateInstance} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {createdInstanceId ? (
                          <>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Ir para Conexão
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Criar Instância
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                        Próximo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
