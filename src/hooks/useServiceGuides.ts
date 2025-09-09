// src/hooks/useServiceGuides.ts

import { useQuery } from '@tanstack/react-query';
import { api, apiEndpoints } from '@/lib/api';
import type {  
  ServiceGuidePaginationParams,
  ServiceCategory 
} from '@/types';

export function useServiceGuides(params: ServiceGuidePaginationParams = { page: 1, limit: 12 }) {
  return useQuery({
    queryKey: ['service-guides', params],
    queryFn: async () => {
      const response = await api.get(apiEndpoints.serviceGuides, { params });
      return response.data;
    },
  });
}

export function useServiceGuide(id: string) {
  return useQuery({
    queryKey: ['service-guide', id],
    queryFn: async () => {
      const response = await api.get(`${apiEndpoints.serviceGuides}/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useServiceGuideBySlug(slug: string) {
  return useQuery({
    queryKey: ['service-guide-slug', slug],
    queryFn: async () => {
      const response = await api.get(`${apiEndpoints.serviceGuides}/slug/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedServiceGuides(limit = 6) {
  return useQuery({
    queryKey: ['service-guides-featured', limit],
    queryFn: async () => {
      const response = await api.get(`${apiEndpoints.serviceGuides}/featured`, {
        params: { limit }
      });
      return response.data;
    },
  });
}

export function useServiceGuidesByCategory(category: ServiceCategory, limit?: number) {
  return useQuery({
    queryKey: ['service-guides-category', category, limit],
    queryFn: async () => {
      const response = await api.get(`${apiEndpoints.serviceGuides}/category/${category}`, {
        params: limit ? { limit } : {}
      });
      return response.data;
    },
    enabled: !!category,
  });
}

export function useServiceGuideCategories() {
  return useQuery({
    queryKey: ['service-guide-categories'],
    queryFn: async () => {
      const response = await api.get(`${apiEndpoints.serviceGuides}/categories`);
      return response.data;
    },
  });
}

export function useSearchServiceGuides(query: string) {
  return useQuery({
    queryKey: ['service-guides-search', query],
    queryFn: async () => {
      const response = await api.get(`${apiEndpoints.serviceGuides}/search`, {
        params: { q: query }
      });
      return response.data;
    },
    enabled: !!query,
  });
}