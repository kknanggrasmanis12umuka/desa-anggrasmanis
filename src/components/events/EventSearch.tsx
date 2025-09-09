import { useState, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { EventCategory } from '@/types';
import { debounce } from 'lodash';

interface EventSearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: EventCategory | null) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  categories: EventCategory[];
  activeCategory?: EventCategory | null; // Make optional
}

export default function EventSearch({ 
  onSearch, 
  onCategoryChange, 
  onDateRangeChange,
  categories, 
  activeCategory = null // Default value
}: EventSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleCategoryClick = (category: EventCategory) => {
    if (activeCategory === category) {
      onCategoryChange(null);
    } else {
      onCategoryChange(category);
    }
  };

  const handleDateRangeSubmit = () => {
    if (onDateRangeChange && startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
    if (onDateRangeChange) {
      onDateRangeChange('', '');
    }
  };

  const getCategoryLabel = (category: EventCategory) => {
    const labels: Record<EventCategory, string> = {
      RAPAT_DESA: 'Rapat Desa',
      KEGIATAN_BUDAYA: 'Budaya',
      POSYANDU: 'Posyandu',
      GOTONG_ROYONG: 'Gotong Royong',
      PELATIHAN: 'Pelatihan',
      SOSIALISASI: 'Sosialisasi',
      OLAHRAGA: 'Olahraga',
      KEAGAMAAN: 'Keagamaan',
      PENDIDIKAN: 'Pendidikan',
      KESEHATAN: 'Kesehatan',
    };
    return labels[category];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari acara atau kegiatan..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Kategori:</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                activeCategory === category
                  ? 'bg-primary-100 text-primary-800 border-primary-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
          {activeCategory && (
            <button
              onClick={() => onCategoryChange(null)}
              className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && onDateRangeChange && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Tanggal:</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Dari Tanggal:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Sampai Tanggal:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleDateRangeSubmit}
                disabled={!startDate || !endDate}
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Terapkan
              </button>
              {(startDate || endDate) && (
                <button
                  onClick={clearDateRange}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}