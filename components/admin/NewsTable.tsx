'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsItem } from '@/types';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { deleteNews } from '@/utils/firebase/firestore';
import { useRouter } from 'next/navigation';

interface NewsTableProps {
  news: NewsItem[];
}

export default function NewsTable({ news }: NewsTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError('');
    
    try {
      await deleteNews(id);
      setDeleteConfirm(null);
      // Refresh the page to update the list
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Silme işlemi sırasında bir hata oluştu.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
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
                Tarih
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {news.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative h-16 w-20">
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover rounded"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{item.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-2">{item.summary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/haberler/${item.slug}`} 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900 p-2"
                    >
                      <FaEye size={16} />
                    </Link>
                    <Link 
                      href={`/admin/haberler/duzenle/${item.id}`}
                      className="text-amber-600 hover:text-amber-900 p-2"
                    >
                      <FaEdit size={16} />
                    </Link>
                    {deleteConfirm === item.id ? (
                      <div className="flex items-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting}
                          className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded disabled:opacity-50"
                        >
                          {isDeleting ? 'Siliniyor...' : 'Sil'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="text-red-600 hover:text-red-900 p-2"
                      >
                        <FaTrash size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 