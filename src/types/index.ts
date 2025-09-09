// src/types/index.ts (Final Version - Complete with PostStatus)

// User & Auth Types - exactly matching your Prisma User model
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'EDITOR';
  phone?: string;
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export type UserRole = 'ADMIN' | 'OPERATOR' | 'EDITOR';

// Tambahkan ke src/types/index.ts

// User Form & API Types (tambahan untuk existing User interface)
export interface UserFormData {
  email: string;
  username: string;
  name: string;
  password?: string;
  phone?: string;
  role: 'ADMIN' | 'OPERATOR' | 'EDITOR';
  avatar?: string;
  isActive?: boolean;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  name: string;
  password: string;
  phone?: string;
  role?: 'ADMIN' | 'OPERATOR' | 'EDITOR';
  avatar?: string;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  email?: string;
  username?: string;
  name?: string;
  phone?: string;
  role?: 'ADMIN' | 'OPERATOR' | 'EDITOR';
  avatar?: string;
  isActive?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserPaginationParams extends PaginationParams {
  role?: 'ADMIN' | 'OPERATOR' | 'EDITOR' | null;
  isActive?: boolean | null;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// User Statistics
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    ADMIN: number;
    OPERATOR: number;
    EDITOR: number;
  };
  recentRegistrations: number;
}

// Login uses EMAIL (not username) based on your backend
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  name: string;
  password: string;
  phone?: string;
  role?: 'ADMIN' | 'OPERATOR' | 'EDITOR';
}

// Auth response matching your AuthService
export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: 'ADMIN' | 'OPERATOR' | 'EDITOR';
    createdAt?: string;
  };
  token: string;
}

// Profile response matching your AuthService.getProfile
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  name: string;
  phone?: string;
  role: 'ADMIN' | 'OPERATOR' | 'EDITOR';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Event Types  
// export interface Event {
//   id: string;
//   title: string;
//   slug: string;
//   description: string;
//   content?: string;
//   startDate: string;
//   endDate?: string;
//   location: string;
//   organizer: string;
//   contactInfo: string;
//   maxParticipants?: number;
//   registrationDeadline?: string;
//   isPublished: boolean;
//   featuredImage?: string;
//   gallery?: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// Event Types - matching your backend exactly
export type EventCategory = 
  | 'RAPAT_DESA'
  | 'KEGIATAN_BUDAYA' 
  | 'POSYANDU'
  | 'GOTONG_ROYONG'
  | 'PELATIHAN'
  | 'SOSIALISASI'
  | 'OLAHRAGA'
  | 'KEAGAMAAN'
  | 'PENDIDIKAN'
  | 'KESEHATAN';

export interface Event {
  id: string;
  title: string;
  description: string;
  content?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category: EventCategory;
  images: string[];
  isPublic: boolean;
  isFeatured: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  contactPerson?: string;
  contactPhone?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  content?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  category: EventCategory;
  isPublic?: boolean;
  isFeatured?: boolean;
  maxParticipants?: number | null | string;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  contactPerson?: string;
  contactPhone?: string;
  tags?: string; // comma-separated for form
}

export interface CreateEventPayload {
  title: string;
  description: string;
  content?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  category: EventCategory;
  images?: string[];
  isPublic?: boolean;
  isFeatured?: boolean;
  maxParticipants?: number | null;
  registrationRequired?: boolean;
  registrationDeadline?: string | null;
  contactPerson?: string;
  contactPhone?: string;
  tags?: string[];
}

export interface EventPaginationParams extends PaginationParams {
  category?: EventCategory | null;
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
  isFeatured?: boolean;
  sortBy?: string; // Add this line
  sortOrder?: 'asc' | 'desc'; // Add this line
}

// Post Types - TAMBAHAN: PostStatus yang hilang
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export type PostCategory = 
  | 'BERITA' 
  | 'PENGUMUMAN' 
  | 'KEGIATAN' 
  | 'PEMERINTAHAN' 
  | 'PENDIDIKAN' 
  | 'PERTANIAN' 
  | 'KEBENCANAAN' 
  | 'PARIWISATA' 
  | 'UMKM';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string; // Made optional since DTO has @IsOptional()
  content: string;
  featuredImage?: string;  // Untuk kompatibilitas frontend
  coverImage?: string;     // Matching your DTO
  category: PostCategory;
  tags: string[];
  featured: boolean;
  status: PostStatus;      // TAMBAHAN: status field
  author: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;  
}

// TAMBAHAN: Interface untuk form data Post
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: PostCategory;
  status: PostStatus;
  tags?: string;  // String format for form input (comma-separated)
}

// TAMBAHAN: Interface untuk create post payload
export interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: PostCategory;
  status: PostStatus;
  tags: string[];  // Array format for API
}

// UMKM Types
// Update untuk src/types/index.ts - Bagian UMKM Types

