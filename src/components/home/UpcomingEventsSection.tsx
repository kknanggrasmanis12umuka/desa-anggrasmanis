'use client';

import { useEvents } from '@/hooks/useEvents';
import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Event } from '@/types';

export default function UpcomingEventsSection() {
  // Use type assertion as a temporary workaround
  const { data: eventsData, isLoading } = useEvents({ 
    limit: 3,
    sortBy: 'startDate',
    sortOrder: 'asc'
  } as any);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!eventsData?.data || eventsData.data.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Acara Mendatang
          </h2>
          <p className="text-xl text-gray-600">
            Kegiatan dan event terdekat di desa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {eventsData.data.map((event: Event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
              <div className="relative h-48 bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                <Calendar className="w-16 h-16 text-white opacity-20" />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                    <span>
                      {event.startDate ? format(new Date(event.startDate), 'EEEE, dd MMMM yyyy', { locale: id }) : 'Tanggal tidak tersedia'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-primary-600" />
                    <span>
                      {event.startTime || 'Waktu tidak tersedia'}
                    </span>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Lihat detail →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Lihat Semua Acara
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}