// src/app/auth/unauthorized/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (user?.role === 'EDITOR') {
      router.push('/admin/posts');
    } else if (user?.role === 'OPERATOR') {
      router.push('/admin/services');
    } else {
      router.push('/profile');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0h-3m21-4a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Akses Tidak Diizinkan
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
            {user && (
              <span className="block mt-1">
                Role Anda: <span className="font-semibold">{user.role}</span>
              </span>
            )}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.back()}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Kembali
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Ke Halaman Utama
          </button>
        </div>
      </div>
    </div>
  );
}