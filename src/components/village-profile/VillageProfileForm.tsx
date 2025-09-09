// src/components/village-profile/VillageProfileForm.tsx
// Alternative version without react-quill (React 19 compatible)
'use client';

import { useState, useEffect, useRef } from 'react';
import { VillageProfile, VillageProfileFormData } from '@/types';
import { uploadMultipleFiles } from '@/lib/api';
//import PlaceholderImage from '@/components/shared/PlaceholderImage';
import Image from 'next/image';

interface VillageProfileFormProps {
  initialData?: VillageProfile;
  onSubmit: (data: VillageProfileFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function VillageProfileForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: VillageProfileFormProps) {
  const [formData, setFormData] = useState<VillageProfileFormData>({
    section: '',
    title: '',
    content: '',
    images: [],
    order: 0,
    isPublished: true,
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  // Populate form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        section: initialData.section,
        title: initialData.title,
        content: initialData.content,
        images: initialData.images || [],
        order: initialData.order,
        isPublished: initialData.isPublished,
      });
      setImagePreviewUrls(initialData.images || []);
    }
  }, [initialData]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [formData.content]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length !== files.length) {
      alert('Beberapa file tidak valid. Hanya file gambar dengan ukuran maksimal 5MB yang diperbolehkan.');
    }

    setImageFiles(validFiles);

    // Create preview URLs
    const previewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...previewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    // Remove from preview URLs
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    setImagePreviewUrls(newPreviewUrls);

    // Remove from existing images if it's an existing image
    if (formData.images && index < formData.images.length) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, images: newImages }));
    }

    // Remove from new files if it's a new file
    const existingImagesCount = formData.images?.length || 0;
    if (index >= existingImagesCount) {
      const fileIndex = index - existingImagesCount;
      const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
      setImageFiles(newFiles);
    }
  };

  // Text formatting functions for the textarea
  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = before + selectedText + after;
    
    const newValue = 
      textarea.value.substring(0, start) + 
      newText + 
      textarea.value.substring(end);
    
    setFormData(prev => ({ ...prev, content: newValue }));
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const toolbarButtons = [
    { label: 'Bold', action: () => insertText('**', '**'), icon: 'B' },
    { label: 'Italic', action: () => insertText('*', '*'), icon: 'I' },
    { label: 'H1', action: () => insertText('# '), icon: 'H1' },
    { label: 'H2', action: () => insertText('## '), icon: 'H2' },
    { label: 'H3', action: () => insertText('### '), icon: 'H3' },
    { label: 'List', action: () => insertText('- '), icon: '•' },
    { label: 'Number List', action: () => insertText('1. '), icon: '1.' },
    { label: 'Quote', action: () => insertText('> '), icon: '❝' },
    { label: 'Link', action: () => insertText('[', '](url)'), icon: '🔗' },
  ];

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) {
      return formData.images || [];
    }

    setIsUploading(true);
    try {
      const response = await uploadMultipleFiles(imageFiles, 'image', setUploadProgress);
      const uploadedImageUrls = response.files.map((file: any) => file.url);
      return [...(formData.images || []), ...uploadedImageUrls];
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload new images if any
      const finalImages = await uploadImages();
      
      // Submit form with uploaded image URLs
      onSubmit({
        ...formData,
        images: finalImages,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Gagal mengupload gambar. Silakan coba lagi.');
    }
  };

  const sectionOptions = [
    { value: 'sejarah', label: 'Sejarah' },
    { value: 'geografi', label: 'Geografi' },
    { value: 'visi_misi', label: 'Visi & Misi' },
    { value: 'struktur_organisasi', label: 'Struktur Organisasi' },
    { value: 'demografi', label: 'Demografi' },
    { value: 'potensi_desa', label: 'Potensi Desa' },
    { value: 'sarana_prasarana', label: 'Sarana & Prasarana' },
    { value: 'program_kerja', label: 'Program Kerja' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Selection */}
      <div>
        <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
          Section <span className="text-red-500">*</span>
        </label>
        <select
          id="section"
          name="section"
          value={formData.section}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Pilih Section</option>
          {sectionOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Judul <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Masukkan judul profil desa"
        />
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
          Urutan
        </label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleInputChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="0"
        />
        <p className="text-sm text-gray-500 mt-1">
          Urutan tampilan (semakin kecil semakin di atas)
        </p>
      </div>

      {/* Content with Custom Toolbar */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Konten <span className="text-red-500">*</span>
        </label>
        
        {/* Custom Toolbar */}
        <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
              title={button.label}
            >
              {button.icon}
            </button>
          ))}
        </div>
        
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none overflow-hidden"
          placeholder="Masukkan konten profil desa... 

Gunakan format Markdown:
- **bold** untuk teks tebal
- *italic* untuk teks miring  
- # Heading 1
- ## Heading 2
- ### Heading 3
- - untuk bullet list
- 1. untuk numbered list
- > untuk quote
- [text](url) untuk link"
        />
        
        {/* Markdown Preview Toggle */}
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            💡 Tip: Gunakan format Markdown untuk memformat teks. Toolbar di atas akan membantu Anda.
          </p>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gambar
        </label>
        
        {/* Image Preview */}
        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <label htmlFor="images" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload gambar
                </span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="sr-only"
                />
              </label>
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, GIF hingga 5MB (maksimal beberapa file)
              </p>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="bg-blue-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Mengupload gambar... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Published Status */}
      <div className="flex items-center">
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          checked={formData.isPublished}
          onChange={handleInputChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
          Publikasikan profil
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || isUploading ? 'Menyimpan...' : initialData ? 'Update' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}