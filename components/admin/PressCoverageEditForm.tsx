'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/utils/firebase/client';
import { FaSave, FaArrowLeft, FaUpload, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceholderImages } from '@/utils/placeholders';

// Press Coverage item type
interface PressItem {
  id: string;
  title: string;
  summary?: string;
  source: string;
  date: string;
  imageUrl: string;
  externalUrl?: string;
  storageRef?: string;
}

interface PressCoverageEditFormProps {
  id: string;
}

export default function PressCoverageEditForm({ id }: PressCoverageEditFormProps) {
  const router = useRouter();
  
  const [pressItem, setPressItem] = useState<PressItem | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch press item data
  useEffect(() => {
    const fetchPressItem = async () => {
      try {
        setInitialLoading(true);
        
        const docRef = doc(db, 'press_coverage', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<PressItem, 'id'>;
          const item: PressItem = {
            id: docSnap.id,
            ...data
          };
          
          setPressItem(item);
          setTitle(item.title || '');
          setSummary(item.summary || '');
          setSource(item.source || '');
          setExternalUrl(item.externalUrl || '');
          setImagePreview(item.imageUrl || PlaceholderImages.press);
          
          // Format date for input
          if (item.date) {
            try {
              const dateObj = new Date(item.date);
              const formattedDate = dateObj.toISOString().split('T')[0];
              setDate(formattedDate);
            } catch (e) {
              setDate('');
            }
          }
          
        } else {
          setError('Basın haberi bulunamadı.');
          setTimeout(() => {
            router.push('/admin/basinda-biz');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Error fetching press item:', error);
        setError('Basın haberi yüklenirken bir hata oluştu.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchPressItem();
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
    
    if (loading || !pressItem) return;
    
    // Validate form
    if (!title.trim()) {
      setError('Başlık alanı zorunludur.');
      return;
    }
    
    if (!source.trim()) {
      setError('Kaynak alanı zorunludur.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Process update data
      const updateData: Record<string, any> = {
        title,
        summary: summary || title.substring(0, 100),
        source,
        externalUrl: externalUrl || null,
        date,
        updatedAt: new Date().toISOString()
      };
      
      // Upload new image if selected
      if (imageFile) {
        // Delete old image if there's a storage reference
        if (pressItem.storageRef) {
          try {
            const oldImageRef = ref(storage, pressItem.storageRef);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue even if the old image deletion fails
          }
        }
        
        // Upload new image
        const storageRef = ref(storage, `press_coverage/${Date.now()}-${imageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        
        updateData.imageUrl = imageUrl;
        updateData.storageRef = storageRef.fullPath;
      }
      
      // Update document in Firestore
      const docRef = doc(db, 'press_coverage', id);
      await updateDoc(docRef, updateData);
      
      // Redirect to press coverage management page
      router.push('/admin/basinda-biz');
      
    } catch (error: any) {
      console.error('Error updating press coverage:', error);
      setError(error.message || 'Basın haberi güncellenirken bir hata oluştu.');
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
  
  if (!pressItem && !initialLoading) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error || 'Basın haberi bulunamadı.'}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Basın Haberi Düzenle</h1>
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
            Görsel
          </label>
          
          {imagePreview && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Mevcut Görsel:</p>
              <div className="relative w-40 h-40 mb-2">
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
