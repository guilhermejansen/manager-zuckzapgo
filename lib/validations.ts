// Manager ZuckZapGo - Zod Validation Schemas
import { z } from "zod"

import { SUPPORTED_EVENTS } from "@/types"

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  token: z.string().min(10, "Token deve ter no mínimo 10 caracteres").max(500, "Token muito longo"),
  role: z.enum(["admin", "user"]),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ============================================================================
// INSTANCE SCHEMAS
// ============================================================================

export const createInstanceSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Use apenas letras, números, _ e -"),
  webhook_url: z.string().url("URL inválida").optional().or(z.literal("")),
  webhook_events: z.array(z.enum(SUPPORTED_EVENTS as unknown as [string, ...string[]])).optional(),
})

export type CreateInstanceFormData = z.infer<typeof createInstanceSchema>

export const updateInstanceNameSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
})

// ============================================================================
// WEBHOOK SCHEMAS
// ============================================================================

export const webhookConfigSchema = z.object({
  webhook_url: z.string().url("URL do webhook inválida").min(1, "URL do webhook é obrigatória"),
  webhook_events: z
    .array(z.enum(SUPPORTED_EVENTS as unknown as [string, ...string[]]))
    .min(1, "Selecione pelo menos um evento"),
  webhook_timeout: z
    .number()
    .int()
    .min(1000, "Timeout mínimo: 1000ms")
    .max(60000, "Timeout máximo: 60000ms")
    .optional()
    .default(30000),
  webhook_max_retries: z
    .number()
    .int()
    .min(0, "Mínimo: 0 tentativas")
    .max(10, "Máximo: 10 tentativas")
    .optional()
    .default(3),
  webhook_retry_delay: z
    .number()
    .int()
    .min(100, "Delay mínimo: 100ms")
    .max(30000, "Delay máximo: 30000ms")
    .optional()
    .default(1000),
  webhook_backoff_factor: z
    .number()
    .min(1, "Fator mínimo: 1")
    .max(5, "Fator máximo: 5")
    .optional()
    .default(2),
})

export type WebhookConfigFormData = z.infer<typeof webhookConfigSchema>

// ============================================================================
// S3 SCHEMAS
// ============================================================================

export const s3ConfigSchema = z.object({
  s3_endpoint: z.string().url("URL do endpoint S3 inválida").min(1, "Endpoint é obrigatório"),
  s3_region: z
    .string()
    .min(2, "Região deve ter no mínimo 2 caracteres")
    .max(50, "Região deve ter no máximo 50 caracteres"),
  s3_bucket: z
    .string()
    .min(3, "Nome do bucket deve ter no mínimo 3 caracteres")
    .max(63, "Nome do bucket deve ter no máximo 63 caracteres")
    .regex(
      /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/,
      "Nome do bucket inválido (apenas letras minúsculas, números, . e -)"
    ),
  s3_access_key: z.string().min(1, "Access Key é obrigatória").max(128, "Access Key muito longa"),
  s3_secret_key: z.string().min(1, "Secret Key é obrigatória").max(128, "Secret Key muito longa"),
  s3_public_url: z.string().url("URL pública inválida").optional().or(z.literal("")),
  s3_path_style: z.boolean().optional().default(false),
  s3_media_delivery: z.enum(["base64", "s3", "both"]).optional().default("base64"),
  s3_retention_days: z
    .number()
    .int()
    .min(0, "Retenção mínima: 0 dias (sem expiração)")
    .max(3650, "Retenção máxima: 3650 dias (10 anos)")
    .optional()
    .default(0),
  s3_disable_acl: z.boolean().optional().default(true),
})

export type S3ConfigFormData = z.infer<typeof s3ConfigSchema>

// ============================================================================
// RABBITMQ SCHEMAS
// ============================================================================

