'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { canAccessAdminPanel } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user && !canAccessAdminPanel(user.role)) {
      router.push('/profile');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={['ADMIN', 'EDITOR', 'OPERATOR']}>
      <AdminLayout />
    </RoleGuard>
  );
}