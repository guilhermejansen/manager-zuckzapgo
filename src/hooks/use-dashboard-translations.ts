import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hook que retorna as traduções corretas para o dashboard da instância
 * Automaticamente seleciona entre 'admin.dashboard' ou 'instance.dashboard'
 * baseado no contexto do usuário (admin ou usuário individual)
 */
export function useDashboardTranslations() {
  const { type } = useAuthStore();
  
  // Determina o namespace baseado no tipo de usuário
  // Se é admin, usa admin.dashboard
  // Se é usuário individual, usa instance.dashboard
  const namespace = type === 'admin' ? 'admin.dashboard' : 'instance.dashboard';
  
  return useTranslations(namespace);
}

/**
 * Hook específico para admin dashboard
 * Sempre usa o namespace 'admin.dashboard'
 */
export function useAdminDashboardTranslations() {
  return useTranslations('admin.dashboard');
}

/**
 * Hook específico para instance dashboard individual
 * Sempre usa o namespace 'instance.dashboard'
 */
export function useInstanceDashboardTranslations() {
  return useTranslations('instance.dashboard');
} 