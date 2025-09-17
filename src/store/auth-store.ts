import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserInstance } from '@/types';
import { apiClient } from '@/lib/api/client';

interface AuthState {
  token: string | null;
  type: 'admin' | 'instance' | null;
  user: UserInstance | null;
  isAuthenticated: boolean;
  login: (token: string, type: 'admin' | 'instance', user?: UserInstance) => void;
  logout: () => void;
  updateUser: (user: UserInstance) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      type: null,
      user: null,
      isAuthenticated: false,
      login: (token, type, user) => {
        // Set cookies for middleware
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        document.cookie = `user-type=${type}; path=/; max-age=${60 * 60 * 24 * 7}`;
        
        // Set token in API client immediately
        apiClient.setToken(token);
        
        set({ 
          token, 
          type, 
          user: user || null, 
          isAuthenticated: true 
        });
      },
      logout: () => {
        // Clear cookies
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user-type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Clear token from API client
        apiClient.setToken(null);
        
        set({ 
          token: null, 
          type: null, 
          user: null, 
          isAuthenticated: false 
        });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Após a hidratação, sincronizar token com o cliente da API
        if (state?.isAuthenticated && state?.token) {
          apiClient.setToken(state.token);
        }
      },
    }
  )
);