// src/app/admin/layanan/ServiceGuidesAdminClient.tsx
'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import ServiceGuideSearch from '@/components/service-guides/ServiceGuideSearch';
import ServiceGuideList from '@/components/service-guides/ServiceGuideList';

export default function ServiceGuidesAdminClient() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panduan Layanan</h1>
          <p className="text-gray-600">Kelola panduan layanan untuk masyarakat</p>
        </div>

        <ServiceGuideSearch />
        <ServiceGuideList />
      </div>
    </AdminLayout>
  );
}