/**
 * Core API Types - Manager ZuckZapGo
 *
 * Tipos baseados EXATAMENTE na estrutura Go `userFullStruct` do ZuckZapGo.
 * CRITICAL: Todos os nomes de campos devem corresponder à API em snake_case.
 *
 * @module types/api
 */

// ============================================================================
// AUTH & ROLES
// ============================================================================

/**
 * Papéis de usuário do sistema
 */
export type UserRole = "admin" | "user"

// ============================================================================
// USER - Estrutura completa baseada em userFullStruct (admin_handlers.go)
// ============================================================================

/**
 * Interface completa do usuário ZuckZapGo
 * Corresponde exatamente ao `userFullStruct` do Go
 */
export interface User {
  // Campos básicos
  id: string
  name: string
  token: string
  webhook: string
  jid: string
  qrcode: string
  connected: boolean
  loggedIn: boolean // Computed field do clientManager
  expiration: number
  events: string
  avatar_url?: string

  // Skip filters (filtros de eventos)
  skip_media_download: boolean
  skip_groups: boolean
  skip_newsletters: boolean
  skip_broadcasts: boolean
  skip_own_messages: boolean
  echo_api_messages: boolean
  skip_calls: boolean

  // Call settings (configurações de chamada)
  call_reject_message: string
  call_reject_type: string

  // Proxy configuration
  proxy_url?: string
  proxy_config?: ProxyConfig

  // S3 Configuration (10+ campos)
  s3_config?: S3Config

  // RabbitMQ Configuration (13+ campos)
  rabbitmq_config?: RabbitMQConfig

  // WhatsApp Device Info (15+ campos)
  whatsapp_config?: WhatsAppDeviceConfig
}

// ============================================================================
// SESSION STATUS - Status da sessão WhatsApp
// ============================================================================

/**
 * Status da conexão WhatsApp
 */
export interface SessionStatus {
  connected: boolean
  loggedIn: boolean
  jid?: string
  name?: string
  qr_code?: string
  paired: boolean
}

/**
 * Informações do dispositivo WhatsApp
 */
export interface DeviceInfo {
  wa_version?: string
  wa_platform?: string
  wa_release_channel?: string
  wa_web_sub_platform?: string
  wa_os_name?: string
  wa_os_version?: string
  wa_device_name?: string
  wa_manufacturer?: string
  wa_device_board?: string
  wa_locale_language?: string
  wa_locale_country?: string
  wa_mcc?: string
  wa_mnc?: string
  wa_connect_type?: string
  wa_platform_type?: string
}

// ============================================================================
// PROXY CONFIGURATION
// ============================================================================

/**
 * Configuração de proxy
 */
export interface ProxyConfig {
  enabled: boolean
  proxy_url: string
}

// ============================================================================
// S3 CONFIGURATION
// ============================================================================

/**
 * Configuração completa de armazenamento S3
 */
export interface S3Config {
  enabled: boolean
  endpoint: string
  region: string
  bucket: string
  access_key: string
  secret_key?: string // Opcional no frontend (não deve ser exibida)
  path_style: boolean
  public_url: string
  media_delivery: MediaDeliveryMode
  retention_days: number
  disable_acl: boolean
}

/**
 * Modos de entrega de mídia
 */
export type MediaDeliveryMode = "base64" | "s3" | "both"

// ============================================================================
// RABBITMQ CONFIGURATION
// ============================================================================

/**
 * Configuração completa de RabbitMQ
 */
export interface RabbitMQConfig {
  enabled: boolean
  url: string
  exchange: string
  exchange_type: ExchangeType
  queue: string
  queue_type: QueueType
  routing_key: string
  events: string
  durable: boolean
  auto_delete: boolean
  exclusive: boolean
  no_wait: boolean
  delivery_mode: DeliveryMode
}

/**
 * Tipos de exchange RabbitMQ
 */
export type ExchangeType = "direct" | "fanout" | "topic" | "headers"

/**
 * Tipos de fila RabbitMQ
 */
export type QueueType = "classic" | "quorum" | "stream"

/**
 * Modos de entrega RabbitMQ
 */
export type DeliveryMode = 1 | 2 // 1 = non-persistent, 2 = persistent

