'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedPostsSection from '@/components/home/FeaturedPostsSection';
import UMKMShowcaseSection from '@/components/home/UMKMShowcaseSection';
import ServicesPreviewSection from '@/components/home/ServicesPreviewSection';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
// import StatisticsSection from '@/components/home/StatisticsSection';
import ContactSection from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturedPostsSection />
        <UMKMShowcaseSection />
        <ServicesPreviewSection />
        <UpcomingEventsSection />
        {/* <StatisticsSection /> */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}