// src/hooks/usePostsQuery.ts
import { useMemo } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PostPaginationParams, Post, PostStatus, PostCategory } from '@/types';

// ----- UTIL -----
function sanitizeParams<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  ) as Partial<T>;
}

// ----- DEFAULT -----
const DEFAULT_PARAMS: PostPaginationParams = {
  page: 1,
  limit: 9,
  search: '',
  category: null,
  status: null,
};

// ----- DECODER: untuk list posts -----
function normalizePostsResponse(raw: any): { data: Post[]; meta?: any } {
  // Struktur berdasarkan respons yang diberikan
  const list = raw?.posts || raw?.data || [];
  const meta = raw?.pagination || raw?.meta;

  const mapped: Post[] = list.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? '',
    content: p.content ?? '',
    coverImage: p.coverImage ?? '',
    featuredImage: p.coverImage ?? p.featuredImage ?? '', // Untuk kompatibilitas
    category: p.category as PostCategory,
    tags: Array.isArray(p.tags) ? p.tags : [],
    featured: p.featured ?? false,
    status: p.status as PostStatus ?? 'DRAFT', // Default ke DRAFT jika tidak ada
    author: {
      id: p.author?.id ?? '',
      name: p.author?.name ?? 'Admin'
    },
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  return { data: mapped, meta };
}

// ----- HOOKS -----
export function usePosts(params: Partial<PostPaginationParams & { featured?: boolean }> = {}) {
  const merged = useMemo(() => {
    let normalizedCategory: PostPaginationParams['category'];
    let normalizedStatus: PostPaginationParams['status'];
    
    if (typeof params.category === 'string') {
      normalizedCategory = params.category.trim() === '' ? null : params.category as PostCategory;
    } else {
      normalizedCategory = params.category ?? DEFAULT_PARAMS.category;
    }
    
    if (typeof params.status === 'string') {
      normalizedStatus = params.status.trim() === '' ? null : params.status as PostStatus;
    } else {
      normalizedStatus = params.status ?? DEFAULT_PARAMS.status;
    }
    
    return {
      ...DEFAULT_PARAMS,
      ...params,
      category: normalizedCategory,
      status: normalizedStatus,
    };
  }, [params]);

  const requestParams = useMemo(() => {
    const backendParams = {
      page: merged.page?.toString(),
      limit: merged.limit?.toString(),
      search: merged.search,
      category: merged.category,
      status: merged.status,
      featured: merged.featured,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    
    return sanitizeParams(backendParams);
  }, [merged]);

  // Fix: Add proper type for placeholderData function
  const queryOptions: UseQueryOptions<any, Error, { data: Post[]; meta?: any }, any[]> = {
    queryKey: ['posts', requestParams],
    queryFn: async () => {
      console.log('🚀 Posts API Request Params:', requestParams);
      const res = await api.get('/posts', { params: requestParams });
      console.log('✅ Posts API Response:', res.data);
      return res.data;
    },
    select: normalizePostsResponse,
    placeholderData: (previousData: any) => previousData,
  };

  return useQuery(queryOptions);
}

// Hook for featured posts
export function useFeaturedPosts(limit: number = 3) {
  const requestParams = sanitizeParams({
    limit: limit.toString(),
    featured: 'true', // Backend might expect string
    status: 'PUBLISHED',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  return useQuery({
    queryKey: ['posts', 'featured', requestParams],
    queryFn: async () => {
      console.log('🚀 Featured Posts API Request Params:', requestParams);
      const res = await api.get('/posts', { params: requestParams });
      console.log('✅ Featured Posts API Response:', res.data);
      return res.data;
    },
    select: normalizePostsResponse,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: async () => {
      const res = await api.get(`/posts/${slug}`);
      
      // Log respons untuk debugging
      console.log('Post detail response:', res.data);
      
      // Berdasarkan struktur API, single post mungkin memiliki struktur berbeda
      // Jika API mengembalikan { message: "...", post: {...} }
      if (res.data && res.data.post) {
        return { data: res.data.post };
      }
      
      // Jika API mengembalikan langsung object post
      if (res.data && res.data.id) {
        return { data: res.data };
      }
      
      // Default return
      return { data: res.data };
    },
    enabled: !!slug,
    select: (data: any) => {
      // Normalisasi data post individual
      const postData = data?.data || data;
      
      if (!postData) return null;
      
      return {
        id: postData.id,
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt ?? '',
        content: postData.content ?? '',
        coverImage: postData.coverImage ?? '',
        featuredImage: postData.coverImage ?? postData.featuredImage ?? '', // Untuk kompatibilitas
        category: postData.category as PostCategory,
        tags: Array.isArray(postData.tags) ? postData.tags : [],
        featured: postData.featured ?? false,
        status: postData.status as PostStatus ?? 'DRAFT',
        author: {
          id: postData.author?.id ?? '',
          name: postData.author?.name ?? 'Admin'
        },
        publishedAt: postData.publishedAt,
        createdAt: postData.createdAt,
        updatedAt: postData.updatedAt,
      } as Post;
    },
  });
}

export function usePostById(id: string) {
  return useQuery({
    queryKey: ['post-by-id', id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);

      console.log('Post by ID response:', res.data);

      if (res.data && res.data.post) {
        return { data: res.data.post };
      }

      if (res.data && res.data.id) {
        return { data: res.data };
      }

      return { data: res.data };
    },
    enabled: !!id,
    select: (data: any) => {
      // Normalisasi data post individual
      const postData = data?.data || data;
      
      if (!postData) return null;
      
      return {
        id: postData.id,
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt ?? '',
        content: postData.content ?? '',
        coverImage: postData.coverImage ?? '',
        featuredImage: postData.coverImage ?? postData.featuredImage ?? '', // Untuk kompatibilitas
        category: postData.category as PostCategory,
        tags: Array.isArray(postData.tags) ? postData.tags : [],
        featured: postData.featured ?? false,
        status: postData.status as PostStatus ?? 'DRAFT',
        author: {
          id: postData.author?.id ?? '',
          name: postData.author?.name ?? 'Admin'
        },
        publishedAt: postData.publishedAt,
        createdAt: postData.createdAt,
        updatedAt: postData.updatedAt,
      } as Post;
    },
  });
}