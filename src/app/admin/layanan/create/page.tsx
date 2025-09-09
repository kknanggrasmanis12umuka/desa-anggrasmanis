// src/app/admin/service-guides/create/page.tsx
'use client';


import AdminLayout from '@/components/admin/AdminLayout';
import ServiceGuideForm from '@/components/service-guides/ServiceGuideForm';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function CreateServiceGuidePage() {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Panduan Layanan</h1>
          <p className="text-gray-600">Buat panduan layanan baru untuk masyarakat</p>
        </div>

        <ServiceGuideForm />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
}
