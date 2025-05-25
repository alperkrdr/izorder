'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { uploadToFirebaseStorage } from '@/utils/firebase/storage';
import StorageErrorHandler from '@/components/admin/StorageErrorHandler';
import { FaSave, FaArrowLeft, FaUpload, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function AddGalleryImagePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    
    if (loading) return;
    
    // Validate form
    if (!title.trim()) {
      setError('Başlık alanı zorunludur.');
      return;
    }
    
    if (!category.trim()) {
      setError('Kategori seçimi zorunludur.');
      return;
    }
    
    if (!imageFile) {
      setError('Görsel seçimi zorunludur.');
      return;
    }
      try {
      setLoading(true);
      setError(null);
      
      // Upload image using the new storage helper
      const uploadResult = await uploadToFirebaseStorage(imageFile, 'gallery/');
      
      if (!uploadResult.success) {
        setError(uploadResult.error || 'Görsel yüklenirken bir hata oluştu.');
        return;
      }
      
      // Add document to Firestore
      const galleryData = {
        title,
        description: description || '',
        category,
        url: uploadResult.url!,
        date: new Date().toISOString(),
        storageRef: uploadResult.storagePath!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'gallery_images'), galleryData);
      
      // Redirect to gallery management page
      router.push('/admin/galeri');
      
    } catch (error: any) {
      console.error('Error adding gallery image:', error);
      setError(error.message || 'Görsel eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Yeni Galeri Görseli Ekle</h1>
        <Link
          href="/admin/galeri"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Geri Dön
        </Link>
      </div>
        {error && (
        <div className="mb-6">
          <StorageErrorHandler 
            error={error} 
            onRetry={() => {
              setError(null);
              // Retry the form submission if there was a file
              if (imageFile) {
                handleSubmit(new Event('submit') as any);
              }
            }} 
          />
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
            Görsel*
          </label>
          <div className="flex items-center">
            <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
              <FaUpload className="mr-2" />
              <span>Görsel Seç</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </label>
            {imageFile && (
              <span className="ml-2 text-sm text-gray-500">
                {imageFile.name}
              </span>
            )}
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-60 rounded-md"
              />
            </div>
          )}
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
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
} 