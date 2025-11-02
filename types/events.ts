/**
 * Event Types - Manager ZuckZapGo
 *
 * Tipos de eventos disponíveis na API do ZuckZapGo.
 * Total: 93 eventos completos baseados no whatsmeow.
 *
 * @module types/events
 */

/**
 * Todos os tipos de eventos suportados pela API
 * Baseado em constants.ts (SUPPORTED_EVENTS) - Lista completa de 93 eventos
 */
export const WHATSAPP_EVENT_TYPES = [
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
 * Type union de todos os eventos
 */
export type WhatsAppEventType = (typeof WHATSAPP_EVENT_TYPES)[number]

/**
 * Categorias de eventos para melhor organização na UI
 */
export const EVENT_CATEGORIES = {
  messages: {
    label: "Mensagens",
    icon: "MessageSquare",
    events: [
      "Message",
      "UndecryptableMessage",
      "FBMessage",
      "Receipt",
      "MediaRetry",
      "ReadReceipt",
    ],
  },
  chatManagement: {
    label: "Gerenciamento de Chats",
    icon: "FolderKanban",
    events: [
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
    ],
  },
  groups: {
    label: "Grupos",
    icon: "Users",
    events: ["GroupInfo", "JoinedGroup"],
  },
  contacts: {
    label: "Contatos e Perfis",
    icon: "UserCircle",
    events: ["Contact", "Picture", "PushName", "BusinessName", "UserAbout"],
  },
  privacy: {
    label: "Privacidade e Segurança",
    icon: "ShieldCheck",
    events: ["PrivacySettings", "IdentityChange", "Blocklist", "BlocklistChange", "UserStatusMute"],
  },
  connection: {
    label: "Conexão e Autenticação",
    icon: "Wifi",
    events: [
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
    ],
  },
  errors: {
    label: "Erros e Banimentos",
    icon: "AlertTriangle",
    events: ["TemporaryBan", "ClientOutdated", "CATRefreshError"],
  },
  calls: {
    label: "Chamadas",
    icon: "Phone",
    events: [
      "CallOffer",
      "CallAccept",
      "CallPreAccept",
      "CallTransport",
      "CallTerminate",
      "CallReject",
      "CallOfferNotice",
      "CallRelayLatency",
      "UnknownCallEvent",
    ],
  },
  presence: {
    label: "Presença",
    icon: "Eye",
    events: ["Presence", "ChatPresence"],
  },
  newsletters: {
    label: "Newsletters e Canais",
    icon: "Newspaper",
    events: ["NewsletterJoin", "NewsletterLeave", "NewsletterMuteChange", "NewsletterLiveUpdate"],
  },
  sync: {
    label: "Sincronização e Estado",
    icon: "RefreshCw",
    events: [
      "AppState",
      "AppStateSyncComplete",
      "HistorySync",
      "OfflineSyncPreview",
      "OfflineSyncCompleted",
      "PushNameSetting",
      "UnarchiveChatsSetting",
    ],
  },
} as const

/**
 * Type das categorias
 */
export type EventCategory = keyof typeof EVENT_CATEGORIES

/**
 * Helper para verificar se um evento é válido
 */
export function isValidEventType(event: string): event is WhatsAppEventType {
  return WHATSAPP_EVENT_TYPES.includes(event as WhatsAppEventType)
}

/**
 * Helper para obter a categoria de um evento
 */
export function getEventCategory(event: WhatsAppEventType): EventCategory {
  for (const [category, data] of Object.entries(EVENT_CATEGORIES)) {
    if (data.events.includes(event as never)) {
      return category as EventCategory
    }
  }
  return "messages" // fallback
}

/**
 * Helper para formatar eventos para API
 * Aceita array de eventos ou "All"
 */
export function formatEventsForAPI(events: WhatsAppEventType[] | "All"): string {
  if (events === "All") return "All"
  return events.join(",")
}

/**
 * Helper para parsear eventos da API
 * Converte string "All" ou "Message,Receipt,..." em array
 */
export function parseEventsFromAPI(eventsString: string): WhatsAppEventType[] | "All" {
  if (eventsString === "All") return "All"
  return eventsString.split(",").filter(isValidEventType)
}

/**
 * Descrições dos eventos (para tooltips/help)
 * Lista completa de 93 eventos
 */
export const EVENT_DESCRIPTIONS: Record<WhatsAppEventType, string> = {
  // General
  All: "Todos os eventos disponíveis",

  // Messages
  Message: "Mensagens recebidas ou enviadas",
  UndecryptableMessage: "Mensagens que não puderam ser decriptadas",
  FBMessage: "Mensagens do Facebook",
  Receipt: "Confirmações de entrega de mensagens",
  MediaRetry: "Tentativas de reenvio de mídia",
  ReadReceipt: "Confirmações de leitura (check azul)",

  // Chat management
  Star: "Mensagem marcada como favorita",
  Pin: "Chat fixado no topo",
  Archive: "Chat arquivado",
  Mute: "Chat silenciado",
  MarkChatAsRead: "Chat marcado como lido",
  ClearChat: "Histórico do chat limpo",
  DeleteChat: "Chat deletado",
  DeleteForMe: "Mensagem deletada para mim",
  LabelAssociationChat: "Label associado ao chat",
  LabelAssociationMessage: "Label associado à mensagem",
  LabelEdit: "Label editado",

  // Groups
  GroupInfo: "Informações de grupos (nome, descrição, etc.)",
  JoinedGroup: "Quando você é adicionado a um grupo",

  // Contacts & profiles
  Contact: "Informações de contato atualizadas",
  Picture: "Foto de perfil alterada",
  PushName: "Nome de exibição alterado",
  BusinessName: "Nome comercial alterado",
  UserAbout: "Status/sobre alterado",

  // Privacy & security
  PrivacySettings: "Configurações de privacidade alteradas",
  IdentityChange: "Mudança de identidade de contato",
  Blocklist: "Lista de contatos bloqueados",
  BlocklistChange: "Mudanças na lista de bloqueados",
  UserStatusMute: "Status de usuário silenciado",

  // Connection & authentication
  Connected: "Conexão estabelecida com WhatsApp",
  Disconnected: "Desconexão do WhatsApp",
  QR: "QR Code gerado para pareamento",
  PairSuccess: "Pareamento bem-sucedido",
  PairError: "Erro no pareamento",
  QRScannedWithoutMultidevice: "QR escaneado sem multi-dispositivo",
  LoggedOut: "Sessão deslogada",
  StreamReplaced: "Stream substituído por nova conexão",
  StreamError: "Erro no stream de dados",
  ConnectFailure: "Falha na tentativa de conexão",
  KeepAliveTimeout: "Timeout de keep-alive",
  KeepAliveRestored: "Conexão restaurada após keep-alive",
  ManualLoginReconnect: "Reconexão manual de login",

  // Error & ban
  TemporaryBan: "Banimento temporário",
  ClientOutdated: "Cliente desatualizado",
  CATRefreshError: "Erro no refresh de token CAT",

  // Calls
  CallOffer: "Chamada recebida",
  CallAccept: "Chamada aceita",
  CallPreAccept: "Pré-aceitação de chamada",
  CallTransport: "Transporte de chamada",
  CallTerminate: "Chamada encerrada",
  CallReject: "Chamada rejeitada",
  CallOfferNotice: "Notificação de chamada",
  CallRelayLatency: "Latência de relay de chamada",
  UnknownCallEvent: "Evento de chamada desconhecido",

  // Presence
  Presence: "Status de presença (online/offline)",
  ChatPresence: "Digitando, gravando áudio, etc.",

  // Newsletter / channels
  NewsletterJoin: "Entrou em um newsletter/canal",
  NewsletterLeave: "Saiu de um newsletter/canal",
  NewsletterMuteChange: "Mudança de mute em newsletter",
  NewsletterLiveUpdate: "Atualização ao vivo de newsletter",

  // Sync & state
  AppState: "Estado do aplicativo",
  AppStateSyncComplete: "Sincronização de estado completa",
  HistorySync: "Sincronização de histórico",
  OfflineSyncPreview: "Preview de sincronização offline",
  OfflineSyncCompleted: "Sincronização offline completa",
  PushNameSetting: "Configuração de nome push alterada",
  UnarchiveChatsSetting: "Configuração de desarquivamento alterada",
}
