'use client';

import { useState } from 'react';
import { usePosts } from '@/hooks/usePostsQuery';
import PostList from '@/components/posts/PostList';
import PostSearch from '@/components/posts/PostSearch';
import Pagination from '@/components/shared/Pagination';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PostPaginationParams, PostCategory } from '@/types';

const categories: PostCategory[] = [
  'BERITA',
  'PENGUMUMAN',
  'KEGIATAN',
  'PEMERINTAHAN',
  'PENDIDIKAN',
  'PERTANIAN',
  'KEBENCANAAN',
  'PARIWISATA',
  'UMKM'
];

export default function PostsPage() {
  const [params, setParams] = useState<PostPaginationParams>({
    page: 1,
    limit: 9,
    search: '',
    category: null
  });

  const { data, isLoading } = usePosts({
    ...params,
    category: params.category || undefined
  });

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setParams((prev) => ({ ...prev, search: query, page: 1 }));
  };

  const handleCategoryChange = (category: PostCategory | null) => {
    setParams((prev) => ({ ...prev, category, page: 1 }));
  };

  // Ensure activeCategory is never undefined
  const activeCategory = params.category === undefined ? null : params.category;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Berita & Informasi Terkini
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan berita, pengumuman, dan artikel terbaru seputar kegiatan dan
              perkembangan desa.
            </p>
          </div>

          <PostSearch
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            categories={categories}
            activeCategory={activeCategory}
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : (
            <>
              <PostList posts={data?.data || []} />
              {data?.meta && (
                <Pagination
                  currentPage={params.page}
                  totalPages={Math.ceil(data.meta.total / params.limit)}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}