import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || 'Web Desa Digital',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Web Desa Digital'}`,
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Portal Digital Desa Modern untuk Pelayanan Publik',
  keywords: ['desa', 'digital', 'pelayanan publik', 'umkm', 'pengaduan', 'berita'],
  authors: [{ name: 'Tim Pengembang Desa Digital' }],
  creator: 'Tim Pengembang Desa Digital',
  publisher: process.env.NEXT_PUBLIC_VILLAGE_NAME || 'Desa Digital',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Web Desa Digital',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Portal Digital Desa Modern',
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'Web Desa Digital',
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Web Desa Digital',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Portal Digital Desa Modern',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}