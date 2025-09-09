// src/components/contact/ContactList.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useContacts } from '@/hooks/useContacts';
import { ContactPaginationParams } from '@/types';
import ContactCard from './ContactCard';
import Pagination from '@/components/shared/Pagination';

interface ContactListProps {
  initialParams: ContactPaginationParams;
  showAdminActions?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({ initialParams, showAdminActions = false }) => {
  const [params, setParams] = useState<ContactPaginationParams>(initialParams);
  const { data, isLoading, error } = useContacts(params);

  // Update params when initialParams change
  useEffect(() => {
    setParams(initialParams);
  }, [initialParams]);

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-800 font-medium mb-2">
          Gagal memuat data kontak
        </div>
        <div className="text-red-600 text-sm">
          {error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data'}
        </div>
      </div>
    );
  }

  const contacts = data?.data || [];
  const pagination = data?.meta;

  if (contacts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Tidak ada kontak ditemukan
        </h3>
        <p className="text-gray-500">
          Belum ada kontak yang sesuai dengan kriteria pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            showAdminActions={showAdminActions}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Summary */}
      {pagination && (
        <div className="text-center text-sm text-gray-500">
          Menampilkan {contacts.length} dari {pagination.total} kontak
        </div>
      )}
    </div>
  );
};

export default ContactList;