'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { PostCategory, PostStatus, PostFormData, CreatePostPayload, SelectOption } from '@/types';
import { useCreatePost } from '@/hooks/usePostsMutation';
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

const statusOptions: SelectOption<PostStatus>[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
];

const CreatePostPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PostFormData>();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Posts', href: '/admin/posts' },
    { label: 'Tambah Post' }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diizinkan');
      return;
    }

    // Validasi ukuran file (maksimal 2MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Menggunakan endpoint upload single dari NestJS controller
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

  const { mutateAsync: createPost, isPending } = useCreatePost();

  const onSubmit = async (data: PostFormData) => {
    try {
      const payload: CreatePostPayload = {
        ...data,
        tags: data.tags
          ? data.tags.split(',').map((tag: string) => tag.trim())
          : [],
        status: data.status || 'DRAFT',
        category: data.category || 'BERITA',
      };

      await createPost(payload);
      router.push('/admin/posts');
    } catch (error) {
      console.error('Gagal membuat post:', error);
      alert('Terjadi kesalahan saat menyimpan post.');
    }
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
    <AdminLayout 
      title="Tambah Post"
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Post Baru</h1>
          <p className="text-gray-600 mt-1">
            Isi formulir di bawah untuk membuat postingan baru
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
                            name="coverImage"
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
                    {errors.title.message as string}
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
                    {errors.content.message as string}
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
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Post'
                  )}
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

export default CreatePostPage;