// src/app/admin/service-guides/edit/[id]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceGuideForm from '@/components/service-guides/ServiceGuideForm';
import { useServiceGuide } from '@/hooks/useServiceGuides';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function EditServiceGuidePage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data, isLoading, error } = useServiceGuide(id);

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Panduan Layanan</h1>
            <p className="text-gray-600">Ubah informasi panduan layanan</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Panduan Layanan</h1>
            <p className="text-gray-600">Ubah informasi panduan layanan</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Gagal memuat data panduan layanan</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  const serviceGuide = data?.serviceGuide;

  if (!serviceGuide) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Panduan Layanan</h1>
            <p className="text-gray-600">Ubah informasi panduan layanan</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <p className="text-gray-600">Panduan layanan tidak ditemukan</p>
            </div>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Panduan Layanan</h1>
          <p className="text-gray-600">Ubah informasi panduan layanan: {serviceGuide.title}</p>
        </div>

        <ServiceGuideForm serviceGuide={serviceGuide} isEdit={true} />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
}