// src/components/umkm/UMKMCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Star, Badge, Globe, MessageSquare } from 'lucide-react';
import { UMKM } from '@/types';
//import PlaceholderImage from '@/components/shared/PlaceholderImage';

interface UMKMCardProps {
  umkm: UMKM;
}

export default function UMKMCard({ umkm }: UMKMCardProps) {
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatRating = (rating?: number) => {
    if (!rating || rating === 0) return '-';
    return rating.toFixed(1);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Makanan & Minuman': 'bg-orange-100 text-orange-800',
      'Fashion & Pakaian': 'bg-purple-100 text-purple-800',
      'Kerajinan Tangan': 'bg-green-100 text-green-800',
      'Pertanian': 'bg-emerald-100 text-emerald-800',
      'Jasa': 'bg-blue-100 text-blue-800',
      'Teknologi': 'bg-indigo-100 text-indigo-800',
      'Kesehatan & Kecantikan': 'bg-pink-100 text-pink-800',
      'Otomotif': 'bg-gray-100 text-gray-800',
      'Perikanan': 'bg-cyan-100 text-cyan-800',
      'Lainnya': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getMainProduct = () => {
    if (umkm.products && umkm.products.length > 0) {
      return umkm.products[0];
    }
    return null;
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const mainProduct = getMainProduct();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48">
        {umkm.images && umkm.images.length > 0 ? (
          <Image
            src={umkm.images[0]}
            alt={umkm.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
  <span className="text-gray-500 text-sm font-medium">{umkm.name}</span>
</div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(umkm.category)}`}>
            {umkm.category}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {umkm.featured && (
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Unggulan
            </span>
          )}
          {umkm.verified && (
            <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
              <Badge className="w-3 h-3" />
              Terverifikasi
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {umkm.name}
          </h3>
          
          {/* Rating */}
          {umkm.rating && umkm.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{formatRating(umkm.rating)}</span>
              <span className="text-gray-500">({umkm.reviewCount})</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-1 flex items-center">
          <span className="font-medium">Pemilik:</span>
          <span className="ml-1">{umkm.owner}</span>
        </p>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {umkm.description}
        </p>

        {/* Main Product */}
        {mainProduct && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 text-sm">{mainProduct.name}</p>
                {mainProduct.description && (
                  <p className="text-xs text-gray-600 line-clamp-1">{mainProduct.description}</p>
                )}
              </div>
              <p className="text-primary-600 font-bold text-sm">
                {formatCurrency(mainProduct.price)}
                {mainProduct.unit && <span className="text-xs text-gray-500">/{mainProduct.unit}</span>}
              </p>
            </div>
            {umkm.products && umkm.products.length > 1 && (
              <p className="text-xs text-gray-500 mt-1">
                +{umkm.products.length - 1} produk lainnya
              </p>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {umkm.address && (
            <div className="flex items-start text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{umkm.address}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="w-4 h-4 mr-2" />
            <span>{umkm.phone}</span>
          </div>
        </div>

        {/* Operating Hours */}
        {umkm.operatingHours && (
          <div className="text-xs text-gray-500 mb-4">
            <span className="font-medium">Jam Buka: </span>
            {Object.entries(umkm.operatingHours).find(([day, hours]) => hours)?.[1] || 'Tidak tersedia'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/umkm/${umkm.id}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Lihat Detail
          </Link>
          
          {(umkm.whatsapp || umkm.phone) && (
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
              title="Hubungi via WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
              WA
            </button>
          )}
          
          {umkm.website && (
            <a
              href={umkm.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              title="Kunjungi Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}