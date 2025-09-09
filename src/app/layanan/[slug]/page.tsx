// src/app/layanan/[slug]/page.tsx

'use client';

import { useParams } from 'next/navigation';
import { useServiceGuideBySlug } from '@/hooks/useServiceGuides';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ServiceGuideDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { data, isLoading, error } = useServiceGuideBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.serviceGuide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Panduan Layanan Tidak Ditemukan
              </h1>
              <p className="text-gray-600 mb-6">
                Maaf, panduan layanan yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Link
                href="/layanan"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Kembali ke Daftar Layanan
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const serviceGuide = data.serviceGuide;

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

  return (
    
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Beranda</Link>
              <span>/</span>
              <Link href="/layanan" className="hover:text-blue-600">Panduan Layanan</Link>
              <span>/</span>
              <span className="text-gray-900">{serviceGuide.title}</span>
            </div>
          </nav>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(serviceGuide.category)}`}>
                  {getCategoryLabel(serviceGuide.category)}
                </span>
                {serviceGuide.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {serviceGuide.title}
              </h1>

              {serviceGuide.description && (
                <p className="text-lg text-gray-600 mb-4">
                  {serviceGuide.description}
                </p>
              )}

              <div className="text-sm text-gray-500">
                Terakhir diperbarui: {new Date(serviceGuide.updatedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="prose max-w-none mb-8">
                <div className="text-gray-700 leading-relaxed">
                  {serviceGuide.content.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {serviceGuide.requirements.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Persyaratan</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {serviceGuide.requirements.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps */}
              {serviceGuide.steps.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Langkah-langkah</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {serviceGuide.steps.map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Documents */}
              {serviceGuide.documents.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Dokumen yang Dikeluarkan</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {serviceGuide.documents.map((doc: string, index: number) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact */}
              {serviceGuide.contact && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Kontak</h3>
                  <p className="text-gray-700">
                    Untuk informasi lebih lanjut, hubungi: <strong>{serviceGuide.contact}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <Link
                href="/layanan"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Kembali ke Daftar Panduan Layanan
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}