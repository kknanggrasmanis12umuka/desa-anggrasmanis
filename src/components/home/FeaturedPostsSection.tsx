'use client';

import { usePosts } from '@/hooks/usePostsQuery';
import PostCard from '@/components/posts/PostCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FeaturedPostsSection() {
  // Create extended params that include featured filter
  const params = {
    limit: 3,
    featured: true
  };

  const { data: postsData, isLoading } = usePosts(params as any); // Use type assertion as a temporary workaround

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!postsData?.data || postsData.data.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Berita Terbaru
          </h2>
          <p className="text-xl text-gray-600">
            Informasi terkini seputar kegiatan desa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {postsData.data.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/posts"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Lihat Semua Berita
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}