// src/components/admin/UserList.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserType, UserPaginationParams } from '@/types';
import { useUsers } from '@/hooks/useUsers';
import UserCard from './UserCard';
import UserSearch from './UserSearch';
import Pagination from '@/components/shared/Pagination';
import { Users, Plus, AlertCircle, Loader2 } from 'lucide-react';

export default function UserList() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<UserPaginationParams>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const { data, isLoading, error, refetch } = useUsers(searchParams);

  const handleSearch = (newParams: UserPaginationParams) => {
    setSearchParams({ ...newParams, limit: searchParams.limit });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page });
  };

  const handleEdit = (user: UserType) => {
    router.push(`/admin/users/edit/${user.id}`);
  };

  const handleView = (user: UserType) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleCreate = () => {
    router.push('/admin/users/create');
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Gagal memuat data user
        </h3>
        <p className="text-gray-600 mb-4">
          {error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manajemen User
            </h1>
            <p className="text-gray-600">
              Kelola pengguna sistem dan hak akses mereka
            </p>
          </div>
        </div>
        
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah User
        </button>
      </div>

      {/* Statistics */}
      {data?.meta && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total User</p>
                <p className="text-xl font-semibold text-gray-900">
                  {data.meta.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Halaman</p>
                <p className="text-xl font-semibold text-gray-900">
                  {data.meta.page} dari {Math.ceil(data.meta.total / searchParams.limit)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Per Halaman</p>
                <p className="text-xl font-semibold text-gray-900">
                  {searchParams.limit}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <UserSearch 
        onSearch={handleSearch}
        initialParams={searchParams}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Memuat data user...</p>
        </div>
      )}

      {/* User Grid */}
      {!isLoading && data?.data && (
        <>
          {data.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((user: UserType) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada user ditemukan
              </h3>
              <p className="text-gray-600 mb-4">
                {searchParams.search 
                  ? 'Coba ubah kata kunci pencarian atau filter'
                  : 'Belum ada user yang terdaftar di sistem'}
              </p>
              {!searchParams.search && (
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                >
                  Tambah User Pertama
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {data?.meta && data.meta.total > searchParams.limit && (
            <div className="flex justify-center">
              <Pagination
                currentPage={searchParams.page}
                totalPages={Math.ceil(data.meta.total / searchParams.limit)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}