// src/app/umkm/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star,
  MessageSquare,
  Instagram,
  Facebook,
  BadgeCheck,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { useUMKMById } from '@/hooks/useUMKM';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
//import { UMKM } from '@/types'; // Import the UMKM type

export default function UMKMDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: umkm, isLoading, error } = useUMKMById(id);

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatRating = (rating?: number) => {
    if (!rating || rating === 0) return '0.0';
    return rating.toFixed(1);
  };

  const handleWhatsAppClick = () => {
    if (!umkm) return;
    const whatsappNumber = umkm.whatsapp || umkm.phone;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.startsWith('0') 
      ? '62' + cleanNumber.substring(1)
      : cleanNumber.startsWith('62') 
      ? cleanNumber 
      : '62' + cleanNumber;
    
    const message = encodeURIComponent(`Halo ${umkm.owner}, saya tertarik dengan produk UMKM ${umkm.name}`);
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    if (umkm) {
      window.location.href = `tel:${umkm.phone}`;
    }
  };

  const handleEmailClick = () => {
    if (umkm?.email) {
      window.location.href = `mailto:${umkm.email}`;
    }
  };

  const handleMapClick = () => {
    if (umkm?.latitude && umkm?.longitude) {
      window.open(`https://www.google.com/maps?q=${umkm.latitude},${umkm.longitude}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(umkm?.address || '')}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !umkm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">UMKM Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">UMKM yang Anda cari tidak ditemukan atau sudah tidak aktif.</p>
            <Link
              href="/umkm"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Kembali ke Daftar UMKM
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
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <Link href="/umkm" className="hover:text-primary-600 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke UMKM
              </Link>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{umkm.name}</h1>
                      {umkm.verified && (
                        <BadgeCheck className="w-6 h-6 text-green-500" />
                      )}
                      {umkm.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-sm font-medium rounded-full">
                          Unggulan
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-2">Pemilik: {umkm.owner}</p>
                    <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                      {umkm.category}
                    </span>
                  </div>
                  
                  {/* Rating */}
                  {umkm.rating && umkm.rating > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold text-lg">{formatRating(umkm.rating)}</span>
                      <span className="text-gray-600">({umkm.reviewCount} review)</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 leading-relaxed">{umkm.description}</p>
              </div>

              {/* Images Gallery */}
              {umkm.images && umkm.images.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4">Galeri Foto</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {umkm.images.map((image: string, index: number) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${umkm.name} - Foto ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          onClick={() => window.open(image, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {umkm.products && umkm.products.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Produk & Layanan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {umkm.products.map((product: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <div className="text-right">
                            <span className="text-primary-600 font-bold text-lg">
                              {formatCurrency(product.price)}
                            </span>
                            {product.unit && (
                              <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
                            )}
                          </div>
                        </div>
                        {product.description && (
                          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.available !== false 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.available !== false ? 'Tersedia' : 'Tidak Tersedia'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operating Hours */}
              {umkm.operatingHours && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Jam Operasional
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(umkm.operatingHours).map(([day, hours]: [string, any]) => {
                      const dayLabels: Record<string, string> = {
                        monday: 'Senin',
                        tuesday: 'Selasa',
                        wednesday: 'Rabu',
                        thursday: 'Kamis',
                        friday: 'Jumat',
                        saturday: 'Sabtu',
                        sunday: 'Minggu',
                      };
                      
                      return (
                        <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">{dayLabels[day]}</span>
                          <span className="text-gray-600">{hours || 'Tutup'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Hubungi Kami</h2>
                
                <div className="space-y-4">
                  {/* WhatsApp */}
                  {(umkm.whatsapp || umkm.phone) && (
                    <button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      WhatsApp
                    </button>
                  )}

                  {/* Phone */}
                  <button
                    onClick={handleCallClick}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Telepon
                  </button>

                  {/* Email */}
                  {umkm.email && (
                    <button
                      onClick={handleEmailClick}
                      className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      Email
                    </button>
                  )}

                  {/* Website */}
                  {umkm.website && (
                    <a
                      href={umkm.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Globe className="w-5 h-5" />
                      Website
                    </a>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{umkm.phone}</span>
                  </div>

                  {umkm.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{umkm.email}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{umkm.address}</span>
                  </div>

                  {/* Map Button */}
                  <button
                    onClick={handleMapClick}
                    className="w-full mt-3 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Lihat di Peta
                  </button>
                </div>

                {/* Social Media */}
                {umkm.socialMedia && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium text-gray-900 mb-3">Media Sosial</h3>
                    <div className="flex gap-3">
                      {umkm.socialMedia.instagram && (
                        <a
                          href={umkm.socialMedia.instagram.startsWith('http') 
                            ? umkm.socialMedia.instagram 
                            : `https://instagram.com/${umkm.socialMedia.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </a>
                      )}

                      {umkm.socialMedia.facebook && (
                        <a
                          href={umkm.socialMedia.facebook.startsWith('http') 
                            ? umkm.socialMedia.facebook 
                            : `https://facebook.com/${umkm.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Facebook className="w-4 h-4" />
                          Facebook
                        </a>
                      )}
                    </div>

                    {umkm.socialMedia.tiktok && (
                      <a
                        href={umkm.socialMedia.tiktok.startsWith('http') 
                          ? umkm.socialMedia.tiktok 
                          : `https://tiktok.com/@${umkm.socialMedia.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-2 bg-black hover:bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="w-4 h-4">🎵</span>
                        TikTok
                      </a>
                    )}

                    {umkm.socialMedia.youtube && (
                      <a
                        href={umkm.socialMedia.youtube.startsWith('http') 
                          ? umkm.socialMedia.youtube 
                          : `https://youtube.com/${umkm.socialMedia.youtube}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="w-4 h-4">📺</span>
                        YouTube
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Informasi UMKM</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      umkm.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {umkm.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  
                  {umkm.verified && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Verifikasi</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Terverifikasi
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bergabung</span>
                    <span className="text-gray-900">
                      {new Date(umkm.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>

                  {umkm.products && umkm.products.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Produk</span>
                      <span className="text-gray-900 font-medium">{umkm.products.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}