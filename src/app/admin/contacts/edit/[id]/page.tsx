// src/app/admin/contacts/edit/[id]/page.tsx

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ContactForm from '@/components/contacts/ContactForm';
import { useContact } from '@/hooks/useContacts';
import { RoleGuard } from '@/components/shared/RoleGuard';

const EditContactPage = () => {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;
  
  const { data: contact, isLoading, error } = useContact(contactId);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Kontak', href: '/admin/contacts' },
    { label: 'Edit Kontak' }
  ];

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout 
        title="Edit Kontak"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data kontak...</p>
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
      <AdminLayout 
        title="Edit Kontak"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-800 font-medium mb-2">
              Gagal memuat data kontak
            </div>
            <div className="text-red-600 text-sm mb-4">
              {error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data'}
            </div>
            <button
              onClick={() => router.push('/admin/contacts')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Kembali ke Daftar Kontak
            </button>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  if (!contact) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout 
        title="Edit Kontak"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-gray-800 font-medium mb-2">
              Kontak tidak ditemukan
            </div>
            <div className="text-gray-600 text-sm mb-4">
              Kontak dengan ID tersebut tidak ada atau telah dihapus.
            </div>
            <button
              onClick={() => router.push('/admin/contacts')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Kembali ke Daftar Kontak
            </button>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Edit Kontak"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Kontak</h1>
          <p className="text-gray-600 mt-1">
            Ubah informasi kontak: <span className="font-medium">{contact.name}</span>
          </p>
        </div>

        {/* Form */}
        <ContactForm 
          contact={contact} 
          mode="edit" 
        />
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default EditContactPage;