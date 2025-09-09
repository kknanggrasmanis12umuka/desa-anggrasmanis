// src/components/service-guides/ServiceGuideList.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useServiceGuides } from '@/hooks/useServiceGuides';
import { 
  useDeleteServiceGuide,
  useToggleServiceGuideActive,
  useToggleServiceGuideFeatured 
} from '@/hooks/useServiceGuidesMutation';
import  Pagination  from '@/components/shared/Pagination';
import type { ServiceGuide, ServiceGuidePaginationParams } from '@/types';

interface ServiceGuideListProps {
  initialParams?: ServiceGuidePaginationParams;
}

export default function ServiceGuideList({ initialParams }: ServiceGuideListProps) {
  const [params, setParams] = useState<ServiceGuidePaginationParams>({
    page: 1,
    limit: 12,
    ...initialParams,
  });

  const { data, isLoading, error } = useServiceGuides(params);
  const deleteServiceGuide = useDeleteServiceGuide();
  const toggleActive = useToggleServiceGuideActive();
  const toggleFeatured = useToggleServiceGuideFeatured();

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus panduan layanan ini?')) {
      try {
        await deleteServiceGuide.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await toggleActive.mutateAsync({ id, isActive: !currentActive });
    } catch (error) {
      console.error('Toggle active error:', error);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await toggleFeatured.mutateAsync({ id, isFeatured: !currentFeatured });
    } catch (error) {
      console.error('Toggle featured error:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'ADMINISTRASI': 'Administrasi',
      'KEPENDUDUKAN': 'Kependudukan',
      'SURAT_MENYURAT': 'Surat Menyurat',
      'PERTANAHAN': 'Pertanahan',
      'SOSIAL': 'Sosial',
      'LAINNYA': 'Lainnya',
    };
    return categoryMap[category] || category;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            
            {/* Table skeleton */}
            <div className="space-y-4">
              <div className="h-12 bg-gray-100 rounded"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gagal memuat data</h3>
          <p className="text-gray-500 mb-4">Terjadi kesalahan saat memuat data panduan layanan</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  const serviceGuides = data?.serviceGuides || [];
  const pagination = data?.pagination;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Panduan Layanan
              </h2>
              <p className="text-sm text-gray-500">
                {pagination ? `${pagination.total} total panduan` : 'Memuat data...'}
              </p>
            </div>
          </div>
          
          <Link
            href="/admin/layanan/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Panduan
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {serviceGuides.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada panduan layanan</h3>
            <p className="text-gray-500 mb-6">
              Mulai dengan menambahkan panduan layanan pertama untuk membantu warga desa
            </p>
            <Link
              href="/admin/layanan/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Panduan Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Panduan Layanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dibuat
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceGuides.map((guide: ServiceGuide) => (
                    <tr key={guide.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {guide.title}
                              </p>
                              {guide.isFeatured && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                  <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  Featured
                                </span>
                              )}
                            </div>
                            {guide.description && (
                              <p className="text-sm text-gray-500 truncate max-w-md mt-1">
                                {guide.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {getCategoryLabel(guide.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(guide.id, guide.isActive)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                            guide.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
                          }`}
                        >
                          <div className={`h-1.5 w-1.5 rounded-full mr-1 ${
                            guide.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          {guide.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(guide.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => handleToggleFeatured(guide.id, guide.isFeatured)}
                            className={`p-2 rounded-md text-sm transition-colors duration-200 ${
                              guide.isFeatured
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                            title={guide.isFeatured ? 'Hapus dari Featured' : 'Jadikan Featured'}
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                          
                          <Link
                            href={`/admin/layanan/edit/${guide.id}`}
                            className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors duration-200"
                            title="Edit panduan"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(guide.id)}
                            className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors duration-200"
                            title="Hapus panduan"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}