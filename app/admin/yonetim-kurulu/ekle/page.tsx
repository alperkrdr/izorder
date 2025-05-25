'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { uploadToFirebaseStorage } from '@/utils/firebase/storage';
import StorageErrorHandler from '@/components/admin/StorageErrorHandler';
import { FaSave, FaArrowLeft, FaUpload, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function AddBoardMemberPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [order, setOrder] = useState('');
  const [isFounder, setIsFounder] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Predefined titles
  const titles = [
    'Başkan',
    'Başkan Yardımcısı',
    'Sekreter',
    'Sayman',
    'Üye'
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
  
  // Suggest next order number
  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const boardQuery = query(collection(db, 'board_members'), orderBy('order', 'desc'));
        const querySnapshot = await getDocs(boardQuery);
        
        if (!querySnapshot.empty) {
          const lastOrder = querySnapshot.docs[0].data().order || 0;
          setOrder((lastOrder + 1).toString());
        } else {
          setOrder('1');
        }
      } catch (error) {
        console.error('Error fetching last order:', error);
        setOrder('1');
      }
    };
    
    fetchLastOrder();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    // Validate form
    if (!name.trim()) {
      setError('Ad alanı zorunludur.');
      return;
    }
    
    if (!surname.trim()) {
      setError('Soyad alanı zorunludur.');
      return;
    }
    
    if (!title.trim()) {
      setError('Görev/Unvan alanı zorunludur.');
      return;
    }
    
    if (!order.trim() || isNaN(parseInt(order))) {
      setError('Sıralama numarası geçerli bir sayı olmalıdır.');
      return;
    }
    
    if (!imageFile) {
      setError('Profil görseli zorunludur.');
      return;    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload image using the new storage helper
      const uploadResult = await uploadToFirebaseStorage(imageFile, 'board_members/');
      
      if (!uploadResult.success) {
        setError(uploadResult.error || 'Görsel yüklenirken bir hata oluştu.');
        return;
      }
      
      // Add document to Firestore
      const memberData = {
        name,
        surname,
        title,
        bio: bio || '',
        order: parseInt(order),
        isFounder,
        imageUrl: uploadResult.url!,
        storageRef: uploadResult.storagePath!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'board_members'), memberData);
      
      // Redirect to board members management page
      router.push('/admin/yonetim-kurulu');
      
    } catch (error: any) {
      console.error('Error adding board member:', error);
      setError(error.message || 'Yönetim kurulu üyesi eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Yeni Yönetim Kurulu Üyesi Ekle</h1>
        <Link
          href="/admin/yonetim-kurulu"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ad*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
              Soyad*
            </label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Görev/Unvan*
            </label>
            <select
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Görev Seçin</option>
              {titles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="custom">Diğer</option>
            </select>
            {title === 'custom' && (
              <input
                type="text"
                placeholder="Özel görev/unvan girin"
                value={title === 'custom' ? '' : title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Sıralama Numarası*
            </label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Daha küçük numaralar daha önce gösterilir.
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFounder"
              checked={isFounder}
              onChange={(e) => setIsFounder(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isFounder" className="ml-2 block text-sm text-gray-700">
              Kurucu Üye
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biyografi
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Kısa biyografi metni"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Profil Görseli*
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
          <p className="text-xs text-gray-500 mt-1">
            Kare formatta bir görsel seçmeniz önerilir (1:1 oranında).
          </p>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full"
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