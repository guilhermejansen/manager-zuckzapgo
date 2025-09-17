// User and Instance Types
export interface UserInstance {
  id: string;
  name: string;
  avatar_url: string;
  token: string;
  webhook: string;
  jid: string;
  qrcode: string;
  connected: boolean;
  loggedIn: boolean;
  expiration: number;
  proxy_url: string;
  events: string;
  
  // Skip configurations
  skip_media_download: boolean;
  skip_groups: boolean;
  skip_newsletters: boolean;
  skip_broadcasts: boolean;
  skip_own_messages: boolean;
  skip_calls: boolean;
  call_reject_message: string;
  call_reject_type: string;
  
  // Proxy configuration
  proxy_config: ProxyConfig;
  
  // S3 configuration
  s3_config: S3Config;
  
  // RabbitMQ configuration
  rabbitmq_config: RabbitMQConfig;
}

export interface ProxyConfig {
  enabled: boolean;
  proxy_url: string;
}

export interface S3Config {
  enabled: boolean;
  endpoint: string;
  region: string;
  bucket: string;
  access_key: string;
  secret_key: string;
  path_style: boolean;
  public_url: string;
  media_delivery: string;
  retention_days: number;
}

export interface RabbitMQConfig {
  enabled: boolean;
  url: string;
  exchange: string;
  exchange_type: string;
  queue: string;
  queue_type: string;
  routing_key: string;
  events: string;
  durable: boolean;
  auto_delete: boolean;
  exclusive: boolean;
  no_wait: boolean;
  delivery_mode: number;
}

// Group Types
export interface GroupInfo {
  JID: string;
  Name: string;
  Topic: string;
  OwnerJID: string;
  GroupCreated: number;
  ParticipantVersionID: string;
  Participants: GroupParticipant[];
  IsEphemeral: boolean;
  IsAnnounce: boolean;
  IsLocked: boolean;
  IsIncognito: boolean;
  IsParent: boolean;
  IsDefaultSub: boolean;
  Created: number;
  ParticipantCount: number;
  PendingParticipants: GroupParticipant[];
  MemberAddMode: string;
  LinkedParentJID: string;
}

export interface GroupParticipant {
  JID: string;
  DisplayName: string;
  IsAdmin: boolean;
  IsSuperAdmin: boolean;
  JoinedAt: number;
}

// Newsletter Types
export interface NewsletterInfo {
  jid: string;
  name: string;
  description: string;
  subscribers: number;
  muted: boolean;
  invite_code: string;
  picture?: string;
  role?: string;
  created_at?: number;
}

// Contact Types
export interface ContactInfo {
  jid: string;
  name: string;
  phone: string;
  status: string;
  lastSeen: string;
  groups: string[];
  profilePicture?: string;
  about?: string;
  blocked?: boolean;
}

// Message Types
export interface MessagePayload {
  phone: string;
  body?: string;
  id?: string;
  presence?: number;
  view_once?: boolean;
  duration?: number;
  context_info?: ContextInfo;
  mention_info?: MentionInfo;
  forward_info?: ForwardInfo;
}

export interface ContextInfo {
  stanzaId?: string;
  participant?: string;
  quotedMessage?: any;
}

export interface MentionInfo {
  mentions: string[];
}

export interface ForwardInfo {
  isForwarded: boolean;
}

export interface MessageResponse {
  id: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  type: 'bulk' | 'sequence' | 'drip';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  targets: CampaignTarget[];
  messages: CampaignMessage[];
  schedule: CampaignSchedule;
  stats: CampaignStats;
  created_at: string;
  updated_at: string;
}

export interface CampaignTarget {
  type: 'phone' | 'group' | 'newsletter' | 'contact_list';
  value: string;
  name?: string;
}

export interface CampaignMessage {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  content: string;
  media?: string;
  delay?: number;
  schedule?: CampaignSchedule;
  variables?: Record<string, string>;
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';
  start_date?: string;
  end_date?: string;
  timezone: string;
  
  // For sequential messages
  sequence_delays?: number[]; // In minutes
  
  // For recurring campaigns
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    days_of_week?: number[];
    day_of_month?: number;
  };
  
  // Cadence settings
  cadence?: {
    max_messages_per_day: number;
    min_interval_between_messages: number; // In minutes
    respect_business_hours: boolean;
    business_hours?: {
      start: string; // "09:00"
      end: string;   // "18:00"
    };
  };
}

export interface CampaignStats {
  campaign_id: string;
  total_targets: number;
  messages_sent: number;
  messages_delivered: number;
  messages_read: number;
  messages_failed: number;
  
  // Stats by type
  stats_by_type: {
    text: MessageTypeStats;
    image: MessageTypeStats;
    video: MessageTypeStats;
    audio: MessageTypeStats;
    document: MessageTypeStats;
  };
  
