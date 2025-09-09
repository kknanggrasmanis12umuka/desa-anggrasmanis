// src/app/admin/posts/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { RoleGuard } from '@/components/shared/RoleGuard';
import { usePosts } from '@/hooks/usePostsQuery';
import { useToggleFeaturedPost, useDeletePost } from '@/hooks/usePostsMutation';
import { Post } from '@/types';

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    className={`w-4 h-4 mr-1 ${filled ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const PencilIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const AdminPostsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = usePosts({ page: currentPage, limit: 12 });
  const toggleFeaturedMutation = useToggleFeaturedPost();
  const deletePostMutation = useDeletePost();
  
  const posts = data?.data || [];
  const pagination = data?.meta;
  const totalPages = pagination?.totalPages || 1;

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Posts' }
  ];

  const handleToggleFeatured = async (id: string, currentlyFeatured: boolean) => {
    try {
      await toggleFeaturedMutation.mutateAsync({
        id,
        featured: !currentlyFeatured
      });
    } catch (err) {
      console.error('Error toggling featured:', err);
      alert('Gagal mengubah status featured');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus post ini?')) {
      try {
        await deletePostMutation.mutateAsync(id);
        alert('Post berhasil dihapus');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Gagal menghapus post');
      }
    }
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
        <AdminLayout 
          title="Posts"
          breadcrumbs={breadcrumbs}
        >
          <div className="p-6">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Memuat data posts...</p>
              </div>
            </div>
          </div>
        </AdminLayout>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
        <AdminLayout 
          title="Posts"
          breadcrumbs={breadcrumbs}
        >
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-800 font-medium mb-2">
                Gagal memuat data posts
              </div>
              <div className="text-red-600 text-sm mb-4">
                {error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data'}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </AdminLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout 
        title="Posts"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kelola Posts</h1>
              <p className="text-gray-600 mt-1">
                Kelola berita dan artikel website
              </p>
            </div>
            <Link
              href="/admin/posts/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <span>+</span>
              <span>Buat Post Baru</span>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Total Posts</h3>
              <p className="text-3xl font-bold text-blue-600">{pagination?.total || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Published</h3>
              <p className="text-3xl font-bold text-green-600">
                {posts.filter(post => post.status === 'PUBLISHED').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900">Drafts</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {posts.filter(post => post.status === 'DRAFT').length}
              </p>
            </div>
          </div>

          {/* Posts Grid */}
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map((post: Post) => {
                // Get the image source safely
                const imageSrc = post.featuredImage || post.coverImage;
                
                return (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={post.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            post.publishedAt || post.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.publishedAt || post.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {post.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
                        <span className="capitalize">{post.category?.toLowerCase()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between space-x-2">
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <EyeIcon />
                          View
                        </Link>
                        
                        <button
                          onClick={() => handleToggleFeatured(post.id, post.featured)}
                          className={`flex items-center text-sm transition-colors ${
                            post.featured 
                              ? 'text-yellow-600 hover:text-yellow-800' 
                              : 'text-gray-600 hover:text-gray-800'
                          } ${toggleFeaturedMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={toggleFeaturedMutation.isPending}
                        >
                          <StarIcon filled={post.featured} />
                          {toggleFeaturedMutation.isPending 
                            ? 'Loading...' 
                            : post.featured ? 'Unfeature' : 'Feature'
                          }
                        </button>
                        
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="flex items-center text-green-600 hover:text-green-800 text-sm"
                        >
                          <PencilIcon />
                          Edit
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(post.id)}
                          className={`flex items-center text-red-600 hover:text-red-800 text-sm ${
                            deletePostMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={deletePostMutation.isPending}
                        >
                          <TrashIcon />
                          {deletePostMutation.isPending ? 'Hapus...' : 'Hapus'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada post</h3>
              <p className="text-gray-500 mb-4">Mulai dengan membuat post pertama Anda</p>
              <Link
                href="/admin/posts/create"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 inline-block"
              >
                Buat Post Baru
              </Link>
            </div>
          )}

          {/* Pagination */}
          {posts && posts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </AdminLayout>
    </RoleGuard>
  );
};

export default AdminPostsPage;