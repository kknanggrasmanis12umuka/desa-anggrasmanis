// hooks/posts/usePostsMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Post } from '@/types';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Post>) => {
      const res = await api.post('/posts', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Post> }) => {
      const res = await api.put(`/posts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// FIXED: Enhanced toggle featured with proper API handling
export function useToggleFeaturedPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      console.log('🚀 API Call: Toggling featured for post:', id);
      console.log('🚀 Payload:', { featured });
      console.log('🚀 Full URL:', `${api.defaults.baseURL}/posts/${id}/featured`);
      
      try {
        // Make the API call
        const response = await api.patch(`/posts/${id}/featured`, { 
          featured 
        });
        
        console.log('✅ Raw API Response:', response);
        console.log('✅ Response Data:', response.data);
        
        // Handle different response structures
        let responseData = response.data;
        
        // If the response has nested data structure
        if (responseData.data) {
          responseData = responseData.data;
        }
        
        // If the response has a post property
        if (responseData.post) {
          responseData = responseData.post;
        }
        
        console.log('✅ Processed Response Data:', responseData);
        
        return responseData;
        
      } catch (error: any) {
        console.error('❌ Toggle Featured Error Details:');
        console.error('  Error object:', error);
        console.error('  Error response:', error.response);
        console.error('  Error response data:', error.response?.data);
        console.error('  Error status:', error.response?.status);
        console.error('  Error message:', error.message);
        
        // Re-throw with more context
        const errorMessage = error.response?.data?.message 
          || error.message 
          || 'Gagal mengubah status featured';
          
        throw new Error(`Toggle Featured Failed: ${errorMessage}`);
      }
    },
    
    onSuccess: (data, variables) => {
      console.log('✅ Toggle Featured Success!');
      console.log('  Variables sent:', variables);
      console.log('  Data received:', data);
      
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      
      // Force refetch current page data
      queryClient.refetchQueries({ 
        queryKey: ['posts'], 
        type: 'active' 
      });
      
      // Optional: Update specific queries in cache
      queryClient.setQueryData(
        ['posts'], 
        (oldData: any) => {
          if (oldData?.data) {
            const updatedPosts = oldData.data.map((post: any) => {
              if (post.id === variables.id) {
                return { ...post, featured: variables.featured };
              }
              return post;
            });
            
            return {
              ...oldData,
              data: updatedPosts
            };
          }
          return oldData;
        }
      );
      
      console.log('🔄 Cache invalidated and updated');
    },
    
    onError: (error: any, variables) => {
      console.error('❌ Toggle Featured Mutation Error:');
      console.error('  Error:', error);
      console.error('  Variables:', variables);
      console.error('  Error message:', error.message);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting post:', id);
      
      try {
        const response = await api.delete(`/posts/${id}`);
        console.log('✅ Delete response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ Delete error:', error);
        throw error;
      }
    },
    
    onSuccess: (data, variables) => {
      console.log('✅ Delete successful for post:', variables);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.refetchQueries({ 
        queryKey: ['posts'], 
        type: 'active' 
      });
    },
    
    onError: (error) => {
      console.error('❌ Delete mutation failed:', error);
    },
  });
}