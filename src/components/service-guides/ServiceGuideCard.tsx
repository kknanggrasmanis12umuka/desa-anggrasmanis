// src/components/service-guides/ServiceGuideCard.tsx

'use client';

import Link from 'next/link';
import type { ServiceGuide } from '@/types';

interface ServiceGuideCardProps {
  serviceGuide: ServiceGuide;
  showAdminActions?: boolean;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onToggleFeatured?: (id: string, isFeatured: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function ServiceGuideCard({ 
  serviceGuide,
  showAdminActions = false,
  onToggleActive,
  onToggleFeatured,
  onDelete
}: ServiceGuideCardProps) {
  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'ADMINISTRASI': 'Administrasi',
      'KEPENDUDUKAN': 'Kependudukan',
      'SURAT_MENYURAT': 'Surat Menyurat',
      'PERTANAHAN': 'Pertanahan',
      'SOSIAL': 'Sosial',
      'LAINNYA': 'Lainnya',
    };
    return categoryMap[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'ADMINISTRASI': 'bg-blue-100 text-blue-800',
      'KEPENDUDUKAN': 'bg-green-100 text-green-800',
      'SURAT_MENYURAT': 'bg-purple-100 text-purple-800',
      'PERTANAHAN': 'bg-yellow-100 text-yellow-800',
      'SOSIAL': 'bg-pink-100 text-pink-800',
      'LAINNYA': 'bg-gray-100 text-gray-800',
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus panduan layanan ini?')) {
      onDelete?.(serviceGuide.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(serviceGuide.category)}`}>
              {getCategoryLabel(serviceGuide.category)}
            </span>
            
            {serviceGuide.isFeatured && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
            
            {!serviceGuide.isActive && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Nonaktif
              </span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {serviceGuide.title}
        </h3>

        {serviceGuide.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {serviceGuide.description}
          </p>
        )}

        {/* Info */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {serviceGuide.requirements.length > 0 && (
            <div>
              <span className="font-medium">Syarat:</span> {serviceGuide.requirements.length} item
            </div>
          )}
          
          {serviceGuide.steps.length > 0 && (
            <div>
              <span className="font-medium">Langkah:</span> {serviceGuide.steps.length} tahap
            </div>
          )}
          
          {serviceGuide.contact && (
            <div>
              <span className="font-medium">Kontak:</span> {serviceGuide.contact}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500 mb-4">
          Dibuat: {new Date(serviceGuide.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link
            href={`/layanan/${serviceGuide.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Lihat Detail →
          </Link>

          {showAdminActions && (
            <div className="flex gap-2">
              <button
                onClick={() => onToggleFeatured?.(serviceGuide.id, serviceGuide.isFeatured)}
                className={`text-xs px-2 py-1 rounded ${
                  serviceGuide.isFeatured
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={serviceGuide.isFeatured ? 'Hapus dari Featured' : 'Jadikan Featured'}
              >
                {serviceGuide.isFeatured ? '★' : '☆'}
              </button>

              <button
                onClick={() => onToggleActive?.(serviceGuide.id, serviceGuide.isActive)}
                className={`text-xs px-2 py-1 rounded ${
                  serviceGuide.isActive
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                {serviceGuide.isActive ? 'Aktif' : 'Nonaktif'}
              </button>
              
              <Link
                href={`/admin/layanan/edit/${serviceGuide.id}`}
                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
              >
                Edit
              </Link>
              
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900 text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded"
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}