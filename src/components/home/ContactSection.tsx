'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send} from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Pesan terkirim! Kami akan membalas secepatnya.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Telepon',
      value: '(021) 1234-5678',
      href: 'tel:+622112345678'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@desadigital.id',
      href: 'mailto:info@desadigital.id'
    },
    {
      icon: MapPin,
      label: 'Alamat',
      value: 'Jl. Desa No. 123, Kec. Digital, Kab. Innovation',
      href: 'https://maps.google.com'
    },
    {
      icon: Clock,
      label: 'Jam Operasional',
      value: 'Senin - Jumat: 08:00 - 16:00 WIB',
      href: null
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tim kami siap membantu Anda. Jangan ragu untuk menghubungi melalui layanan berikut.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Informasi Kontak
            </h3>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.label}</h4>
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          {item.value}
                        </Link>
                      ) : (
                        <p className="text-gray-600">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Media Sosial</h4>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', href: '#', color: 'bg-blue-600' },
                  { name: 'Instagram', href: '#', color: 'bg-pink-600' },
                  { name: 'YouTube', href: '#', color: 'bg-red-600' },
                  { name: 'WhatsApp', href: '#', color: 'bg-green-600' }
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity`}
                    title={social.name}
                  >
                    <span className="sr-only">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Kirim Pesan
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="email@contoh.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16 rounded-xl overflow-hidden h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19030.550012362775!2d111.14398507685868!3d-7.578612979854926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79f4c662389fcd%3A0x59f71f0609e02739!2sAnggrasmanis%2C%20Kec.%20Jenawi%2C%20Kabupaten%20Karanganyar%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1756614918022!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
}