'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaEdit, FaEye, FaPlus } from 'react-icons/fa';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/utils/firebase/client';

// Gallery image type
interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  date: string;
  storageRef?: string;
}

export default function GalleryManagementPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch gallery images
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      
      // Create a query against the gallery_images collection
      const galleryQuery = query(collection(db, 'gallery_images'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(galleryQuery);
      
      // Map the documents to GalleryImage objects
      const images: GalleryImage[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<GalleryImage, 'id'>
      }));
      
      setGalleryImages(images);
    } catch (error: any) {
      console.error('Error fetching gallery images:', error);
      setError('Galeri görselleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete gallery image
  const handleDelete = async (image: GalleryImage) => {
    if (!confirm(`"${image.title}" görselini silmek istediğinize emin misiniz?`)) {
      return;
    }
    
    try {
      setDeleting(image.id);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'gallery_images', image.id));
      
      // Delete from Storage if storageRef exists
      if (image.storageRef) {
        try {
          const imageRef = ref(storage, image.storageRef);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error('Error deleting image from storage:', storageError);
          // Continue even if storage deletion fails
        }
      }
      
      // Update the state
      setGalleryImages(galleryImages.filter(img => img.id !== image.id));
      setSuccessMessage('Görsel başarıyla silindi.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error deleting gallery image:', error);
      setError('Görsel silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDeleting(null);
    }
  };
  
  useEffect(() => {
    fetchGalleryImages();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch (error) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Galeri Yönetimi</h1>
        <Link
          href="/admin/galeri/ekle"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Görsel Ekle
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      {galleryImages.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">Henüz galeri görseli bulunmuyor. Yeni bir görsel ekleyin.</p>
        </div>
      ) : (
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
                <p className="text-xs text-gray-400 mt-1">{formatDate(image.date)}</p>
              </div>
              <div className="px-3 py-2 bg-gray-50 flex justify-between">
                <button className="text-gray-600 hover:text-gray-900">
                  <FaEye />
                </button>
                <Link href={`/admin/galeri/duzenle/${image.id}`} className="text-blue-600 hover:text-blue-900">
                  <FaEdit />
                </Link>
                <button 
                  className="text-red-600 hover:text-red-900"
                  onClick={() => handleDelete(image)}
                  disabled={deleting === image.id}
                >
                  {deleting === image.id ? '...' : <FaTrash />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 