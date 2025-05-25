'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createNews, updateNews } from '@/utils/firebase/firestore';
import { FaImage, FaSave, FaArrowLeft } from 'react-icons/fa';

interface NewsFormProps {
  initialData?: {
    id?: string;
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    date: string;
    slug: string;
    author?: string;
  };
  isEditing?: boolean;
}

export default function NewsForm({ initialData, isEditing = false }: NewsFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    slug: '',
    author: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        summary: initialData.summary || '',
        content: initialData.content || '',
        imageUrl: initialData.imageUrl || '',
        date: initialData.date || new Date().toISOString().split('T')[0],
        slug: initialData.slug || '',
        author: initialData.author || ''
      });
      setImagePreview(initialData.imageUrl || '');
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate slug from title if slug field is empty
    if (name === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData({
        ...formData,
        [name]: value,
        slug
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEditing && initialData?.id) {
        await updateNews(initialData.id, formData, imageFile);
      } else {
        await createNews(formData, imageFile);
      }
      router.push('/admin/haberler');
    } catch (error: any) {
      setError(error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Geri Dön
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Başlık
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="mt-1 text-xs text-gray-500">
            Bu, haberin URL'inde görünecek metin. Otomatik olarak oluşturulur, ancak düzenleyebilirsiniz.
          </p>
        </div>
        
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
            Özet
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={2}
            value={formData.summary}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            İçerik
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            value={formData.content}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p className="mt-1 text-xs text-gray-500">
            HTML içerik ekleyebilirsiniz. Örn: &lt;p&gt;Paragraf metni&lt;/p&gt;
          </p>
        </div>
        
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Yazar
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Tarih
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Haber Görseli
          </label>
          
          <div className="mt-2 flex items-center">
            <div className="mr-4">
              <label htmlFor="image" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                <FaImage className="inline-block mr-2" />
                {imageFile ? 'Görsel Değiştir' : 'Görsel Seç'}
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
            </div>
            
            {imagePreview && (
              <div className="relative h-20 w-20 border rounded overflow-hidden">
                <Image 
                  src={imagePreview} 
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t pt-5">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <FaSave className="mr-2" />
            {loading
              ? isEditing
                ? 'Güncelleniyor...'
                : 'Kaydediliyor...'
              : isEditing
                ? 'Güncelle'
                : 'Kaydet'
            }
          </button>
        </div>
      </form>
    </div>
  );
} 