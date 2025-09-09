
// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { UserPaginationParams } from '@/types';

export function useUsers(params: UserPaginationParams = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await api.get('/users', { params });
      return response.data;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await api.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: async () => {
      const response = await api.get('/users/stats');
      return response.data;
    },
  });
}