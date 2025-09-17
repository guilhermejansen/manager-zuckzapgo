'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';

/**
 * Hook que sincroniza o token de autenticação com o cliente da API
 * Garante que após o refresh da página, o token seja corretamente setado
 */
export function useAuthSync() {
  const { token, isAuthenticated } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Detecta quando a hidratação aconteceu
  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Se já hidratou, marca como hidratado
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return unsubscribe;
  }, []);

  // Sincroniza o token após a hidratação
  useEffect(() => {
    if (hasHydrated) {
      if (isAuthenticated && token) {
        apiClient.setToken(token);
      } else {
        apiClient.setToken(null);
      }
    }
  }, [token, isAuthenticated, hasHydrated]);

  return { hasHydrated };
} 