// ============================================================================
// WHATSAPP DEVICE CONFIGURATION
// ============================================================================

/**
 * Configuração completa do dispositivo WhatsApp
 */
export interface WhatsAppDeviceConfig {
  wa_version: string
  wa_platform: string
  wa_release_channel: string
  wa_web_sub_platform: string
  wa_os_name: string
  wa_os_version: string
  wa_device_name: string
  wa_manufacturer: string
  wa_device_board: string
  wa_locale_language: string
  wa_locale_country: string
  wa_mcc: string
  wa_mnc: string
  wa_connect_type: string
  wa_platform_type: string
}

// ============================================================================
// SKIP FILTERS CONFIGURATION
// ============================================================================

/**
 * Configuração de filtros de eventos
 */
export interface SkipFiltersConfig {
  skip_media_download: boolean
  skip_groups: boolean
  skip_newsletters: boolean
  skip_broadcasts: boolean
  skip_own_messages: boolean
  echo_api_messages: boolean
  skip_calls: boolean
}

// ============================================================================
// CALL SETTINGS CONFIGURATION
// ============================================================================

/**
 * Configuração de rejeição de chamadas
 */
export interface CallSettingsConfig {
  call_reject_message: string
  call_reject_type: CallRejectType
}

/**
 * Tipos de rejeição de chamada
 */
export type CallRejectType = "busy" | "declined" | "unavailable"

// ============================================================================
// SKIP FILTER RESPONSES (SESSION CONFIG)
// ============================================================================

export interface SkipMediaConfigResponse {
  SkipMediaDownload?: boolean
  UserSkipMediaDownload?: boolean
  GlobalSkipMediaDownload?: boolean
  Details?: string
}

export interface SkipGroupsConfigResponse {
  SkipGroups?: boolean
  UserSkipGroups?: boolean
  GlobalSkipGroups?: boolean
  Details?: string
}

export interface SkipNewslettersConfigResponse {
  SkipNewsletters?: boolean
  UserSkipNewsletters?: boolean
  GlobalSkipNewsletters?: boolean
  Details?: string
}

export interface SkipBroadcastsConfigResponse {
  SkipBroadcasts?: boolean
  UserSkipBroadcasts?: boolean
  GlobalSkipBroadcasts?: boolean
  Details?: string
}

export interface SkipOwnMessagesConfigResponse {
  SkipOwnMessages?: boolean
  UserSkipOwnMessages?: boolean
  GlobalSkipOwnMessages?: boolean
  Details?: string
}

export interface SkipCallsConfigRequest {
  enabled: boolean
  reject_message?: string
  reject_type?: CallRejectType
}

export interface SkipCallsConfigResponse {
  SkipCalls: boolean
  RejectMessage?: string
  RejectType?: CallRejectType
  Details?: string
}

// ============================================================================
// WEBHOOK CONFIGURATION
// ============================================================================

/**
 * Configuração de webhook individual (por usuário)
 */
export interface WebhookConfig {
  webhook: string
  events: string
}

/**
 * Configuração de webhook global
 */
export interface GlobalWebhook {
  enabled: boolean
  url: string
  events: string[]
  timeout: string
  retryCount: number
  retryDelay: string
  maxRetryDelay: string
  maxConcurrency: number
  backoffFactor: number
}

// ============================================================================
// GLOBAL RABBITMQ CONFIGURATION
// ============================================================================

/**
 * Configuração global de RabbitMQ
 */
export interface GlobalRabbitMQ {
  enabled: boolean
  url: string
  events: string[]
  exchange: string
  exchangeType: ExchangeType
  queue: string
  queueType: QueueType
  routingKey: string
  durable: boolean
  autoDelete: boolean
  deliveryMode: DeliveryMode
}

/**
 * Skip filters configuration
 */
export interface GlobalSkipConfig {
  callRejectMessage: string
  callRejectType: string
  skipBroadcasts: boolean
  skipCalls: boolean
  skipGroups: boolean
  skipMediaDownload: boolean
  skipNewsletters: boolean
  skipOwnMessages: boolean
}

/**
 * Global S3 configuration
 */
