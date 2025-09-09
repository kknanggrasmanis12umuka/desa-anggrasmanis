// src/app/admin/users/edit/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@/hooks/useUsers';
import UserForm from '@/components/admin/UserForm';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const { data, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Memuat data user...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          User tidak ditemukan
        </h3>
        <p className="text-gray-600 mb-4">
          User yang Anda cari tidak ada atau telah dihapus
        </p>
        <Link
          href="/admin/users"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
        >
          Kembali ke User
        </Link>
      </div>
    );
  }

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
            Edit User: {data.name}
          </h1>
          <p className="text-gray-600">
            Ubah informasi dan pengaturan pengguna
          </p>
        </div>

        <UserForm 
          mode="edit"
          userId={userId}
          initialData={{
            email: data.email,
            username: data.username,
            name: data.name,
            phone: data.phone,
            role: data.role,
            avatar: data.avatar,
            isActive: data.isActive,
          }}
        />
      </div>
    </div>
  );
}