export const rabbitmqConfigSchema = z.object({
  rabbitmq_url: z
    .string()
    .regex(/^amqps?:\/\/.+/, "URL deve começar com amqp:// ou amqps://")
    .min(1, "URL do RabbitMQ é obrigatória"),
  rabbitmq_exchange_name: z
    .string()
    .min(1, "Nome da exchange é obrigatório")
    .max(255, "Nome da exchange muito longo"),
  rabbitmq_exchange_type: z.enum(["direct", "fanout", "topic", "headers"]).default("topic"),
  rabbitmq_queue_name: z
    .string()
    .max(255, "Nome da queue muito longo")
    .optional()
    .or(z.literal("")),
  rabbitmq_queue_type: z.enum(["classic", "quorum", "stream"]).optional().default("classic"),
  rabbitmq_routing_key: z.string().max(255, "Routing key muito longo").optional().or(z.literal("")),
  rabbitmq_durable: z.boolean().optional().default(true),
  rabbitmq_auto_delete: z.boolean().optional().default(false),
  rabbitmq_exclusive: z.boolean().optional().default(false),
  rabbitmq_no_wait: z.boolean().optional().default(false),
  rabbitmq_delivery_mode: z
    .enum(["1", "2"])
    .transform((val) => parseInt(val) as 1 | 2)
    .optional()
    .default("2" as any),
  rabbitmq_events: z
    .array(z.enum(SUPPORTED_EVENTS as unknown as [string, ...string[]]))
    .min(1, "Selecione pelo menos um evento"),
  rabbitmq_pool_size: z
    .number()
    .int()
    .min(1, "Pool mínimo: 1 conexão")
    .max(100, "Pool máximo: 100 conexões")
    .optional()
    .default(10),
  rabbitmq_worker_count: z
    .number()
    .int()
    .min(1, "Mínimo: 1 worker")
    .max(200, "Máximo: 200 workers")
    .optional()
    .default(50),
  rabbitmq_queue_buffer_size: z
    .number()
    .int()
    .min(100, "Buffer mínimo: 100 eventos")
    .max(1000000, "Buffer máximo: 1000000 eventos")
    .optional()
    .default(10000),
  rabbitmq_batch_size: z
    .number()
    .int()
    .min(1, "Batch mínimo: 1 evento")
    .max(10000, "Batch máximo: 10000 eventos")
    .optional()
    .default(100),
})

export type RabbitMQConfigFormData = z.infer<typeof rabbitmqConfigSchema>

// ============================================================================
// SKIP FILTERS SCHEMAS
// ============================================================================

export const skipFiltersSchema = z.object({
  skip_media_download: z.boolean().optional().default(false),
  skip_groups: z.boolean().optional().default(false),
  skip_newsletters: z.boolean().optional().default(false),
  skip_broadcasts: z.boolean().optional().default(false),
  skip_own_messages: z.boolean().optional().default(false),
  skip_calls: z.boolean().optional().default(false),
})

export type SkipFiltersFormData = z.infer<typeof skipFiltersSchema>

// ============================================================================
// CALL SETTINGS SCHEMAS
// ============================================================================

export const callSettingsSchema = z.object({
  call_auto_reject: z.boolean().default(false),
  call_reject_message: z
    .string()
    .max(500, "Mensagem deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  call_reject_type: z.enum(["busy", "declined", "unavailable"]).default("busy"),
})

export type CallSettingsFormData = z.infer<typeof callSettingsSchema>

// ============================================================================
// PROXY SCHEMAS
// ============================================================================

export const proxyConfigSchema = z.object({
  proxy_url: z
    .string()
    .url("URL do proxy inválida")
    .regex(/^(http|https|socks4|socks5):\/\/.+/, "Protocolo deve ser http, https, socks4 ou socks5")
    .optional()
    .or(z.literal("")),
})

export type ProxyConfigFormData = z.infer<typeof proxyConfigSchema>

// ============================================================================
// PAIRING SCHEMAS
// ============================================================================

export const pairPhoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\d{10,15}$/, "Número inválido (10-15 dígitos, sem formatação)")
    .min(10, "Número deve ter no mínimo 10 dígitos")
    .max(15, "Número deve ter no máximo 15 dígitos"),
  show_push_notification: z.boolean().optional().default(true),
})

export type PairPhoneFormData = z.infer<typeof pairPhoneSchema>

// ============================================================================
// WIZARD COMPLETO - CREATE INSTANCE
// ============================================================================

/**
 * Schema completo do wizard de criação de instância
 * Agrupa todos os steps em um único schema com validações condicionais
 */
