// src/components/umkm/UMKMList.tsx
import { UMKM } from '@/types';
import UMKMCard from './UMKMCard';

interface UMKMListProps {
  umkms: UMKM[];
  loading?: boolean;
}

export default function UMKMList({ umkms, loading }: UMKMListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="h-16 bg-gray-200 rounded mb-4" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (umkms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum Ada UMKM
          </h3>
          <p className="text-gray-500">
            Tidak ada UMKM yang ditemukan. Coba ubah filter pencarian Anda atau periksa kembali nanti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {umkms.map((umkm) => (
        <UMKMCard key={umkm.id} umkm={umkm} />
      ))}
    </div>
  );
}