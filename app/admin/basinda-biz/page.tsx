'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { getPressCoverage } from '@/lib/data';
import { FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface PressItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  externalUrl?: string;
}

export default function PressCoveragePage() {
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPressItems = async () => {
      try {
        const items = await getPressCoverage();
        setPressItems(items);
      } catch (error) {
        console.error('Error fetching press items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPressItems();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Basında Biz Yönetimi</h1>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md">
          Yeni Ekle
        </button>
      </div>
      
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
              {pressItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image 
                        src={item.imageUrl}
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
                    <div className="text-sm text-gray-900">{item.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.externalUrl && (
                      <a 
                        href={item.externalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark inline-flex items-center"
                      >
                        <FaExternalLinkAlt className="mr-1" size={14} />
                        Görüntüle
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark mr-3">
                      Düzenle
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
} 