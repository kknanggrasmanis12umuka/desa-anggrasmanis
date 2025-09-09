import { useState } from 'react';
import { uploadFile, uploadMultipleFiles, ApiError } from '@/lib/api';

export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  message?: string;
}

export interface UseUploadResult {
  uploadFile: (file: File, type?: 'image' | 'document') => Promise<UploadResponse>;
  uploadMultipleFiles: (files: File[], type?: 'image' | 'document') => Promise<UploadResponse[]>;
  uploading: boolean;
  error: string | null;
  progress: number;
}

export const useUpload = (): UseUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File, type: 'image' | 'document' = 'image'): Promise<UploadResponse> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await uploadFile(file, type, (progress) => {
        setProgress(progress);
      });

      // Handle berbagai format response dari backend
      if (response?.data) {
        return response.data;
      } else if (response) {
        return response;
      } else {
        throw new ApiError('Format response upload tidak valid');
      }
    } catch (err: any) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err.response?.data?.message 
        || err.message 
        || 'Upload gagal';
      
      setError(errorMessage);
      throw new ApiError(errorMessage, err.status, err.code, err.data);
    } finally {
      setUploading(false);
      // Reset progress setelah 1 detik
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleMultipleUpload = async (files: File[], type: 'image' | 'document' = 'image'): Promise<UploadResponse[]> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const response = await uploadMultipleFiles(files, type, (progress) => {
        setProgress(progress);
      });

      // Handle response untuk multiple files
      if (Array.isArray(response?.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      } else {
        throw new ApiError('Format response upload tidak valid');
      }
    } catch (err: any) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : err.response?.data?.message 
        || err.message 
        || 'Upload gagal';
      
      setError(errorMessage);
      throw new ApiError(errorMessage, err.status, err.code, err.data);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadFile: handleUpload,
    uploadMultipleFiles: handleMultipleUpload,
    uploading,
    error,
    progress,
  };
};

// Hook khusus untuk upload gambar dengan validasi
export const useImageUpload = () => {
  const { uploadFile, uploadMultipleFiles, uploading, error, progress } = useUpload();

  const validateImage = (file: File) => {
    // Validasi file image
    if (!file.type.startsWith('image/')) {
      throw new ApiError('File harus berupa gambar (JPEG, PNG, GIF, etc.)');
    }

    // Validasi size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new ApiError('Ukuran gambar maksimal 5MB');
    }

    return true;
  };

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    validateImage(file);
    return uploadFile(file, 'image');
  };

  const uploadMultipleImages = async (files: File[]): Promise<UploadResponse[]> => {
    files.forEach(validateImage);
    return uploadMultipleFiles(files, 'image');
  };

  return {
    uploadImage,
    uploadMultipleImages,
    uploading,
    error,
    progress,
  };
};

// Hook khusus untuk upload document
export const useDocumentUpload = () => {
  const { uploadFile, uploading, error, progress } = useUpload();

  const validateDocument = (file: File) => {
    // Validasi document types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new ApiError('Format file tidak didukung. Gunakan PDF, DOC, DOCX, XLS, XLSX, atau TXT');
    }

    // Validasi size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new ApiError('Ukuran dokumen maksimal 10MB');
    }

    return true;
  };

  const uploadDocument = async (file: File): Promise<UploadResponse> => {
    validateDocument(file);
    return uploadFile(file, 'document');
  };

  return {
    uploadDocument,
    uploading,
    error,
    progress,
  };
};