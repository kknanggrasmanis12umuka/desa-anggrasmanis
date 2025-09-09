// src/app/profil-desa/[section]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
//import PlaceholderImage from '@/components/shared/PlaceholderImage';
import { useVillageProfileBySection } from '@/hooks/useVillageProfile';

export default function VillageProfileSectionPage() {
  const params = useParams();
  const router = useRouter();
  const section = params.section as string;

  const { data: profile, isLoading, error } = useVillageProfileBySection(section);

  const formatSectionName = (section: string) => {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">Section profil desa tidak ditemukan</div>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Kembali
              </button>
              <Link
                href="/profile"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Lihat Semua Profil
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600 mb-4">Section profil desa tidak ditemukan</div>
            <Link
              href="/profile"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Kembali ke Profil Desa
            </Link>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-primary-600">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/profile" className="hover:text-primary-600">
                Profil Desa
              </Link>
              <span>/</span>
              <span className="text-gray-900">{formatSectionName(profile.section)}</span>
            </div>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
              <div className="flex items-center mb-4">
                <span className="bg-white bg-opacity-20 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold text-white mr-4">
                  {profile.order}
                </span>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.title}</h1>
                  <p className="text-primary-100 text-lg">{formatSectionName(profile.section)}</p>
                </div>
              </div>
              <div className="text-primary-100 text-sm">
                Terakhir diupdate: {new Date(profile.updatedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Images Gallery */}
              {profile.images && profile.images.length > 0 && (
                <div className="mb-8">
                  {profile.images.length === 1 ? (
                    <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
                      <Image
                        src={profile.images[0]}
                        alt={profile.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 80vw"
                        priority
                      />
                    </div>
                  ) : (
                    <>
                      {/* Main image */}
                      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={profile.images[0]}
                          alt={profile.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 80vw"
                          priority
                        />
                      </div>
                      
                      {/* Thumbnail gallery */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {profile.images.slice(1).map((image, index) => (
                          <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`${profile.title} ${index + 2}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: profile.content }}
                  className="text-gray-800 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Lihat Semua Section
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}