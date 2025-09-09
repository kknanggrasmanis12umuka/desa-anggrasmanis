import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError, uploadMultipleFiles } from '@/lib/api';
import { CreateEventPayload, EventFormData } from '@/types';

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventPayload) => {
      try {
        const response = await api.post('/events', data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateEventPayload> }) => {
      try {
        const response = await api.patch(`/events/${id}`, data);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await api.delete(`/events/${id}`);
        return response.data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Helper function for form submission with file upload
// Helper function for form submission with file upload
// Helper function for form submission with file upload
export function useEventFormSubmission() {
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

  const submitEvent = async (
    formData: EventFormData,
    files: File[] = [],
    eventId?: string
  ) => {
    try {
      let imageUrls: string[] = [];

      // Upload images if provided
      if (files.length > 0) {
        const uploadResponse = await uploadMultipleFiles(files, 'image');
        imageUrls = uploadResponse.files.map((file: any) => file.url);
      }

      // Handle maxParticipants conversion
      let maxParticipants: number | null = null;
      
      // Check if maxParticipants exists and is a valid number
      if (formData.maxParticipants !== undefined && 
          formData.maxParticipants !== null) {
        
        // Convert to number if it's a string
        const numericValue = typeof formData.maxParticipants === 'string' 
          ? parseInt(formData.maxParticipants, 10) 
          : formData.maxParticipants;
        
        // Only set if it's a valid positive number
        if (!isNaN(numericValue) && numericValue > 0) {
          maxParticipants = numericValue;
        }
      }

      // Convert form data to API payload
      const payload: CreateEventPayload = {
        ...formData,
        maxParticipants, // Use the converted value
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        images: imageUrls,
        isPublic: formData.isPublic ?? true,
        registrationRequired: formData.registrationRequired ?? false,
        registrationDeadline: formData.registrationRequired
    ?   formData.registrationDeadline || null
        : null, // pastikan null kalau tidak perlu pendaftaran
      };

      // Remove undefined values (keep null for API)
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof CreateEventPayload] === undefined) {
          delete payload[key as keyof CreateEventPayload];
        }
      });

      console.log('Payload being sent:', payload);
      console.log('maxParticipants type:', typeof payload.maxParticipants);
      console.log('maxParticipants value:', payload.maxParticipants);

      if (eventId) {
        return updateMutation.mutateAsync({ id: eventId, data: payload });
      } else {
        return createMutation.mutateAsync(payload);
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    submitEvent,
    isLoading: createMutation.isPending || updateMutation.isPending,
    error: createMutation.error || updateMutation.error,
  };
}