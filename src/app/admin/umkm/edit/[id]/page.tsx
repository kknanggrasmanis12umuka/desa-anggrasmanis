// src/app/admin/umkm/edit/[id]/page.tsx
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import UMKMForm from '@/components/umkm/UMKMForm';
import { useUMKMById } from '@/hooks/useUMKM';
import { RoleGuard } from '@/components/shared/RoleGuard';

const EditUMKMPage = () => {
  const params = useParams();
  const router = useRouter();
  const umkmId = params.id as string;

  const { data: umkm, isLoading, error } = useUMKMById(umkmId);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'UMKM', href: '/admin/umkm' },
    { label: 'Edit UMKM' }
  ];

  const handleSuccess = () => {
    router.push('/admin/umkm');
  };

  if (isLoading) {
    return (
      <AdminLayout 
        title="Edit UMKM"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data UMKM...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout 
        title="Edit UMKM"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-800 font-medium mb-2">
              Gagal memuat data UMKM
            </div>
            <div className="text-red-600 text-sm mb-4">
              {error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data'}
            </div>
            <button
              onClick={() => router.push('/admin/umkm')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Kembali ke Daftar UMKM
            </button>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  if (!umkm) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout 
        title="Edit UMKM"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-gray-800 font-medium mb-2">
              UMKM tidak ditemukan
            </div>
            <div className="text-gray-600 text-sm mb-4">
              UMKM dengan ID tersebut tidak ada atau telah dihapus.
            </div>
            <button
              onClick={() => router.push('/admin/umkm')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Kembali ke Daftar UMKM
            </button>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  // Convert UMKM data to form format
  const initialData = {
    name: umkm.name,
    description: umkm.description,
    category: umkm.category,
    owner: umkm.owner,
    phone: umkm.phone,
    whatsapp: umkm.whatsapp || '',
    email: umkm.email || '',
    address: umkm.address,
    latitude: umkm.latitude,
    longitude: umkm.longitude,
    website: umkm.website || '',
    socialMedia: umkm.socialMedia || {
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
    },
    products: umkm.products || [],
    operatingHours: umkm.operatingHours || {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
    isActive: umkm.isActive,
    featured: umkm.featured,
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Edit UMKM"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit UMKM</h1>
          <p className="text-gray-600 mt-1">
            Ubah informasi UMKM: <span className="font-medium">{umkm.name}</span>
          </p>
        </div>

        {/* Form */}
        <UMKMForm 
          initialData={initialData} 
          umkmId={umkmId} 
          onSuccess={handleSuccess} 
        />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default EditUMKMPage;
