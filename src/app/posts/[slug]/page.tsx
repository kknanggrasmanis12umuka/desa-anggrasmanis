'use client';

import { usePost } from '@/hooks/usePostsQuery';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
//import { Post } from '@/types'; // Import the Post type

// Fungsi helper untuk memvalidasi dan memformat tanggal
const formatDateSafe = (dateString?: string, fallback: string = 'Tanggal tidak tersedia') => {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return fallback;
    }
    return format(date, 'dd MMMM yyyy', { locale: id });
  } catch (error) {
    return fallback;
  }
};

export default function PostDetailPage() {
  const { slug } = useParams();
  const { data: postData, isLoading, error } = usePost(slug as string);
  
  // Debug data
  console.log('Post data:', postData);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Terjadi Kesalahan</h1>
            <p className="text-gray-600 mt-2">Gagal memuat artikel. Silakan coba lagi nanti.</p>
            <Link href="/posts" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Kembali ke daftar artikel
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Debug post data
  console.log('Post data:', postData);
  
  if (!postData || !postData.id) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Artikel tidak ditemukan</h1>
            <p className="text-gray-600 mt-2">Slug: {slug}</p>
            <Link href="/posts" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Kembali ke daftar artikel
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/posts" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke daftar artikel
          </Link>
          
          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{postData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDateSafe(postData.publishedAt || postData.createdAt)}
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {postData.author?.name || 'Admin'}
                </span>
                {postData.category && (
                  <span className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded">
                    {postData.category}
                  </span>
                )}
              </div>
            </header>
            
            {postData.coverImage && (
              <div className="relative h-96 mb-8">
                <Image 
                  src={postData.coverImage} 
                  alt={postData.title} 
                  fill 
                  className="object-cover rounded-lg" 
                  priority
                />
              </div>
            )}
            
            {postData.content ? (
              <div 
                className="prose prose-lg max-w-none" 
                dangerouslySetInnerHTML={{ 
                  __html: postData.content.replace(/\n/g, '<br/>') 
                }} 
              />
            ) : (
              <p className="text-gray-500">Konten tidak tersedia.</p>
            )}
            
            {postData.tags && postData.tags.length > 0 && (
              <footer className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {postData.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}