// src/hooks/useContactsMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CreateContactPayload, UpdateContactPayload } from '@/types';

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContactPayload) => {
      const res = await api.post('/contacts', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact-types'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContactPayload }) => {
      const res = await api.patch(`/contacts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact:', id);
      
      try {
        const response = await api.delete(`/contacts/${id}`);
        console.log('Delete response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Delete error:', error);
        throw error;
      }
    },
    
    onSuccess: (data, variables) => {
      console.log('Delete successful for contact:', variables);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.refetchQueries({ 
        queryKey: ['contacts'], 
        type: 'active' 
      });
    },
    
    onError: (error) => {
      console.error('Delete mutation failed:', error);
    },
  });
}

export function useToggleActiveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      console.log('API Call: Toggling active for contact:', id);
      console.log('Payload:', { isActive });
      
      try {
        const response = await api.patch(`/contacts/${id}/toggle-active`, { 
          isActive 
        });
        
        console.log('Raw API Response:', response);
        console.log('Response Data:', response.data);
        
        let responseData = response.data;
        
        if (responseData.data) {
          responseData = responseData.data;
        }
        
        if (responseData.contact) {
          responseData = responseData.contact;
        }
        
        console.log('Processed Response Data:', responseData);
        
        return responseData;
        
      } catch (error: any) {
        console.error('Toggle Active Error Details:');
        console.error('  Error object:', error);
        console.error('  Error response:', error.response);
        console.error('  Error response data:', error.response?.data);
        console.error('  Error status:', error.response?.status);
        console.error('  Error message:', error.message);
        
        const errorMessage = error.response?.data?.message 
          || error.message 
          || 'Gagal mengubah status aktif';
          
        throw new Error(`Toggle Active Failed: ${errorMessage}`);
      }
    },
    
    onSuccess: (data, variables) => {
      console.log('Toggle Active Success!');
      console.log('  Variables sent:', variables);
      console.log('  Data received:', data);
      
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
      
      queryClient.refetchQueries({ 
        queryKey: ['contacts'], 
        type: 'active' 
      });
      
      queryClient.setQueryData(
        ['contacts'], 
        (oldData: any) => {
          if (oldData?.data) {
            const updatedContacts = oldData.data.map((contact: any) => {
              if (contact.id === variables.id) {
                return { ...contact, isActive: variables.isActive };
              }
              return contact;
            });
            
            return {
              ...oldData,
              data: updatedContacts
            };
          }
          return oldData;
        }
      );
      
      console.log('Cache invalidated and updated');
    },
    
    onError: (error: any, variables) => {
      console.error('Toggle Active Mutation Error:');
      console.error('  Error:', error);
      console.error('  Variables:', variables);
      console.error('  Error message:', error.message);
    },
  });
}