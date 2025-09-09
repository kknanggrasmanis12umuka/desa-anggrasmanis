// src/app/services/page.tsx
'use client';
import { Suspense } from 'react';
import ServiceGuideCard from '@/components/service-guides/ServiceGuideCard';
import { useServiceGuides, useServiceGuideCategories } from '@/hooks/useServiceGuides';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ServiceGuide } from '@/types'; // Import the ServiceGuide type

function ServiceGuidesContent() {
  const { data: guidesData, isLoading } = useServiceGuides({ 
    page: 1, 
    limit: 20,
    isActive: true 
  });
  const { data: categoriesData } = useServiceGuideCategories();

  const serviceGuides = guidesData?.serviceGuides || [];
  const categories = categoriesData?.categories || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategori Layanan</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: string) => (
              <button
                key={category}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {category.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Service Guides Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Semua Panduan Layanan</h2>
        
        {serviceGuides.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada panduan layanan tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceGuides.map((guide: ServiceGuide) => (
              <ServiceGuideCard key={guide.id} serviceGuide={guide} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div>
        <Header />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ServiceGuidesContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}