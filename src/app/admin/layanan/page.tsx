'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceGuideSearch from '@/components/service-guides/ServiceGuideSearch';
import ServiceGuideList from '@/components/service-guides/ServiceGuideList';
import type { ServiceGuidePaginationParams } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

const ServiceGuidesPage = () => {
  const [searchParams, setSearchParams] = useState<ServiceGuidePaginationParams>({
    page: 1,
    limit: 12,
  });

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Panduan Layanan' }
  ];

  const handleSearch = (params: ServiceGuidePaginationParams) => {
    setSearchParams(params);
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Panduan Layanan"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panduan Layanan</h1>
            <p className="text-gray-600 mt-1">
              Kelola panduan layanan desa untuk membantu warga
            </p>
          </div>
        </div>

        {/* Search & Filter Component */}
        <ServiceGuideSearch onSearch={handleSearch} />

        {/* Service Guide List */}
        <ServiceGuideList initialParams={searchParams} />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default ServiceGuidesPage;