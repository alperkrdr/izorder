'use client';

import Image from 'next/image';
import { GalleryImage } from '@/types';

interface GalleryPreviewProps {
  images: GalleryImage[];
}

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative overflow-hidden rounded-lg group h-60">
          <Image
            src={image.url}
            alt={image.description}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <h3 className="text-white font-medium text-lg">{image.title}</h3>
              <p className="text-white/80 text-sm">{image.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 