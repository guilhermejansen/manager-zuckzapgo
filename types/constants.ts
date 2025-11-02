/**
 * Constants and Enums - Manager ZuckZapGo
 *
 * Constantes, enums e arrays para uso em toda aplicação.
 * Valores baseados na API ZuckZapGo e configurações do sistema.
 *
 * @module types/constants
 */

// ============================================================================
// SUPPORTED EVENTS
// ============================================================================

/**
 * Eventos suportados pelo ZuckZapGo
 * Baseado em supportedEventTypes do Go
 */
export const SUPPORTED_EVENTS = [
  // General catch-all
  "All",

  // Messages
  "Message",
  "UndecryptableMessage",
  "FBMessage",
  "Receipt",
  "MediaRetry",
  "ReadReceipt",

  // Chat management
  "Star",
  "Pin",
  "Archive",
  "Mute",
  "MarkChatAsRead",
  "ClearChat",
  "DeleteChat",
  "DeleteForMe",
  "LabelAssociationChat",
  "LabelAssociationMessage",
  "LabelEdit",

  // Groups
  "GroupInfo",
  "JoinedGroup",

  // Contacts & profiles
  "Contact",
  "Picture",
  "PushName",
  "BusinessName",
  "UserAbout",

  // Privacy & security
  "PrivacySettings",
  "IdentityChange",
  "Blocklist",
  "BlocklistChange",
  "UserStatusMute",

  // Connection & authentication
  "Connected",
  "Disconnected",
  "QR",
  "PairSuccess",
  "PairError",
  "QRScannedWithoutMultidevice",
  "LoggedOut",
  "StreamReplaced",
  "StreamError",
  "ConnectFailure",
  "KeepAliveTimeout",
  "KeepAliveRestored",
  "ManualLoginReconnect",

  // Error & ban
  "TemporaryBan",
  "ClientOutdated",
  "CATRefreshError",

  // Calls
  "CallOffer",
  "CallAccept",
  "CallPreAccept",
  "CallTransport",
  "CallTerminate",
  "CallReject",
  "CallOfferNotice",
  "CallRelayLatency",
  "UnknownCallEvent",

  // Presence
  "Presence",
  "ChatPresence",

  // Newsletter / channels
  "NewsletterJoin",
  "NewsletterLeave",
  "NewsletterMuteChange",
  "NewsletterLiveUpdate",

  // Sync & state
  "AppState",
  "AppStateSyncComplete",
  "HistorySync",
  "OfflineSyncPreview",
  "OfflineSyncCompleted",
  "PushNameSetting",
  "UnarchiveChatsSetting",
] as const

/**
 * Tipo derivado dos eventos suportados
 */
export type SupportedEvent = (typeof SUPPORTED_EVENTS)[number]

/**
 * Labels em português para os eventos
 */
