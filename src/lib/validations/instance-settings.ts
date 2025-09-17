import { z } from 'zod';

// General settings validation
export const generalSettingsSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
  webhook: z.string().url('URL do webhook deve ser válida').optional().or(z.literal('')),
  events: z.string().min(1, 'Eventos são obrigatórios')
});

// Proxy settings validation
export const proxySettingsSchema = z.object({
  enabled: z.boolean(),
  proxy_url: z.string().optional().refine((val) => {
    if (!val) return true;
    return val.match(/^(socks5|http|https):\/\/.+/);
  }, 'URL do proxy deve começar com socks5://, http:// ou https://')
});

// S3 settings validation
export const s3SettingsSchema = z.object({
  enabled: z.boolean(),
  endpoint: z.string().url('Endpoint deve ser uma URL válida').optional().or(z.literal('')),
  region: z.string().min(1, 'Região é obrigatória').optional().or(z.literal('')),
  bucket: z.string().min(1, 'Nome do bucket é obrigatório').optional().or(z.literal('')),
  access_key: z.string().min(1, 'Access Key é obrigatória').optional().or(z.literal('')),
  secret_key: z.string().min(1, 'Secret Key é obrigatória').optional().or(z.literal('')),
  path_style: z.boolean(),
  public_url: z.string().url('URL pública deve ser válida').optional().or(z.literal('')),
  media_delivery: z.enum(['base64', 's3', 'both']),
  retention_days: z.number().min(1, 'Dias de retenção deve ser pelo menos 1').max(365, 'Máximo 365 dias')
}).refine((data) => {
  if (data.enabled) {
    return data.endpoint && data.region && data.bucket && data.access_key && data.secret_key;
  }
  return true;
}, {
  message: 'Todos os campos obrigatórios devem ser preenchidos quando S3 estiver habilitado',
  path: ['enabled']
});

// RabbitMQ settings validation
export const rabbitmqSettingsSchema = z.object({
  enabled: z.boolean(),
  url: z.string().refine((val) => {
    if (!val) return true;
    return val.match(/^amqp:\/\/.+/);
  }, 'URL deve começar com amqp://').optional().or(z.literal('')),
  exchange: z.string().min(1, 'Exchange é obrigatório').optional().or(z.literal('')),
  exchange_type: z.enum(['topic', 'direct', 'fanout', 'headers']),
  queue: z.string().min(1, 'Queue é obrigatória').optional().or(z.literal('')),
  queue_type: z.enum(['classic', 'quorum', 'stream']),
  routing_key: z.string().min(1, 'Routing key é obrigatória').optional().or(z.literal('')),
  events: z.string().min(1, 'Eventos são obrigatórios'),
  durable: z.boolean(),
  auto_delete: z.boolean(),
  exclusive: z.boolean(),
  no_wait: z.boolean(),
  delivery_mode: z.number().min(1).max(2)
}).refine((data) => {
  if (data.enabled) {
    return data.url && data.exchange && data.queue && data.routing_key;
  }
  return true;
}, {
  message: 'Todos os campos obrigatórios devem ser preenchidos quando RabbitMQ estiver habilitado',
  path: ['enabled']
});

// Skip settings validation
export const skipSettingsSchema = z.object({
  skip_media_download: z.boolean(),
  skip_groups: z.boolean(),
  skip_newsletters: z.boolean(),
  skip_broadcasts: z.boolean(),
  skip_own_messages: z.boolean(),
  skip_calls: z.boolean(),
  call_reject_message: z.string().max(200, 'Mensagem deve ter no máximo 200 caracteres').optional().or(z.literal('')),
  call_reject_type: z.enum(['busy', 'declined', 'unavailable'])
});

// Session settings validation
export const sessionSettingsSchema = z.object({
  connect: z.boolean(),
  disconnect: z.boolean(),
  logout: z.boolean()
});

// Complete instance settings validation
export const instanceSettingsSchema = z.object({
  general: generalSettingsSchema,
  session: sessionSettingsSchema,
  proxy: proxySettingsSchema,
  s3: s3SettingsSchema,
  rabbitmq: rabbitmqSettingsSchema,
  skips: skipSettingsSchema
});

// Phone pairing validation
export const pairPhoneSchema = z.object({
  phone: z.string()
    .min(10, 'Número de telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Número de telefone deve ter no máximo 15 dígitos')
    .regex(/^\d+$/, 'Número de telefone deve conter apenas dígitos')
});

// Validation error types
export type GeneralSettingsErrors = z.inferFlattenedErrors<typeof generalSettingsSchema>;
export type ProxySettingsErrors = z.inferFlattenedErrors<typeof proxySettingsSchema>;
export type S3SettingsErrors = z.inferFlattenedErrors<typeof s3SettingsSchema>;
export type RabbitMQSettingsErrors = z.inferFlattenedErrors<typeof rabbitmqSettingsSchema>;
export type SkipSettingsErrors = z.inferFlattenedErrors<typeof skipSettingsSchema>;
export type SessionSettingsErrors = z.inferFlattenedErrors<typeof sessionSettingsSchema>;
export type InstanceSettingsErrors = z.inferFlattenedErrors<typeof instanceSettingsSchema>;
export type PairPhoneErrors = z.inferFlattenedErrors<typeof pairPhoneSchema>;

// Export inferred types
export type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;
export type ProxySettingsData = z.infer<typeof proxySettingsSchema>;
export type S3SettingsData = z.infer<typeof s3SettingsSchema>;
export type RabbitMQSettingsData = z.infer<typeof rabbitmqSettingsSchema>;
export type SkipSettingsData = z.infer<typeof skipSettingsSchema>;
export type SessionSettingsData = z.infer<typeof sessionSettingsSchema>;
export type InstanceSettingsData = z.infer<typeof instanceSettingsSchema>;
export type PairPhoneData = z.infer<typeof pairPhoneSchema>;