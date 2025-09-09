// src/hooks/useUsersMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import { CreateUserPayload, UpdateUserPayload, ChangePasswordPayload } from '@/types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserPayload) => {
      try {
        const response = await api.post('/users', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserPayload }) => {
      try {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.patch(`/users/${id}/verify`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useChangeUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ChangePasswordPayload }) => {
      try {
        const response = await api.patch(`/users/${id}/change-password`, data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}