export const createInstanceWizardSchema = z.object({
  // Step 1: Informações Básicas (OBRIGATÓRIO)
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Use apenas letras, números, _ e -"),
  token: z.string().min(10, "Token deve ter no mínimo 10 caracteres").max(500, "Token muito longo"),

  // Step 2: Webhook (OPCIONAL)
  webhook: z.object({
    webhook: z.string().optional().default(""),
    events: z.array(z.string()).default([]),
    // Advanced Configuration (Optional)
    timeout: z.number().int().min(1000).max(60000).default(60000),
    maxRetries: z.number().int().min(0).max(10).default(3),
    retryDelay: z.number().int().min(100).max(30000).default(1000),
    backoffFactor: z.number().min(1).max(5).default(2),
  }),

  // Step 3: RabbitMQ (OPCIONAL)
  rabbitmqConfig: z.object({
    enabled: z.boolean().default(false),
    url: z.string().default(""),
    exchange: z.string().default("whatsapp.events"),
    exchangeType: z.enum(["direct", "fanout", "topic", "headers"]).default("topic"),
    queue: z.string().default("whatsapp.user.{user_id}"),
    queueType: z.enum(["classic", "quorum", "stream"]).default("classic"),
    routingKey: z.string().default("whatsapp.{event_type}"),
    events: z.array(z.string()).default([]),
    durable: z.boolean().default(true),
    autoDelete: z.boolean().default(false),
    exclusive: z.boolean().default(false),
    noWait: z.boolean().default(false),
    deliveryMode: z.number().int().min(1).max(2).default(2),
    // Advanced Performance Configuration (Optional)
    poolSize: z.number().int().min(1).max(100).default(10),
    workerCount: z.number().int().min(1).max(200).default(50),
    queueBufferSize: z.number().int().min(100).max(1000000).default(10000),
    batchSize: z.number().int().min(1).max(10000).default(100),
  }),

  // Step 4: S3 Storage (OPCIONAL)
  s3Config: z.object({
    enabled: z.boolean().default(false),
    endpoint: z.string().default(""),
    region: z.string().default("us-east-1"),
    bucket: z.string().default(""),
    accessKey: z.string().default(""),
    secretKey: z.string().default(""),
    pathStyle: z.boolean().default(true),
    publicURL: z.string().default(""),
    mediaDelivery: z.enum(["base64", "url", "both"]).default("both"),
    retentionDays: z.number().int().min(0).max(3650).default(30),
    disableACL: z.boolean().default(true),
  }),

  // Step 5: Filtros & Call Settings (OPCIONAL)
  skipMedia: z.boolean().default(false),
  skipGroups: z.boolean().default(false),
  skipNewsletters: z.boolean().default(false),
  skipBroadcasts: z.boolean().default(false),
  skipOwnMessages: z.boolean().default(false),
  skipCalls: z.boolean().default(false),
  echoApiMessages: z.boolean().default(false),
  callRejectMessage: z
    .string()
    .max(500, "Mensagem muito longa")
    .default("Sorry, I cannot take calls at the moment. Please send a message."),
  callRejectType: z.enum(["busy", "decline", "unavailable"]).default("busy"),

  // Step 6: Proxy (OPCIONAL)
  proxyConfig: z.object({
    enabled: z.boolean().default(false),
    proxyURL: z.string().default(""),
  }),

  // Step 7: WhatsApp Advanced Config (OPCIONAL)
  whatsappConfig: z.object({
    waVersion: z.string().default(""),
    waPlatform: z.string().default(""),
    waReleaseChannel: z.string().default(""),
    waWebSubPlatform: z.string().default(""),
    waOSName: z.string().default(""),
    waOSVersion: z.string().default(""),
    waDeviceName: z.string().default(""),
    waManufacturer: z.string().default(""),
    waDeviceBoard: z.string().default(""),
    waLocaleLanguage: z.string().default(""),
    waLocaleCountry: z.string().default(""),
    waMCC: z.string().default(""),
    waMNC: z.string().default(""),
    waConnectType: z.string().default(""),
    waPlatformType: z.string().default(""),
  }),
})

export type CreateInstanceWizardData = z.infer<typeof createInstanceWizardSchema>

/**
 * Schema parcial para Step 1 (apenas campos obrigatórios)
 */
export const step1BasicInfoSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Use apenas letras, números, _ e -"),
  token: z.string().min(10, "Token deve ter no mínimo 10 caracteres").max(500, "Token muito longo"),
})

export type Step1BasicInfoData = z.infer<typeof step1BasicInfoSchema>

// ============================================================================
// CAMPAIGN SCHEMAS
// ============================================================================

/**
 * Schema para workflow visual (React Flow)
 */
