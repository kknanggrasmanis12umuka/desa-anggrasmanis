'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  fallback?: React.ReactNode;
};

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc,
  fallback,
  ...rest
}: Props) {
  const [errored, setErrored] = useState(false);

  // Tidak ada src → langsung fallback
  if (!src || errored) {
    if (fallback) return <>{fallback}</>;
    if (fallbackSrc)
      return (
        <img
          src={fallbackSrc}
          alt={alt}
          className={(rest as any).className ?? ''}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      );
    // fallback minimal
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
        No Image
      </div>
    );
  }

  return (
    <Image
      {...rest}
      alt={alt}
      src={src}
      onError={() => setErrored(true)}
    />
  );
}
