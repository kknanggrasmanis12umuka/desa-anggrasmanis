// src/components/contact/ContactCard.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Contact } from '@/types';
import { useToggleActiveContact, useDeleteContact } from '@/hooks/useContactsMutation';

interface ContactCardProps {
  contact: Contact;
  showAdminActions?: boolean;
}

const getContactTypeLabel = (type: string) => {
  const typeLabels: Record<string, string> = {
    'KEPALA_DESA': 'Kepala Desa',
    'SEKRETARIS_DESA': 'Sekretaris Desa',
    'BENDAHARA_DESA': 'Bendahara Desa',
    'KEPALA_URUSAN': 'Kepala Urusan',
    'KEPALA_DUSUN': 'Kepala Dusun',
    'RT_RW': 'RT/RW',
    'BPD': 'BPD',
    'KARANG_TARUNA': 'Karang Taruna',
    'PKK': 'PKK',
    'POSYANDU': 'Posyandu',
    'KADER_KESEHATAN': 'Kader Kesehatan',
    'GURU': 'Guru',
    'TOKOH_AGAMA': 'Tokoh Agama',
    'TOKOH_MASYARAKAT': 'Tokoh Masyarakat',
    'UMKM': 'UMKM',
    'LAINNYA': 'Lainnya',
  };
  return typeLabels[type] || type;
};

const ContactCard: React.FC<ContactCardProps> = ({ contact, showAdminActions = false }) => {
  const router = useRouter();
  const toggleActiveMutation = useToggleActiveContact();
  const deleteMutation = useDeleteContact();

  const handleToggleActive = async () => {
    try {
      await toggleActiveMutation.mutateAsync({
        id: contact.id,
        isActive: !contact.isActive
      });
    } catch (error) {
      console.error('Error toggling contact active status:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kontak "${contact.name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(contact.id);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/contacts/edit/${contact.id}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${!contact.isActive ? 'opacity-75' : ''}`}>
      {/* Header with Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {contact.name}
          </h3>
          <p className="text-sm text-gray-600">
            {contact.position}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            contact.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {contact.isActive ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {getContactTypeLabel(contact.type)}
          </span>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-2 mb-4">
        {contact.department && (
          <div className="text-sm">
            <span className="text-gray-500">Departemen:</span>
            <span className="ml-2 text-gray-900">{contact.department}</span>
          </div>
        )}

        {contact.phone && (
          <div className="text-sm">
            <span className="text-gray-500">Telepon:</span>
            <a 
              href={`tel:${contact.phone}`}
              className="ml-2 text-blue-600 hover:underline"
            >
              {contact.phone}
            </a>
          </div>
        )}

        {contact.whatsapp && (
          <div className="text-sm">
            <span className="text-gray-500">WhatsApp:</span>
            <a 
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-green-600 hover:underline"
            >
              {contact.whatsapp}
            </a>
          </div>
        )}

        {contact.email && (
          <div className="text-sm">
            <span className="text-gray-500">Email:</span>
            <a 
              href={`mailto:${contact.email}`}
              className="ml-2 text-blue-600 hover:underline"
            >
              {contact.email}
            </a>
          </div>
        )}

        {contact.address && (
          <div className="text-sm">
            <span className="text-gray-500">Alamat:</span>
            <span className="ml-2 text-gray-900">{contact.address}</span>
          </div>
        )}
      </div>

      {/* Admin Actions */}
      {showAdminActions && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleToggleActive}
              disabled={toggleActiveMutation.isPending}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                contact.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } ${toggleActiveMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {toggleActiveMutation.isPending 
                ? 'Loading...' 
                : contact.isActive ? 'Nonaktifkan' : 'Aktifkan'
              }
            </button>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className={`px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${
              deleteMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {deleteMutation.isPending ? 'Loading...' : 'Hapus'}
          </button>
        </div>
      )}

      {/* Order Badge for Admin */}
      {showAdminActions && (
        <div className="mt-2 text-xs text-gray-500">
          Urutan: {contact.order}
        </div>
      )}
    </div>
  );
};

export default ContactCard;