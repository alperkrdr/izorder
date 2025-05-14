import Image from 'next/image';
import { getAllGalleryImages } from '@/lib/data';

export const metadata = {
  title: 'Galeri - İzorder',
  description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği Fotoğraf Galerisi',
};

export default async function GalleryPage() {
  const galleryImages = await getAllGalleryImages();
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Galeri</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <div key={image.id} className="relative overflow-hidden rounded-lg group">
            <div className="aspect-w-1 aspect-h-1 relative h-64">
              <Image
                src={image.url}
                alt={image.description}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-4 w-full">
                <h3 className="text-white font-medium text-lg line-clamp-2">{image.title}</h3>
                <p className="text-white/80 text-sm line-clamp-1">{image.description}</p>
                <p className="text-white/70 text-xs mt-1">{image.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 