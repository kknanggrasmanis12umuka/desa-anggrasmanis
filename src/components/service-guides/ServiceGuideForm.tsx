// src/components/service-guides/ServiceGuideForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  useCreateServiceGuide, 
  useUpdateServiceGuide 
} from '@/hooks/useServiceGuidesMutation';
import type { 
  ServiceGuide, 
  ServiceGuideFormData, 
  ServiceCategory,
  CreateServiceGuidePayload,
  UpdateServiceGuidePayload 
} from '@/types';

interface ServiceGuideFormProps {
  serviceGuide?: ServiceGuide;
  isEdit?: boolean;
}

// Create a separate interface for errors
interface FormErrors {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  category?: string;
  requirements?: string;
  steps?: string;
  documents?: string;
  contact?: string;
  isActive?: string;
  isFeatured?: string;
}

const CATEGORY_OPTIONS: { value: ServiceCategory; label: string }[] = [
  { value: 'ADMINISTRASI', label: 'Administrasi' },
  { value: 'KEPENDUDUKAN', label: 'Kependudukan' },
  { value: 'SURAT_MENYURAT', label: 'Surat Menyurat' },
  { value: 'PERTANAHAN', label: 'Pertanahan' },
  { value: 'SOSIAL', label: 'Sosial' },
  { value: 'LAINNYA', label: 'Lainnya' },
];

export default function ServiceGuideForm({ serviceGuide, isEdit = false }: ServiceGuideFormProps) {
  const router = useRouter();
  const createServiceGuide = useCreateServiceGuide();
  const updateServiceGuide = useUpdateServiceGuide();

  const [formData, setFormData] = useState<ServiceGuideFormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: 'ADMINISTRASI',
    requirements: '',
    steps: '',
    documents: '',
    contact: '',
    isActive: true,
    isFeatured: false,
  });

  const [errors, setErrors] = useState<FormErrors>({}); // Use FormErrors instead of Partial<ServiceGuideFormData>
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && serviceGuide) {
      setFormData({
        title: serviceGuide.title,
        slug: serviceGuide.slug,
        description: serviceGuide.description || '',
        content: serviceGuide.content,
        category: serviceGuide.category,
        requirements: serviceGuide.requirements.join(', '),
        steps: serviceGuide.steps.join(', '),
        documents: serviceGuide.documents.join(', '),
        contact: serviceGuide.contact || '',
        isActive: serviceGuide.isActive,
        isFeatured: serviceGuide.isFeatured,
      });
    }
  }, [isEdit, serviceGuide]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug when title changes
    if (name === 'title' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}; // Use FormErrors instead

    if (!formData.title.trim()) {
      newErrors.title = 'Judul harus diisi';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Konten harus diisi';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori harus dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateServiceGuidePayload | UpdateServiceGuidePayload = {
        title: formData.title.trim(),
        slug: formData.slug?.trim(),
        description: formData.description?.trim() || undefined,
        content: formData.content.trim(),
        category: formData.category,
        requirements: formData.requirements 
          ? formData.requirements.split(',').map(req => req.trim()).filter(Boolean)
          : [],
        steps: formData.steps
          ? formData.steps.split(',').map(step => step.trim()).filter(Boolean)
          : [],
        documents: formData.documents
          ? formData.documents.split(',').map(doc => doc.trim()).filter(Boolean)
          : [],
        contact: formData.contact?.trim() || undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      if (isEdit && serviceGuide) {
        await updateServiceGuide.mutateAsync({ 
          id: serviceGuide.id, 
          data: payload as UpdateServiceGuidePayload 
        });
      } else {
        await createServiceGuide.mutateAsync(payload as CreateServiceGuidePayload);
      }

      router.push('/admin/layanan');
      router.refresh();
    } catch (error: any) {
      console.error('Form submission error:', error);
      // Handle form errors if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Panduan Layanan' : 'Tambah Panduan Layanan'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Judul *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan judul panduan layanan"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="URL slug (otomatis digenerate dari judul)"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Singkat
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Deskripsi singkat tentang panduan layanan ini"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Konten Lengkap *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tulis konten lengkap panduan layanan (mendukung Markdown/HTML)"
            />
            {errors.content && (
              <p className="text-red-600 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
              Syarat-syarat
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Pisahkan dengan koma, contoh: Fotokopi KTP, KK Asli, Surat Pengantar RT"
            />
            <p className="text-sm text-gray-500 mt-1">
              Pisahkan setiap syarat dengan koma
            </p>
          </div>

          {/* Steps */}
          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
              Langkah-langkah
            </label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Pisahkan dengan koma, contoh: Datang ke kantor desa, Isi formulir, Serahkan dokumen"
            />
            <p className="text-sm text-gray-500 mt-1">
              Pisahkan setiap langkah dengan koma
            </p>
          </div>

          {/* Documents */}
          <div>
            <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-2">
              Dokumen yang Dikeluarkan
            </label>
            <textarea
              id="documents"
              name="documents"
              value={formData.documents}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Pisahkan dengan koma, contoh: Surat Keterangan Tidak Mampu, Surat Pengantar"
            />
            <p className="text-sm text-gray-500 mt-1">
              Pisahkan setiap dokumen dengan koma
            </p>
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
              Kontak Perangkat Desa
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nomor telepon atau kontak yang bisa dihubungi"
            />
          </div>

          {/* Status Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Aktif</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (isEdit ? 'Mengupdate...' : 'Menyimpan...') 
                : (isEdit ? 'Update Panduan' : 'Simpan Panduan')
              }
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}