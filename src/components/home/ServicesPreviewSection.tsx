import Link from 'next/link';
import { ArrowRight, MessageSquare, Phone, Store, FileText } from 'lucide-react';

const services = [
  {
    title: 'Panduan Layanan',
    description: 'Temukan prosedur lengkap untuk berbagai layanan publik desa',
    icon: MessageSquare,
    href: '/layanan',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Bantuan',
    description: 'Layanan bantuan cepat untuk masyarakat',
    icon: Phone,
    href: '/contacts',
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'UMKM Desa',
    description: 'Direktori lengkap usaha mikro, kecil, dan menengah desa',
    icon: Store,
    href: '/umkm',
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Berita & Info',
    description: 'Informasi terkini seputar kegiatan dan pembangunan desa',
    icon: FileText,
    href: '/posts',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function ServicesPreviewSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Layanan Digital Desa
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Akses mudah ke berbagai layanan publik dan informasi desa dalam satu platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.href}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 ${service.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                  <span>Akses Layanan</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}