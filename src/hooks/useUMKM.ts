// src/hooks/useUMKM.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError, uploadMultipleFiles } from '@/lib/api';
import { UMKMPaginationParams, CreateUMKMPayload, UMKMFormData } from '@/types';

// Get all UMKM with pagination and filters
export function useUMKM(params?: UMKMPaginationParams) {
  return useQuery({
    queryKey: ['umkm', params],
    queryFn: async () => {
      try {
        // Convert boolean parameters to string for API compatibility
        const apiParams: Record<string, any> = { ...params };
        
        if (apiParams.isActive !== undefined) {
          apiParams.isActive = apiParams.isActive.toString();
        }
        if (apiParams.featured !== undefined) {
          apiParams.featured = apiParams.featured.toString();
        }
        if (apiParams.verified !== undefined) {
          apiParams.verified = apiParams.verified.toString();
        }

        const response = await api.get('/umkm', { params: apiParams });
        return {
          data: response.data.umkms,
          meta: response.data.pagination
        };
      } catch (error) {
        handleApiError(error);
      }
    },
  });
}

// Get single UMKM by ID
export function useUMKMById(id: string) {
  return useQuery({
    queryKey: ['umkm', id],
    queryFn: async () => {
      try {
        const response = await api.get(`/umkm/${id}`);
        return response.data.umkm;
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!id,
  });
}

// Get featured UMKM
export function useFeaturedUMKM(limit = 6) {
  return useQuery({
    queryKey: ['umkm', 'featured', limit],
    queryFn: async () => {
      try {
        const response = await api.get(`/umkm/featured?limit=${limit}`);
        return response.data.umkms;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
}

// Get top rated UMKM
export function useTopRatedUMKM(limit = 6) {
  return useQuery({
    queryKey: ['umkm', 'top-rated', limit],
    queryFn: async () => {
      try {
        const response = await api.get(`/umkm/top-rated?limit=${limit}`);
        return response.data.umkms;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
}

// Get UMKM categories
export function useUMKMCategories() {
  return useQuery({
    queryKey: ['umkm', 'categories'],
    queryFn: async () => {
      try {
        const response = await api.get('/umkm/categories');
        return response.data.categories;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
}

// Get UMKM by category
export function useUMKMByCategory(category: string, limit = 12) {
  return useQuery({
    queryKey: ['umkm', 'category', category, limit],
    queryFn: async () => {
      try {
        const response = await api.get(`/umkm/category/${category}?limit=${limit}`);
        return response.data.umkms;
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!category,
  });
}

// Get nearby UMKM
export function useNearbyUMKM(
  latitude: number, 
  longitude: number, 
  radius = 5, 
  limit = 12
) {
  return useQuery({
    queryKey: ['umkm', 'nearby', latitude, longitude, radius, limit],
    queryFn: async () => {
      try {
        const response = await api.get('/umkm/nearby', {
          params: { latitude, longitude, radius, limit }
        });
        return response.data.umkms;
      } catch (error) {
        handleApiError(error);
      }
    },
    enabled: !!(latitude && longitude),
  });
}

// Create UMKM
export function useCreateUMKM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUMKMPayload) => {
      try {
        const response = await api.post('/umkm', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
    },
  });
}

// Update UMKM
export function useUpdateUMKM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateUMKMPayload> }) => {
      try {
        const response = await api.patch(`/umkm/${id}`, data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
      queryClient.invalidateQueries({ queryKey: ['umkm', id] });
    },
  });
}

// Delete UMKM
export function useDeleteUMKM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/umkm/${id}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
    },
  });
}

// Verify UMKM (Admin only)
export function useVerifyUMKM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      try {
        const response = await api.patch(`/umkm/${id}/verify`, { verified });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
      queryClient.invalidateQueries({ queryKey: ['umkm', id] });
    },
  });
}

// Set featured UMKM (Admin only)
export function useSetFeaturedUMKM() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      try {
        const response = await api.patch(`/umkm/${id}/feature`, { featured });
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
      queryClient.invalidateQueries({ queryKey: ['umkm', id] });
    },
  });
}

// Helper function for form submission with file upload
export function useUMKMFormSubmission() {
  const createMutation = useCreateUMKM();
  const updateMutation = useUpdateUMKM();

  const submitUMKM = async (
    formData: UMKMFormData,
    files: File[] = [],
    umkmId?: string
  ) => {
    try {
      let imageUrls: string[] = [];

      // Upload images if provided
      if (files.length > 0) {
        const uploadResponse = await uploadMultipleFiles(files, 'image');
        imageUrls = uploadResponse.files.map((file: any) => file.url);
      }

      // Convert form data to API payload
      const payload: CreateUMKMPayload = {
        ...formData,
        images: imageUrls,
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof CreateUMKMPayload] === undefined) {
          delete payload[key as keyof CreateUMKMPayload];
        }
      });

      console.log('UMKM Payload being sent:', payload);

      if (umkmId) {
        return updateMutation.mutateAsync({ id: umkmId, data: payload });
      } else {
        return createMutation.mutateAsync(payload);
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    submitUMKM,
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
}