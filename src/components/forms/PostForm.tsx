'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostCategory } from '@/types';
import { useUpload } from '@/hooks/useUpload';

interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (data: CreatePostData) => Promise<void>;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

// Types untuk form data
export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  category: PostCategory;
  tags?: string[];
  featuredImage?: string;
  publishedAt?: string;
}

const POST_CATEGORIES: PostCategory[] = [
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

export default function PostForm({ initialData, onSubmit, isEditing = false, isSubmitting = false }: PostFormProps) {
  const router = useRouter();
  const { uploadFile, uploading } = useUpload();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CreatePostData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || 'BERITA',
    tags: initialData?.tags || [],
    featuredImage: initialData?.featuredImage || '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Jika published, set publishedAt ke waktu sekarang
      const submitData = {
      ...formData,
      publishedAt: formData.publishedAt || new Date().toISOString(),
    };

      await onSubmit(submitData);
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadFile(file, 'image');
      setFormData(prev => ({
        ...prev,
        featuredImage: response.url,
      }));
    } catch (err) {
      setError('Gagal mengupload gambar');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Judul Post *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Kategori *
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as PostCategory })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {POST_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
          Ringkasan (Excerpt)
        </label>
        <textarea
          id="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ringkasan singkat tentang post ini..."
        />
      </div>

          <div>
      <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
        Tanggal Publikasi
      </label>
      <input
        type="datetime-local"
        id="publishedAt"
        value={formData.publishedAt?.slice(0, 16) || ''}
        onChange={(e) =>
          setFormData({ ...formData, publishedAt: e.target.value })
        }
        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>


      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Konten *
        </label>
        <textarea
          id="content"
          rows={10}
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tulis konten post di sini..."
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tambahkan tag..."
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Tambah
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
          Gambar Utama
        </label>
        <input
          type="file"
          id="featuredImage"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1 block w-full"
        />
        {uploading && <p className="text-sm text-gray-500">Mengupload gambar...</p>}
        {formData.featuredImage && (
          <div className="mt-2">
            <img
              src={formData.featuredImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading || isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {(loading || uploading || isSubmitting) 
            ? 'Menyimpan...' 
            : isEditing ? 'Update Post' : 'Buat Post'
          }
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
        >
          Batal
        </button>
      </div>
    </form>
  );
}