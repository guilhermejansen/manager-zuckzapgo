/**
 * Form Data Types - Manager ZuckZapGo
 *
 * Tipos específicos para formulários com react-hook-form + zod.
 * Estruturas otimizadas para validação e submissão.
 *
 * @module types/forms
 */

// ============================================================================
// AUTH FORMS
// ============================================================================

/**
 * Dados do formulário de login
 */
export interface LoginFormData {
  token: string
  role: "admin" | "user"
  remember?: boolean
}

// ============================================================================
// USER FORMS
// ============================================================================

/**
 * Dados do formulário de criação de usuário
 */
export interface CreateUserFormData {
  name: string
  token: string
  webhook?: string
  events?: string
  expiration?: number

  // Proxy configuration
  proxyConfig?: {
    enabled: boolean
    proxyURL: string
  }

  // Skip filters
  skipMedia?: boolean
  skipGroups?: boolean
  skipNewsletters?: boolean
  skipBroadcasts?: boolean
  skipOwnMessages?: boolean
  echoApiMessages?: boolean
  skipCalls?: boolean

  // Call settings
  callRejectMessage?: string
  callRejectType?: string

  // S3 configuration
  s3Config?: {
    enabled: boolean
    endpoint: string
    region: string
    bucket: string
    accessKey: string
    secretKey: string
    pathStyle: boolean
    publicURL?: string
    mediaDelivery: string
    retentionDays: number
    disableACL: boolean
  }

  // RabbitMQ configuration
  rabbitmqConfig?: {
    enabled: boolean
    url: string
    exchange: string
    exchangeType: string
    queue: string
    queueType: string
    routingKey: string
    events: string
    durable: boolean
    autoDelete: boolean
    exclusive: boolean
    noWait: boolean
    deliveryMode: number
  }

  // WhatsApp configuration
  whatsappConfig?: {
    waVersion?: string
    waPlatform?: string
    waReleaseChannel?: string
    waWebSubPlatform?: string
    waOSName?: string
    waOSVersion?: string
    waDeviceName?: string
    waManufacturer?: string
    waDeviceBoard?: string
    waLocaleLanguage?: string
    waLocaleCountry?: string
    waMCC?: string
    waMNC?: string
    waConnectType?: string
    waPlatformType?: string
  }
}

/**
 * Dados do formulário de atualização de usuário
 * Similar ao CreateUserFormData, mas todos os campos são opcionais
 */
export interface UpdateUserFormData extends Partial<Omit<CreateUserFormData, "token">> {
  id: string
}

// ============================================================================
// WEBHOOK FORMS
// ============================================================================

/**
 * Dados do formulário de configuração de webhook
 */
export interface WebhookFormData {
  webhook: string
  events: string[]
}

/**
 * Dados do formulário de webhook global
 */
export interface GlobalWebhookFormData {
  enabled: boolean
  url: string
  events: string[]
  timeout?: number
  retryCount?: number
  retryDelay?: number
  maxRetryDelay?: number
  backoffFactor?: number
  maxConcurrency?: number
}

// ============================================================================
// S3 FORMS
// ============================================================================

/**
 * Dados do formulário de configuração S3
 */
export interface S3FormData {
  enabled: boolean
  endpoint: string
  region: string
  bucket: string
  accessKey: string
  secretKey: string
  pathStyle: boolean
  publicURL?: string
  mediaDelivery: "base64" | "url" | "both"
  retentionDays: number
  disableACL: boolean
}

/**
 * Dados do formulário S3 global (mesma estrutura que S3FormData)
 */
export type GlobalS3FormData = S3FormData

// ============================================================================
// RABBITMQ FORMS
// ============================================================================

/**
 * Dados do formulário de configuração RabbitMQ
 */
export interface RabbitMQFormData {
  enabled: boolean
  url: string
  exchange: string
  exchangeType: "direct" | "fanout" | "topic" | "headers"
  queue: string
  queueType: "classic" | "quorum" | "stream"
  routingKey: string
  events: string[]
  durable: boolean
  autoDelete: boolean
  exclusive: boolean
  noWait: boolean
  deliveryMode: 1 | 2
}

/**
 * Dados do formulário RabbitMQ global (mesma estrutura que RabbitMQFormData)
 */
export type GlobalRabbitMQFormData = RabbitMQFormData

// ============================================================================
// SKIP FILTERS FORMS
// ============================================================================

/**
 * Dados do formulário de filtros de eventos
 */
