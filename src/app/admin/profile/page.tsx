'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import VillageProfileSearch from '@/components/village-profile/VillageProfileSearch';
import VillageProfileList from '@/components/village-profile/VillageProfileList';
import Pagination from '@/components/shared/Pagination';
import { useVillageProfiles } from '@/hooks/useVillageProfile';
import { 
  useDeleteVillageProfile, 
  useTogglePublishVillageProfile 
} from '@/hooks/useVillageProfileMutation';
import { VillageProfilePaginationParams } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function AdminVillageProfilePage() {
  const [params, setParams] = useState<VillageProfilePaginationParams>({
    page: 1,
    limit: 12,
    search: '',
    section: undefined,
    isPublished: undefined,
    sortBy: 'order',
    sortOrder: 'asc',
  });

  const { data, isLoading, error } = useVillageProfiles(params);
  const deleteVillageProfile = useDeleteVillageProfile();
  const togglePublish = useTogglePublishVillageProfile();

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleSearch = (search: string) => {
    setParams(prev => ({ ...prev, search, page: 1 }));
  };

  const handleSectionFilter = (section: string | null) => {
    setParams(prev => ({ ...prev, section: section || undefined, page: 1 }));
  };

  const handlePublishedFilter = (isPublished: boolean | null) => {
    setParams(prev => ({ ...prev, isPublished: isPublished || undefined, page: 1 }));
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await togglePublish.mutateAsync({ id, isPublished });
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Gagal mengubah status publikasi');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVillageProfile.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting village profile:', error);
      alert('Gagal menghapus profil desa');
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Error loading village profiles</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Refresh
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profil Desa</h1>
            <p className="text-gray-600">Kelola konten profil desa</p>
          </div>
          <Link
            href="/admin/profile/create"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Tambah Profil
          </Link>
        </div>

        {/* Stats Cards */}
        {data?.meta && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-900">{data.meta.total}</div>
              <div className="text-gray-600">Total Profil</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600">
                {data.data.filter(p => p.isPublished).length}
              </div>
              <div className="text-gray-600">Published</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-gray-600">
                {data.data.filter(p => !p.isPublished).length}
              </div>
              <div className="text-gray-600">Draft</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(data.data.map(p => p.section)).size}
              </div>
              <div className="text-gray-600">Section</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <VillageProfileSearch
          onSearch={handleSearch}
          onSectionFilter={handleSectionFilter}
          onPublishedFilter={handlePublishedFilter}
          activeSection={params.section || null}
          activePublished={params.isPublished || null}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <div className="space-y-6">
            <VillageProfileList
              profiles={data?.data || []}
              isAdmin={true}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {data?.meta && data.meta.total > params.limit && (
              <Pagination
                currentPage={params.page}
                totalPages={Math.ceil(data.meta.total / params.limit)}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
      
    </AdminLayout>
    </RoleGuard>
  );
}
