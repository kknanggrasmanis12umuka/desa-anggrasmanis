import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Selamat Datang di <br />
          <span className="text-yellow-300">
            {process.env.NEXT_PUBLIC_VILLAGE_NAME || 'Desa Digital'}
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Portal digital untuk meningkatkan pelayanan publik, transparansi, 
          dan partisipasi masyarakat dalam pembangunan desa
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/layanan"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Layanan Online
          </Link>
          <Link
            href="/profile"
            className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
          >
            Tentang Desa
          </Link>
        </div>
      </div>
    </section>
  );
}