// src/hooks/useEvents.ts
import { useQuery } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import { Event, EventPaginationParams } from '@/types';

// Utility function to sanitize parameters
function sanitizeParams<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  ) as Partial<T>;
}

// Utility function to normalize events response from API
function normalizeEventsResponse(raw: any): Event[] {
  const eventsData = raw?.events || raw?.data || raw;
  
  if (!Array.isArray(eventsData)) {
    console.error('Invalid events response format:', raw);
    return [];
  }
  
  return eventsData.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    content: event.content ?? '',
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    address: event.address,
    latitude: event.latitude,
    longitude: event.longitude,
    category: event.category,
    images: Array.isArray(event.images) ? event.images : [],
    isPublic: event.isPublic ?? true,
    isFeatured: event.isFeatured ?? false,
    maxParticipants: event.maxParticipants,
    currentParticipants: event.currentParticipants ?? 0,
    registrationRequired: event.registrationRequired ?? false,
    registrationDeadline: event.registrationDeadline,
    contactPerson: event.contactPerson,
    contactPhone: event.contactPhone,
    tags: Array.isArray(event.tags) ? event.tags : [],
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  } as Event));
}

// Get all events with pagination and filters
export function useEvents(params?: EventPaginationParams) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      try {
        // Only use parameters that match the backend DTO
        const apiParams: Record<string, any> = {};
        
        if (params?.search) apiParams.search = params.search;
        if (params?.category) apiParams.category = params.category;
        if (params?.startDate) apiParams.startDate = params.startDate;
        if (params?.endDate) apiParams.endDate = params.endDate;
        if (params?.page) apiParams.page = params.page.toString();
        if (params?.limit) apiParams.limit = params.limit.toString();
        
        // Convert boolean parameters to string for API compatibility
        if (params?.isPublic !== undefined) {
          apiParams.isPublic = params.isPublic.toString();
        }
        if (params?.isFeatured !== undefined) {
          apiParams.isFeatured = params.isFeatured.toString();
        }

        // Remove any sort/order parameters that don't exist in backend DTO
        const sanitizedParams = sanitizeParams(apiParams);
        
        console.log('Events API Request Params:', sanitizedParams);
        
        const response = await api.get('/events', { params: sanitizedParams });
        
        console.log('Events API Response:', response.data);
        
        return {
          data: response.data.events || response.data.data || [],
          meta: response.data.pagination || response.data.meta
        };
      } catch (error) {
        console.error('Events API Error:', error);
        handleApiError(error);
      }
    },
  });
}

// Hook for getting recent/upcoming events
export function useUpcomingEvents(limit: number = 3) {
  const requestParams = sanitizeParams({
    limit: limit.toString(),
    isPublic: true,
    sortBy: 'startDate',
    sortOrder: 'asc',
  });

  return useQuery({
    queryKey: ['events', 'upcoming', requestParams],
    queryFn: async () => {
      const res = await api.get('/events', { params: requestParams });
      return res.data;
    },
    select: (raw: any) => normalizeEventsResponse(raw),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for getting a single event
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const res = await api.get(`/events/${id}`);
      return res.data;
    },
    enabled: !!id,
    select: (data: any) => {
      const eventData = data?.data || data?.event || data;
      
      if (!eventData) return null;
      
      return {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        content: eventData.content ?? '',
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        address: eventData.address,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        category: eventData.category,
        images: Array.isArray(eventData.images) ? eventData.images : [],
        isPublic: eventData.isPublic ?? true,
        isFeatured: eventData.isFeatured ?? false,
        maxParticipants: eventData.maxParticipants,
        currentParticipants: eventData.currentParticipants ?? 0,
        registrationRequired: eventData.registrationRequired ?? false,
        registrationDeadline: eventData.registrationDeadline,
        contactPerson: eventData.contactPerson,
        contactPhone: eventData.contactPhone,
        tags: Array.isArray(eventData.tags) ? eventData.tags : [],
        createdAt: eventData.createdAt,
        updatedAt: eventData.updatedAt,
      } as Event;
    },
  });
}