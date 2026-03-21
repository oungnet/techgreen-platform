import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: Date;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  logout: () => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: user !== null,
        error: null 
      }),

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        error: null,
      }),

      reset: () => set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'user-store', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
