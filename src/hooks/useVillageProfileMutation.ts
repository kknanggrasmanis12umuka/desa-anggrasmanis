//src/hooks/useVillageProfileMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { 
  CreateVillageProfilePayload, 
  UpdateVillageProfilePayload,
  ReorderSectionPayload 
} from '@/types';

export const useCreateVillageProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVillageProfilePayload) => {
      const response = await api.post('/village-profiles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['village-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['village-profiles-published'] });
      queryClient.invalidateQueries({ queryKey: ['village-profile-sections'] });
    },
  });
};

export const useUpdateVillageProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateVillageProfilePayload }) => {
      const response = await api.patch(`/village-profiles/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['village-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['village-profile', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['village-profiles-published'] });
      queryClient.invalidateQueries({ queryKey: ['village-profile-sections'] });
    },
  });
};

export const useDeleteVillageProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/village-profiles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['village-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['village-profiles-published'] });
      queryClient.invalidateQueries({ queryKey: ['village-profile-sections'] });
    },
  });
};

export const useTogglePublishVillageProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const response = await api.patch(`/village-profiles/${id}/toggle-publish`, { isPublished });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['village-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['village-profile', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['village-profiles-published'] });
      queryClient.invalidateQueries({ queryKey: ['village-profile-sections'] });
    },
  });
};

export const useReorderVillageProfiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sections: ReorderSectionPayload[]) => {
      const response = await api.post('/village-profiles/reorder', sections);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['village-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['village-profiles-published'] });
      queryClient.invalidateQueries({ queryKey: ['village-profile-sections'] });
    },
  });
};