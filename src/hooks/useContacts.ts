// src/hooks/useContacts.ts

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ContactPaginationParams, Contact, ContactType } from '@/types';

// ----- UTIL -----
function sanitizeParams<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  ) as Partial<T>;
}

// ----- DEFAULT -----
const DEFAULT_PARAMS: ContactPaginationParams = {
  page: 1,
  limit: 12,
  search: '',
  type: null,
  isActive: null,
  department: '',
  sortBy: 'order',
  sortOrder: 'asc',
};

// ----- DECODER: untuk list contacts -----
function normalizeContactsResponse(raw: any): { data: Contact[]; meta?: any } {
  // Struktur berdasarkan respons backend
  const list = raw?.contacts || raw?.data || [];
  const meta = raw?.pagination || raw?.meta;

  const mapped: Contact[] = list.map((c: any) => ({
    id: c.id,
    name: c.name,
    position: c.position,
    department: c.department ?? '',
    phone: c.phone ?? '',
    whatsapp: c.whatsapp ?? '',
    email: c.email ?? '',
    address: c.address ?? '',
    type: c.type as ContactType,
    isActive: c.isActive ?? true,
    order: c.order ?? 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return { data: mapped, meta };
}

// ----- HOOKS -----
export function useContacts(params: Partial<ContactPaginationParams> = {}) {
  const merged = useMemo(() => {
    let normalizedType: ContactPaginationParams['type'];
    let normalizedIsActive: ContactPaginationParams['isActive'];
    
    if (typeof params.type === 'string') {
      normalizedType = params.type.trim() === '' ? null : params.type as ContactType;
    } else {
      normalizedType = params.type ?? DEFAULT_PARAMS.type;
    }
    
    if (typeof params.isActive === 'string') {
      normalizedIsActive = params.isActive === 'true' ? true : 
                           params.isActive === 'false' ? false : null;
    } else {
      normalizedIsActive = params.isActive ?? DEFAULT_PARAMS.isActive;
    }
    
    return {
      ...DEFAULT_PARAMS,
      ...params,
      type: normalizedType,
      isActive: normalizedIsActive,
    };
  }, [params]);

  const requestParams = useMemo(() => sanitizeParams(merged), [merged]);

  return useQuery({
    queryKey: ['contacts', requestParams],
    queryFn: async () => {
      const res = await api.get('/contacts', { params: requestParams });
      return res.data;
    },
    select: (raw: any) => normalizeContactsResponse(raw),
  });
}

// Hook untuk mengambil contact berdasarkan ID
export function useContact(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
      const res = await api.get(`/contacts/${id}`);
      
      console.log('Contact detail response:', res.data);
      
      if (res.data && res.data.contact) {
        return { data: res.data.contact };
      }
      
      if (res.data && res.data.id) {
        return { data: res.data };
      }
      
      return { data: res.data };
    },
    enabled: !!id,
    select: (data: any) => {
      const contactData = data?.data || data;
      
      if (!contactData) return null;
      
      return {
        id: contactData.id,
        name: contactData.name,
        position: contactData.position,
        department: contactData.department ?? '',
        phone: contactData.phone ?? '',
        whatsapp: contactData.whatsapp ?? '',
        email: contactData.email ?? '',
        address: contactData.address ?? '',
        type: contactData.type as ContactType,
        isActive: contactData.isActive ?? true,
        order: contactData.order ?? 0,
        createdAt: contactData.createdAt,
        updatedAt: contactData.updatedAt,
      } as Contact;
    },
  });
}

// Hook untuk mengambil contacts berdasarkan type
export function useContactsByType(type: ContactType, limit?: number) {
  return useQuery({
    queryKey: ['contacts', 'by-type', type, limit],
    queryFn: async () => {
      const res = await api.get(`/contacts/type/${type}`, {
        params: limit ? { limit: limit.toString() } : undefined
      });
      return res.data;
    },
    enabled: !!type,
    select: (raw: any) => normalizeContactsResponse(raw),
  });
}

// Hook untuk mengambil types yang tersedia
export function useContactTypes() {
  return useQuery({
    queryKey: ['contact-types'],
    queryFn: async () => {
      const res = await api.get('/contacts/types');
      return res.data;
    },
    select: (data: any) => {
      const types = data?.types || [];
      return types;
    },
  });
}