'use client';

import Link from 'next/link';
import ImageWithFallback from '@/components/shared/ImageWithFallback';
import PlaceholderImage from '@/components/shared/PlaceholderImage';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const getImageUrl = () => {
    // Prioritas: featuredImage -> coverImage
    const raw = post.featuredImage ?? post.coverImage ?? '';
    if (!raw) return null;

    // Absolute URL (http/https/data) langsung dipakai
    if (/^(https?:|data:)/i.test(raw)) return raw;

    // Path relatif -> gabungkan dengan base API URL
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    return `${base}${raw.startsWith('/') ? raw : `/${raw}`}`;
  };

  const imgSrc = getImageUrl();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        {imgSrc ? (
          <ImageWithFallback
            src={imgSrc}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // Jika komponenmu menerima string fallback:
            fallbackSrc={`https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=${encodeURIComponent(
              post.category ?? 'Post'
            )}`}
            // Jika komponenmu menerima elemen fallback, bisa gunakan ini:
            // fallback={
            //   <PlaceholderImage label={post.category ?? 'Post'} />
            // }
          />
        ) : (
          <div className="h-48 w-full flex items-center justify-center bg-gray-100">
            <PlaceholderImage
              label={post.category ?? 'Post'}
              className="h-full w-full"
            />
          </div>
        )}

        {post.category && (
          <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
            {post.category}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{formatDate(post.createdAt)}</span>
          <span className="mx-2">•</span>
          <span>Oleh {post?.author?.name ?? 'Redaksi'}</span>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h3 className="text-xl font-semibold text-gray-909 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt ?? ''}</p>

        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          Baca selengkapnya
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}