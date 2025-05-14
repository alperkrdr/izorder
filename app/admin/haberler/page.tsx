'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import NewsTable from '@/components/admin/NewsTable';
import { getAllNews } from '@/lib/data';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { NewsItem } from '@/types';

export default function NewsManagement() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsData = await getAllNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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
        <h1 className="text-2xl font-bold">Haber Yönetimi</h1>
        <Link
          href="/admin/haberler/ekle"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Yeni Haber Ekle
        </Link>
      </div>
      
      <NewsTable news={news} />
    </AdminLayout>
  );
} 