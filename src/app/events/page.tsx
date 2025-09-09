'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import EventList from '@/components/events/EventList';
import EventSearch from '@/components/events/EventSearch';
import Pagination from '@/components/shared/Pagination';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { EventPaginationParams, EventCategory } from '@/types';

const categories: EventCategory[] = [
  'RAPAT_DESA',
  'KEGIATAN_BUDAYA',
  'POSYANDU',
  'GOTONG_ROYONG',
  'PELATIHAN',
  'SOSIALISASI',
  'OLAHRAGA',
  'KEAGAMAAN',
  'PENDIDIKAN',
  'KESEHATAN'
];

export default function EventsPage() {
  const [params, setParams] = useState<EventPaginationParams>({
    page: 1,
    limit: 9,
    search: '',
    category: null, // Explicitly set to null
    isPublic: true,
  });

  const { data, isLoading } = useEvents(params);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setParams((prev) => ({ ...prev, search: query, page: 1 }));
  };

  const handleCategoryChange = (category: EventCategory | null) => {
    setParams((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setParams((prev) => ({ 
      ...prev, 
      startDate: startDate || undefined, 
      endDate: endDate || undefined, 
      page: 1 
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Acara & Kegiatan Desa
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan berbagai acara dan kegiatan menarik yang akan berlangsung di desa kami.
              Jangan sampai terlewat!
            </p>
          </div>

          <EventSearch
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onDateRangeChange={handleDateRangeChange}
            categories={categories}
            activeCategory={params.category ?? null } // Now this will always be null or EventCategory
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : (
            <>
              <EventList events={data?.data || []} />
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