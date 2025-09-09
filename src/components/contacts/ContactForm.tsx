// src/components/contact/ContactForm.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Contact, ContactFormData, ContactType } from '@/types';
import { useCreateContact, useUpdateContact } from '@/hooks/useContactsMutation';

interface ContactFormProps {
  contact?: Contact;
  mode: 'create' | 'edit';
}

const contactTypeOptions = [
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

const ContactForm: React.FC<ContactFormProps> = ({ contact, mode }) => {
  const router = useRouter();
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    position: '',
    department: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    type: 'LAINNYA' as ContactType,
    isActive: true,
    order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form for edit mode
  useEffect(() => {
    if (contact && mode === 'edit') {
      setFormData({
        name: contact.name,
        position: contact.position,
        department: contact.department || '',
        phone: contact.phone || '',
        whatsapp: contact.whatsapp || '',
        email: contact.email || '',
        address: contact.address || '',
        type: contact.type,
        isActive: contact.isActive,
        order: contact.order,
      });
    }
  }, [contact, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Posisi harus diisi';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.type) {
      newErrors.type = 'Tipe kontak harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(formData);
        router.push('/admin/contacts');
      } else if (mode === 'edit' && contact) {
        await updateMutation.mutateAsync({
          id: contact.id,
          data: formData,
        });
        router.push('/admin/contacts');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Dasar
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan posisi/jabatan"
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as ContactType)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {contactTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departemen
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Masukkan nama departemen"
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan Tampil
              </label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="text-gray-500 text-sm mt-1">
                Angka yang lebih kecil akan ditampilkan lebih dulu
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Aktif
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Informasi Kontak
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Contoh: 0271-123456"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Contoh: 08123456789"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contoh@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Masukkan alamat lengkap"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/contacts')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting 
              ? 'Menyimpan...' 
              : mode === 'create' ? 'Simpan' : 'Update'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;