'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Calendar, FileText, Store, MessageSquare, Phone } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Profil', href: '/profile', icon: Home },
    { name: 'Berita', href: '/posts', icon: FileText },
    { name: 'Acara', href: '/events', icon: Calendar },
    { name: 'UMKM', href: '/umkm', icon: Store },
    { name: 'Layanan', href: '/layanan', icon: MessageSquare },
    { name: 'Kontak', href: '/contacts', icon: Phone },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  {process.env.NEXT_PUBLIC_VILLAGE_NAME || 'Desa Digital'}
                </h1>
                <p className="text-sm text-gray-600">Portal Digital Desa</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Masuk
            </Link>
            <Link
              href="/admin/dashboard"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mb-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Masuk</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-2 bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}