// src/app/umkm/page.tsx
'use client';

import { useState } from 'react';
import { useUMKM, useUMKMCategories } from '@/hooks/useUMKM';
import UMKMList from '@/components/umkm/UMKMList';
import UMKMSearch from '@/components/umkm/UMKMSearch';
import Pagination from '@/components/shared/Pagination';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { UMKMPaginationParams } from '@/types';

export default function UMKMPage() {
  const [params, setParams] = useState<UMKMPaginationParams>({
    page: 1,
    limit: 12,
    search: '',
    category: undefined,
    isActive: true,
    verified: true, // Only show verified UMKM for public
  });

  const { data, isLoading } = useUMKM(params);
  const { data: categories } = useUMKMCategories();

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setParams((prev) => ({ ...prev, search: query, page: 1 }));
  };

  const handleCategoryChange = (category: string | null) => {
    // Convert null to undefined to match the UMKMPaginationParams type
    const normalizedCategory = category === null ? undefined : category;
    setParams((prev) => ({ ...prev, category: normalizedCategory, page: 1 }));
  };

  const handleRatingChange = (rating: number | null) => {
    // Convert null to undefined to match the UMKMPaginationParams type
    const normalizedRating = rating === null ? undefined : rating;
    setParams((prev) => ({ ...prev, minRating: normalizedRating, page: 1 }));
  };

  const handleLocationFilter = (latitude: number, longitude: number, radius: number) => {
    setParams((prev) => ({ ...prev, latitude, longitude, radius, page: 1 }));
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setParams((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  // Convert undefined to null for the UMKMSearch component
  const activeCategory = params.category === undefined ? null : params.category;
  const activeRating = params.minRating === undefined ? null : params.minRating;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              UMKM Desa
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai produk dan jasa unggulan dari UMKM lokal desa kami.
              Dukung ekonomi lokal dengan berbelanja dari tetangga sendiri!
            </p>
          </div>

          <UMKMSearch
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onRatingChange={handleRatingChange}
            onLocationFilter={handleLocationFilter}
            onSortChange={handleSortChange}
            categories={categories || []}
            activeCategory={activeCategory}
            activeRating={activeRating}
          />

          <UMKMList umkms={data?.data || []} loading={isLoading} />

          {data?.meta && (
            <Pagination
              currentPage={params.page}
              totalPages={Math.ceil(data.meta.total / params.limit)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}