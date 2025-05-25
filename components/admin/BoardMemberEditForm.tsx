'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { uploadImageWithAuth } from '@/utils/firebase/storageUtils';
import { FaSave, FaArrowLeft, FaUpload, FaExclamationCircle } from 'react-icons/fa';

// Board member type
interface BoardMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  imageUrl?: string;
  storageRef?: string;
  order: number;
}

interface BoardMemberEditFormProps {
  id: string;
}

export default function BoardMemberEditForm({ id }: BoardMemberEditFormProps) {
  const router = useRouter();
  
  const [boardMember, setBoardMember] = useState<BoardMember | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Predefined positions
  const positions = [
    'Başkan',
    'Başkan Yardımcısı',
    'Genel Sekreter',
    'Sayman',
    'Üye',
    'Denetmen',
    'Yedek Üye'
  ];
  
  // Fetch board member data
  useEffect(() => {
    const fetchBoardMember = async () => {
      try {
        const docRef = doc(db, 'boardMembers', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as BoardMember;
          setBoardMember(data);
          setName(data.name || '');
          setPosition(data.position || '');
          setBio(data.bio || '');
          setOrder(data.order || 0);
          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
        } else {
          setError('Yönetim kurulu üyesi bulunamadı.');
        }
      } catch (error) {
        console.error('Board member fetch error:', error);
        setError('Veri yüklenirken hata oluştu.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBoardMember();
  }, [id]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'den küçük olmalıdır.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin.');
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!boardMember) return;
    
    if (!name.trim()) {
      setError('İsim gereklidir.');
      return;
    }
    
    if (!position.trim()) {
      setError('Pozisyon gereklidir.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: Partial<BoardMember> = {
        name: name.trim(),
        position: position.trim(),
        bio: bio.trim(),
        order: order
      };

      // Upload new image if selected
      if (imageFile) {
        const timestamp = Date.now();
        const fileName = `board_member_${timestamp}_${imageFile.name}`;
        
        const uploadResult = await uploadImageWithAuth(
          imageFile,
          'board_members',
          fileName
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Resim yüklenirken hata oluştu');
        }

        updateData.imageUrl = uploadResult.url; 
        updateData.storageRef = uploadResult.storageRef;
      }

      // Update document in Firestore
      const docRef = doc(db, 'boardMembers', id);
      await updateDoc(docRef, updateData);

      console.log('Board member updated successfully');
      router.push('/admin/yonetim-kurulu');
    } catch (error: any) {
      console.error('Update error:', error);
      setError(error.message || 'Güncelleme sırasında hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!boardMember) {
    return (
      <div className="text-center py-8">
        <FaExclamationCircle className="mx-auto text-4xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Yönetim Kurulu Üyesi Bulunamadı</h2>
        <p className="text-gray-600 mb-4">Aradığınız yönetim kurulu üyesi mevcut değil.</p>
        <Link 
          href="/admin/yonetim-kurulu"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Geri Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Yönetim Kurulu Üyesi Düzenle</h1>
          <Link 
            href="/admin/yonetim-kurulu"
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Geri Dön
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                İsim *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Üye ismini girin"
                required
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Pozisyon *
              </label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Pozisyon seçin</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              Sıralama (sayısal değer)
            </label>
            <input
              type="number"
              id="order"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Görüntülenme sırası (0-99)"
              min="0"
              max="99"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Biyografi
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Üye hakkında kısa bilgi..."
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Profil Resmi
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <FaUpload className="mr-2" />
                Resim Seç
              </label>
              <span className="text-sm text-gray-500">
                {imageFile ? imageFile.name : 'Dosya seçilmedi'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Maksimum 5MB, JPG, PNG veya GIF formatında olmalıdır.
            </p>
            
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Önizleme:</p>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    src={imagePreview}
                    alt="Önizleme"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/yonetim-kurulu"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Güncelle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
