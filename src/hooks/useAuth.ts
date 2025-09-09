import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useEffect } from 'react';
import { api, authUtils } from '@/lib/api';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'EDITOR';
  phone?: string;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'ADMIN' | 'OPERATOR' | 'EDITOR';
}

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          queryClient.setQueryData(['user'], parsedUser);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await api.post<AuthResponse>('/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      authUtils.setToken(data.token);
      authUtils.setUser(data.user);
      setUser(data.user); // Update local state
      queryClient.setQueryData(['user'], data.user);
      
      // Redirect setelah state diupdate
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 0);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const { confirmPassword, ...dataToSend } = userData as any;
      const res = await api.post<AuthResponse>('/auth/register', dataToSend);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user); // Update local state
      queryClient.setQueryData(['user'], data.user);
      router.push('/profile');
    },
  });

  const logout = useCallback(() => {
    authUtils.clearAuth();
    setUser(null);
    queryClient.setQueryData(['user'], null);
    queryClient.clear();
    router.push('/auth/login');
  }, [queryClient, router]);

  const getProfile = useCallback(async () => {
    try {
      const res = await api.get<{ message: string; user: User }>('/auth/me');
      const userData = res.data.user;
      setUser(userData);
      authUtils.setUser(userData);
      return userData;
    } catch (error) {
      authUtils.clearAuth();
      setUser(null);
      throw error;
    }
  }, []);

  return {
    user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    getProfile,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
}