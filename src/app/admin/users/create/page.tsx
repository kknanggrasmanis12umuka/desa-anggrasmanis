// src/app/admin/users/create/page.tsx
'use client';

import UserForm from '@/components/admin/UserForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/users"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke User
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tambah User Baru
          </h1>
          <p className="text-gray-600">
            Buat akun pengguna baru untuk mengakses sistem
          </p>
        </div>

        <UserForm mode="create" />
      </div>
    </div>
  );
}
