import EventCard from './EventCard';
import { Event } from '@/types';

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Belum ada acara
        </h3>
        <p className="text-gray-600">
          Saat ini belum ada acara yang tersedia. Silakan cek kembali nanti.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}