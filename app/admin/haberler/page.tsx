'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { useRouter } from 'next/navigation';

// Define the NewsItem type
interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  content: string;
  imageUrl?: string;
  date: string;
  slug?: string;
  author: string;
}

export default function NewsManagement() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  // Fetch news from Firestore
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // Create a query against the news collection, ordered by date
        const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(newsQuery);
        
        // Map the documents to NewsItem objects
        const newsItems: NewsItem[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<NewsItem, 'id'>
        }));
        
        setNews(newsItems);
      } catch (error: any) {
        console.error('Error fetching news:', error);
        setError('Haberler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);
  
  // Handle news deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'news', id));
      
      // Update the local state
      setNews(news.filter(item => item.id !== id));
      
    } catch (error: any) {
      console.error('Error deleting news:', error);
      alert(`Haber silinemedi: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Haber Yönetimi</h1>
        <Link
          href="/admin/haberler/ekle"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Haber Ekle
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yazar
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Henüz haber bulunmuyor. Yeni bir haber ekleyin.
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(item.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/haberler/duzenle/${item.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="inline mr-1" /> Düzenle
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className={`text-red-600 hover:text-red-900 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FaTrash className="inline mr-1" /> Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 