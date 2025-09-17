import { apiClient } from './client';
import { 
  SessionStatus, 
  S3Config, 
  RabbitMQConfig, 
  WebhookConfig,
  QRCodeResponse,
  PairPhoneResponse,
  ConnectionTestResponse 
} from '@/types';

// Session Management
export async function fetchInstanceStatus(): Promise<SessionStatus> {
  return await apiClient.getSessionStatus();
}

export async function connectInstance(subscribe?: string[], immediate?: boolean): Promise<void> {
  return await apiClient.connectSession(subscribe, immediate);
}

export async function disconnectInstance(): Promise<void> {
  return await apiClient.disconnectSession();
}

export async function logoutInstance(): Promise<void> {
  return await apiClient.logoutSession();
}

export async function getQRCode(): Promise<QRCodeResponse> {
  const result = await apiClient.getQRCode();
  return result as QRCodeResponse;
}
  
export async function pairPhone(phone: string): Promise<PairPhoneResponse> {
  const result = await apiClient.pairPhone(phone);
  return result as PairPhoneResponse;
}

// S3 Configuration
export async function getS3Config(): Promise<S3Config> {
  return await apiClient.getS3Config();
}

export async function updateS3Config(config: S3Config): Promise<void> {
  return await apiClient.setS3Config(config);
}

export async function deleteS3Config(): Promise<void> {
  return await apiClient.deleteS3Config();
}

export async function testS3Connection(): Promise<ConnectionTestResponse> {
  return await apiClient.testS3Connection();
}

// RabbitMQ Configuration
export async function getRabbitMQConfig(): Promise<RabbitMQConfig> {
  return await apiClient.getRabbitMQConfig();
}

export async function updateRabbitMQConfig(config: RabbitMQConfig): Promise<void> {
  return await apiClient.setRabbitMQConfig(config);
}

export async function deleteRabbitMQConfig(): Promise<void> {
  return await apiClient.deleteRabbitMQConfig();
}

export async function testRabbitMQConnection(): Promise<ConnectionTestResponse> {
  return await apiClient.testRabbitMQConnection();
}

// Proxy Configuration
export async function updateProxyConfig(proxyUrl: string): Promise<void> {
  return await apiClient.setProxy(proxyUrl);
}

// Webhook Configuration
export async function getWebhookConfig(): Promise<WebhookConfig> {
  return await apiClient.getWebhook();
}

export async function updateWebhookConfig(config: WebhookConfig): Promise<void> {
  return await apiClient.setWebhook(config);
}

export async function deleteWebhookConfig(): Promise<void> {
  return await apiClient.deleteWebhook();
}

// Skip Configurations
export async function updateSkipMediaConfig(enabled: boolean): Promise<void> {
  return await apiClient.setSkipMediaConfig(enabled);
}

export async function updateSkipGroupsConfig(enabled: boolean): Promise<void> {
  return await apiClient.setSkipGroupsConfig(enabled);
}

export async function updateSkipNewslettersConfig(enabled: boolean): Promise<void> {
  return await apiClient.setSkipNewslettersConfig(enabled);
}

export async function updateSkipBroadcastsConfig(enabled: boolean): Promise<void> {
  return await apiClient.setSkipBroadcastsConfig(enabled);
}

export async function updateSkipOwnMessagesConfig(enabled: boolean): Promise<void> {
  return await apiClient.setSkipOwnMessagesConfig(enabled);
}

export async function updateSkipCallsConfig(enabled: boolean, message?: string, type?: string): Promise<void> {
  return await apiClient.setSkipCallsConfig(enabled, message, type);
} 