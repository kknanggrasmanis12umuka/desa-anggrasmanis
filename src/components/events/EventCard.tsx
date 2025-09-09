import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Event } from '@/types';
import PlaceholderImage from '@/components/shared/PlaceholderImage';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
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
      KEGIATAN_BUDAYA: 'Budaya',
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48">
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
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(event.category)}`}>
            {getCategoryLabel(event.category)}
          </span>
        </div>
        {event.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full">
              Unggulan
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {formatDate(event.startDate)}
              {event.endDate && event.startDate !== event.endDate && (
                <> - {formatDate(event.endDate)}</>
              )}
            </span>
          </div>

          {(event.startTime || event.endTime) && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {event.startTime && formatTime(event.startTime)}
                {event.endTime && event.startTime !== event.endTime && (
                  <> - {formatTime(event.endTime)}</>
                )}
              </span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}

          {event.maxParticipants && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              <span>
                {event.currentParticipants}/{event.maxParticipants} peserta
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{event.tags.length - 3} lainnya
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/events/${event.id}`}
          className="block w-full bg-primary-600 hover:bg-primary-700 text-white text-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}