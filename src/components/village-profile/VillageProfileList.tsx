// src/components/village-profile/VillageProfileList.tsx
'use client';

import { VillageProfile } from '@/types';
import VillageProfileCard from './VillageProfileCard';

interface VillageProfileListProps {
  profiles: VillageProfile[];
  isAdmin?: boolean;
  onTogglePublish?: (id: string, isPublished: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function VillageProfileList({ 
  profiles, 
  isAdmin = false,
  onTogglePublish,
  onDelete 
}: VillageProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-sm mx-auto">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada profil desa</h3>
          <p className="text-gray-500 mb-6">
            {isAdmin ? 'Belum ada profil desa yang dibuat.' : 'Profil desa belum tersedia.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles.map((profile) => (
        <VillageProfileCard
          key={profile.id}
          profile={profile}
          isAdmin={isAdmin}
          onTogglePublish={onTogglePublish}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}