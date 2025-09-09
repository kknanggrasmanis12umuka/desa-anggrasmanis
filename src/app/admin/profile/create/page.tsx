// src/app/admin/village-profile/create/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import VillageProfileForm from '@/components/village-profile/VillageProfileForm';
import { useCreateVillageProfile } from '@/hooks/useVillageProfileMutation';
import { VillageProfileFormData } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function CreateVillageProfilePage() {
  const router = useRouter();
  const createVillageProfile = useCreateVillageProfile();

  const handleSubmit = async (data: VillageProfileFormData) => {
    try {
      await createVillageProfile.mutateAsync(data);
      router.push('/admin/profile');
    } catch (error: any) {
      console.error('Error creating village profile:', error);
      alert(error?.message || 'Gagal membuat profil desa');
    }
  };

  const handleCancel = () => {
    router.push('/admin/profile');
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Profil Desa</h1>
          <p className="text-gray-600">Buat konten profil desa baru</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <VillageProfileForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createVillageProfile.isPending}
          />
        </div>
      </div>
    </AdminLayout>
    </RoleGuard>
  );
}
