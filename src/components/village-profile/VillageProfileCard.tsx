// src/components/village-profile/VillageProfileCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { VillageProfile } from '@/types';
import PlaceholderImage from '@/components/shared/PlaceholderImage';
//import MarkdownRenderer from '@/components/shared/MarkdownRenderer';

interface VillageProfileCardProps {
  profile: VillageProfile;
  isAdmin?: boolean;
  onTogglePublish?: (id: string, isPublished: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function VillageProfileCard({ 
  profile, 
  isAdmin = false,
  onTogglePublish,
  onDelete 
}: VillageProfileCardProps) {
  const handleTogglePublish = () => {
    if (onTogglePublish) {
      onTogglePublish(profile.id, !profile.isPublished);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Apakah Anda yakin ingin menghapus profil ini?')) {
      onDelete(profile.id);
    }
  };

  const formatSectionName = (section: string) => {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, '').replace(/[*#>\-`]/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48">
        // Replace the PlaceholderImage usage with this corrected version:

      {profile.images && profile.images.length > 0 ? (
        <Image
          src={profile.images[0]}
          alt={profile.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <PlaceholderImage 
          label="Tidak ada gambar" 
          className="w-full h-full"
        />
      )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            profile.isPublished
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {profile.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Order Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            #{profile.order}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Section */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-600">
            {formatSectionName(profile.section)}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(profile.updatedAt).toLocaleDateString('id-ID')}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {profile.title}
        </h3>

        {/* Content Preview */}
        <div className="text-sm text-gray-600 mb-4 line-clamp-3">
          {truncateContent(profile.content)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {isAdmin ? (
            <div className="flex space-x-2">
              <Link
                href={`/admin/profile/edit/${profile.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </Link>
              <button
                onClick={handleTogglePublish}
                className={`text-sm font-medium ${
                  profile.isPublished
                    ? 'text-orange-600 hover:text-orange-800'
                    : 'text-green-600 hover:text-green-800'
                }`}
              >
                {profile.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ) : (
            <Link
              href={`/profile/${profile.section}`}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Baca Selengkapnya
            </Link>
          )}
          
          <div className="flex items-center space-x-2">
            {profile.images && profile.images.length > 1 && (
              <span className="text-xs text-gray-500">
                +{profile.images.length - 1} foto
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}