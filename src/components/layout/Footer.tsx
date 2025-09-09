import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Tentang Desa', href: '/profile' },
    { name: 'Berita Terkini', href: '/posts' },
    { name: 'Acara & Kegiatan', href: '/events' },
    { name: 'UMKM Desa', href: '/umkm' },
  ];

  const services = [
    { name: 'Panduan Layanan', href: '/layanan' }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#',
      icon: Instagram,
    },
    {
      name: 'YouTube',
      href: process.env.NEXT_PUBLIC_YOUTUBE_URL || '#',
      icon: Youtube,
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {process.env.NEXT_PUBLIC_VILLAGE_NAME || 'Desa Digital'}
                </h3>
                <p className="text-gray-400 text-sm">Portal Digital Desa</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Sistem informasi digital untuk meningkatkan pelayanan publik, 
              transparansi, dan partisipasi masyarakat dalam pembangunan desa.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {process.env.NEXT_PUBLIC_VILLAGE_ADDRESS || 'Alamat Desa'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">
                  {process.env.NEXT_PUBLIC_VILLAGE_PHONE || '+62 123 4567 8900'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span className="text-sm">
                  {process.env.NEXT_PUBLIC_VILLAGE_EMAIL || 'info@desa.id'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigasi Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {process.env.NEXT_PUBLIC_VILLAGE_NAME || 'Desa Digital'}. 
            Seluruh hak cipta dilindungi.
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-gray-400 text-sm">Ikuti Kami:</span>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}