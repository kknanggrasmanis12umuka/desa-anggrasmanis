/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable standalone untuk build yang lebih simple
  // output: 'standalone',
  
  // Image configuration - simplified untuk mengurangi memory usage
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3001', 
        pathname: '/uploads/**',
      },
    ],
    // Disable optimizations yang berat
    unoptimized: true,  
  },

  // Environment variables - simplified
  env: {
    CUSTOM_KEY: 'my-value',
  },

  // Experimental features - kosongkan untuk menghindari warning
  experimental: {
    // Hapus konfigurasi yang deprecated atau bermasalah
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ];
  },

  // API Rewrites - penting untuk development dan Docker
  async rewrites() {
    // Hanya aktif di development mode
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/:path*`,
        },
      ];
    }
    
    // Di production, tidak perlu rewrite karena akan dihandle oleh nginx
    return [];
  },

  // Security headers - simplified untuk Docker
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Cache headers untuk static assets
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack configuration - minimal untuk mengurangi memory
  webpack: (config: any) => {
    // Reduce memory usage
    config.optimization.splitChunks = false;
    config.optimization.minimize = false;
    return config;
  },

  // Compiler options - simplified
  compiler: {
    // Remove console logs di production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  generateEtags: false, // Disable ETags for better caching control

  // Build optimizations - disable heavy optimizations
  //swcMinify: false,
  // compress: false,
  
  // Typescript configuration - allow builds to continue with errors if needed
  typescript: {
    // Uncomment jika ada error TypeScript yang tidak bisa diperbaiki dengan cepat
    // ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // ESLint configuration - allow builds to continue with lint errors if needed
  eslint: {
    ignoreDuringBuilds: true,
    // Uncomment jika ada error ESLint yang tidak bisa diperbaiki dengan cepat
    // ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },

  // Transpile packages (jika ada package yang perlu di-transpile)
  transpilePackages: [],
};

// Export menggunakan CommonJS untuk kompatibilitas yang lebih baik
module.exports = nextConfig;