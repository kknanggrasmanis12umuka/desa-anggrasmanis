// src/components/village-profile/VillageProfileSearch.tsx
'use client';

import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

interface VillageProfileSearchProps {
  onSearch: (query: string) => void;
  onSectionFilter: (section: string | null) => void;
  onPublishedFilter: (isPublished: boolean | null) => void;
  activeSection?: string | null;
  activePublished?: boolean | null;
}

export default function VillageProfileSearch({
  onSearch,
  onSectionFilter,
  onPublishedFilter,
  activeSection,
  activePublished,
}: VillageProfileSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Cari Profil Desa
          </label>
          <input
            id="search"
            type="text"
            placeholder="Cari berdasarkan section, title, atau content..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Section Filter */}
        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Section
          </label>
          <select
            id="section"
            value={activeSection || ''}
            onChange={(e) => onSectionFilter(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Section</option>
            <option value="sejarah">Sejarah</option>
            <option value="geografi">Geografi</option>
            <option value="visi_misi">Visi & Misi</option>
            <option value="struktur_organisasi">Struktur Organisasi</option>
            <option value="demografi">Demografi</option>
            <option value="potensi_desa">Potensi Desa</option>
            <option value="sarana_prasarana">Sarana & Prasarana</option>
            <option value="program_kerja">Program Kerja</option>
          </select>
        </div>

        
        {/* Published Filter */}
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-2">
            Status Publikasi
          </label>
          <select
            id="published"
            value={activePublished === null || activePublished === undefined ? '' : activePublished.toString()}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                onPublishedFilter(null);
              } else {
                onPublishedFilter(value === 'true');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Status</option>
            <option value="true">Dipublikasikan</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>
    </div>
  );
}