export const EVENT_LABELS: Record<SupportedEvent, string> = {
  All: "Todos os Eventos (All)",

  // Messages
  Message: "Mensagens (Message)",
  UndecryptableMessage: "Mensagem Indecifrável (UndecryptableMessage)",
  FBMessage: "Mensagem Facebook/Instagram (FBMessage)",
  Receipt: "Recibos (Receipt)",
  MediaRetry: "Reintento de Mídia (MediaRetry)",
  ReadReceipt: "Recibo de Leitura (Legado) (ReadReceipt)",

  // Chat management
  Star: "Favoritar Mensagem (Star)",
  Pin: "Fixar Conversa (Pin)",
  Archive: "Arquivar Conversa (Archive)",
  Mute: "Silenciar Conversa (Mute)",
  MarkChatAsRead: "Marcar Conversa como Lida (MarkChatAsRead)",
  ClearChat: "Limpar Conversa (ClearChat)",
  DeleteChat: "Excluir Conversa (DeleteChat)",
  DeleteForMe: "Excluir só para Mim (DeleteForMe)",
  LabelAssociationChat: "Etiqueta em Conversa (LabelAssociationChat)",
  LabelAssociationMessage: "Etiqueta em Mensagem (LabelAssociationMessage)",
  LabelEdit: "Edição de Etiqueta (LabelEdit)",

  // Groups
  GroupInfo: "Informações do Grupo (GroupInfo)",
  JoinedGroup: "Entrada em Grupo (JoinedGroup)",

  // Contacts & profiles
  Contact: "Contato Atualizado (Contact)",
  Picture: "Foto de Perfil (Picture)",
  PushName: "Nome Exibido (PushName)",
  BusinessName: "Nome Comercial (BusinessName)",
  UserAbout: "Texto Sobre (UserAbout)",

  // Privacy & security
  PrivacySettings: "Privacidade (PrivacySettings)",
  IdentityChange: "Alteração de Identidade (IdentityChange)",
  Blocklist: "Lista de Bloqueio (Blocklist)",
  BlocklistChange: "Bloqueio/Desbloqueio (BlocklistChange)",
  UserStatusMute: "Silenciar Status (UserStatusMute)",

  // Connection & authentication
  Connected: "Conectado (Connected)",
  Disconnected: "Desconectado (Disconnected)",
  QR: "QR Gerado (QR)",
  PairSuccess: "Pareamento Concluído (PairSuccess)",
  PairError: "Erro no Pareamento (PairError)",
  QRScannedWithoutMultidevice: "QR sem Multidispositivo (QRScannedWithoutMultidevice)",
  LoggedOut: "Logout (LoggedOut)",
  StreamReplaced: "Fluxo Substituído (StreamReplaced)",
  StreamError: "Erro de Fluxo (StreamError)",
  ConnectFailure: "Falha de Conexão (ConnectFailure)",
  KeepAliveTimeout: "Keepalive Expirado (KeepAliveTimeout)",
  KeepAliveRestored: "Keepalive Restaurado (KeepAliveRestored)",
  ManualLoginReconnect: "Reconexão Manual (ManualLoginReconnect)",

  // Error & ban
  TemporaryBan: "Banimento Temporário (TemporaryBan)",
  ClientOutdated: "Cliente Desatualizado (ClientOutdated)",
  CATRefreshError: "Erro CAT Refresh (CATRefreshError)",

  // Calls
  CallOffer: "Chamada Recebida (CallOffer)",
  CallAccept: "Chamada Aceita (CallAccept)",
  CallPreAccept: "Pré-aceite de Chamada (CallPreAccept)",
  CallTransport: "Transporte da Chamada (CallTransport)",
  CallTerminate: "Chamada Encerrada (CallTerminate)",
  CallReject: "Chamada Recusada (CallReject)",
  CallOfferNotice: "Aviso de Chamada (CallOfferNotice)",
  CallRelayLatency: "Latência da Chamada (CallRelayLatency)",
  UnknownCallEvent: "Chamada Desconhecida (UnknownCallEvent)",

  // Presence
  Presence: "Presença Online (Presence)",
  ChatPresence: "Presença na Conversa (ChatPresence)",

  // Newsletter / channels
  NewsletterJoin: "Entrada em Newsletter (NewsletterJoin)",
  NewsletterLeave: "Saída de Newsletter (NewsletterLeave)",
  NewsletterMuteChange: "Silenciar Newsletter (NewsletterMuteChange)",
  NewsletterLiveUpdate: "Atualização ao Vivo (NewsletterLiveUpdate)",

  // Sync & state
  AppState: "Estado do App (AppState)",
  AppStateSyncComplete: "Sync de Estado Concluído (AppStateSyncComplete)",
  HistorySync: "Sincronização de Histórico (HistorySync)",
  OfflineSyncPreview: "Prévia de Sync Offline (OfflineSyncPreview)",
  OfflineSyncCompleted: "Sync Offline Concluído (OfflineSyncCompleted)",
  PushNameSetting: "Configurar Nome (PushNameSetting)",
  UnarchiveChatsSetting: "Configurar Desarquivamento (UnarchiveChatsSetting)",
} as const

/**
 * Descrições dos eventos
 */
