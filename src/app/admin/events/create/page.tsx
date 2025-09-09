// src/app/admin/events/create/page.tsx
'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import EventForm from '@/components/events/EventForm';
import { RoleGuard } from '@/components/shared/RoleGuard';

const CreateEventPage = () => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Acara', href: '/admin/events' },
    { label: 'Tambah Acara' }
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Tambah Acara"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Acara Baru</h1>
          <p className="text-gray-600 mt-1">
            Tambahkan acara atau kegiatan baru untuk desa
          </p>
        </div>

        {/* Form */}
        <EventForm />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default CreateEventPage;
