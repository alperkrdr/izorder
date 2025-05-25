'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { FaSave, FaArrowLeft, FaUpload, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';
import { PlaceholderImages } from '@/utils/placeholders';
import { uploadImageWithAuth } from '@/utils/firebase/storageUtils';

export default function AddPressCoveragePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(PlaceholderImages.press);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    
    if (!source.trim()) {
      setError('Kaynak alanı zorunludur.');
      return;
    }
    
    if (!imageFile) {
      setError('Görsel seçimi zorunludur.');
      return;
    }
      try {
      setLoading(true);
      setError(null);
      
      console.log('Görsel yükleme işlemi başlıyor:', imageFile.name);
      
      // Upload image using new utility function
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'press_coverage', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        setError(`Görsel yükleme hatası: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
      
      const imageUrl = uploadResult.url!;
      const storageRefPath = uploadResult.storageRef!;
      console.log('Görsel yükleme başarılı:', imageUrl);
      
      // Add document to Firestore
      try {
        const pressData = {
          title,
          summary: summary || title.substring(0, 100),
          source,
          externalUrl: externalUrl || null,
          imageUrl,
          date,
          storageRef: storageRefPath,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('Firestore belgesine kaydediliyor...');
        await addDoc(collection(db, 'press_coverage'), pressData);
        console.log('Belge başarıyla kaydedildi!');
      } catch (firestoreError: any) {
        console.error('Firestore kaydetme hatası:', firestoreError);
        setError(`Veritabanı kayıt hatası: ${firestoreError.code || ''} - ${firestoreError.message || 'Bilinmeyen hata'}. Firebase Firestore kurallarınızı kontrol edin.`);
        setLoading(false);
        return;
      }
      
      // Redirect to press coverage management page
      router.push('/admin/basinda-biz');
      
    } catch (error: any) {
      console.error('Error adding press coverage:', error);
      setError(`Genel hata: ${error.code || ''} - ${error.message || 'Basın haberi eklenirken bir hata oluştu.'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Yeni Basın Haberi Ekle</h1>
        <Link
          href="/admin/basinda-biz"
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
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Özet
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Haber özeti (boş bırakılırsa başlık kullanılacaktır)"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Kaynak*
          </label>
          <input
            type="text"
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Örn: Hürriyet Gazetesi, CNN Türk, vb."
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Kaynak Linki
          </label>
          <input
            type="url"
            id="externalUrl"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Tarih*
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
                className="max-h-40 rounded-md"
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