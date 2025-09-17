'use client';

import { useState, useEffect } from 'react';
import { SessionStatus } from '@/types';
import { fetchInstanceStatus } from '@/lib/api/instance';
import { useAuthStore } from '@/store/auth-store';

interface UseInstanceStatusReturn {
  status: SessionStatus | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useInstanceStatus(): UseInstanceStatusReturn {
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuthStore();

  const fetchStatus = async () => {
    // Só faz a requisição se estiver autenticado e tiver token
    if (!isAuthenticated || !token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchInstanceStatus();
      setStatus(data);
    } catch (err) {
      console.error('Error fetching instance status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch status';
      
      // Se for erro de autorização, não tentar novamente automaticamente
      if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
        setError('Token invalid or expired');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchStatus();
  };

  useEffect(() => {
    // Só executa se estiver autenticado
    if (isAuthenticated && token) {
      fetchStatus();

      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchStatus, 30000);

      return () => clearInterval(interval);
    } else {
      // Se não estiver autenticado, limpa os dados
      setStatus(null);
      setLoading(false);
      setError('User not authenticated');
    }
  }, [isAuthenticated, token]); // Dependências incluem isAuthenticated e token

  return {
    status,
    loading,
    error,
    refresh,
  };
} 