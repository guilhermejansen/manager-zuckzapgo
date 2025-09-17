import { z } from 'zod';

// User Instance validation
export const userInstanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  token: z.string().min(1, 'Token is required'),
  webhook: z.string().url('Invalid URL').optional().or(z.literal('')),
  events: z.string().optional(),
  proxy_config: z.object({
    enabled: z.boolean(),
    proxy_url: z.string().url().optional().or(z.literal('')),
  }).optional(),
  s3_config: z.object({
    enabled: z.boolean(),
    endpoint: z.string().url().optional().or(z.literal('')),
    bucket: z.string().optional(),
    access_key: z.string().optional(),
    secret_key: z.string().optional(),
    region: z.string().optional(),
  }).optional(),
  rabbitmq_config: z.object({
    enabled: z.boolean(),
    url: z.string().optional(),
    exchange: z.string().optional(),
    queue: z.string().optional(),
    routing_key: z.string().optional(),
  }).optional(),
});

// Message validation
export const messageSchema = z.object({
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number'),
  body: z.string().min(1, 'Message is required'),
  id: z.string().optional(),
});

// Campaign validation
export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum(['bulk', 'sequence', 'drip']),
  targets: z.array(z.object({
    type: z.enum(['phone', 'group', 'newsletter', 'contact_list']),
    value: z.string(),
    name: z.string().optional(),
  })).min(1, 'At least one recipient is required'),
  messages: z.array(z.object({
    type: z.enum(['text', 'image', 'video', 'audio', 'document']),
    content: z.string().min(1, 'Content is required'),
    media: z.string().optional(),
    delay: z.number().optional(),
  })).min(1, 'At least one message is required'),
  schedule: z.object({
    type: z.enum(['immediate', 'scheduled', 'recurring']),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    timezone: z.string(),
  }),
});

// Login validation
export const loginSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  type: z.enum(['admin', 'instance']),
});

// Group creation validation
export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(25, 'Group name too long'),
  participants: z.array(z.string().regex(/^\+?\d{10,15}$/)).min(1, 'At least one participant is required'),
});

// Newsletter creation validation
export const createNewsletterSchema = z.object({
  name: z.string().min(1, 'Newsletter name is required').max(100, 'Newsletter name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
});

// Webhook configuration validation
export const webhookConfigSchema = z.object({
  webhook: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).optional(),
});

// S3 configuration validation
export const s3ConfigSchema = z.object({
  enabled: z.boolean(),
  endpoint: z.string().url('Invalid endpoint URL').optional().or(z.literal('')),
  region: z.string().min(1, 'Region is required'),
  bucket: z.string().min(1, 'Bucket name is required'),
  access_key: z.string().min(1, 'Access key is required'),
  secret_key: z.string().min(1, 'Secret key is required'),
  path_style: z.boolean().optional(),
  public_url: z.string().url().optional().or(z.literal('')),
  media_delivery: z.string().optional(),
  retention_days: z.number().min(1).optional(),
});

// RabbitMQ configuration validation
export const rabbitmqConfigSchema = z.object({
  enabled: z.boolean(),
  url: z.string().min(1, 'RabbitMQ URL is required'),
  exchange: z.string().min(1, 'Exchange name is required'),
  exchange_type: z.enum(['direct', 'topic', 'fanout', 'headers']).optional(),
  queue: z.string().min(1, 'Queue name is required'),
  queue_type: z.enum(['classic', 'quorum']).optional(),
  routing_key: z.string().optional(),
  events: z.string().optional(),
  durable: z.boolean().optional(),
  auto_delete: z.boolean().optional(),
  exclusive: z.boolean().optional(),
  no_wait: z.boolean().optional(),
  delivery_mode: z.number().min(1).max(2).optional(),
});

// Skip configuration validation
export const skipConfigSchema = z.object({
  skip_media_download: z.boolean(),
  skip_groups: z.boolean(),
  skip_newsletters: z.boolean(),
  skip_broadcasts: z.boolean(),
  skip_own_messages: z.boolean(),
  skip_calls: z.boolean(),
  call_reject_message: z.string().optional(),
  call_reject_type: z.enum(['busy', 'declined', 'unavailable']).optional(),
});

// Status message validation
export const statusMessageSchema = z.object({
  text: z.string().min(1, 'Status text is required').max(139, 'Status text too long'),
  background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  font: z.number().min(0).max(5).optional(),
  audience: z.array(z.string()).optional(),
  exclude_list: z.array(z.string()).optional(),
});

// Poll creation validation
export const pollSchema = z.object({
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number'),
  question: z.string().min(1, 'Question is required').max(256, 'Question too long'),
  options: z.array(z.string().min(1).max(100)).min(2, 'At least 2 options required').max(12, 'Maximum 12 options allowed'),
});

// Location message validation
export const locationSchema = z.object({
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  name: z.string().optional(),
});

// Template validation
export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  category: z.enum(['marketing', 'transactional', 'notification']),
  type: z.enum(['text', 'image', 'video', 'audio', 'document']),
  content: z.string().min(1, 'Content is required'),
  variables: z.array(z.object({
    key: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(['text', 'number', 'date', 'url']),
    required: z.boolean(),
    default_value: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
});

// Contact import validation
export const contactImportSchema = z.object({
  contacts: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number'),
    groups: z.array(z.string()).optional(),
  })).min(1, 'At least one contact is required'),
});

// Phone number validation helper
export const phoneNumberSchema = z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number');

// Email validation helper (for future use)
export const emailSchema = z.string().email('Invalid email address');

// URL validation helper
export const urlSchema = z.string().url('Invalid URL');

// Date validation helper
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)');

// Time validation helper
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)');

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 16 * 1024 * 1024,
    'File size must be less than 16MB'
  ),
  type: z.enum(['image', 'video', 'audio', 'document']).optional(),
});

// Image file validation
export const imageFileSchema = z.instanceof(File).refine(
  (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
  'Only JPEG, PNG, GIF, and WebP images are allowed'
).refine(
  (file) => file.size <= 5 * 1024 * 1024,
  'Image size must be less than 5MB'
);

// Video file validation
export const videoFileSchema = z.instanceof(File).refine(
  (file) => ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'].includes(file.type),
  'Only MP4, MPEG, QuickTime, and AVI videos are allowed'
).refine(
  (file) => file.size <= 16 * 1024 * 1024,
  'Video size must be less than 16MB'
);

// Audio file validation
export const audioFileSchema = z.instanceof(File).refine(
  (file) => ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/mp4'].includes(file.type),
  'Only MP3, OGG, WAV, and M4A audio files are allowed'
).refine(
  (file) => file.size <= 16 * 1024 * 1024,
  'Audio size must be less than 16MB'
);

// Document file validation
export const documentFileSchema = z.instanceof(File).refine(
  (file) => [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ].includes(file.type),
  'Only PDF, Word, Excel, PowerPoint, and text files are allowed'
).refine(
  (file) => file.size <= 16 * 1024 * 1024,
  'Document size must be less than 16MB'
);