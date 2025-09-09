// src/app/umkm/create/page.tsx (Public Registration)
'use client';

import { useRouter } from 'next/navigation';
import UMKMForm from '@/components/umkm/UMKMForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RegisterUMKMPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Show success message and redirect
    alert('UMKM berhasil didaftarkan! Mohon tunggu verifikasi dari admin.');
    router.push('/umkm');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Daftarkan UMKM Anda
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas UMKM desa kami. Daftarkan usaha Anda untuk 
              mendapatkan lebih banyak pelanggan dan mengembangkan bisnis.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Syarat dan Ketentuan Pendaftaran
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Persyaratan Umum:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Usaha berlokasi di wilayah desa</li>
                  <li>Memiliki produk/jasa yang legal</li>
                  <li>Menyediakan informasi yang akurat</li>
                  <li>Memiliki nomor telepon yang bisa dihubungi</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Keuntungan Bergabung:</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Promosi gratis melalui website desa</li>
                  <li>Akses ke pasar yang lebih luas</li>
                  <li>Networking dengan UMKM lain</li>
                  <li>Dukungan dari pemerintah desa</li>
                </ul>
              </div>
            </div>
          </div>

          <UMKMForm onSuccess={handleSuccess} />
        </div>
      </main>
      <Footer />
    </div>
  );
}