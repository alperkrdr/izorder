'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/utils/firebase/client';
import { FaSave, FaArrowLeft, FaUpload, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

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

export default function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [galleryImage, setGalleryImage] = useState<GalleryImage | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Predefined categories
  const categories = [
    'Etkinlik',
    'Dernek Faaliyetleri',
    'Toplantılar',
    'Eğitim',
    'Kültürel',
    'Sosyal',
    'Diğer'
  ];
  
  // Fetch gallery image data
  useEffect(() => {
    const fetchGalleryImage = async () => {
      try {
        setInitialLoading(true);
        
        const docRef = doc(db, 'gallery_images', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<GalleryImage, 'id'>;
          const image: GalleryImage = {
            id: docSnap.id,
            ...data
          };
          
          setGalleryImage(image);
          setTitle(image.title || '');
          setDescription(image.description || '');
          setCategory(image.category || '');
          setImagePreview(image.url || null);
          
        } else {
          setError('Galeri görseli bulunamadı.');
          setTimeout(() => {
            router.push('/admin/galeri');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Error fetching gallery image:', error);
        setError('Galeri görseli yüklenirken bir hata oluştu.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchGalleryImage();
  }, [id, router]);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Görsel dosyası 5MB\'dan küçük olmalıdır.');
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || !galleryImage) return;
    
    // Validate form
    if (!title.trim()) {
      setError('Başlık alanı zorunludur.');
      return;
    }
    
    if (!category.trim()) {
      setError('Kategori seçimi zorunludur.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Process update data
      const updateData: Record<string, any> = {
        title,
        description: description || '',
        category,
        updatedAt: new Date().toISOString()
      };
      
      // Upload new image if selected
      if (imageFile) {
        // Delete old image if there's a storage reference
        if (galleryImage.storageRef) {
          try {
            const oldImageRef = ref(storage, galleryImage.storageRef);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue even if the old image deletion fails
          }
        }
        
        // Upload new image
        const storageRef = ref(storage, `gallery/${Date.now()}-${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        
        updateData.url = imageUrl;
        updateData.storageRef = storageRef.fullPath;
      }
      
      // Update document in Firestore
      const docRef = doc(db, 'gallery_images', id);
      await updateDoc(docRef, updateData);
      
      // Redirect to gallery management page
      router.push('/admin/galeri');
      
    } catch (error: any) {
      console.error('Error updating gallery image:', error);
      setError(error.message || 'Galeri görseli güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!galleryImage && !initialLoading) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error || 'Galeri görseli bulunamadı.'}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Galeri Görseli Düzenle</h1>
        <Link
          href="/admin/galeri"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Geri Dön
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Başlık*
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Görsel hakkında kısa açıklama"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Kategori*
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Görsel
          </label>
          
          {imagePreview && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Mevcut Görsel:</p>
              <div className="relative w-60 h-60 mb-2">
                <Image
                  src={imagePreview}
                  alt={title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
              <FaUpload className="mr-2" />
              <span>Yeni Görsel Seç</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imageFile && (
              <span className="ml-2 text-sm text-gray-500">
                {imageFile.name}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Yeni bir görsel seçmezseniz mevcut görsel kullanılmaya devam edilecektir.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <FaSave className="mr-2" />
            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 