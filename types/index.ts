/**
 * Central Type Exports - Manager ZuckZapGo
 *
 * Ponto único de exportação para todos os tipos da aplicação.
 * Importar deste arquivo garante consistência e facilita refatoração.
 *
 * @example
 * ```typescript
 * import { User, ApiResponse, LoginFormData } from '@/types';
 * ```
 *
 * @module types
 */

// ============================================================================
// API TYPES
// ============================================================================

export type {
  // Auth & Roles
  UserRole,

  // User & Core
  User,
  SessionStatus,
  DeviceInfo,

  // Configuration
  ProxyConfig,
  S3Config,
  RabbitMQConfig,
  WhatsAppDeviceConfig,
  SkipFiltersConfig,
  CallSettingsConfig,
  SkipMediaConfigResponse,
  SkipGroupsConfigResponse,
  SkipNewslettersConfigResponse,
  SkipBroadcastsConfigResponse,
  SkipOwnMessagesConfigResponse,
  SkipCallsConfigRequest,
  SkipCallsConfigResponse,
  WebhookConfig,
  GlobalWebhook,
  GlobalRabbitMQ,
  GlobalConfiguration,
  GlobalComponentStatus,

  // Type Aliases
  MediaDeliveryMode,
  ExchangeType,
  QueueType,
  DeliveryMode,
  CallRejectType,

  // Messaging
  Message,
  MessageType,
  QuotedMessage,
  SendTextRequest,
  SendImageRequest,
  SendVideoRequest,
  SendAudioRequest,
  SendDocumentRequest,
  SendButtonsRequest,
  Button,
  SendListRequest,
  Section,
  Row,

  // Groups
  GroupInfo,
  GroupParticipant,

  // Community
  CommunityInfo,

  // QR Code & Pairing
  QRCodeResponse,
  PairPhoneRequest,
  PairPhoneResponse,

  // Stats
  GlobalStats,
  GlobalTestResult,
  GlobalTestResults,
  BufferStats,
  DispatchRule,
  DispatchRules,
  TransportStatus,
  S3Stats,
  TestResult,

  // Global Configuration
  GlobalSkipConfig,
  GlobalS3Config,

  // DLQ (Dead Letter Queue)
  DLQEvent,
  DLQStats,
  DLQListParams,
  DLQReplayParams,
  DLQDeleteParams,
  DLQReplayResponse,
  DLQDeleteResponse,
  DLQPruneResponse,

  // Event Archive
  ArchiveEvent,
  ArchiveStats,
  ArchiveListParams,
  ArchiveReplayRequest,
  ArchiveDeleteBulkRequest,
  ArchiveReplayResponse,
  ArchiveDeleteResponse,

  // Monitoring
  MonitoringEventStatus,
  MonitoringEvent,
  MonitoringEventFilter,
  MonitoringHistoryParams,
  MonitoringHistoryResponse,
  MonitoringClientInfo,
  MonitoringHubStats,
  MonitoringNotifierStats,
  MonitoringStatistics,
  MonitoringSessionTokenRequest,
  MonitoringSessionToken,
} from "./api"

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export type {
  // Generic Responses
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
  ActionResponse,
  BulkActionResponse,
  ValidationError,

  // System Responses
  HealthCheckResponse,
  TestResponse,
  BatchResponse,
} from "./responses"

// Type Guards
export { isApiError, hasData, isValidationError } from "./responses"

// ============================================================================
// HEALTH CHECK TYPES
// ============================================================================

export type { ApiHealthResponse, ApiHealthError } from "./health"

// ============================================================================
// LICENSE TYPES
// ============================================================================

export type { LicenseInfoResponse, LicenseError } from "./license"

// ============================================================================
// FORM TYPES
// ============================================================================

export type {
  // Auth Forms
  LoginFormData,

  // User Forms
  CreateUserFormData,
  UpdateUserFormData,

  // Configuration Forms
  WebhookFormData,
  GlobalWebhookFormData,
  S3FormData,
  GlobalS3FormData,
  RabbitMQFormData,
  GlobalRabbitMQFormData,
  SkipFiltersFormData,
  GlobalSkipFiltersFormData,
  CallSettingsFormData,
  GlobalCallSettingsFormData,
  ProxyFormData,

  // Messaging Forms
  SendTextFormData,
  SendImageFormData,
  SendVideoFormData,
  SendAudioFormData,
  SendDocumentFormData,
  SendButtonsFormData,
  SendListFormData,

  // Connection Forms
  PairPhoneFormData,

  // Search & Filter Forms
  SearchUsersFormData,
  FilterEventsFormData,

  // Admin Forms
  GlobalTestFormData,
  SendTestEventFormData,

  // Utility Types
  FieldValidation,
  FormState as FormStateData,
  SelectOption,
  CheckboxOption,
} from "./forms"

