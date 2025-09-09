// src/components/admin/UserSearch.tsx
import { useState } from 'react';
import { Search, Filter, X, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { UserPaginationParams, UserRole } from '@/types';

interface UserSearchProps {
  onSearch: (params: UserPaginationParams) => void;
  initialParams?: UserPaginationParams;
}

const roles = [
  { value: '', label: 'Semua Role' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'OPERATOR', label: 'Operator' },
];

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'true', label: 'Aktif' },
  { value: 'false', label: 'Tidak Aktif' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Tanggal Dibuat' },
  { value: 'name', label: 'Nama' },
  { value: 'email', label: 'Email' },
  { value: 'lastLogin', label: 'Login Terakhir' },
];

const sortOrderOptions = [
  { value: 'DESC', label: 'Terbaru' },
  { value: 'ASC', label: 'Terlama' },
];

export default function UserSearch({ onSearch, initialParams }: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialParams?.search || '');
  const [selectedRole, setSelectedRole] = useState<UserRole | null | undefined>(
    initialParams?.role || null
  );
  const [selectedStatus, setSelectedStatus] = useState<boolean | null | undefined>(
    initialParams?.isActive !== undefined && initialParams?.isActive !== null 
      ? initialParams.isActive 
      : null
  );
  const [sortBy, setSortBy] = useState(initialParams?.sortBy || 'createdAt');
  const [sortOrder, setSortOrder] = useState(initialParams?.sortOrder || 'DESC');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const params: UserPaginationParams = {
      page: 1,
      limit: 10,
      search: searchTerm || undefined,
      role: selectedRole || undefined,
      isActive: selectedStatus !== null ? selectedStatus : undefined,
      sortBy,
      sortOrder,
    };

    onSearch(params);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole(null);
    setSelectedStatus(null);
    setSortBy('createdAt');
    setSortOrder('DESC');
    
    onSearch({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
  };

  const hasActiveFilters = searchTerm || selectedRole !== null || selectedStatus !== null;

  // Convert selectedRole to string for the select value
  const selectedRoleValue = selectedRole === null ? '' : selectedRole || '';

  // Convert selectedStatus to string for the select value
  const selectedStatusValue = selectedStatus === null ? '' : selectedStatus ? 'true' : 'false';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Cari berdasarkan nama, email, atau username..."
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-md flex items-center gap-2 transition-colors ${
              showFilters || hasActiveFilters
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[searchTerm, selectedRole, selectedStatus].filter(Boolean).length}
              </span>
            )}
          </button>
          
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedRoleValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedRole(value === '' ? null : value as UserRole);
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedStatusValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedStatus(value === '' ? null : value === 'true');
                  }}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urutkan berdasarkan
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urutan
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOrderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {selectedRole !== null && selectedRole !== undefined && (
                <span className="flex items-center bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  <Shield className="w-3 h-3 mr-1" />
                  {roles.find(r => r.value === selectedRole)?.label}
                </span>
              )}
              {selectedStatus !== null && selectedStatus !== undefined && (
                <span className="flex items-center bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  {selectedStatus ? (
                    <UserCheck className="w-3 h-3 mr-1" />
                  ) : (
                    <UserX className="w-3 h-3 mr-1" />
                  )}
                  {selectedStatus ? 'Aktif' : 'Tidak Aktif'}
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Bersihkan Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}