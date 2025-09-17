import { ApiResponse, UserInstance, GroupInfo, NewsletterInfo, MessagePayload, MessageResponse, Campaign, SessionStatus, WebhookConfig, StatusPayload, CallReject, ContactInfo } from '@/types';

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private isAdminRoute(endpoint: string): boolean {
    return endpoint.startsWith('/admin/');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      if (this.isAdminRoute(endpoint)) {
        headers['Authorization'] = this.token;
      } else {
        headers['token'] = this.token;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send cookies for cross-origin requests
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Handle the API response format
      if ('code' in data && 'success' in data) {
        const apiResponse = data as ApiResponse<T>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.error || 'API request failed');
        }
        return apiResponse.data as T;
      }

      return data as T;
    } catch (error) {
      // Enhanced error handling for CORS and network issues
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Erro de conexão: Verifique se a API está acessível ou se há problemas de CORS');
      }
      throw error;
    }
  }

  // Admin endpoints
  async getUsers(): Promise<UserInstance[]> {
    return this.request('/admin/users');
  }

  async getUser(id: string): Promise<UserInstance> {
    return this.request(`/admin/users/${id}`);
  }

  async createUser(user: Partial<UserInstance>): Promise<UserInstance> {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteUserFull(id: string): Promise<void> {
    return this.request(`/admin/users/${id}/full`, {
      method: 'DELETE',
    });
  }

  // Admin global endpoints
  async getGlobalStats(): Promise<any> {
    return this.request('/admin/global/stats');
  }

  async testGlobalSystems(): Promise<any> {
    return this.request('/admin/global/test', {
      method: 'POST',
    });
  }

  async getGlobalConfiguration(): Promise<any> {
    return this.request('/admin/global/config');
  }

  async reloadGlobalConfig(): Promise<any> {
    return this.request('/admin/global/config/reload', {
      method: 'POST',
    });
  }

  async sendGlobalTestEvent(eventData: any): Promise<any> {
    return this.request('/admin/global/event/test', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Session endpoints
  async getSessionStatus(): Promise<SessionStatus> {
    return this.request('/session/status');
  }

  async connectSession(subscribe?: string[], immediate?: boolean): Promise<void> {
    const body = {
      Subscribe: subscribe || ["All"],
      Immediate: immediate ?? true
    };
    
    return this.request('/session/connect', { 
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async disconnectSession(): Promise<void> {
    return this.request('/session/disconnect', { method: 'POST' });
  }

  async logoutSession(): Promise<void> {
    return this.request('/session/logout', { method: 'POST' });
  }

  async getQRCode(): Promise<{ QRCode: string; code: string }> {
    return this.request('/session/qr');
  }

  async pairPhone(phone: string): Promise<{ LinkingCode: string }> {
    return this.request('/session/pairphone', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  // Webhook endpoints
  async getWebhook(): Promise<WebhookConfig> {
    return this.request('/webhook');
  }

  async setWebhook(config: WebhookConfig): Promise<void> {
    return this.request('/webhook', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async updateWebhook(config: WebhookConfig): Promise<void> {
    return this.request('/webhook', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  async deleteWebhook(): Promise<void> {
    return this.request('/webhook', {
      method: 'DELETE',
    });
  }

  // Groups endpoints
  async getGroups(): Promise<GroupInfo[]> {
    return this.request('/group/list');
  }

  async getGroupInfo(jid: string): Promise<GroupInfo> {
    return this.request('/group/info', {
      method: 'POST',
      body: JSON.stringify({ jid }),
    });
  }

  async createGroup(name: string, participants: string[]): Promise<GroupInfo> {
    return this.request('/group/create', {
      method: 'POST',
      body: JSON.stringify({ name, participants }),
    });
  }

  async leaveGroup(jid: string): Promise<void> {
    return this.request('/group/leave', {
      method: 'POST',
      body: JSON.stringify({ jid }),
    });
  }

  async updateGroupParticipants(jid: string, participants: string[], action: 'add' | 'remove' | 'promote' | 'demote'): Promise<void> {
    return this.request('/group/updateparticipants', {
      method: 'POST',
      body: JSON.stringify({ jid, participants, action }),
    });
  }

  // Newsletters endpoints
  async getNewsletters(): Promise<NewsletterInfo[]> {
    return this.request('/newsletter/list');
  }

  async getNewsletterInfo(jid: string): Promise<NewsletterInfo> {
    return this.request('/newsletter/info', {
      method: 'POST',
      body: JSON.stringify({ jid }),
    });
  }

  async createNewsletter(name: string, description: string): Promise<NewsletterInfo> {
    return this.request('/newsletter/create', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async followNewsletter(jid: string): Promise<void> {
    return this.request('/newsletter/follow', {
      method: 'POST',
      body: JSON.stringify({ jid }),
    });
  }

  async unfollowNewsletter(jid: string): Promise<void> {
    return this.request('/newsletter/unfollow', {
      method: 'POST',
      body: JSON.stringify({ jid }),
    });
  }

  async muteNewsletter(jid: string, mute: boolean): Promise<void> {
    return this.request('/newsletter/mute', {
      method: 'POST',
      body: JSON.stringify({ jid, mute }),
    });
  }

  // Messages endpoints
  async sendMessage(payload: MessagePayload): Promise<MessageResponse> {
    return this.request('/chat/send/text', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async sendImage(phone: string, image: string, caption?: string): Promise<MessageResponse> {
    return this.request('/chat/send/image', {
      method: 'POST',
      body: JSON.stringify({ phone, image, caption }),
    });
  }

  async sendVideo(phone: string, video: string, caption?: string): Promise<MessageResponse> {
    return this.request('/chat/send/video', {
      method: 'POST',
      body: JSON.stringify({ phone, video, caption }),
    });
  }

  async sendAudio(phone: string, audio: string): Promise<MessageResponse> {
    return this.request('/chat/send/audio', {
      method: 'POST',
      body: JSON.stringify({ phone, audio }),
    });
  }

  async sendDocument(phone: string, document: string, filename?: string): Promise<MessageResponse> {
    return this.request('/chat/send/document', {
      method: 'POST',
      body: JSON.stringify({ phone, document, filename }),
    });
  }

  async sendLocation(phone: string, latitude: number, longitude: number, name?: string): Promise<MessageResponse> {
    return this.request('/chat/send/location', {
      method: 'POST',
      body: JSON.stringify({ phone, latitude, longitude, name }),
    });
  }

  async sendPoll(phone: string, question: string, options: string[]): Promise<MessageResponse> {
    return this.request('/chat/send/poll', {
      method: 'POST',
      body: JSON.stringify({ phone, poll_name: question, poll_options: options }),
    });
  }

  async deleteMessage(phone: string, messageId: string): Promise<void> {
    return this.request('/chat/delete', {
      method: 'POST',
      body: JSON.stringify({ phone, id: messageId }),
    });
  }

  async reactToMessage(phone: string, messageId: string, emoji: string): Promise<void> {
    return this.request('/chat/react', {
      method: 'POST',
      body: JSON.stringify({ phone, id: messageId, emoji }),
    });
  }

  async markAsRead(phone: string): Promise<void> {
    return this.request('/chat/markread', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async sendPresence(phone: string, presence: 'composing' | 'recording' | 'paused'): Promise<void> {
    return this.request('/chat/presence', {
      method: 'POST',
      body: JSON.stringify({ phone, presence }),
    });
  }

  // User/Contact endpoints
  async getContacts(): Promise<ContactInfo[]> {
    return this.request('/user/contacts');
  }

  async getUserInfo(phone: string): Promise<ContactInfo> {
    return this.request('/user/info', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async checkUser(phones: string[]): Promise<{ exists: boolean; jid: string }[]> {
    return this.request('/user/check', {
      method: 'POST',
      body: JSON.stringify({ phones }),
    });
  }

  async getUserAvatar(phone: string, preview: boolean = false): Promise<{ url: string; id: string; type: string; direct_path: string }> {
    return this.request('/user/avatar', {
      method: 'POST',
      body: JSON.stringify({ 
        Phone: phone,
        Preview: preview 
      }),
    });
  }

  async setUserPresence(presence: 'available' | 'unavailable'): Promise<void> {
    return this.request('/user/presence', {
      method: 'POST',
      body: JSON.stringify({ presence }),
    });
  }

  // Status endpoints
  async sendTextStatus(text: string, backgroundColor?: string, textColor?: string, font?: number): Promise<void> {
    return this.request('/status/send/text', {
      method: 'POST',
      body: JSON.stringify({ text, background_color: backgroundColor, text_color: textColor, font }),
    });
  }

  async sendImageStatus(image: string, caption?: string): Promise<void> {
    return this.request('/status/send/image', {
      method: 'POST',
      body: JSON.stringify({ image, caption }),
    });
  }

  async sendVideoStatus(video: string, caption?: string): Promise<void> {
    return this.request('/status/send/video', {
      method: 'POST',
      body: JSON.stringify({ video, caption }),
    });
  }

  async sendAudioStatus(audio: string): Promise<void> {
    return this.request('/status/send/audio', {
      method: 'POST',
      body: JSON.stringify({ audio }),
    });
  }

  // Call endpoints
  async rejectCall(callReject: CallReject): Promise<void> {
    return this.request('/call/reject/send', {
      method: 'POST',
      body: JSON.stringify(callReject),
    });
  }

  // S3 configuration endpoints
  async getS3Config(): Promise<any> {
    return this.request('/session/s3/config');
  }

  async setS3Config(config: any): Promise<void> {
    return this.request('/session/s3/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async deleteS3Config(): Promise<void> {
    return this.request('/session/s3/config', {
      method: 'DELETE',
    });
  }

  async testS3Connection(): Promise<{ success: boolean; message: string }> {
    return this.request('/session/s3/test', {
      method: 'POST',
    });
  }

  // RabbitMQ configuration endpoints
  async getRabbitMQConfig(): Promise<any> {
    return this.request('/session/rabbitmq/config');
  }

  async setRabbitMQConfig(config: any): Promise<void> {
    return this.request('/session/rabbitmq/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async deleteRabbitMQConfig(): Promise<void> {
    return this.request('/session/rabbitmq/config', {
      method: 'DELETE',
    });
  }

  async testRabbitMQConnection(): Promise<{ success: boolean; message: string }> {
    return this.request('/session/rabbitmq/test', {
      method: 'POST',
    });
  }

  // Skip configuration endpoints
  async getSkipMediaConfig(): Promise<{ skip_media_download: boolean }> {
    return this.request('/session/skipmedia/config');
  }

  async setSkipMediaConfig(skip: boolean): Promise<void> {
    return this.request('/session/skipmedia/config', {
      method: 'POST',
      body: JSON.stringify({ skip_media_download: skip }),
    });
  }

  async getSkipGroupsConfig(): Promise<{ skip_groups: boolean }> {
    return this.request('/session/skipgroups/config');
  }

  async setSkipGroupsConfig(skip: boolean): Promise<void> {
    return this.request('/session/skipgroups/config', {
      method: 'POST',
      body: JSON.stringify({ skip_groups: skip }),
    });
  }

  async getSkipNewslettersConfig(): Promise<{ skip_newsletters: boolean }> {
    return this.request('/session/skipnewsletters/config');
  }

  async setSkipNewslettersConfig(skip: boolean): Promise<void> {
    return this.request('/session/skipnewsletters/config', {
      method: 'POST',
      body: JSON.stringify({ skip_newsletters: skip }),
    });
  }

  async getSkipBroadcastsConfig(): Promise<{ skip_broadcasts: boolean }> {
    return this.request('/session/skipbroadcasts/config');
  }

  async setSkipBroadcastsConfig(skip: boolean): Promise<void> {
    return this.request('/session/skipbroadcasts/config', {
      method: 'POST',
      body: JSON.stringify({ skip_broadcasts: skip }),
    });
  }

  async getSkipOwnMessagesConfig(): Promise<{ skip_own_messages: boolean }> {
    return this.request('/session/skipownmessages/config');
  }

  async setSkipOwnMessagesConfig(skip: boolean): Promise<void> {
    return this.request('/session/skipownmessages/config', {
      method: 'POST',
      body: JSON.stringify({ skip_own_messages: skip }),
    });
  }

  async getSkipCallsConfig(): Promise<{ skip_calls: boolean; call_reject_message: string; call_reject_type: string }> {
    return this.request('/session/skipcalls/config');
  }

  async setSkipCallsConfig(skip: boolean, message?: string, type?: string): Promise<void> {
    return this.request('/session/skipcalls/config', {
      method: 'POST',
      body: JSON.stringify({ skip_calls: skip, call_reject_message: message, call_reject_type: type }),
    });
  }

  // Proxy configuration
  async setProxy(proxyUrl: string): Promise<void> {
    return this.request('/session/proxy', {
      method: 'POST',
      body: JSON.stringify({ proxy_url: proxyUrl }),
    });
  }

  // Health check
  async checkHealth(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    return this.request('/health');
  }

  // Campaigns (custom implementation - not in the original API)
  async getCampaigns(): Promise<Campaign[]> {
    // This would be a custom endpoint you'd need to implement
    return this.request('/campaigns');
  }

  async getCampaign(id: string): Promise<Campaign> {
    return this.request(`/campaigns/${id}`);
  }

  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  }

  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
    return this.request(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaign),
    });
  }

  async deleteCampaign(id: string): Promise<void> {
    return this.request(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async startCampaign(id: string): Promise<void> {
    return this.request(`/campaigns/${id}/start`, {
      method: 'POST',
    });
  }

  async pauseCampaign(id: string): Promise<void> {
    return this.request(`/campaigns/${id}/pause`, {
      method: 'POST',
    });
  }

  async getCampaignStats(id: string): Promise<any> {
    return this.request(`/campaigns/${id}/stats`);
  }
}

const getApiUrl = () => {
  // In development, use proxy to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      // Client-side: use proxy route
      return '/api';
    } else {
      // Server-side: use direct API URL
      return process.env.NEXT_PUBLIC_API_URL || 'https://api.zuckzapgo.com';
    }
  }
  
  // In production, use direct API URL
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.zuckzapgo.com';
};

export const apiClient = new APIClient(getApiUrl());