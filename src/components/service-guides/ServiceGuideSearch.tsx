// src/components/service-guides/ServiceGuideSearch.tsx

'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ServiceCategory } from '@/types';

interface ServiceGuideSearchProps {
  onSearch?: (params: any) => void;
}

const CATEGORY_OPTIONS: { value: ServiceCategory | ''; label: string }[] = [
  { value: '', label: 'Semua Kategori' },
  { value: 'ADMINISTRASI', label: 'Administrasi' },
  { value: 'KEPENDUDUKAN', label: 'Kependudukan' },
  { value: 'SURAT_MENYURAT', label: 'Surat Menyurat' },
  { value: 'PERTANAHAN', label: 'Pertanahan' },
  { value: 'SOSIAL', label: 'Sosial' },
  { value: 'LAINNYA', label: 'Lainnya' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'true', label: 'Aktif' },
  { value: 'false', label: 'Nonaktif' },
];

const FEATURED_OPTIONS = [
  { value: '', label: 'Semua' },
  { value: 'true', label: 'Featured' },
  { value: 'false', label: 'Bukan Featured' },
];

export default function ServiceGuideSearch({ onSearch }: ServiceGuideSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    isActive: searchParams.get('isActive') || '',
    isFeatured: searchParams.get('isFeatured') || '',
  });

  const handleFilterChange = useCallback((key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    
    const queryString = params.toString();
    router.push(`/admin/layanan${queryString ? `?${queryString}` : ''}`);

    // Call onSearch if provided
    if (onSearch) {
      const searchParams = {
        page: 1,
        limit: 12,
        search: newFilters.search || undefined,
        category: newFilters.category || undefined,
        isActive: newFilters.isActive ? newFilters.isActive === 'true' : undefined,
        isFeatured: newFilters.isFeatured ? newFilters.isFeatured === 'true' : undefined,
      };
      onSearch(searchParams);
    }
  }, [filters, router, onSearch]);

  const handleReset = () => {
    const resetFilters = {
      search: '',
      category: '',
      isActive: '',
      isFeatured: '',
    };
    setFilters(resetFilters);
    router.push('/admin/layanan');

    if (onSearch) {
      onSearch({ page: 1, limit: 12 });
    }
  };

  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filter & Pencarian</h3>
              <p className="text-sm text-gray-500">
                Cari dan filter panduan layanan berdasarkan kriteria tertentu
              </p>
            </div>
          </div>
          
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFiltersCount} filter aktif
              </span>
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset Semua
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Cari Panduan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Cari berdasarkan judul..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {CATEGORY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="isActive"
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div className="space-y-2">
            <label htmlFor="isFeatured" className="block text-sm font-medium text-gray-700">
              Featured
            </label>
            <select
              id="isFeatured"
              value={filters.isFeatured}
              onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {FEATURED_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Filter Cepat:</span>
            
            <button
              onClick={() => handleFilterChange('isActive', 'true')}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                filters.isActive === 'true'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5" />
              Aktif
            </button>
            
            <button
              onClick={() => handleFilterChange('isFeatured', 'true')}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                filters.isFeatured === 'true'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </button>
            
            {CATEGORY_OPTIONS.slice(1, 4).map(category => (
              <button
                key={category.value}
                onClick={() => handleFilterChange('category', category.value)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                  filters.category === category.value
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}