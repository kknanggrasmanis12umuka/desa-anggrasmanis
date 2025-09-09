// src/components/admin/UserForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Shield, Eye, EyeOff, UserCheck } from 'lucide-react';
import { UserFormData } from '@/types';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsersMutation';

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  userId?: string;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

const roles = [
  { value: 'OPERATOR', label: 'Operator' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function UserForm({ 
  initialData, 
  userId, 
  onSuccess,
  mode = 'create' 
}: UserFormProps) {
  const router = useRouter();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    username: '',
    name: '',
    password: '',
    phone: '',
    role: 'OPERATOR',
    avatar: '',
    isActive: true,
    ...initialData,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = 'Username hanya boleh berisi huruf, angka, titik, underscore, dan dash';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap harus diisi';
    }

    // Password validation (only for create mode or when password is provided)
    if (mode === 'create' || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password harus diisi';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password minimal 8 karakter';
      }
    }

    // Phone validation (optional)
    if (formData.phone && !/^(\+62|62|0)[0-9]{9,13}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const payload = { ...formData };
      
      // Remove password if empty in edit mode
      if (mode === 'edit' && !payload.password) {
        delete payload.password;
      }

      if (mode === 'edit' && userId) {
        await updateMutation.mutateAsync({ id: userId, data: payload });
      } else {
        await createMutation.mutateAsync(payload as any);
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/users');
        router.refresh();
      }
    } catch (err) {
      console.error('Error submitting user:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Informasi Dasar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="user@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nama Lengkap"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {mode === 'create' ? 'Password' : 'Ubah Password'}
        </h2>

        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'create' ? 'Password *' : 'Password Baru'}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={mode === 'create' ? 'Masukkan password' : 'Kosongkan jika tidak ingin mengubah'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          {mode === 'edit' && (
            <p className="text-xs text-gray-500 mt-1">
              Kosongkan jika tidak ingin mengubah password
            </p>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2" />
          Pengaturan
        </h2>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            User aktif
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          User yang tidak aktif tidak dapat login ke sistem
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800 text-sm">
            {error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan user'}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white rounded-md font-medium transition-colors"
        >
          {isLoading ? 'Menyimpan...' : mode === 'edit' ? 'Update User' : 'Buat User'}
        </button>
      </div>
    </form>
  );
}