import { useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useUserStore } from '@/stores/userStore';

/**
 * Custom hook that integrates useAuth with Zustand user store
 * Automatically syncs auth state to global store
 */
export function useAuthStore() {
  const { user, isAuthenticated, loading, error, logout: authLogout } = useAuth();
  const { setUser, setIsAuthenticated, setIsLoading, setError, logout: storeLogout } = useUserStore();
  
  // Type guard for user object
  const typedUser = user as any;

  // Sync auth state to store
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (user) {
      setUser({
        id: String(user.id),
        email: user.email || '',
        name: user.name || '',
        role: user.role,
        avatar: user.avatar || undefined,
        createdAt: new Date(user.createdAt),
      });
    } else {
      setUser(null);
    }
  }, [user, setUser]);

  useEffect(() => {
    setIsAuthenticated(isAuthenticated);
  }, [isAuthenticated, setIsAuthenticated]);

  useEffect(() => {
    if (error) {
      const err = new Error(error?.message || 'An error occurred');
      setError(err);
    }
  }, [error, setError]);

  // Combined logout that clears both auth and store
  const logout = async () => {
    try {
      await authLogout();
      storeLogout();
    } catch (err) {
      console.error('Logout failed:', err);
      storeLogout();
    }
  };

  return {
    user: user as any,
    isAuthenticated,
    isLoading: loading,
    error,
    logout,
  };
}
