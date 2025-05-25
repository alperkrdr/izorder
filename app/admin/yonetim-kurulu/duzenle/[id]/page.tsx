'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { uploadToFirebaseStorage, deleteFromFirebaseStorage } from '@/utils/firebase/storage';
import { FaSave, FaArrowLeft, FaUpload, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// Board member type
interface BoardMember {
  id: string;
  name: string;
  surname: string;
  title: string;
  imageUrl: string;
  bio: string;
  order: number;
  isFounder?: boolean;
  storageRef?: string;
}

export default function EditBoardMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [boardMember, setBoardMember] = useState<BoardMember | null>(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [order, setOrder] = useState('');
  const [isFounder, setIsFounder] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Predefined titles
  const titles = [
    'Başkan',
    'Başkan Yardımcısı',
    'Sekreter',
    'Sayman',
    'Üye'
  ];
  
  // Fetch board member data
  useEffect(() => {
    const fetchBoardMember = async () => {
      try {
        setInitialLoading(true);
        
        const docRef = doc(db, 'board_members', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<BoardMember, 'id'>;
          const member: BoardMember = {
            id: docSnap.id,
            ...data
          };
          
          setBoardMember(member);
          setName(member.name || '');
          setSurname(member.surname || '');
          setTitle(member.title || '');
          setBio(member.bio || '');
          setOrder(member.order?.toString() || '');
          setIsFounder(member.isFounder || false);
          setImagePreview(member.imageUrl || null);
          
        } else {
          setError('Yönetim kurulu üyesi bulunamadı.');
          setTimeout(() => {
            router.push('/admin/yonetim-kurulu');
          }, 2000);
        }
      } catch (error: any) {
        console.error('Error fetching board member:', error);
        setError('Yönetim kurulu üyesi yüklenirken bir hata oluştu.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchBoardMember();
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
    
    if (loading || !boardMember) return;
    
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
    
    try {
      setLoading(true);
      setError(null);
      
      // Process update data
      const updateData: Record<string, any> = {
        name,
        surname,
        title,
        bio: bio || '',
        order: parseInt(order),
        isFounder,
        updatedAt: new Date().toISOString()
      };
        // Upload new image if selected
      if (imageFile) {
        // Delete old image if there's a storage reference
        if (boardMember.storageRef) {
          try {
            await deleteFromFirebaseStorage(boardMember.storageRef);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue even if the old image deletion fails
          }
        }
        
        // Upload new image using the new storage helper
        const uploadResult = await uploadToFirebaseStorage(imageFile, 'board_members/');
        
        if (!uploadResult.success) {
          setError(uploadResult.error || 'Görsel yüklenirken bir hata oluştu.');
          return;
        }
        
        updateData.imageUrl = uploadResult.url!;
        updateData.storageRef = uploadResult.storagePath!;
      }
      
      // Update document in Firestore
      const docRef = doc(db, 'board_members', id);
      await updateDoc(docRef, updateData);
      
      // Redirect to board members management page
      router.push('/admin/yonetim-kurulu');
      
    } catch (error: any) {
      console.error('Error updating board member:', error);
      setError(error.message || 'Yönetim kurulu üyesi güncellenirken bir hata oluştu.');
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
  
  if (!boardMember && !initialLoading) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error || 'Yönetim kurulu üyesi bulunamadı.'}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Yönetim Kurulu Üyesi Düzenle</h1>
        <Link
          href="/admin/yonetim-kurulu"
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
              value={titles.includes(title) ? title : 'custom'}
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
            {!titles.includes(title) && (
              <input
                type="text"
                placeholder="Özel görev/unvan girin"
                value={title}
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
            Profil Görseli
          </label>
          
          {imagePreview && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Mevcut Görsel:</p>
              <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
                <Image
                  src={imagePreview}
                  alt={`${name} ${surname}`}
                  width={128}
                  height={128}
                  className="object-cover"
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