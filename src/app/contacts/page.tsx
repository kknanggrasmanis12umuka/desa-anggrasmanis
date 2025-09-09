// src/app/contacts/page.tsx

'use client';

import React, { useState } from 'react';
import { useContacts, useContactsByType } from '@/hooks/useContacts';
import ContactCard from '@/components/contacts/ContactCard';
import { ContactType } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const contactTypeOptions = [
  { value: 'ALL', label: 'Semua Kontak' },
  { value: 'KEPALA_DESA', label: 'Kepala Desa' },
  { value: 'SEKRETARIS_DESA', label: 'Sekretaris Desa' },
  { value: 'BENDAHARA_DESA', label: 'Bendahara Desa' },
  { value: 'KEPALA_URUSAN', label: 'Kepala Urusan' },
  { value: 'KEPALA_DUSUN', label: 'Kepala Dusun' },
  { value: 'RT_RW', label: 'RT/RW' },
  { value: 'BPD', label: 'BPD' },
  { value: 'KARANG_TARUNA', label: 'Karang Taruna' },
  { value: 'PKK', label: 'PKK' },
  { value: 'POSYANDU', label: 'Posyandu' },
  { value: 'KADER_KESEHATAN', label: 'Kader Kesehatan' },
  { value: 'GURU', label: 'Guru' },
  { value: 'TOKOH_AGAMA', label: 'Tokoh Agama' },
  { value: 'TOKOH_MASYARAKAT', label: 'Tokoh Masyarakat' },
  { value: 'UMKM', label: 'UMKM' },
  { value: 'LAINNYA', label: 'Lainnya' },
];

const ContactsPage = () => {
  const [selectedType, setSelectedType] = useState<ContactType | 'ALL'>('ALL');
  
  // Get contacts berdasarkan filter
  const { data: contactsData, isLoading } = useContacts({
    page: 1,
    limit: 100,
    isActive: true,
    type: selectedType === 'ALL' ? undefined : selectedType as ContactType,
    sortBy: 'order',
    sortOrder: 'asc',
  });

  const contacts = contactsData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Direktori Kontak</h1>
            <p className="text-gray-600">Informasi kontak penting desa</p>
          </div>

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
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Direktori Kontak</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan informasi kontak penting untuk berbagai kebutuhan di desa kami.
            Hubungi perangkat desa, tokoh masyarakat, atau penyedia layanan yang Anda butuhkan.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Berdasarkan Kategori</h3>
            <div className="flex flex-wrap gap-2">
              {contactTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedType(option.value as ContactType | 'ALL')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                showAdminActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Tidak ada kontak ditemukan
            </h3>
            <p className="text-gray-500">
              {selectedType === 'ALL' 
                ? 'Belum ada kontak yang tersedia saat ini.'
                : `Belum ada kontak untuk kategori ${contactTypeOptions.find(opt => opt.value === selectedType)?.label}.`
              }
            </p>
          </div>
        )}

        {/* Contact Info Footer */}
        <div className="mt-12 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Butuh Bantuan Lainnya?
            </h3>
            <p className="text-blue-700 mb-4">
              Jika Anda tidak menemukan kontak yang dicari atau memerlukan bantuan khusus, 
              silakan hubungi kantor desa secara langsung.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center text-blue-800">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Telepon Kantor Desa
              </div>
              <div className="flex items-center text-blue-800">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Kunjungi Kantor Desa
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    
  );
};

export default ContactsPage;