export const EVENT_DESCRIPTIONS: Record<SupportedEvent, string> = {
  All: "Recebe todos os eventos disponíveis na plataforma.",

  // Messages
  Message: "Mensagens padrão recebidas (texto, mídia, documentos, botões).",
  UndecryptableMessage: "Mensagens recebidas que não puderam ser descriptografadas.",
  FBMessage: "Mensagens provenientes das integrações Facebook/Instagram.",
  Receipt: "Recibos de entrega, leitura e reprodução emitidos pelo WhatsApp.",
  MediaRetry: "Tentativas automáticas de baixar mídias quando o primeiro download falha.",
  ReadReceipt: "Recibos explícitos de leitura mantidos por compatibilidade.",

  // Chat management
  Star: "Quando uma mensagem é marcada ou desmarcada como favorita.",
  Pin: "Quando uma conversa é fixada ou desafixada na lista de chats.",
  Archive: "Eventos de arquivamento ou desarquivamento de conversas.",
  Mute: "Alterações no estado de silêncio de um chat individual ou em grupo.",
  MarkChatAsRead: "Quando todas as mensagens de uma conversa são marcadas como lidas.",
  ClearChat: "Limpeza local das mensagens de uma conversa.",
  DeleteChat: "Exclusão completa de uma conversa.",
  DeleteForMe: "Remoção de uma mensagem apenas para o usuário autenticado.",
  LabelAssociationChat: "Etiquetas aplicadas ou removidas de conversas.",
  LabelAssociationMessage: "Etiquetas aplicadas ou removidas de mensagens específicas.",
  LabelEdit: "Criação, edição ou remoção de etiquetas personalizadas.",

  // Groups
  GroupInfo: "Mudanças na configuração geral de um grupo (nome, descrição, foto).",
  JoinedGroup: "Confirmação de entrada ou adição do usuário a um grupo.",

  // Contacts & profiles
  Contact: "Atualizações nos dados de um contato (telefone, apelido, etc.).",
  Picture: "Alterações detectadas na foto de perfil de um contato.",
  PushName: "Quando um contato altera o nome exibido (push name).",
  BusinessName: "Atualização no nome comercial de contas business.",
  UserAbout: "Mudanças no texto de status/about do contato.",

  // Privacy & security
  PrivacySettings: "Alterações nas configurações de privacidade (visto por último, foto, etc.).",
  IdentityChange: "Quando a chave de segurança/identidade de um contato muda.",
  Blocklist: "Sincronização completa da lista de bloqueios.",
  BlocklistChange: "Entrada ou saída de contatos na lista de bloqueio.",
  UserStatusMute: "Quando status/Stories de um contato são silenciados ou reativados.",

  // Connection & authentication
  Connected: "Sessão autenticada e conectada com êxito ao WhatsApp.",
  Disconnected: "Sessão encerrada ou conexão perdida com o WhatsApp.",
  QR: "Novo QR Code gerado para pareamento do dispositivo.",
  PairSuccess: "Pareamento concluído com sucesso via QR ou código.",
  PairError: "Falha durante o processo de pareamento.",
  QRScannedWithoutMultidevice: "QR lido em conta sem multidispositivo habilitado.",
  LoggedOut: "Sessão desconectada explicitamente do WhatsApp.",
  StreamReplaced: "Sessão de WebSocket substituída por uma nova conexão.",
  StreamError: "Erros na camada de streaming/WebSocket.",
  ConnectFailure: "Tentativa de conexão com o WhatsApp falhou.",
  KeepAliveTimeout: "A conexão heartbeat expirou sem resposta.",
  KeepAliveRestored: "Heartbeat restabelecido após um timeout.",
  ManualLoginReconnect: "Necessidade de reconectar manualmente via dashboard/login.",

  // Error & ban
  TemporaryBan: "Indica banimento temporário imposto pelo WhatsApp.",
  ClientOutdated: "Versão do cliente incompatível com a exigida pelo WhatsApp.",
  CATRefreshError: "Falha ao renovar o token CAT da sessão.",

  // Calls
  CallOffer: "Oferta de chamada recebida (voz ou vídeo).",
  CallAccept: "Chamada aceita pelo destinatário.",
  CallPreAccept: "Pré-aceite enviado antes do estabelecimento completo da chamada.",
  CallTransport: "Atualizações sobre transporte/ICE da chamada.",
  CallTerminate: "Chamada finalizada por qualquer parte ou pelo sistema.",
  CallReject: "Chamada rejeitada explicitamente.",
  CallOfferNotice: "Notificação de oferta de chamada (ex.: chamadas em grupo).",
  CallRelayLatency: "Métricas de latência coletadas durante a chamada.",
  UnknownCallEvent: "Eventos de chamada não categorizados (fallback).",

  // Presence
  Presence: "Status online/offline global dos contatos.",
  ChatPresence: "Eventos de digitação, gravação ou visualização dentro do chat.",

  // Newsletter / channels
  NewsletterJoin: "Inscrição em um canal/newsletter no WhatsApp.",
  NewsletterLeave: "Saída ou remoção de um canal/newsletter.",
  NewsletterMuteChange: "Alteração do estado de mute de um canal/newsletter.",
  NewsletterLiveUpdate: "Atualizações em tempo real enviadas por canais/newsletters.",

  // Sync & state
  AppState: "Recebimento incremental do estado global da conta.",
  AppStateSyncComplete: "Processo de sincronização de estado concluído.",
  HistorySync: "Sincronização de histórico de conversas e mídias.",
  OfflineSyncPreview: "Prévia dos itens que serão sincronizados offline.",
  OfflineSyncCompleted: "Sincronização offline finalizada.",
  PushNameSetting: "Alteração das preferências de nome exibido global.",
  UnarchiveChatsSetting: "Preferência de desarquivar conversas automaticamente atualizada.",
} as const

