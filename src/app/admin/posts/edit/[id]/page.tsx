'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import AdminLayout from '@/components/admin/AdminLayout';
import { apiUtils, apiEndpoints } from '@/lib/api';
import { PostCategory, PostStatus } from '@/types';
import { RoleGuard } from '@/components/shared/RoleGuard';

const categories: PostCategory[] = [
  'BERITA',
  'PENGUMUMAN',
  'KEGIATAN',
  'PEMERINTAHAN',
  'PENDIDIKAN',
  'PERTANIAN',
  'KEBENCANAAN',
  'PARIWISATA',
  'UMKM'
];

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  category: PostCategory;
  tags: string;
  status: PostStatus;
  coverImage: string;
}

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Posts', href: '/admin/posts' },
    { label: 'Edit Post' }
  ];

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching post with ID:', id);
        const response = await apiUtils.get(`${apiEndpoints.posts}/${id}`);
        const postData = response.data;
        console.log('Fetched post data:', postData);
        
        // Cek struktur response
        const actualPostData = postData.post || postData.data || postData;
        setPost(actualPostData);
        
        // Set form values
        if (actualPostData) {
          console.log('Setting form values with:', actualPostData);
          
          setValue('title', actualPostData.title || '');
          setValue('content', actualPostData.content || '');
          setValue('excerpt', actualPostData.excerpt || '');
          setValue('category', actualPostData.category || 'BERITA');
          setValue('tags', Array.isArray(actualPostData.tags) ? actualPostData.tags.join(', ') : actualPostData.tags || '');
          setValue('status', actualPostData.status || 'DRAFT');
          setValue('coverImage', actualPostData.coverImage || actualPostData.images?.[0] || '');
          
          if (actualPostData.coverImage || actualPostData.images?.[0]) {
            setPreviewImage(actualPostData.coverImage || actualPostData.images?.[0]);
          }
        }
      } catch (error) {
        console.error('Gagal mengambil data post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diizinkan');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/single?type=IMAGE&folder=posts`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.files && data.files.length > 0) {
          setValue('coverImage', data.files[0].url);
          setPreviewImage(URL.createObjectURL(file));
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload gagal');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert((error as Error).message || 'Gagal mengupload gambar');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    const coverImageUrl = watch('coverImage');
    
    if (coverImageUrl) {
      try {
        const url = new URL(coverImageUrl);
        const filePath = url.pathname;
        
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/${encodeURIComponent(filePath)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    setValue('coverImage', '');
    setPreviewImage(null);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        category: data.category || 'BERITA',
        tags: data.tags?.split(',').map((tag: string) => tag.trim()) || [],
        status: data.status || 'DRAFT',
        coverImage: data.coverImage || '',
        images: data.coverImage ? [data.coverImage] : [],
      };

      console.log('Submitting payload:', payload);
      console.log('Endpoint:', `${apiEndpoints.posts}/${id}`);

      await apiUtils.patch(`${apiEndpoints.posts}/${id}`, payload);
      
      alert('Post berhasil diupdate!');
      router.push('/admin/posts');
      router.refresh();
    } catch (error: any) {
      console.error('Gagal mengupdate post:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Gagal mengupdate post: ${error.response.data.message || error.message}`);
      } else {
        alert(`Gagal mengupdate post: ${(error as Error).message}`);
      }
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout 
        title="Edit Post"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Memuat data post...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
      </RoleGuard>
    );
  }

  if (!post) {
    return (
      <RoleGuard allowedRoles={['ADMIN']}>
      <AdminLayout 
        title="Edit Post"
        breadcrumbs={breadcrumbs}
      >
        <div className="p-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-gray-800 font-medium mb-2">
              Post tidak ditemukan
            </div>
            <div className="text-gray-600 text-sm mb-4">
              Post dengan ID tersebut tidak ada atau telah dihapus.
            </div>
            <button
              onClick={() => router.push('/admin/posts')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Kembali ke Daftar Posts
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
      title="Edit Post"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <p className="text-gray-600 mt-1">
            Ubah informasi post: <span className="font-medium">{post.title}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Upload Cover Image */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-gray-800">
                  Cover Image
                </label>
                
                {previewImage ? (
                  <div className="relative">
                    <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img 
                        src={previewImage} 
                        alt="Preview cover" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
                      title="Hapus gambar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-200">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <label
                          htmlFor="coverImage"
                          className="cursor-pointer bg-blue-50 text-blue-700 font-semibold py-3 px-6 rounded-lg hover:bg-blue-100 transition-colors duration-200 inline-block"
                        >
                          Pilih Gambar Cover
                          <input
                            id="coverImage"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF hingga 2MB</p>
                    </div>
                  </div>
                )}
                
                {uploading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center text-blue-600">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mengupload gambar...
                    </div>
                  </div>
                )}
                
                <input type="hidden" {...register('coverImage')} />
              </div>

              {/* Judul */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-gray-800">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title', { required: 'Judul wajib diisi' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Masukkan judul postingan"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.title.message?.toString()}
                  </p>
                )}
              </div>

              {/* Konten */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-gray-800">
                  Konten <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('content', { required: 'Konten wajib diisi' })}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Tulis konten postingan di sini..."
                />
                {errors.content && (
                  <p className="text-red-600 text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.content.message?.toString()}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-gray-800">
                  Excerpt (Ringkasan)
                </label>
                <textarea
                  {...register('excerpt')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Ringkasan singkat tentang postingan ini..."
                />
                <p className="text-gray-500 text-sm">Ringkasan ini akan ditampilkan di halaman daftar postingan</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kategori */}
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-800">
                    Kategori
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-800">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-gray-800">
                  Tags (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="contoh: tag1, tag2, tag3"
                />
                <p className="text-gray-500 text-sm">Gunakan tag untuk memudahkan pencarian dan pengategorian</p>
              </div>

              {/* Tombol Submit */}
              <div className="pt-8 flex justify-end space-x-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/admin/posts')}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Batal
                </button>
                
                <button
                  type="button"
                  onClick={() => router.push(`/posts/${post.slug || id}`)}
                  className="px-6 py-3 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-all duration-200 font-medium"
                >
                  Preview
                </button>
                
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-sm transition-all duration-200 font-medium"
                >
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
    </RoleGuard>
  );
};

export default EditPostPage;