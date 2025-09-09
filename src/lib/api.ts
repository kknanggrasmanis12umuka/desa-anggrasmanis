import axios from 'axios';
import Cookies from 'js-cookie';
import { QueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    // Jangan set Content-Type untuk FormData, biarkan browser yang mengatur
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const token = localStorage.getItem('token') || Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk handle token expired dan error handling
api.interceptors.response.use(
  (response) => {
    // Format response yang konsisten
    if (response.data && typeof response.data === 'object') {
      return response;
    }
    
    // Jika response bukan object, wrap dalam structure yang konsisten
    return {
      ...response,
      data: { data: response.data }
    };
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Cookies.remove('token');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    // Format error response yang konsisten
    const formattedError = {
      ...error,
      message: error.response?.data?.message || error.message || 'Terjadi kesalahan',
      status: error.response?.status,
      data: error.response?.data
    };
    
    return Promise.reject(formattedError);
  }
);

// Helper function untuk handle file upload
export const uploadFile = async (
  file: File, 
  type: 'image' | 'document' | 'avatar' = 'image',
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
    timeout: 60000, // 60 seconds untuk upload
  });

  return response.data;
};

// Helper function untuk handle multiple file upload
export const uploadMultipleFiles = async (
  files: File[],
  type: 'image' | 'document' = 'image',
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  formData.append('type', type);

  const response = await api.post('/upload/multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
    timeout: 120000, // 120 seconds untuk multiple upload
  });

  return response.data;
};

// API endpoints
export const apiEndpoints = {
  auth: { 
    login: '/auth/login', 
    register: '/auth/register', 
    profile: '/auth/profile',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  },
  events: '/events',
  posts: '/posts',
  umkm: '/umkm',
  services: '/services',
  serviceGuides: '/service-guides',
  upload: '/upload',
  users: '/users',
  categories: '/categories',
  statistics: '/statistics',
};

// Utility functions untuk API calls
export const apiUtils = {
  // GET request dengan query params
  get: (url: string, params?: any) => api.get(url, { params }),
  
  // POST request
  post: (url: string, data?: any) => api.post(url, data),
  
  // PUT request
  put: (url: string, data?: any) => api.put(url, data),
  
  // DELETE request
  delete: (url: string) => api.delete(url),
  
  // PATCH request
  patch: (url: string, data?: any) => api.patch(url, data),
};

// React Query client dengan configuration yang lebih robust
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Jangan retry untuk 401 errors
        if (error?.status === 401) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Jangan retry untuk 401 errors
        if (error?.status === 401) return false;
        return failureCount < 1;
      },
    },
  },
});

// Error types untuk better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility untuk handle API errors
export const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    const code = error.response?.data?.code;
    
    throw new ApiError(message, status, code, error.response?.data);
  }
  
  throw new ApiError(error.message || 'Terjadi kesalahan');
};

// Auth utilities
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 7 }); // 7 days
  },
  
  getToken: () => {
    return localStorage.getItem('token') || Cookies.get('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
  },
  
  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('user');
  },
  
  clearAuth: () => {
    authUtils.removeToken();
    authUtils.removeUser();
  }
};

export default api;