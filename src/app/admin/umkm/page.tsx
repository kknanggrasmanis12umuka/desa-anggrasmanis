// src/app/admin/umkm/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Badge,
  Star
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useUMKM, useDeleteUMKM, useVerifyUMKM, useSetFeaturedUMKM } from '@/hooks/useUMKM';
import Pagination from '@/components/shared/Pagination';
import { UMKMPaginationParams, UMKM } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

const AdminUMKMPage = () => {
  const [params, setParams] = useState<UMKMPaginationParams>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [selectedUMKM, setSelectedUMKM] = useState<UMKM | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const { data, isLoading, refetch } = useUMKM(params);
  const deleteUMKMMutation = useDeleteUMKM();
  const verifyUMKMMutation = useVerifyUMKM();
  const setFeaturedMutation = useSetFeaturedUMKM();

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'UMKM' }
  ];

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const isOutside = Object.values(dropdownRefs.current).every(ref => {
        return ref && !ref.contains(event.target as Node);
      });
      
      if (isOutside) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleDelete = async () => {
    if (selectedUMKM) {
      try {
        await deleteUMKMMutation.mutateAsync(selectedUMKM.id);
        setShowDeleteModal(false);
        setSelectedUMKM(null);
        setOpenDropdownId(null);
        refetch();
      } catch (error) {
        console.error('Error deleting UMKM:', error);
      }
    }
  };

  const handleVerify = async (verified: boolean) => {
    if (selectedUMKM) {
      try {
        await verifyUMKMMutation.mutateAsync({ id: selectedUMKM.id, verified });
        setShowVerifyModal(false);
        setSelectedUMKM(null);
        setOpenDropdownId(null);
        refetch();
      } catch (error) {
        console.error('Error verifying UMKM:', error);
      }
    }
  };

  const handleSetFeatured = async (featured: boolean) => {
    if (selectedUMKM) {
      try {
        await setFeaturedMutation.mutateAsync({ id: selectedUMKM.id, featured });
        setShowFeaturedModal(false);
        setSelectedUMKM(null);
        setOpenDropdownId(null);
        refetch();
      } catch (error) {
        console.error('Error setting featured UMKM:', error);
      }
    }
  };

  // Fixed ref callback function
  const setDropdownRef = (id: string) => (el: HTMLDivElement | null) => {
    dropdownRefs.current[id] = el;
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="UMKM"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola UMKM</h1>
            <p className="text-gray-600 mt-1">
              Kelola data UMKM desa
            </p>
          </div>
          <Link
            href="/admin/umkm/create"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tambah UMKM
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari UMKM..."
                value={params.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* UMKM Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UMKM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pemilik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  // Loading rows
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 w-8 bg-gray-200 rounded ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Belum ada UMKM yang terdaftar
                    </td>
                  </tr>
                ) : (
                  data?.data.map((umkm: UMKM) => (
                    <tr key={umkm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-primary-600 font-semibold text-sm">
                              {umkm.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{umkm.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              {umkm.verified && (
                                <span className="inline-flex items-center gap-1">
                                  <Badge className="w-3 h-3 text-green-500" />
                                  Terverifikasi
                                </span>
                              )}
                              {umkm.featured && (
                                <span className="inline-flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{umkm.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{umkm.owner}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            umkm.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {umkm.isActive ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                          {!umkm.verified && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Perlu Verifikasi
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-900">
                            {umkm.rating ? umkm.rating.toFixed(1) : '0.0'}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({umkm.reviewCount})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(umkm.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="relative flex justify-end">
                          <div 
                            className="dropdown-container" 
                            ref={setDropdownRef(umkm.id)}
                          >
                            <button 
                              onClick={() => toggleDropdown(umkm.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  toggleDropdown(umkm.id);
                                }
                              }}
                              aria-haspopup="true"
                              aria-expanded={openDropdownId === umkm.id}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openDropdownId === umkm.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                                <div className="py-1">
                                  <Link
                                    href={`/admin/umkm/edit/${umkm.id}`}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setOpenDropdownId(null)}
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit UMKM
                                  </Link>
                                  <Link
                                    href={`/umkm/${umkm.id}`}
                                    target="_blank"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setOpenDropdownId(null)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Lihat Detail
                                  </Link>
                                  <button
                                    onClick={() => {
                                      setSelectedUMKM(umkm);
                                      setShowVerifyModal(true);
                                      setOpenDropdownId(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Badge className="w-4 h-4 mr-2" />
                                    {umkm.verified ? 'Batalkan Verifikasi' : 'Verifikasi'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUMKM(umkm);
                                      setShowFeaturedModal(true);
                                      setOpenDropdownId(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Star className="w-4 h-4 mr-2" />
                                    {umkm.featured ? 'Hapus Featured' : 'Jadikan Featured'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUMKM(umkm);
                                      setShowDeleteModal(true);
                                      setOpenDropdownId(null);
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data?.meta && (
            <div className="px-6 py-3 border-t">
              <Pagination
                currentPage={params.page}
                totalPages={Math.ceil(data.meta.total / params.limit)}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Hapus UMKM</h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus UMKM "{selectedUMKM?.name}"? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteUMKMMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteUMKMMutation.isPending ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verify Confirmation Modal */}
        {showVerifyModal && selectedUMKM && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {selectedUMKM.verified ? 'Batalkan Verifikasi' : 'Verifikasi'} UMKM
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin {selectedUMKM.verified ? 'membatalkan verifikasi' : 'memverifikasi'} 
                UMKM "{selectedUMKM.name}"?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleVerify(!selectedUMKM.verified)}
                  disabled={verifyUMKMMutation.isPending}
                  className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                    selectedUMKM.verified 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {verifyUMKMMutation.isPending ? 'Memproses...' : 
                   selectedUMKM.verified ? 'Batalkan Verifikasi' : 'Verifikasi'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Featured Confirmation Modal */}
        {showFeaturedModal && selectedUMKM && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {selectedUMKM.featured ? 'Hapus dari Featured' : 'Jadikan Featured'} UMKM
              </h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin {selectedUMKM.featured ? 'menghapus dari featured' : 'menjadikan featured'} 
                UMKM "{selectedUMKM.name}"?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowFeaturedModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleSetFeatured(!selectedUMKM.featured)}
                  disabled={setFeaturedMutation.isPending}
                  className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
                    selectedUMKM.featured 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {setFeaturedMutation.isPending ? 'Memproses...' : 
                   selectedUMKM.featured ? 'Hapus Featured' : 'Jadikan Featured'}
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

export default AdminUMKMPage;