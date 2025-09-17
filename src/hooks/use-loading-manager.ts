'use client';

import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
  loadingType?: 'page' | 'component' | 'inline';
  setLoading: (loading: boolean, message?: string, type?: 'page' | 'component' | 'inline') => void;
  clearLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingMessage: undefined,
  loadingType: 'component',
  setLoading: (loading, message, type = 'component') => 
    set({ isLoading: loading, loadingMessage: message, loadingType: type }),
  clearLoading: () => 
    set({ isLoading: false, loadingMessage: undefined, loadingType: 'component' })
}));

/**
 * Hook para gerenciar loading states de forma global
 * Permite controlar diferentes tipos de loading (página, componente, inline)
 */
export function useLoadingManager() {
  const { isLoading, loadingMessage, loadingType, setLoading, clearLoading } = useLoadingStore();

  const showPageLoading = (message?: string) => {
    setLoading(true, message, 'page');
  };

  const showComponentLoading = (message?: string) => {
    setLoading(true, message, 'component');
  };

  const showInlineLoading = (message?: string) => {
    setLoading(true, message, 'inline');
  };

  const hideLoading = () => {
    clearLoading();
  };

  return {
    isLoading,
    loadingMessage,
    loadingType,
    showPageLoading,
    showComponentLoading,
    showInlineLoading,
    hideLoading
  };
} 