// UMKM Types - Updated to match backend Prisma model
export interface UMKM {
  id: string;
  name: string;
  description: string;
  category: string;
  owner: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  images: string[];
  products?: Array<{
    name: string;
    description?: string;
    price: number;
    unit?: string;
    image?: string;
    available?: boolean;
  }>;
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  isActive: boolean;
  featured: boolean;
  verified: boolean;
  rating?: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UMKMFormData {
  name: string;
  description: string;
  category: string;
  owner: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  products?: Array<{
    name: string;
    description?: string;
    price: number;
    unit?: string;
    image?: string;
    available?: boolean;
  }>;
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  isActive?: boolean;
  featured?: boolean;
}

export interface CreateUMKMPayload {
  name: string;
  description: string;
  category: string;
  owner: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  images?: string[];
  products?: Array<{
    name: string;
    description?: string;
    price: number;
    unit?: string;
    image?: string;
    available?: boolean;
  }>;
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  isActive?: boolean;
  featured?: boolean;
}

export interface UMKMPaginationParams extends PaginationParams {
  category?: string;
  owner?: string;
  isActive?: boolean;
  featured?: boolean;
  verified?: boolean;
  minRating?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UMKMReview {
  id: string;
  rating: number;
  review?: string;
  reviewerName: string;
  reviewerPhone?: string;
  createdAt: string;
}

export interface CreateUMKMReviewPayload {
  rating: number;
  review?: string;
  reviewerName: string;
  reviewerPhone?: string;
}

// Tambahkan ke src/types/index.ts - Service Guide Types

// Service Guide Types - matching backend Prisma model
export type ServiceCategory = 
  | 'ADMINISTRASI'
  | 'KEPENDUDUKAN'
  | 'SURAT_MENYURAT'
  | 'PERTANAHAN'
  | 'SOSIAL'
  | 'LAINNYA';

export interface ServiceGuide {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  category: ServiceCategory;
  requirements: string[];
  steps: string[];
  documents: string[];
  contact?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceGuideFormData {
  title: string;
  slug?: string;
  description?: string;
  content: string;
  category: ServiceCategory;
  requirements?: string; // comma-separated for form input
  steps?: string; // comma-separated for form input
  documents?: string; // comma-separated for form input
  contact?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface CreateServiceGuidePayload {
  title: string;
  slug?: string;
  description?: string;
  content: string;
  category: ServiceCategory;
  requirements?: string[];
  steps?: string[];
  documents?: string[];
  contact?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateServiceGuidePayload {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  category?: ServiceCategory;
  requirements?: string[];
  steps?: string[];
  documents?: string[];
  contact?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface ServiceGuidePaginationParams extends PaginationParams {
  category?: ServiceCategory | null;
  isActive?: boolean | null;
  isFeatured?: boolean | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// TAMBAHAN: Upload Types - matching your upload controller
export type UploadType = 'IMAGE' | 'DOCUMENT' | 'AVATAR';

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
  uploadType: UploadType;
  folder?: string;
  createdAt: string;
}

export interface UploadResponse {
  message: string;
  files: UploadedFile[];
}

// API Response Types matching your backend format
export interface ApiResponse<T> {
  message?: string;
  data?: T;
  user?: T; // For auth responses
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  // category?: PostCategory | null;
  // status?: PostStatus | null; // TAMBAHAN: filter by status
}

export interface PostPaginationParams extends PaginationParams {
  category?: PostCategory | null;
  status?: PostStatus | null;
}
// TAMBAHAN: Common form field types
export interface SelectOption<T = string> {
  value: T;
  label: string;
}

// TAMBAHAN: API Error Response
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

// Tambahkan ke src/types/index.ts - Village Profile Types

// Village Profile Types - matching backend Prisma model
export interface VillageProfile {
  id: string;
  section: string;
  title: string;
  content: string;
  images: string[];
  order: number;
  isPublished: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface VillageProfileFormData {
  section: string;
  title: string;
  content: string;
  images?: string[];
  order?: number;
  isPublished?: boolean;
}

export interface CreateVillageProfilePayload {
  section: string;
  title: string;
  content: string;
  images?: string[];
  order?: number;
  isPublished?: boolean;
}

export interface UpdateVillageProfilePayload {
  section?: string;
  title?: string;
  content?: string;
  images?: string[];
  order?: number;
  isPublished?: boolean;
}

export interface VillageProfilePaginationParams extends PaginationParams {
  section?: string;
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface VillageProfileSection {
  section: string;
  title: string;
  isPublished: boolean;
}

export interface ReorderSectionPayload {
  id: string;
  order: number;
}

// Tambahan untuk src/types/index.ts - Contact Types

// Contact Types - matching backend Prisma model
export type ContactType = 
  | 'KEPALA_DESA'
  | 'SEKRETARIS_DESA' 
  | 'BENDAHARA_DESA'
  | 'KEPALA_URUSAN'
  | 'KEPALA_DUSUN'
  | 'RT_RW'
  | 'BPD'
  | 'KARANG_TARUNA'
  | 'PKK'
  | 'POSYANDU'
  | 'KADER_KESEHATAN'
  | 'GURU'
  | 'TOKOH_AGAMA'
  | 'TOKOH_MASYARAKAT'
  | 'UMKM'
  | 'LAINNYA';

export interface Contact {
  id: string;
  name: string;
  position: string;
  department?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  type: ContactType;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  position: string;
  department?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  type: ContactType;
  isActive?: boolean;
  order?: number;
}

export interface CreateContactPayload {
  name: string;
  position: string;
  department?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  type: ContactType;
  isActive?: boolean;
  order?: number;
}

export interface UpdateContactPayload {
  name?: string;
  position?: string;
  department?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  type?: ContactType;
  isActive?: boolean;
  order?: number;
}

export interface ContactPaginationParams extends PaginationParams {
  type?: ContactType | null;
  isActive?: boolean | null;
  department?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactByTypeParams {
  type: ContactType;
  limit?: number;
}