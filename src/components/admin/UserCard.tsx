// src/components/admin/UserCard.tsx
import { useState } from 'react';
import { User as UserType } from '@/types';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  MoreVertical,
  Eye
} from 'lucide-react';
import { useDeleteUser, useUpdateUser } from '@/hooks/useUsersMutation';

interface UserCardProps {
  user: UserType;
  onEdit?: (user: UserType) => void;
  onView?: (user: UserType) => void;
}

const roleColors = {
  ADMIN: 'bg-red-100 text-red-800',
  EDITOR: 'bg-blue-100 text-blue-800',
  OPERATOR: 'bg-green-100 text-green-800',
};

const roleLabels = {
  ADMIN: 'Admin',
  EDITOR: 'Editor', 
  OPERATOR: 'Operator',
};

export default function UserCard({ user, onEdit, onView }: UserCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const deleteMutation = useDeleteUser();
  const updateMutation = useUpdateUser();

  const handleToggleStatus = async () => {
    try {
      await updateMutation.mutateAsync({
        id: user.id,
        data: { isActive: !user.isActive }
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(user.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            {/* Status & Menu */}
            <div className="flex items-center space-x-2">
              {user.isActive ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Aktif
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  <UserX className="w-3 h-3 mr-1" />
                  Tidak Aktif
                </span>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                    <div className="py-1">
                      {onView && (
                        <button
                          onClick={() => {
                            onView(user);
                            setShowDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat Detail
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(user);
                            setShowDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleToggleStatus();
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        disabled={updateMutation.isPending}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" />
                            Nonaktifkan
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Aktifkan
                          </>
                        )}
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Email */}
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{user.email}</span>
          </div>

          {/* Phone */}
          {user.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span>{user.phone}</span>
            </div>
          )}

          {/* Role */}
          <div className="flex items-center text-sm">
            <Shield className="w-4 h-4 mr-2 text-gray-400" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
          </div>

          {/* Last Login */}
          {user.lastLogin && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>Login terakhir: {formatDate(user.lastLogin)}</span>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>Bergabung: {formatDate(user.createdAt)}</span>
          </div>

          {/* Verification Status */}
          {user.verifiedAt && (
            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              ✓ Diverifikasi {formatDate(user.verifiedAt)}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hapus User
            </h3>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus user <strong>{user.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-md transition-colors"
              >
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}