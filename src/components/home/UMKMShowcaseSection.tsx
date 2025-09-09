// src/components/home/UMKMShowcaseSection.tsx (Updated)
import Link from 'next/link';
import { ArrowRight, Store } from 'lucide-react';
import { useFeaturedUMKM } from '@/hooks/useUMKM';
import UMKMCard from '@/components/umkm/UMKMCard';
import { UMKM } from '@/types'; // Import the UMKM type

export default function UMKMShowcaseSection() {
  const { data: featuredUMKM, isLoading } = useFeaturedUMKM(6);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-16 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredUMKM || featuredUMKM.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              UMKM Unggulan Desa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dukung ekonomi lokal dengan produk dan layanan berkualitas dari UMKM desa kami
            </p>
          </div>
          
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Store className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada UMKM Unggulan
            </h3>
            <p className="text-gray-500 mb-6">
              UMKM unggulan akan ditampilkan di sini
            </p>
            <Link
              href="/umkm/create"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Daftarkan UMKM Anda
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            UMKM Unggulan Desa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Dukung ekonomi lokal dengan produk dan layanan berkualitas dari UMKM desa kami
          </p>
        </div>

        {/* UMKM Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredUMKM.map((umkm: UMKM) => (
            <UMKMCard key={umkm.id} umkm={umkm} />
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-primary-50 rounded-lg">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {featuredUMKM.length}+
            </div>
            <div className="text-gray-700 font-medium">UMKM Unggulan</div>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {featuredUMKM.filter((umkm: UMKM) => umkm.verified).length}
            </div>
            <div className="text-gray-700 font-medium">UMKM Terverifikasi</div>
          </div>
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {featuredUMKM.reduce((avg: number, umkm: UMKM) => avg + (umkm.rating || 0), 0) / featuredUMKM.length || 0}
            </div>
            <div className="text-gray-700 font-medium">Rating Rata-rata</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Punya Usaha? Bergabunglah dengan Kami!
          </h3>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Daftarkan UMKM Anda dan dapatkan akses ke pasar yang lebih luas. 
            Kami membantu mempromosikan produk dan layanan Anda kepada masyarakat desa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/umkm/create"
              className="bg-white text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Daftarkan UMKM
            </Link>
            <Link
              href="/umkm"
              className="border border-white text-white hover:bg-white hover:text-primary-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              Lihat Semua UMKM
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-lg group"
          >
            Jelajahi Semua UMKM
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}