export interface GlobalS3Config {
  accessKey: string
  bucket: string
  disableACL: boolean
  enabled: boolean
  endpoint: string
  mediaDelivery: string
  pathStyle: boolean
  publicURL: string
  region: string
  retentionDays: number
  secretKey: string
}

/**
 * Complete global configuration from API
 */
export interface GlobalConfiguration {
  webhook: GlobalWebhook
  rabbitmq: GlobalRabbitMQ
  s3: GlobalS3Config
  skip: GlobalSkipConfig
  environment_variables: Record<string, string>
}

export interface GlobalComponentStatus {
  enabled: boolean
  success?: boolean
  error?: string | null
  [key: string]: unknown
}

// ============================================================================
// MESSAGING TYPES
// ============================================================================

/**
 * Mensagem WhatsApp
 */
export interface Message {
  id: string
  remote_jid: string
  from_me: boolean
  timestamp: number
  type: MessageType
  text?: string
  caption?: string
  url?: string
  mimetype?: string
  file_length?: number
  quoted?: QuotedMessage
}

/**
 * Tipos de mensagem suportados
 */
export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "sticker"
  | "location"
  | "contact"
  | "poll"
  | "reaction"
  | "list"
  | "buttons"

/**
 * Mensagem citada
 */
export interface QuotedMessage {
  id: string
  remote_jid: string
  from_me: boolean
  text?: string
}

// ============================================================================
// MESSAGE SENDING REQUESTS
// ============================================================================

/**
 * Request para enviar mensagem de texto
 */
export interface SendTextRequest {
  phone: string
  message: string
  quoted_message_id?: string
}

/**
 * Request para enviar imagem
 */
export interface SendImageRequest {
  phone: string
  image: string // Base64 ou URL
  caption?: string
  quoted_message_id?: string
}

/**
 * Request para enviar vídeo
 */
export interface SendVideoRequest {
  phone: string
  video: string // Base64 ou URL
  caption?: string
  quoted_message_id?: string
}

/**
 * Request para enviar áudio
 */
export interface SendAudioRequest {
  phone: string
  audio: string // Base64 ou URL
  quoted_message_id?: string
}

/**
 * Request para enviar documento
 */
export interface SendDocumentRequest {
  phone: string
  document: string // Base64 ou URL
  filename: string
  mimetype?: string
  caption?: string
  quoted_message_id?: string
}

/**
 * Request para enviar botões
 */
export interface SendButtonsRequest {
  phone: string
  message: string
  footer?: string
  buttons: Button[]
  quoted_message_id?: string
}

/**
 * Botão de mensagem
 */
export interface Button {
  id: string
  text: string
}

/**
 * Request para enviar lista
 */
export interface SendListRequest {
  phone: string
  title: string
  description: string
  button_text: string
  footer?: string
  sections: Section[]
  quoted_message_id?: string
}

/**
 * Seção de lista
 */
export interface Section {
  title: string
  rows: Row[]
}

/**
 * Linha de lista
 */
export interface Row {
  id: string
  title: string
  description?: string
}

// ============================================================================
// GROUP TYPES
// ============================================================================

/**
 * Informações de grupo WhatsApp
 */
export interface GroupInfo {
  jid: string
  name: string
  owner?: string
  subject: string
  subject_time?: number
  creation_time?: number
  participants: GroupParticipant[]
  announce?: boolean
  locked?: boolean
}

/**
 * Participante de grupo
 */
export interface GroupParticipant {
  jid: string
  is_admin: boolean
  is_super_admin: boolean
}

// ============================================================================
// COMMUNITY TYPES
// ============================================================================

/**
 * Informações de comunidade WhatsApp
 */
export interface CommunityInfo {
  jid: string
  name: string
  description?: string
  linked_groups: string[]
  creation_time?: number
}

// ============================================================================
// QR CODE TYPES
// ============================================================================

/**
 * Response de geração de QR Code
 */
export interface QRCodeResponse {
  qr_code: string
  timeout: number
}

/**
 * Request de pareamento por telefone
 */
export interface PairPhoneRequest {
  phone: string
  show_push_notification?: boolean
}

/**
 * Response de pareamento por telefone
 */
export interface PairPhoneResponse {
  success: boolean
  message: string
  code?: string
}

// ============================================================================
// STATS TYPES
// ============================================================================

