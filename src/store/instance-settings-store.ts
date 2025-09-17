'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SessionStatus, 
  InstanceManagementFormData
} from '@/types';

interface InstanceSettingsState {
  // Current instance status
  status: SessionStatus | null;
  loading: boolean;
  error: string | null;
  
  // Form data
  formData: InstanceManagementFormData;
  hasUnsavedChanges: boolean;
  
  // UI state
  activeTab: string;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isLoggingOut: boolean;
  
  // Connection states
  qrCode: string | null;
  linkingCode: string | null;
  showQR: boolean;
  showPairing: boolean;
  
  // Actions
  setStatus: (status: SessionStatus | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  updateFormData: (section: keyof InstanceManagementFormData, data: any) => void;
  resetFormData: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  setActiveTab: (tab: string) => void;
  setIsConnecting: (connecting: boolean) => void;
  setIsDisconnecting: (disconnecting: boolean) => void;
  setIsLoggingOut: (loggingOut: boolean) => void;
  
  setQRCode: (qrCode: string | null) => void;
  setLinkingCode: (code: string | null) => void;
  setShowQR: (show: boolean) => void;
  setShowPairing: (show: boolean) => void;
  
  // Reset all
  reset: () => void;
}

const getDefaultFormData = (): InstanceManagementFormData => ({
  general: {
    name: '',
    webhook: '',
    events: ''
  },
  session: {
    connect: false,
    disconnect: false,
    logout: false
  },
  proxy: {
    enabled: false,
    proxy_url: ''
  },
  s3: {
    enabled: false,
    endpoint: '',
    region: 'us-east-1',
    bucket: '',
    access_key: '',
    secret_key: '',
    path_style: false,
    public_url: '',
    media_delivery: 'both',
    retention_days: 30
  },
  rabbitmq: {
    enabled: false,
    url: '',
    exchange: '',
    exchange_type: 'topic',
    queue: '',
    queue_type: 'classic',
    routing_key: '',
    events: 'All',
    durable: true,
    auto_delete: false,
    exclusive: false,
    no_wait: false,
    delivery_mode: 2
  },
  skips: {
    skip_media_download: false,
    skip_groups: false,
    skip_newsletters: false,
    skip_broadcasts: false,
    skip_own_messages: false,
    skip_calls: false,
    call_reject_message: '',
    call_reject_type: 'busy'
  }
});

export const useInstanceSettingsStore = create<InstanceSettingsState>()(
  persist(
    (set) => ({
      // Initial state
      status: null,
      loading: false,
      error: null,
      
      formData: getDefaultFormData(),
      hasUnsavedChanges: false,
      
      activeTab: 'general',
      isConnecting: false,
      isDisconnecting: false,
      isLoggingOut: false,
      
      qrCode: null,
      linkingCode: null,
      showQR: false,
      showPairing: false,
      
      // Actions
      setStatus: (status) => set({ status }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      updateFormData: (section, data) => set((state) => ({
        formData: {
          ...state.formData,
          [section]: {
            ...state.formData[section],
            ...data
          }
        },
        hasUnsavedChanges: true
      })),
      
      resetFormData: () => set({ 
        formData: getDefaultFormData(),
        hasUnsavedChanges: false 
      }),
      
      setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      setIsConnecting: (connecting) => set({ isConnecting: connecting }),
      setIsDisconnecting: (disconnecting) => set({ isDisconnecting: disconnecting }),
      setIsLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
      
      setQRCode: (qrCode) => set({ qrCode }),
      setLinkingCode: (code) => set({ linkingCode: code }),
      setShowQR: (show) => set({ showQR: show }),
      setShowPairing: (show) => set({ showPairing: show }),
      
      reset: () => set({
        status: null,
        loading: false,
        error: null,
        formData: getDefaultFormData(),
        hasUnsavedChanges: false,
        activeTab: 'general',
        isConnecting: false,
        isDisconnecting: false,
        isLoggingOut: false,
        qrCode: null,
        linkingCode: null,
        showQR: false,
        showPairing: false
      })
    }),
    {
      name: 'instance-settings-storage',
      partialize: (state) => ({
        activeTab: state.activeTab,
        formData: state.formData
      })
    }
  )
);

// Selectors for easier access
export const useInstanceSettingsActions = () => {
  const store = useInstanceSettingsStore();
  return {
    setStatus: store.setStatus,
    setLoading: store.setLoading,
    setError: store.setError,
    updateFormData: store.updateFormData,
    resetFormData: store.resetFormData,
    setHasUnsavedChanges: store.setHasUnsavedChanges,
    setActiveTab: store.setActiveTab,
    setIsConnecting: store.setIsConnecting,
    setIsDisconnecting: store.setIsDisconnecting,
    setIsLoggingOut: store.setIsLoggingOut,
    setQRCode: store.setQRCode,
    setLinkingCode: store.setLinkingCode,
    setShowQR: store.setShowQR,
    setShowPairing: store.setShowPairing,
    reset: store.reset
  };
};

// Helper to populate form data from status
export const populateFormDataFromStatus = (status: SessionStatus): InstanceManagementFormData => ({
  general: {
    name: status.name || '',
    webhook: status.webhook || '',
    events: status.events || ''
  },
  session: {
    connect: status.connected || false,
    disconnect: false,
    logout: false
  },
  proxy: {
    enabled: status.proxy_config?.enabled || false,
    proxy_url: status.proxy_config?.proxy_url || ''
  },
  s3: {
    enabled: status.s3_config?.enabled || false,
    endpoint: status.s3_config?.endpoint || '',
    region: status.s3_config?.region || 'us-east-1',
    bucket: status.s3_config?.bucket || '',
    access_key: status.s3_config?.access_key || '',
    secret_key: status.s3_config?.secret_key || '',
    path_style: status.s3_config?.path_style || false,
    public_url: status.s3_config?.public_url || '',
    media_delivery: status.s3_config?.media_delivery || 'both',
    retention_days: status.s3_config?.retention_days || 30
  },
  rabbitmq: {
    enabled: status.rabbitmq_config?.enabled || false,
    url: status.rabbitmq_config?.url || '',
    exchange: status.rabbitmq_config?.exchange || '',
    exchange_type: status.rabbitmq_config?.exchange_type || 'topic',
    queue: status.rabbitmq_config?.queue || '',
    queue_type: status.rabbitmq_config?.queue_type || 'classic',
    routing_key: status.rabbitmq_config?.routing_key || '',
    events: status.rabbitmq_config?.events || 'All',
    durable: status.rabbitmq_config?.durable ?? true,
    auto_delete: status.rabbitmq_config?.auto_delete ?? false,
    exclusive: status.rabbitmq_config?.exclusive ?? false,
    no_wait: status.rabbitmq_config?.no_wait ?? false,
    delivery_mode: status.rabbitmq_config?.delivery_mode || 2
  },
  skips: {
    skip_media_download: status.skip_media_download || false,
    skip_groups: status.skip_groups || false,
    skip_newsletters: status.skip_newsletters || false,
    skip_broadcasts: status.skip_broadcasts || false,
    skip_own_messages: status.skip_own_messages || false,
    skip_calls: status.skip_calls || false,
    call_reject_message: status.call_reject_message || '',
    call_reject_type: (status.call_reject_type as 'busy' | 'declined' | 'unavailable') || 'busy'
  }
});