// ============================================================================
// CONNECTION STATUS
// ============================================================================

/**
 * Status de conexão WhatsApp
 */
export const CONNECTION_STATUS = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  CONNECTING: "connecting",
  UNKNOWN: "unknown",
} as const

export type ConnectionStatus = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS]

/**
 * Labels de status de conexão
 */
export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  connected: "Conectado",
  disconnected: "Desconectado",
  connecting: "Conectando",
  unknown: "Desconhecido",
} as const

/**
 * Cores para badges de status
 */
export const STATUS_COLORS: Record<ConnectionStatus, string> = {
  connected: "bg-green-500",
  disconnected: "bg-red-500",
  connecting: "bg-yellow-500",
  unknown: "bg-gray-500",
} as const

/**
 * Variantes de badge para status
 */
export const STATUS_BADGE_VARIANTS: Record<
  ConnectionStatus,
  "default" | "success" | "warning" | "error"
> = {
  connected: "success",
  disconnected: "error",
  connecting: "warning",
  unknown: "default",
} as const

// ============================================================================
// RABBITMQ CONFIGURATION
// ============================================================================

/**
 * Tipos de exchange RabbitMQ
 */
export const EXCHANGE_TYPES = ["direct", "fanout", "topic", "headers"] as const

export type ExchangeType = (typeof EXCHANGE_TYPES)[number]

/**
 * Labels dos tipos de exchange
 */
export const EXCHANGE_TYPE_LABELS: Record<ExchangeType, string> = {
  direct: "Direct",
  fanout: "Fanout",
  topic: "Topic",
  headers: "Headers",
} as const

/**
 * Descrições dos tipos de exchange
 */
export const EXCHANGE_TYPE_DESCRIPTIONS: Record<ExchangeType, string> = {
  direct: "Roteamento baseado em routing key exata",
  fanout: "Broadcast para todas as filas vinculadas",
  topic: "Roteamento baseado em padrões de routing key",
  headers: "Roteamento baseado em headers da mensagem",
} as const

/**
 * Tipos de fila RabbitMQ
 */
export const QUEUE_TYPES = ["classic", "quorum", "stream"] as const

export type QueueType = (typeof QUEUE_TYPES)[number]

/**
 * Labels dos tipos de fila
 */
export const QUEUE_TYPE_LABELS: Record<QueueType, string> = {
  classic: "Classic",
  quorum: "Quorum",
  stream: "Stream",
} as const

/**
 * Descrições dos tipos de fila
 */
export const QUEUE_TYPE_DESCRIPTIONS: Record<QueueType, string> = {
  classic: "Fila tradicional com menor latência",
  quorum: "Fila replicada com alta disponibilidade",
  stream: "Fila otimizada para streaming de logs",
} as const

/**
 * Modos de entrega RabbitMQ
 */
export const DELIVERY_MODES = [
  { value: 1, label: "Non-Persistent (1)" },
  { value: 2, label: "Persistent (2)" },
] as const

/**
 * Descrições dos modos de entrega
 */
export const DELIVERY_MODE_DESCRIPTIONS: Record<1 | 2, string> = {
  1: "Mensagens não persistentes (mais rápido)",
  2: "Mensagens persistentes em disco (mais seguro)",
} as const

// ============================================================================
// S3 CONFIGURATION
// ============================================================================

/**
 * Modos de entrega de mídia S3
 */
export const MEDIA_DELIVERY_MODES = ["base64", "s3", "both"] as const

export type MediaDeliveryMode = (typeof MEDIA_DELIVERY_MODES)[number]

/**
 * Labels dos modos de entrega
 */
export const MEDIA_DELIVERY_LABELS: Record<MediaDeliveryMode, string> = {
  base64: "Base64",
  s3: "S3",
  both: "Base64 + S3",
} as const

