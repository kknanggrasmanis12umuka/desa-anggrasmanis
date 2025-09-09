'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@/hooks/useUsers';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  Edit,
  UserCheck,
  UserX
} from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/types';

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  EDITOR: 'Editor',
  OPERATOR: 'Operator',
};

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  EDITOR: 'bg-blue-100 text-blue-800',
  OPERATOR: 'bg-green-100 text-green-800',
};

// Helper function to safely get role information
const getRoleInfo = (role: string) => {
  // Type guard to ensure role is a valid UserRole
  const isValidRole = (r: string): r is UserRole => {
    return roleLabels.hasOwnProperty(r);
  };

  if (isValidRole(role)) {
    return {
      label: roleLabels[role],
      color: roleColors[role],
      role: role as UserRole
    };
  }

  // Fallback for invalid roles
  return {
    label: 'Operator',
    color: 'bg-green-100 text-green-800',
    role: 'OPERATOR' as UserRole
  };
};

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Memuat data user...</p>
      </div>
    );
  }

  if (error || !user) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get safe role information
  const roleInfo = getRoleInfo(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/users"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke User
          </Link>
        </div>
        
        <Link
          href={`/admin/users/edit/${userId}`}
          className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit User
        </Link>
      </div>

      {/* User Profile */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-primary-100">@{user.username}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleInfo.color} bg-white bg-opacity-90`}>
                  {roleInfo.label}
                </span>
                {user.isActive ? (
                  <span className="flex items-center text-green-100 text-sm">
                    <UserCheck className="w-4 h-4 mr-1" />
                    Aktif
                  </span>
                ) : (
                  <span className="flex items-center text-red-100 text-sm">
                    <UserX className="w-4 h-4 mr-1" />
                    Tidak Aktif
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Kontak
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Nomor Telepon</p>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium text-gray-900">{roleInfo.label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Informasi Akun
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Bergabung</p>
                    <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {user.lastLogin && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Login Terakhir</p>
                      <p className="font-medium text-gray-900">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                )}

                {user.verifiedAt && (
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Status Verifikasi</p>
                      <p className="font-medium text-green-600">
                        Terverifikasi pada {formatDate(user.verifiedAt)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                    <p className="font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section - Placeholder for future features */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Aktivitas Terbaru
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-500">
                Fitur aktivitas pengguna akan segera tersedia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}