// src/app/admin/contacts/create/page.tsx

'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactForm from '@/components/contacts/ContactForm';
import { RoleGuard } from '@/components/shared/RoleGuard';

const CreateContactPage = () => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Kontak', href: '/admin/contacts' },
    { label: 'Tambah Kontak' }
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Tambah Kontak"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Kontak Baru</h1>
          <p className="text-gray-600 mt-1">
            Tambahkan kontak baru ke dalam direktori desa
          </p>
        </div>

        {/* Form */}
        <ContactForm mode="create" />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default CreateContactPage;