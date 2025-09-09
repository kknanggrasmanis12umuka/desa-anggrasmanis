// src/components/contact/ContactSearch.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContactPaginationParams, ContactType } from '@/types';

interface ContactSearchProps {
  onSearch: (params: ContactPaginationParams) => void;
  showCreateButton?: boolean;
}

const contactTypeOptions = [
  { value: '', label: 'Semua Tipe' },
  { value: 'KEPALA_DESA', label: 'Kepala Desa' },
  { value: 'SEKRETARIS_DESA', label: 'Sekretaris Desa' },
  { value: 'BENDAHARA_DESA', label: 'Bendahara Desa' },
  { value: 'KEPALA_URUSAN', label: 'Kepala Urusan' },
  { value: 'KEPALA_DUSUN', label: 'Kepala Dusun' },
  { value: 'RT_RW', label: 'RT/RW' },
  { value: 'BPD', label: 'BPD' },
  { value: 'KARANG_TARUNA', label: 'Karang Taruna' },
  { value: 'PKK', label: 'PKK' },
  { value: 'POSYANDU', label: 'Posyandu' },
  { value: 'KADER_KESEHATAN', label: 'Kader Kesehatan' },
  { value: 'GURU', label: 'Guru' },
  { value: 'TOKOH_AGAMA', label: 'Tokoh Agama' },
  { value: 'TOKOH_MASYARAKAT', label: 'Tokoh Masyarakat' },
  { value: 'UMKM', label: 'UMKM' },
  { value: 'LAINNYA', label: 'Lainnya' },
];

const ContactSearch: React.FC<ContactSearchProps> = ({ onSearch, showCreateButton = false }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const handleSearch = () => {
    const params: ContactPaginationParams = {
      page: 1,
      limit: 12,
      search: searchTerm.trim() || undefined,
      type: selectedType ? (selectedType as ContactType) : undefined,
      isActive: isActiveFilter === '' ? undefined : isActiveFilter === 'true',
      department: departmentFilter.trim() || undefined,
    };

    onSearch(params);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedType('');
    setIsActiveFilter('');
    setDepartmentFilter('');
    
    onSearch({
      page: 1,
      limit: 12,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Pencarian & Filter</h3>
        {showCreateButton && (
          <button
            onClick={() => router.push('/admin/contacts/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Tambah Kontak
          </button>
        )}
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cari
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nama, posisi, telepon..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipe
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {contactTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departemen
          </label>
          <input
            type="text"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nama departemen..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Cari
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ContactSearch;