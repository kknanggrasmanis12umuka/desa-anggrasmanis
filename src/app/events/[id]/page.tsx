'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  User, 
  ArrowLeft
} from 'lucide-react';
import { useEvent } from '@/hooks/useEvents';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlaceholderImage from '@/components/shared/PlaceholderImage';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const { data: event, isLoading, error } = useEvent(eventId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      RAPAT_DESA: 'Rapat Desa',
      KEGIATAN_BUDAYA: 'Kegiatan Budaya',
      POSYANDU: 'Posyandu',
      GOTONG_ROYONG: 'Gotong Royong',
      PELATIHAN: 'Pelatihan',
      SOSIALISASI: 'Sosialisasi',
      OLAHRAGA: 'Olahraga',
      KEAGAMAAN: 'Keagamaan',
      PENDIDIKAN: 'Pendidikan',
      KESEHATAN: 'Kesehatan',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      RAPAT_DESA: 'bg-blue-100 text-blue-800',
      KEGIATAN_BUDAYA: 'bg-purple-100 text-purple-800',
      POSYANDU: 'bg-green-100 text-green-800',
      GOTONG_ROYONG: 'bg-orange-100 text-orange-800',
      PELATIHAN: 'bg-indigo-100 text-indigo-800',
      SOSIALISASI: 'bg-yellow-100 text-yellow-800',
      OLAHRAGA: 'bg-red-100 text-red-800',
      KEAGAMAAN: 'bg-emerald-100 text-emerald-800',
      PENDIDIKAN: 'bg-cyan-100 text-cyan-800',
      KESEHATAN: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acara tidak ditemukan
            </h1>
            <p className="text-gray-600 mb-8">
              Acara yang Anda cari mungkin telah dihapus atau tidak tersedia.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Acara
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/events"
              className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Acara
            </Link>
          </div>

          {/* Event Header */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
            {/* Hero Image */}
            <div className="relative h-64 sm:h-80">
              {event.images && event.images.length > 0 ? (
                <Image
                  src={event.images[0]}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <PlaceholderImage label={event.title} />
              )}
              
              {/* Overlay with category and featured badge */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(event.category)}`}>
                  {getCategoryLabel(event.category)}
                </span>
                {event.isFeatured && (
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 text-sm font-medium rounded-full">
                    Unggulan
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h1>
                
                {/* Action buttons */}
                {/* <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div> */}
              </div>

              <p className="text-lg text-gray-600 mb-6">
                {event.description}
              </p>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">Tanggal</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.startDate)}
                        {event.endDate && event.startDate !== event.endDate && (
                          <> - {formatDate(event.endDate)}</>
                        )}
                      </p>
                    </div>
                  </div>

                  {(event.startTime || event.endTime) && (
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-primary-600" />
                      <div>
                        <p className="font-medium">Waktu</p>
                        <p className="text-sm text-gray-600">
                          {event.startTime && formatTime(event.startTime)}
                          {event.endTime && event.startTime !== event.endTime && (
                            <> - {formatTime(event.endTime)}</>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location & Contact */}
                <div className="space-y-3">
                  {event.location && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                      <div>
                        <p className="font-medium">Lokasi</p>
                        <p className="text-sm text-gray-600">
                          {event.location}
                          {event.address && (
                            <>
                              <br />
                              <span className="text-xs text-gray-500">{event.address}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.contactPerson && (
                    <div className="flex items-center text-gray-700">
                      <User className="w-5 h-5 mr-3 text-primary-600" />
                      <div>
                        <p className="font-medium">Contact Person</p>
                        <p className="text-sm text-gray-600">
                          {event.contactPerson}
                          {event.contactPhone && (
                            <>
                              <br />
                              <span className="text-xs text-gray-500">{event.contactPhone}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Participants Info */}
              {event.maxParticipants && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">Kapasitas Peserta</p>
                      <p className="text-sm text-gray-600">
                        {event.currentParticipants} dari {event.maxParticipants} peserta
                      </p>
                    </div>
                  </div>
                  
                  {event.registrationRequired && (
                    <div className="text-right">
                      {event.registrationDeadline && (
                        <p className="text-xs text-gray-500 mb-1">
                          Batas daftar: {formatDate(event.registrationDeadline)}
                        </p>
                      )}
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium">
                        Daftar Sekarang
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Content */}
          {event.content && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detail Acara
              </h2>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: event.content.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          )}

          {/* Image Gallery */}
          {event.images && event.images.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Galeri Foto
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${event.title} - Foto ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}