export interface SkipFiltersFormData {
  skipMediaDownload: boolean
  skipGroups: boolean
  skipNewsletters: boolean
  skipBroadcasts: boolean
  skipOwnMessages: boolean
  echoApiMessages: boolean
  skipCalls: boolean
}

/**
 * Dados do formulário de filtros globais (mesma estrutura que SkipFiltersFormData)
 */
export type GlobalSkipFiltersFormData = SkipFiltersFormData

// ============================================================================
// CALL SETTINGS FORMS
// ============================================================================

/**
 * Dados do formulário de configurações de chamada
 */
export interface CallSettingsFormData {
  callRejectMessage: string
  callRejectType: "busy" | "decline" | "unavailable"
}

/**
 * Dados do formulário de configurações de chamada globais (mesma estrutura que CallSettingsFormData)
 */
export type GlobalCallSettingsFormData = CallSettingsFormData

// ============================================================================
// PROXY FORMS
// ============================================================================

/**
 * Dados do formulário de configuração de proxy
 */
export interface ProxyFormData {
  enabled: boolean
  proxyURL: string
}

// ============================================================================
// MESSAGING FORMS
// ============================================================================

/**
 * Dados do formulário de envio de mensagem de texto
 */
export interface SendTextFormData {
  phone: string
  message: string
  quotedMessageId?: string
}

/**
 * Dados do formulário de envio de imagem
 */
export interface SendImageFormData {
  phone: string
  image: File | string // File para upload, string para base64/URL
  caption?: string
  quotedMessageId?: string
}

/**
 * Dados do formulário de envio de vídeo
 */
export interface SendVideoFormData {
  phone: string
  video: File | string
  caption?: string
  quotedMessageId?: string
}

/**
 * Dados do formulário de envio de áudio
 */
export interface SendAudioFormData {
  phone: string
  audio: File | string
  quotedMessageId?: string
}

/**
 * Dados do formulário de envio de documento
 */
export interface SendDocumentFormData {
  phone: string
  document: File | string
  filename: string
  mimetype?: string
  caption?: string
  quotedMessageId?: string
}

/**
 * Dados do formulário de envio de botões
 */
export interface SendButtonsFormData {
  phone: string
  message: string
  footer?: string
  buttons: Array<{
    id: string
    text: string
  }>
  quotedMessageId?: string
}

/**
 * Dados do formulário de envio de lista
 */
export interface SendListFormData {
  phone: string
  title: string
  description: string
  buttonText: string
  footer?: string
  sections: Array<{
    title: string
    rows: Array<{
      id: string
      title: string
      description?: string
    }>
  }>
  quotedMessageId?: string
}

// ============================================================================
// CONNECTION FORMS
// ============================================================================

/**
 * Dados do formulário de pareamento por telefone
 */
export interface PairPhoneFormData {
  phone: string
  showPushNotification?: boolean
}

// ============================================================================
// SEARCH & FILTER FORMS
// ============================================================================

/**
 * Dados do formulário de busca de usuários
 */
export interface SearchUsersFormData {
  query: string
  status?: "all" | "connected" | "disconnected"
  sortBy?: "name" | "created_at" | "updated_at"
  sortOrder?: "asc" | "desc"
}

/**
 * Dados do formulário de filtro de eventos
 */
export interface FilterEventsFormData {
  eventType?: string
  dateFrom?: Date
  dateTo?: Date
  userId?: string
}

// ============================================================================
// ADMIN FORMS
// ============================================================================

/**
 * Dados do formulário de teste de sistema global
 */
export interface GlobalTestFormData {
  testWebhook: boolean
  testRabbitMQ: boolean
  testS3: boolean
}

/**
 * Dados do formulário de envio de evento de teste
 */
export interface SendTestEventFormData {
  eventType: string
  userId: string
  userToken?: string
  data?: Record<string, unknown>
}

// ============================================================================
// UTILITY TYPES FOR FORMS
// ============================================================================

/**
 * Estado de validação de campo
 */
export interface FieldValidation {
  isValid: boolean
  error?: string
}

/**
 * Estado completo de formulário
 */
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
  touchedFields: Partial<Record<keyof T, boolean>>
}

/**
 * Opções de campo select
 */
export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
}

/**
 * Opções de campo checkbox/radio
 */
export interface CheckboxOption {
  id: string
  label: string
  value: string
  checked?: boolean
  disabled?: boolean
}
