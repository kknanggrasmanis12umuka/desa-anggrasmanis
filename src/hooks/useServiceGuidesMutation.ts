// src/hooks/useServiceGuidesMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiEndpoints, handleApiError } from '@/lib/api';
import type { 
  CreateServiceGuidePayload, 
  UpdateServiceGuidePayload 
} from '@/types';

export function useCreateServiceGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceGuidePayload) => {
      try {
        const response = await api.post(apiEndpoints.serviceGuides, data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-guides'] });
      queryClient.invalidateQueries({ queryKey: ['service-guides-featured'] });
    },
  });
}

export function useUpdateServiceGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateServiceGuidePayload }) => {
      try {
        const response = await api.patch(`${apiEndpoints.serviceGuides}/${id}`, data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['service-guides'] });
      queryClient.invalidateQueries({ queryKey: ['service-guide', id] });
      queryClient.invalidateQueries({ queryKey: ['service-guides-featured'] });
    },
  });
}

export function useDeleteServiceGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`${apiEndpoints.serviceGuides}/${id}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-guides'] });
      queryClient.invalidateQueries({ queryKey: ['service-guides-featured'] });
    },
  });
}

export function useToggleServiceGuideActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      try {
        const response = await api.patch(`${apiEndpoints.serviceGuides}/${id}/toggle-active`, {
          isActive
        });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['service-guides'] });
      queryClient.invalidateQueries({ queryKey: ['service-guide', id] });
    },
  });
}

export function useToggleServiceGuideFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      try {
        const response = await api.patch(`${apiEndpoints.serviceGuides}/${id}/toggle-featured`, {
          isFeatured
        });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['service-guides'] });
      queryClient.invalidateQueries({ queryKey: ['service-guide', id] });
      queryClient.invalidateQueries({ queryKey: ['service-guides-featured'] });
    },
  });
}