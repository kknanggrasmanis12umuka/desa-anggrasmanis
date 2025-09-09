// src/app/admin/contacts/page.tsx

'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactSearch from '@/components/contacts/ContactSearch';
import ContactList from '@/components/contacts/ContactList';
import type { ContactPaginationParams } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

const ContactsPage = () => {
  const [searchParams, setSearchParams] = useState<ContactPaginationParams>({
    page: 1,
    limit: 12,
    sortBy: 'order',
    sortOrder: 'asc',
  });

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Kontak' }
  ];

  const handleSearch = (params: ContactPaginationParams) => {
    setSearchParams(params);
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Kontak"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kontak</h1>
            <p className="text-gray-600 mt-1">
              Kelola direktori kontak penting desa
            </p>
          </div>
        </div>

        {/* Search & Filter Component with Create Button */}
        <ContactSearch 
          onSearch={handleSearch}
          showCreateButton={true}
        />

        {/* Contact List */}
        <ContactList 
          initialParams={searchParams} 
          showAdminActions={true}
        />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default ContactsPage;