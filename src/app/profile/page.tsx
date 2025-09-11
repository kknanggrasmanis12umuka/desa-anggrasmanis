// src/app/profil-desa/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
//import PlaceholderImage from '@/components/shared/PlaceholderImage';
import { usePublishedVillageProfiles } from '@/hooks/useVillageProfile';
//import { VillageProfile } from '@/types';

export default function VillageProfilePage() {
  const { data: profiles, isLoading, error } = usePublishedVillageProfiles();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const formatSectionName = (section: string) => {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">Gagal memuat profil desa</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Coba Lagi
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Profil Desa
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mengenal lebih dekat tentang sejarah, visi misi, struktur organisasi, 
              dan berbagai aspek kehidupan di desa kami.
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
          ) : profiles && profiles.length > 0 ? (
            <div className="space-y-8">
              {profiles.map((profile, index) => {
                const isExpanded = expandedSections.includes(profile.id);
                const shouldShowToggle = profile.content.replace(/<[^>]*>/g, '').length > 200;
                
                return (
                  <div key={profile.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <span className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-3">
                          {profile.order}
                        </span>
                        {profile.title}
                      </h2>
                      <p className="text-primary-100 mt-1">
                        {formatSectionName(profile.section)}
                      </p>
                    </div>

                    <div className="p-6">
                      {/* Images Gallery */}
                      {profile.images && profile.images.length > 0 && (
                        <div className="mb-6">
                          {profile.images.length === 1 ? (
                            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                              <Image
                                src={profile.images[0]}
                                alt={profile.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                              />
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {profile.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="relative h-48 rounded-lg overflow-hidden">
                                  <Image
                                    src={image}
                                    alt={`${profile.title} ${imgIndex + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="prose prose-lg max-w-none">
                        {isExpanded || !shouldShowToggle ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: profile.content }}
                            className="text-gray-700 leading-relaxed"
                          />
                        ) : (
                          <div className="text-gray-700 leading-relaxed">
                            {truncateContent(profile.content)}
                          </div>
                        )}

                        {shouldShowToggle && (
                          <div className="mt-4">
                            <button
                              onClick={() => toggleSection(profile.id)}
                              className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
                            >
                              {isExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya'}
                              <svg 
                                className={`ml-1 h-4 w-4 transform transition-transform ${
                                  isExpanded ? 'rotate-180' : 'rotate-0'
                                }`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                        <div>
                          Terakhir diupdate: {new Date(profile.updatedAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <Link
                          href={`/profile/${profile.section}`}
                          className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          Lihat Detail →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-sm mx-auto">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Profil Desa Belum Tersedia</h3>
                <p className="text-gray-500">
                  Konten profil desa sedang dalam tahap persiapan. Silakan kembali lagi nanti.
                </p>
              </div>
            </div>
          )}

          {/* Navigation to sections */}
          {profiles && profiles.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigasi Cepat</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {profiles.map(profile => (
                  <Link
                    key={profile.id}
                    href={`/profile/${profile.section}`}
                    className="flex items-center p-3 text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-2">
                      {profile.order}
                    </span>
                    {formatSectionName(profile.section)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}