/**
 * Descrições dos modos de entrega
 */
export const MEDIA_DELIVERY_DESCRIPTIONS: Record<MediaDeliveryMode, string> = {
  base64: "Mídia codificada em base64 no payload",
  s3: "Publica no S3 e retorna somente a URL",
  both: "Base64 e URL juntos (maior payload)",
} as const

/**
 * Regiões AWS S3 mais comuns
 */
export const AWS_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "sa-east-1", label: "South America (São Paulo)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
] as const

// ============================================================================
// CALL SETTINGS
// ============================================================================

/**
 * Tipos de rejeição de chamada
 */
export const CALL_REJECT_TYPES = ["busy", "declined", "unavailable"] as const

export type CallRejectType = (typeof CALL_REJECT_TYPES)[number]

/**
 * Labels dos tipos de rejeição
 */
export const CALL_REJECT_TYPE_LABELS: Record<CallRejectType, string> = {
  busy: "Ocupado",
  declined: "Chamada recusada",
  unavailable: "Indisponível",
} as const

/**
 * Descrições dos tipos de rejeição
 */
export const CALL_REJECT_TYPE_DESCRIPTIONS: Record<CallRejectType, string> = {
  busy: "Informa que está ocupado em outra chamada",
  declined: "Recusa a chamada diretamente",
  unavailable: "Informa que está indisponível no momento",
} as const

// ============================================================================
// MESSAGE TYPES
// ============================================================================

/**
 * Tipos de mensagem WhatsApp
 */
export const MESSAGE_TYPES = [
  "text",
  "image",
  "video",
  "audio",
  "document",
  "sticker",
  "location",
  "contact",
  "poll",
  "reaction",
  "list",
  "buttons",
] as const

export type MessageType = (typeof MESSAGE_TYPES)[number]

/**
 * Labels dos tipos de mensagem
 */
export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  text: "Texto",
  image: "Imagem",
  video: "Vídeo",
  audio: "Áudio",
  document: "Documento",
  sticker: "Figurinha",
  location: "Localização",
  contact: "Contato",
  poll: "Enquete",
  reaction: "Reação",
  list: "Lista",
  buttons: "Botões",
} as const

/**
 * Ícones para tipos de mensagem (Lucide React icons)
 */
export const MESSAGE_TYPE_ICONS: Record<MessageType, string> = {
  text: "MessageSquare",
  image: "Image",
  video: "Video",
  audio: "Mic",
  document: "FileText",
  sticker: "Sticker",
  location: "MapPin",
  contact: "User",
  poll: "BarChart3",
  reaction: "Smile",
  list: "List",
  buttons: "SquareStack",
} as const

// ============================================================================
// WHATSAPP DEVICE CONFIGURATION
// ============================================================================

/**
 * Plataformas WhatsApp
 */
export const WA_PLATFORMS = ["android", "ios", "windows", "macos", "web"] as const

/**
 * Canais de release WhatsApp
 */
export const WA_RELEASE_CHANNELS = ["production", "beta", "alpha"] as const

/**
 * Tipos de conexão WhatsApp
 */
export const WA_CONNECT_TYPES = ["wifi", "cellular", "ethernet"] as const

/**
 * Tipos de plataforma WhatsApp
 */
export const WA_PLATFORM_TYPES = [
  "android",
  "iphone",
  "chrome",
  "firefox",
  "ie",
  "opera",
  "safari",
  "edge",
] as const

// ============================================================================
// UI CONFIGURATION
// ============================================================================

/**
 * Temas disponíveis
 */
export const THEMES = ["light", "dark", "system"] as const

export type Theme = (typeof THEMES)[number]

/**
 * Labels dos temas
 */
export const THEME_LABELS: Record<Theme, string> = {
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
} as const

/**
 * Moedas suportadas
 */
export const CURRENCIES = ["BRL", "USD", "EUR"] as const

export type Currency = (typeof CURRENCIES)[number]

/**
 * Labels das moedas
 */
export const CURRENCY_LABELS: Record<Currency, string> = {
  BRL: "Real (BRL)",
  USD: "Dólar (USD)",
  EUR: "Euro (EUR)",
} as const

/**
 * Símbolos das moedas
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
} as const

/**
 * Itens por página para paginação
 */
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const

/**
 * Timeout padrão para requests (ms)
 */
