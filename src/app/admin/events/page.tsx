// src/app/admin/events/page.tsx
'use client';

import React, { useState } from 'react';
import  Link  from 'next/link';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import EventSearch from '@/components/events/EventSearch';
import Pagination from '@/components/shared/Pagination';
import { useEvents } from '@/hooks/useEvents';
import { useDeleteEvent } from '@/hooks/useEventsMutation';
import type { EventPaginationParams, EventCategory } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

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

const EventsPage = () => {
  const [searchParams, setSearchParams] = useState<EventPaginationParams>({
    page: 1,
    limit: 10,
    search: '',
    category: null,
  });

  const { data, isLoading, refetch } = useEvents(searchParams);
  const deleteEventMutation = useDeleteEvent();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Acara' }
  ];

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleCategoryChange = (category: EventCategory | null) => {
    setSearchParams(prev => ({ ...prev, category, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync(id);
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
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
    return labels[category] || category;
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Acara"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manajemen Acara</h1>
            <p className="text-gray-600 mt-1">
              Kelola acara dan kegiatan desa
            </p>
          </div>
          <Link
            href="/admin/events/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Acara
          </Link>
        </div>

        {/* Search & Filter */}
        <EventSearch 
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          activeCategory={searchParams.category || null}
        />

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat data acara...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acara
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Peserta
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.data.map((event: any) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {event.description}
                              </div>
                              <div className="flex items-center mt-1 space-x-2">
                                {event.isFeatured && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    Unggulan
                                  </span>
                                )}
                                {!event.isPublic && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Draft
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getCategoryLabel(event.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div>{formatDate(event.startDate)}</div>
                              {event.startTime && (
                                <div className="text-xs text-gray-500">
                                  {event.startTime}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(event.startDate) > new Date() ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Akan Datang
                            </span>
                          ) : new Date(event.endDate || event.startDate) >= new Date() ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Berlangsung
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Selesai
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.maxParticipants ? (
                            <div className="flex items-center">
                              <span>{event.currentParticipants || 0}/{event.maxParticipants}</span>
                              <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${((event.currentParticipants || 0) / event.maxParticipants) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Tidak terbatas</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/events/${event.id}`}
                              className="text-gray-400 hover:text-gray-600"
                              title="Lihat"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/events/edit/${event.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(event.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data?.meta && (
                <div className="bg-white px-6 py-3 border-t">
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus acara ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={deleteEventMutation.isPending}
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                  disabled={deleteEventMutation.isPending}
                >
                  {deleteEventMutation.isPending ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default EventsPage;