/**
 * Buffer statistics from global system
 */
export interface BufferStats {
  ackFailures: number
  ackSuccess: number
  archivePruned: number
  archiveStored: number
  dequeued: number
  enabled: boolean
  enqueued: number
  pending: number
  replayed: number
  requeued: number
}

/**
 * Dispatch rule configuration for a transport
 */
export interface DispatchRule {
  allowAll: boolean
  enabled: boolean
  events: string[]
}

/**
 * All dispatch rules for global transports
 */
export interface DispatchRules {
  "global-rabbitmq": DispatchRule
  "global-redis": DispatchRule
  "global-sqs": DispatchRule
  "global-webhook": DispatchRule
  "global-websocket": DispatchRule
}

/**
 * Transport status information
 */
export interface TransportStatus {
  enabled: boolean
}

/**
 * S3 transport statistics
 */
export interface S3Stats extends TransportStatus {
  bucket: string
  endpoint: string
  hasClient: boolean
  mediaDelivery: string
  region: string
}

/**
 * Global system statistics
 */
export interface GlobalStats {
  buffer: BufferStats
  dispatchRules: DispatchRules
  enabled: boolean
  rabbitmq: TransportStatus
  redis: TransportStatus
  s3: S3Stats
  sqs: TransportStatus
  transportCount: number
  transports: string[]
  webhook: TransportStatus
  websocket: TransportStatus
}

/**
 * Test result for a single transport
 */
export interface TestResult {
  enabled: boolean
  error?: string | null
  success: boolean
  bucket?: string
  region?: string
}

/**
 * Global system test results
 */
export interface GlobalTestResults {
  rabbitmq: TestResult
  redis: TestResult
  s3: TestResult
  sqs: TestResult
  webhook: TestResult
  websocket: TestResult
}

/**
 * Resultado de testes do sistema global (legacy type)
 */
export type GlobalTestResult = Record<string, GlobalComponentStatus>

// ============================================================================
// DLQ (DEAD LETTER QUEUE) TYPES
// ============================================================================

/**
 * Dead Letter Queue Event
 * Represents a failed event that exceeded retry limits
 */
export interface DLQEvent {
  id: number
  user_id: string
  transport: string
  event_type: string
  payload: Record<string, unknown>
  attempts: number
  last_error: string
  failed_at: string
  archived_at: string
  replay_count: number
  last_replay_at?: string
}

/**
 * DLQ Statistics
 * Aggregated statistics about events in the Dead Letter Queue
 */
export interface DLQStats {
  total_count: number
  oldest_event?: string
  newest_event?: string
  by_transport: Record<string, number>
  by_event_type: Record<string, number>
}

/**
 * DLQ List Parameters
 * Query parameters for filtering and paginating DLQ events
 */
export interface DLQListParams {
  transport?: string
  user_id?: string
  event_type?: string
  from?: string
  to?: string
  limit?: number
  offset?: number
}

/**
 * DLQ Replay Parameters
 * Parameters for replaying events from DLQ back to buffer
 */
export interface DLQReplayParams {
  id?: number
  dry_run?: boolean
  remove_after?: boolean
}

/**
 * DLQ Delete Parameters
 * Parameters for bulk deletion of DLQ events
 */
export interface DLQDeleteParams {
  transport?: string
  user_id?: string
  event_type?: string
  from?: string
  to?: string
  confirm?: boolean
}

/**
 * DLQ Replay Response
 */
export interface DLQReplayResponse {
  success: boolean
  message: string
  replayed_count?: number
  failed_count?: number
  events_affected?: number[]
}

/**
 * DLQ Delete Response
 */
export interface DLQDeleteResponse {
  success: boolean
  message: string
  deleted_count: number
}

/**
 * DLQ Prune Response
 */
export interface DLQPruneResponse {
  success: boolean
  message: string
  pruner_stats?: {
    total_pruned: number
    total_archive_pruned: number
    last_prune_time: string
    next_prune_time: string
  }
}

// ============================================================================
// EVENT ARCHIVE TYPES
// ============================================================================

/**
 * Archive Event
 * Represents an archived event (DLQ or Successfully Delivered)
 */
