'use client';

import { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
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
}

export default function PressCoveragePage() {
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch press coverage items
  const fetchPressItems = async () => {
    try {
      setLoading(true);
      
      // Create a query against the press_coverage collection
      const pressQuery = query(collection(db, 'press_coverage'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(pressQuery);
      
      // Map the documents to PressItem objects
      const items: PressItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<PressItem, 'id'>
      }));
      
      setPressItems(items);
    } catch (error: any) {
      console.error('Error fetching press coverage:', error);
      setError('Basın haberleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete press item
  const handleDelete = async (id: string) => {
    if (!confirm('Bu basın haberini silmek istediğinize emin misiniz?')) {
      return;
    }
    
    try {
      setDeleting(id);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'press_coverage', id));
      
      // Update the state
      setPressItems(pressItems.filter(item => item.id !== id));
      setSuccessMessage('Basın haberi başarıyla silindi.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error deleting press item:', error);
      setError('Basın haberi silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDeleting(null);
    }
  };
  
  useEffect(() => {
    fetchPressItems();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch (error) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Basında Biz Yönetimi</h1>
        <Link
          href="/admin/basinda-biz/ekle"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Ekle
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Görsel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kaynak
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pressItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Henüz basın haberi bulunmuyor. Yeni bir haber ekleyin.
                  </td>
                </tr>
              ) : (
                pressItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image 
                          src={item.imageUrl || PlaceholderImages.press}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{item.summary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(item.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.externalUrl && (
                        <a 
                          href={item.externalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <FaExternalLinkAlt className="mr-1" size={14} />
                          Görüntüle
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/basinda-biz/duzenle/${item.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit className="inline mr-1" /> Düzenle
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                      >
                        <FaTrash className="inline mr-1" /> 
                        {deleting === item.id ? 'Siliniyor...' : 'Sil'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 