export const workflowSchema = z.object({
  metadata: z
    .object({
      version: z.string().default("1.0.0"),
      createdAt: z.string().datetime().optional(),
    })
    .default({ version: "1.0.0" }),
  nodes: z
    .array(
      z
        .object({
          id: z.string(),
          type: z.string(),
          position: z.object({
            x: z.number(),
            y: z.number(),
          }),
          data: z.object({
            label: z.string().default(""),
            active: z.boolean().default(true),
            config: z.record(z.string(), z.any()).default({}),
            inputs: z
              .array(
                z.object({
                  name: z.string(),
                  sourceNodeId: z.string(),
                  sourceOutput: z.string(),
                  required: z.boolean().default(false),
                })
              )
              .default([]),
            outputs: z
              .array(
                z.object({
                  name: z.string(),
                  description: z.string().optional(),
                })
              )
              .default([]),
          }),
        })
        .passthrough()
    )
    .default([]),
  edges: z
    .array(
      z
        .object({
          id: z.string(),
          source: z.string(),
          target: z.string(),
          sourceHandle: z.string().optional(),
          targetHandle: z.string().optional(),
          type: z.string().optional(),
          animated: z.boolean().optional(),
        })
        .passthrough()
    )
    .default([]),
  variables: z.record(z.string(), z.any()).optional(),
})

export type WorkflowFormData = z.infer<typeof workflowSchema>

/**
 * Schema para criação de campanha
 */
export const campaignSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z.string().max(1000, "Descrição muito longa").optional().or(z.literal("")),
  type: z.enum(["SINGLE", "SCHEDULED", "RECURRING"]),
  contactListId: z.string().min(1, "Lista de contatos é obrigatória"),
  workflow: workflowSchema,
  scheduledAt: z.string().datetime().optional().or(z.literal("")),
  cronExpression: z.string().max(100).optional().or(z.literal("")),
  timezone: z.string().max(100).optional().default("America/Sao_Paulo"),
  enableFallback: z.boolean().default(true),
  randomizeInstances: z.boolean().default(true),
  maxRetriesPerInstance: z.number().int().min(1).max(10).default(3),
})

export type CreateCampaignFormData = z.infer<typeof campaignSchema>

/**
 * Schema para atualização de campanha
 */
export const updateCampaignSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres")
    .optional(),
  description: z.string().max(1000, "Descrição muito longa").optional(),
  type: z.enum(["SINGLE", "SCHEDULED", "RECURRING"]).optional(),
  status: z
    .enum(["DRAFT", "SCHEDULED", "RUNNING", "PAUSED", "COMPLETED", "FAILED", "CANCELLED"])
    .optional(),
  workflow: workflowSchema.optional(),
  contactListId: z.string().min(1, "Lista de contatos é obrigatória").optional(),
  scheduledAt: z.string().datetime().optional(),
  cronExpression: z.string().max(100).optional(),
  timezone: z.string().max(100).optional(),
  enableFallback: z.boolean().optional(),
  randomizeInstances: z.boolean().optional(),
  maxRetriesPerInstance: z.number().int().min(1).max(10).optional(),
})

export type UpdateCampaignFormData = z.infer<typeof updateCampaignSchema>

/**
 * Schema para adicionar instância à campanha
 */
export const addCampaignInstanceSchema = z.object({
  instanceId: z.string().min(1, "ID da instância é obrigatório"),
  token: z.string().min(10, "Token deve ter no mínimo 10 caracteres"),
  name: z.string().max(200).optional().or(z.literal("")),
  priority: z.number().int().min(0).default(0),
  maxRetries: z.number().int().min(1).max(10).default(3),
  fallbackOrder: z.number().int().min(0).optional(),
})

export type AddCampaignInstanceFormData = z.infer<typeof addCampaignInstanceSchema>

// ============================================================================
// CONTACT LIST SCHEMAS
// ============================================================================

/**
 * Schema para criação de lista de contatos
 */
export const createContactListSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z.string().max(1000, "Descrição muito longa").optional().or(z.literal("")),
  source: z.enum(["MANUAL", "CSV", "EXCEL", "API"]),
  type: z.enum(["INDIVIDUAL", "GROUP", "CHANNEL", "STATUS"]).default("INDIVIDUAL"),
})

export type CreateContactListFormData = z.infer<typeof createContactListSchema>