export interface ArchiveEvent {
  id: number
  status: "dlq" | "success"
  transport: string
  user_id: string
  event_type: string
  payload: string
  attempts: number
  last_error: string | null
  created_at: string
  archived_at: string
  replay_count: number
  last_replay_at: string | null
}

/**
 * Archive Statistics
 * Comprehensive statistics about the Event Archive
 */
export interface ArchiveStats {
  total_count: number
  success_count: number
  dlq_count: number
  oldest_success: string | null
  newest_success: string | null
  oldest_dlq: string | null
  newest_dlq: string | null
  by_transport: Record<string, number>
  by_event_type: Record<string, number>
  by_status: Record<string, number>
  by_transport_status: Record<string, Record<string, number>>
}

/**
 * Archive List Parameters
 * Query parameters for filtering and paginating archive events
 */
export interface ArchiveListParams {
  status?: "" | "dlq" | "success"
  transport?: string
  user_id?: string
  event_type?: string
  from_date?: string
  to_date?: string
  limit?: number
  offset?: number
}

/**
 * Archive Replay Request
 * Parameters for replaying events from archive back to buffer
 */
export interface ArchiveReplayRequest {
  event_id?: number
  dry_run?: boolean
  status?: "" | "dlq" | "success"
  transport?: string
  user_id?: string
  event_type?: string
  limit?: number
}

/**
 * Archive Delete Bulk Request
 * Parameters for bulk deletion of archive events
 */
export interface ArchiveDeleteBulkRequest {
  status: "dlq" | "success"
  transport?: string
  user_id?: string
  event_type?: string
  limit?: number
}

/**
 * Archive Replay Response
 */
export interface ArchiveReplayResponse {
  success: boolean
  message?: string
  code?: number
  replayed?: number
  failed?: number
  total?: number
  dry_run?: boolean
  event_id?: number
  filter?: ArchiveListParams
  events?: ArchiveEvent[]
  errors?: string[]
}

/**
 * Archive Delete Response
 */
export interface ArchiveDeleteResponse {
  success: boolean
  message?: string
  code?: number
  deleted?: number
  failed?: number
  total?: number
  event_id?: number
  filter?: ArchiveListParams
  errors?: string[]
}

// ============================================================================
// MONITORING TYPES
// ============================================================================

export type MonitoringEventStatus =
  | "pending"
  | "processing"
  | "delivered"
  | "failed"
  | (string & {})

export interface MonitoringEvent {
  id: number
  user_id: string
  event_type: string
  payload: Record<string, unknown>
  status: MonitoringEventStatus
  attempts: number
  created_at: string
  updated_at: string
}

export interface MonitoringEventFilter {
  user_id?: string
  event_type?: string
  status?: MonitoringEventStatus | ""
  since_id?: number
  before_id?: number
  since_time?: string
  limit?: number
  only_failed?: boolean
}

export type MonitoringHistoryParams = Omit<MonitoringEventFilter, "since_id">

export interface MonitoringHistoryResponse {
  events: MonitoringEvent[]
  has_more: boolean
  next_id: number
  count: number
}

export interface MonitoringClientInfo {
  id: string
  session_token: string
  user_id: string
  is_admin: boolean
  connected: boolean
  connected_at: string
  last_event_id: number
  last_heartbeat: string
  connection_time: number
  filter: MonitoringEventFilter | null
}

export interface MonitoringHubStats {
  connected_clients: number
  total_events_broadcast: number
  total_events_delivered: number
  cache_hits: number
  cache_misses: number
  cache_hit_rate: number
  uptime_seconds: number
  start_time: string
  last_broadcast_at: string | null
}

export interface MonitoringNotifierStats {
  enabled: boolean
  workers: number
  queue_size: number
  queue_capacity: number
  queue_utilization: number
}

export interface MonitoringStatistics {
  hub: MonitoringHubStats
  notifier: MonitoringNotifierStats
  events: {
    by_status: Record<string, number>
    by_type: Record<string, number>
  }
  clients: MonitoringClientInfo[]
}

export interface MonitoringSessionTokenRequest {
  filters?: MonitoringEventFilter
}

export interface MonitoringSessionToken {
  session_token: string
  expires_at: string
  stream_url: string
  ttl_seconds: number
}