// ============================================================================
// UI TYPES
// ============================================================================

export type {
  // Loading States
  LoadingState,
  LoadingStateWithMessage,

  // Form States
  FormState,
  SubmitState,

  // Table Types
  DataTableColumn,
  SortConfig,
  SortDirection,
  FilterState,
  PaginationConfig,
  TableState,

  // Notification Types
  NotificationType,
  NotificationConfig,

  // Modal Types
  ModalState,
  ConfirmModalConfig,

  // Navigation Types
  BreadcrumbItem,
  SidebarItem,
  SidebarGroup,
  SidebarState,

  // Theme Types
  Theme,
  ThemeConfig,

  // Currency Types
  Currency,
  CurrencyConfig,

  // Status Types
  StatusVariant,
  StatusBadgeConfig,

  // Skeleton Types
  SkeletonVariant,
  SkeletonConfig,

  // Empty State Types
  EmptyStateConfig,

  // Error Display Types
  ErrorDisplayConfig,

  // Card Types
  StatCardConfig,

  // Command Palette Types
  CommandItem,
  CommandGroup,

  // Tab Types
  TabItem,

  // Dropdown Types
  DropdownMenuItem,
  DropdownMenuGroup,

  // Dialog Types
  DialogConfig,

  // Sheet Types
  SheetPosition,
  SheetConfig,

  // Tooltip Types
  TooltipPosition,
  TooltipConfig,

  // Alert Types
  AlertVariant,
  AlertConfig,

  // Progress Types
  ProgressConfig,

  // Avatar Types
  AvatarSize,
  AvatarConfig,

  // Utility Types
  ConditionalClass,
  ClassNameValue,
} from "./ui"

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  // Events
  SUPPORTED_EVENTS,
  EVENT_LABELS,
  EVENT_DESCRIPTIONS,
  type SupportedEvent,

  // Connection Status
  CONNECTION_STATUS,
  CONNECTION_STATUS_LABELS,
  STATUS_COLORS,
  STATUS_BADGE_VARIANTS,
  type ConnectionStatus,

  // RabbitMQ
  EXCHANGE_TYPES,
  EXCHANGE_TYPE_LABELS,
  EXCHANGE_TYPE_DESCRIPTIONS,
  QUEUE_TYPES,
  QUEUE_TYPE_LABELS,
  QUEUE_TYPE_DESCRIPTIONS,
  DELIVERY_MODES,
  DELIVERY_MODE_DESCRIPTIONS,

  // S3
  MEDIA_DELIVERY_MODES,
  MEDIA_DELIVERY_LABELS,
  MEDIA_DELIVERY_DESCRIPTIONS,
  AWS_REGIONS,

  // Call Settings
  CALL_REJECT_TYPES,
  CALL_REJECT_TYPE_LABELS,
  CALL_REJECT_TYPE_DESCRIPTIONS,

  // Message Types
  MESSAGE_TYPES,
  MESSAGE_TYPE_LABELS,
  MESSAGE_TYPE_ICONS,

  // WhatsApp Device
  WA_PLATFORMS,
  WA_RELEASE_CHANNELS,
  WA_CONNECT_TYPES,
  WA_PLATFORM_TYPES,

  // UI Configuration
  THEMES,
  THEME_LABELS,
  CURRENCIES,
  CURRENCY_LABELS,
  CURRENCY_SYMBOLS,
  ITEMS_PER_PAGE_OPTIONS,
  DEFAULT_REQUEST_TIMEOUT,
  STATUS_POLL_INTERVAL,
  TOAST_DURATION,
  MAX_UPLOAD_SIZE,

  // API
  API_BASE_PATH,
  API_ENDPOINTS,

  // Validation
  PHONE_REGEX,
  URL_REGEX,
  TOKEN_REGEX,
  JID_REGEX,

  // Errors
  ERROR_CODES,
  ERROR_MESSAGES,
  type ErrorCode,
} from "./constants"