  // Temporal stats
  hourly_stats: HourlyStats[];
  daily_stats: DailyStats[];
  
  // Success rates
  success_rate: number;
  delivery_rate: number;
  read_rate: number;
  
  // Average delivery time
  avg_delivery_time: number;
  
  // Error breakdown
  error_breakdown: ErrorBreakdown[];
}

export interface MessageTypeStats {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface HourlyStats {
  hour: string;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface DailyStats {
  date: string;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

export interface ErrorBreakdown {
  error_type: string;
  count: number;
  percentage: number;
}

// Template Types
export interface MessageTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'transactional' | 'notification';
  type: 'text' | 'image' | 'video' | 'audio' | 'document';
  content: string;
  variables: TemplateVariable[];
  preview: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateVariable {
  key: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'url';
  required: boolean;
  default_value?: string;
  description?: string;
}

// Status Types
export interface StatusPayload {
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  caption?: string;
  background_color?: string;
  text_color?: string;
  font?: number;
  audience?: string[];
  exclude_list?: string[];
  id?: string;
}

// Call Types
export interface CallReject {
  call_id: string;
  call_from: string;
  reject_type: 'busy' | 'declined' | 'unavailable';
  message?: string;
}

// Session Types - Complete status from /session/status endpoint
export interface SessionStatus {
  id: string;
  name: string;
  avatar_url: string;
  connected: boolean;
  loggedIn: boolean;
  expiration: number;
  token: string;
  jid: string;
  webhook: string;
  events: string;
  proxy_url: string;
  qrcode: string;
  skip_media_download: boolean;
  skip_groups: boolean;
  skip_newsletters: boolean;
  skip_broadcasts: boolean;
  skip_own_messages: boolean;
  skip_calls: boolean;
  call_reject_message: string;
  call_reject_type: string;
  proxy_config: ProxyConfig;
  s3_config: S3Config;
  rabbitmq_config: RabbitMQConfig;
}

// Webhook Types
export interface WebhookConfig {
  webhook: string;
  events: string[];
}

// Global Settings Types
export interface GlobalSettings {
  webhook: GlobalWebhookConfig;
  rabbitmq: GlobalRabbitMQConfig;
  s3: GlobalS3Config;
  skip: GlobalSkipConfig;
}

export interface GlobalWebhookConfig {
  enabled: boolean;
  url: string;
  events: string[];
}

export interface GlobalRabbitMQConfig extends RabbitMQConfig {
  connection_pool_size: number;
  heartbeat: number;
}

export interface GlobalS3Config extends S3Config {
  multipart_threshold: number;
  multipart_chunksize: number;
  max_bandwidth: number;
}

export interface GlobalSkipConfig {
  skip_media_download: boolean;
  skip_groups: boolean;
  skip_newsletters: boolean;
  skip_broadcasts: boolean;
  skip_own_messages: boolean;
  skip_calls: boolean;
  default_call_reject_message: string;
  default_call_reject_type: string;
}

// Activity Types
export interface Activity {
  id: string;
  type: 'instance_created' | 'instance_deleted' | 'instance_connected' | 'instance_disconnected' | 'message_sent' | 'message_received' | 'webhook_triggered' | 'error';
  instance_id?: string;
  instance_name?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Admin Dashboard Types
export interface AdminDashboardStats {
  totalInstances: number;
  activeInstances: number;
  messagesLastHour: number;
  messagesLastDay: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  recentActivity: Activity[];
}

// API Response Types
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  data?: T;
  error?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Instance Management Types
export interface InstanceManagementFormData {
  general: {
    name: string;
    webhook: string;
    events: string;
  };
  session: {
    connect: boolean;
    disconnect: boolean;
    logout: boolean;
  };
  proxy: ProxyConfig;
  s3: S3Config;
  rabbitmq: RabbitMQConfig;
  skips: {
    skip_media_download: boolean;
    skip_groups: boolean;
    skip_newsletters: boolean;
    skip_broadcasts: boolean;
    skip_own_messages: boolean;
    skip_calls: boolean;
    call_reject_message: string;
    call_reject_type: 'busy' | 'declined' | 'unavailable';
  };
}

export interface QRCodeResponse {
  QRCode: string;  // base64 image
  code: string;    // text code
}

export interface PairPhoneRequest {
  phone: string;
}

export interface PairPhoneResponse {
  LinkingCode: string;
}

export interface ConnectionTestResponse {
  success: boolean;
  message: string;
}

export interface WebhookUpdateRequest {
  webhook: string;
  events: string[];
  active?: boolean;
}

export interface ProxyRequest {
  proxy_url: string;
  enable: boolean;
}