/**
 * Schema para adicionar contato manualmente
 *
 * Tipos de JID suportados (baseado em whatsmeow):
 * - s.whatsapp.net: Usuários padrão
 * - lid: Usuários com LID (Hidden User Server)
 * - g.us: Grupos
 * - newsletter: Canais/Newsletters
 * - broadcast: Listas de transmissão
 * - c.us: Usuários legados (Legacy User Server)
 * - bot: Bots do WhatsApp
 * - hosted: Hosted servers
 * - hosted.lid: Hosted LID servers
 * - msgr: Messenger interop
 * - interop: General interop
 */
export const addContactSchema = z.object({
  jid: z
    .string()
    .min(1, "JID é obrigatório")
    .refine(
      (val) => {
        // Aceita tanto número puro quanto JID completo
        const numberOnly = /^[\d\w]+$/
        const fullJid =
          /^[\d\w]+@(s\.whatsapp\.net|lid|g\.us|newsletter|broadcast|c\.us|bot|hosted|hosted\.lid|msgr|interop)$/
        const statusBroadcast = /^status@broadcast$/

        return numberOnly.test(val) || fullJid.test(val) || statusBroadcast.test(val)
      },
      {
        message: "Digite apenas o número/ID. Exemplo: 5511999999999",
      }
    ),
  name: z.string().max(200).optional().or(z.literal("")),
  pushName: z.string().max(200).optional().or(z.literal("")),
  type: z.enum([
    "INDIVIDUAL", // s.whatsapp.net, c.us
    "LID", // lid
    "GROUP", // g.us
    "NEWSLETTER", // newsletter
    "BROADCAST", // broadcast
    "BOT", // bot
    "HOSTED", // hosted
    "HOSTED_LID", // hosted.lid
    "MESSENGER", // msgr
    "INTEROP", // interop
    "STATUS", // status@broadcast
  ]),
  customFields: z.record(z.string(), z.any()).optional(),
})

export type AddContactFormData = z.infer<typeof addContactSchema>

/**
 * Schema para import de contatos via CSV
 */
export const importContactsCSVSchema = z.object({
  file: z.any(), // File object
  listId: z.string().min(1, "ID da lista é obrigatório"),
  hasHeader: z.boolean().default(true),
  jidColumn: z.number().int().min(0, "Coluna do JID inválida"),
  nameColumn: z.number().int().min(0).optional(),
  delimiter: z.string().max(1).default(","),
})

export type ImportContactsCSVFormData = z.infer<typeof importContactsCSVSchema>

/**
 * Schema para import de contatos via Excel
 */
export const importContactsExcelSchema = z.object({
  file: z.any(), // File object
  listId: z.string().min(1, "ID da lista é obrigatório"),
  sheetName: z.string().optional(),
  hasHeader: z.boolean().default(true),
  jidColumn: z.string().min(1, "Coluna do JID é obrigatória"), // Ex: "A"
  nameColumn: z.string().optional(),
})

export type ImportContactsExcelFormData = z.infer<typeof importContactsExcelSchema>

/**
 * Schema para import de contatos via API ZuckZapGo
 */
export const importContactsAPISchema = z.object({
  listId: z.string().min(1, "ID da lista é obrigatório"),
  instanceId: z.string().min(1, "ID da instância é obrigatório"),
  token: z.string().min(10, "Token inválido"),
  contactType: z.enum(["INDIVIDUAL", "GROUP", "CHANNEL", "STATUS"]).default("INDIVIDUAL"),
  includeGroups: z.boolean().default(false),
  includeChannels: z.boolean().default(false),
})

export type ImportContactsAPIFormData = z.infer<typeof importContactsAPISchema>

// ============================================================================
// CAMPAIGN MESSAGE SCHEMAS
// ============================================================================

/**
 * Schema para adicionar mensagem ao workflow
 */
export const addCampaignMessageSchema = z.object({
  nodeId: z.string().min(1, "Node ID é obrigatório"),
  order: z.number().int().min(0),
  type: z.enum(["TEXT", "MEDIA", "TEMPLATE", "INTERACTIVE", "LOCATION", "CONTACT", "REACTION"]),
  content: z.any(), // JSON content específico por tipo
  delayMs: z.number().int().min(0).default(0),
})

export type AddCampaignMessageFormData = z.infer<typeof addCampaignMessageSchema>
