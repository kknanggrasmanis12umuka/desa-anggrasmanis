// src/app/admin/village-profile/edit/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import VillageProfileForm from '@/components/village-profile/VillageProfileForm';
import { useVillageProfile } from '@/hooks/useVillageProfile';
import { useUpdateVillageProfile } from '@/hooks/useVillageProfileMutation';
import { VillageProfileFormData } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

export default function EditVillageProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: villageProfile, isLoading, error } = useVillageProfile(id);
  const updateVillageProfile = useUpdateVillageProfile();

  const handleSubmit = async (data: VillageProfileFormData) => {
    try {
      await updateVillageProfile.mutateAsync({ id, data });
      router.push('/admin/profile');
    } catch (error: any) {
      console.error('Error updating village profile:', error);
      alert(error?.message || 'Gagal mengupdate profil desa');
    }
  };

  const handleCancel = () => {
    router.push('/admin/profile');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !villageProfile) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Profil desa tidak ditemukan</div>
          <button
            onClick={() => router.push('/admin/profile')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Kembali ke Daftar
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profil Desa</h1>
          <p className="text-gray-600">Ubah konten profil desa: {villageProfile.title}</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <VillageProfileForm
            initialData={villageProfile}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateVillageProfile.isPending}
          />
        </div>
      </div>
    </AdminLayout>
    </RoleGuard>
  );
}