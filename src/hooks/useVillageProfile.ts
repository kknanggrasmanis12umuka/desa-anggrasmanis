// src/hooks/useVillageProfile.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { VillageProfile, VillageProfilePaginationParams, VillageProfileSection } from '@/types';

// Get all village profiles with pagination and filters
export const useVillageProfiles = (params: VillageProfilePaginationParams) => {
  return useQuery({
    queryKey: ['village-profiles', params],
    queryFn: async () => {
      const response = await api.get('/village-profiles', { params });
      return {
        data: response.data.villageProfiles as VillageProfile[],
        meta: response.data.pagination
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single village profile by ID
export const useVillageProfile = (id: string) => {
  return useQuery({
    queryKey: ['village-profile', id],
    queryFn: async () => {
      const response = await api.get(`/village-profiles/${id}`);
      return response.data.villageProfile as VillageProfile;
    },
    enabled: !!id,
  });
};

// Get village profile by section
export const useVillageProfileBySection = (section: string) => {
  return useQuery({
    queryKey: ['village-profile-section', section],
    queryFn: async () => {
      const response = await api.get(`/village-profiles/section/${section}`);
      return response.data.villageProfile as VillageProfile;
    },
    enabled: !!section,
  });
};

// Get published village profiles
export const usePublishedVillageProfiles = () => {
  return useQuery({
    queryKey: ['village-profiles-published'],
    queryFn: async () => {
      const response = await api.get('/village-profiles/published');
      return response.data.villageProfiles as VillageProfile[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get all sections
export const useVillageProfileSections = () => {
  return useQuery({
    queryKey: ['village-profile-sections'],
    queryFn: async () => {
      const response = await api.get('/village-profiles/sections');
      return response.data.sections as VillageProfileSection[];
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};