export const DEFAULT_REQUEST_TIMEOUT = 30000

/**
 * Intervalo de polling para status (ms)
 */
export const STATUS_POLL_INTERVAL = 5000

/**
 * Duração de notificações toast (ms)
 */
export const TOAST_DURATION = 5000

/**
 * Tamanho máximo de upload (bytes) - 50MB
 */
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Prefixo base da API
 */
export const API_BASE_PATH = "/api"

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Admin - Users
  ADMIN_USERS: "/admin/users",
  ADMIN_USER: (id: string) => `/admin/users/${id}`,
  ADMIN_USER_FULL: (id: string) => `/admin/users/${id}/full`,

  // Admin - Global
  ADMIN_GLOBAL_STATS: "/admin/global/stats",
  ADMIN_GLOBAL_TEST: "/admin/global/test",
  ADMIN_GLOBAL_CONFIG: "/admin/global/config",
  ADMIN_GLOBAL_CONFIG_RELOAD: "/admin/global/config/reload",
  ADMIN_GLOBAL_EVENT_TEST: "/admin/global/event/test",

  // Admin - DLQ
  ADMIN_DLQ: "/admin/dlq",
  ADMIN_DLQ_EVENT: (id: string | number) => `/admin/dlq/${id}`,
  ADMIN_DLQ_REPLAY: "/admin/dlq/replay",
  ADMIN_DLQ_PRUNE: "/admin/dlq/prune",
  ADMIN_DLQ_STATS: "/admin/dlq/stats",

  // Session lifecycle
  SESSION_STATUS: "/session/status",
  SESSION_QR: "/session/qr",
  SESSION_CONNECT: "/session/connect",
  SESSION_DISCONNECT: "/session/disconnect",
  SESSION_LOGOUT: "/session/logout",
  SESSION_PAIRPHONE: "/session/pairphone",
  SESSION_PROXY: "/session/proxy",

  // Session storage & transports
  SESSION_S3_CONFIG: "/session/s3/config",
  SESSION_S3_TEST: "/session/s3/test",
  SESSION_RABBITMQ_CONFIG: "/session/rabbitmq/config",
  SESSION_RABBITMQ_TEST: "/session/rabbitmq/test",

  // Session filters
  SESSION_SKIP_MEDIA: "/session/skipmedia/config",
  SESSION_SKIP_GROUPS: "/session/skipgroups/config",
  SESSION_SKIP_NEWSLETTERS: "/session/skipnewsletters/config",
  SESSION_SKIP_BROADCASTS: "/session/skipbroadcasts/config",
  SESSION_SKIP_OWN_MESSAGES: "/session/skipownmessages/config",
  SESSION_SKIP_CALLS: "/session/skipcalls/config",
  SESSION_ECHO_API: "/session/echo/api",

  // Webhook
  WEBHOOK: "/webhook",
} as const

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

/**
 * Regex para validação de telefone (formato internacional)
 */
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/

/**
 * Regex para validação de URL
 */
export const URL_REGEX = /^https?:\/\/.+/

/**
 * Regex para validação de token
 */
export const TOKEN_REGEX = /^[a-zA-Z0-9_-]{10,}$/

/**
 * Regex para validação de JID WhatsApp
 */
export const JID_REGEX = /^\d+@(s\.whatsapp\.net|g\.us|broadcast)$/

// ============================================================================
// ERROR CODES
// ============================================================================

/**
 * Códigos de erro customizados
 */
export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONNECTION_ERROR: "CONNECTION_ERROR",
  TIMEOUT: "TIMEOUT",
  SERVER_ERROR: "SERVER_ERROR",
  RATE_LIMIT: "RATE_LIMIT",
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

/**
 * Mensagens de erro em português
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UNAUTHORIZED: "Não autorizado. Verifique suas credenciais.",
  FORBIDDEN: "Acesso negado. Você não tem permissão para esta ação.",
  NOT_FOUND: "Recurso não encontrado.",
  VALIDATION_ERROR: "Dados inválidos. Verifique os campos e tente novamente.",
  CONNECTION_ERROR: "Erro de conexão. Verifique sua internet e tente novamente.",
  TIMEOUT: "Tempo limite excedido. Tente novamente.",
  SERVER_ERROR: "Erro no servidor. Tente novamente mais tarde.",
  RATE_LIMIT: "Muitas requisições. Aguarde alguns segundos e tente novamente.",
} as const
