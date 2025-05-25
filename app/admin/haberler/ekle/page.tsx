'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FaSave, FaUpload, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, storage, auth } from '@/utils/firebase/client';
// Import our custom upload helper
import { uploadFile } from '@/utils/upload-helper';

// Import ReactQuill dynamically as it requires client-side rendering
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => null });

export default function AddNewsPage() {
  const router = useRouter();
  
  // Form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('İzorder Yönetimi');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  useEffect(() => {
    setEditorLoaded(true);
  }, []);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    // Validate form
    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik alanları zorunludur.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Get current user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('Oturum açmanız gerekiyor.');
        setLoading(false);
        return;
      }
      
      // Test Firebase permissions
      try {
        console.log('Firebase izinleri kontrol ediliyor...');
        
        // Test permissions by writing a simple document
        const testCollection = collection(db, '__test_permissions');
        const testDoc = await addDoc(testCollection, { 
          testValue: 'test', 
          timestamp: new Date().toISOString() 
        });
        
        console.log('Test başarılı, belge oluşturuldu:', testDoc.id);
      } catch (permError: any) {
        console.error('Firebase izin hatası:', permError);
        setError(`Firebase izin hatası: ${permError.code} - ${permError.message}`);
        return;
      }
      
      // Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        try {
          // CHANGED: Use our server-side upload helper instead of direct Firebase Storage
          imageUrl = await uploadFile(imageFile, 'news/');
          console.log('Görsel başarıyla yüklendi:', imageUrl);
        } catch (uploadError: any) {
          console.error('Görsel yükleme hatası:', uploadError);
          setError(`Görsel yüklenirken hata oluştu: ${uploadError.message}`);
          return;
        }
      }
      
      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
      
      // Add document to Firestore
      const newsData = {
        title,
        summary: summary || title.substring(0, 100),
        content,
        imageUrl,
        date: new Date().toISOString(),
        slug,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: currentUser.uid
      };
      
      console.log('Haber kaydediliyor...');
      const docRef = await addDoc(collection(db, 'news'), newsData);
      console.log('Haber başarıyla kaydedildi:', docRef.id);
      
      // Redirect to news management page
      router.push('/admin/haberler');
      
    } catch (error: any) {
      console.error('Error adding news:', error);
      setError(`Haber eklenirken bir hata oluştu: ${error.code || ''} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Yeni Haber Ekle</h1>
        <Link
          href="/admin/haberler"
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
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            İçerik*
          </label>
          <div className="border border-gray-300 rounded-md">
            {editorLoaded ? (
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                className="h-64"
              />
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Görsel
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
        
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Yazar
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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