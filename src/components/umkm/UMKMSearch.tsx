// src/components/umkm/UMKMSearch.tsx
import { useState, useEffect } from 'react';
import { Search, Filter, X, Star, MapPin } from 'lucide-react';

interface UMKMSearchProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  onRatingChange: (rating: number | null) => void;
  onLocationFilter: (latitude: number, longitude: number, radius: number) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  categories: string[];
  activeCategory?: string | null;
  activeRating?: number | null;
}

export default function UMKMSearch({
  onSearch,
  onCategoryChange,
  onRatingChange,
  onLocationFilter,
  onSortChange,
  categories,
  activeCategory,
  activeRating
}: UMKMSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    radius: '5'
  });

  const ratings = [5, 4, 3, 2, 1];

  const sortOptions = [
    { value: 'createdAt', label: 'Terbaru' },
    { value: 'name', label: 'Nama A-Z' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'reviewCount', label: 'Paling Banyak Review' },
  ];

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, onSearch]);

  const handleCategoryClick = (category: string) => {
    const newCategory = activeCategory === category ? null : category;
    onCategoryChange(newCategory);
  };

  const handleRatingClick = (rating: number) => {
    const newRating = activeRating === rating ? null : rating;
    onRatingChange(newRating);
  };

  const handleSortChange = (newSortBy: string, newSortOrder?: 'asc' | 'desc') => {
    const finalSortOrder = newSortOrder || (newSortBy === 'name' ? 'asc' : 'desc');
    setSortBy(newSortBy);
    setSortOrder(finalSortOrder);
    onSortChange(newSortBy, finalSortOrder);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            ...locationData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak dapat mengakses lokasi. Pastikan izin lokasi telah diberikan.');
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolokasi.');
    }
  };

  const handleLocationSubmit = () => {
    const lat = parseFloat(locationData.latitude);
    const lng = parseFloat(locationData.longitude);
    const radius = parseInt(locationData.radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      alert('Mohon masukkan koordinat yang valid');
      return;
    }

    onLocationFilter(lat, lng, radius);
    setShowLocationModal(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    onCategoryChange(null);
    onRatingChange(null);
    setSortBy('createdAt');
    setSortOrder('desc');
    onSortChange('createdAt', 'desc');
  };

  const activeFiltersCount = 
    (activeCategory ? 1 : 0) + 
    (activeRating ? 1 : 0) + 
    (searchQuery ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari UMKM berdasarkan nama, kategori, atau pemilik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'border-primary-500 text-primary-600 bg-primary-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filter
          {activeFiltersCount > 0 && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowLocationModal(true)}
          className="px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors"
          title="Cari berdasarkan lokasi"
        >
          <MapPin className="w-4 h-4" />
          Terdekat
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-6 border-t pt-6">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Kategori</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Rating Minimal</h3>
            <div className="flex gap-2">
              {ratings.map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingClick(rating)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                    activeRating === rating
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  {rating}+
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Urutkan</h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    sortBy === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-gray-600">
                {activeFiltersCount} filter aktif
              </span>
              <button
                onClick={clearAllFilters}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Hapus Semua Filter
              </button>
            </div>
          )}
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cari UMKM Terdekat</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={getCurrentLocation}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Gunakan Lokasi Saat Ini
              </button>

              <div className="text-center text-gray-500 text-sm">atau masukkan manual</div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={locationData.latitude}
                    onChange={(e) => setLocationData({...locationData, latitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="-7.xxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={locationData.longitude}
                    onChange={(e) => setLocationData({...locationData, longitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="110.xxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Radius (km)
                </label>
                <select
                  value={locationData.radius}
                  onChange={(e) => setLocationData({...locationData, radius: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="1">1 km</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="25">25 km</option>
                  <option value="50">50 km</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleLocationSubmit}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}