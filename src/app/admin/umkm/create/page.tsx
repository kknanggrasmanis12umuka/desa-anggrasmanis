// src/app/admin/umkm/create/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import UMKMForm from '@/components/umkm/UMKMForm';
import { RoleGuard } from '@/components/shared/RoleGuard';

const CreateUMKMPage = () => {
  const router = useRouter();

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'UMKM', href: '/admin/umkm' },
    { label: 'Tambah UMKM' }
  ];

  const handleSuccess = () => {
    router.push('/admin/umkm');
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Tambah UMKM"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tambah UMKM Baru</h1>
          <p className="text-gray-600 mt-1">
            Daftarkan UMKM baru ke dalam sistem
          </p>
        </div>

        {/* Form */}
        <UMKMForm onSuccess={handleSuccess} />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default CreateUMKMPage;