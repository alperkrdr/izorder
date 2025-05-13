import AdminLayout from '@/components/admin/AdminLayout';
import { getAllGalleryImages } from '@/lib/data';
import Image from 'next/image';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

export const metadata = {
  title: 'Galeri Yönetimi - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Galeri Yönetimi',
};

export default async function GalleryManagementPage() {
  const galleryImages = await getAllGalleryImages();
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Galeri Yönetimi</h1>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md">
          Yeni Görsel Ekle
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((image) => (
          <div key={image.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Image 
                src={image.url}
                alt={image.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/80 rounded-full px-2 py-1 text-xs font-medium">
                {image.category}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 truncate">{image.title}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{image.description}</p>
              <p className="text-xs text-gray-400 mt-1">{image.date}</p>
            </div>
            <div className="px-3 py-2 bg-gray-50 flex justify-between">
              <button className="text-gray-600 hover:text-gray-900">
                <FaEye />
              </button>
              <button className="text-primary hover:text-primary-dark">
                <FaEdit />
              </button>
              <button className="text-red-600 hover:text-red-900">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
} 