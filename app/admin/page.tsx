'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { FaNewspaper, FaRegFileAlt, FaUsers, FaImages } from 'react-icons/fa';

// Define types
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

interface RecentItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newsCount: 0,
    pressCoverageCount: 0,
    boardMembersCount: 0,
    galleryImagesCount: 0
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch news count
        const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'));
        const newsSnapshot = await getDocs(newsQuery);
        const newsCount = newsSnapshot.size;
        
        // Fetch press coverage count
        const pressQuery = query(collection(db, 'press_coverage'), orderBy('date', 'desc'));
        const pressSnapshot = await getDocs(pressQuery);
        const pressCoverageCount = pressSnapshot.size;
        
        // Fetch board members count
        const boardQuery = query(collection(db, 'board_members'), orderBy('order'));
        const boardSnapshot = await getDocs(boardQuery);
        const boardMembersCount = boardSnapshot.size;
        
        // Fetch gallery images count
        const galleryQuery = query(collection(db, 'gallery_images'), orderBy('date', 'desc'));
        const gallerySnapshot = await getDocs(galleryQuery);
        const galleryImagesCount = gallerySnapshot.size;
        
        // Set stats
        setStats({
          newsCount,
          pressCoverageCount,
          boardMembersCount,
          galleryImagesCount
        });
        
        // Collect recent items
        const recentItems: RecentItem[] = [];
        
        // Add recent news
        newsSnapshot.docs.slice(0, 3).forEach(doc => {
          const data = doc.data();
          recentItems.push({
            id: doc.id,
            title: data.title,
            date: data.date,
            type: 'news'
          });
        });
        
        // Add recent press coverage
        pressSnapshot.docs.slice(0, 3).forEach(doc => {
          const data = doc.data();
          recentItems.push({
            id: doc.id,
            title: data.title,
            date: data.date,
            type: 'press'
          });
        });
        
        // Sort by date and limit to 5 items
        recentItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentItems(recentItems.slice(0, 5));
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError('Veri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Stats card component
  const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="text-white" size={20} />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Haberler" 
          value={stats.newsCount} 
          icon={FaNewspaper} 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Basın Haberleri" 
          value={stats.pressCoverageCount} 
          icon={FaRegFileAlt} 
          color="bg-green-500" 
        />
        <StatsCard 
          title="Yönetim Kurulu" 
          value={stats.boardMembersCount} 
          icon={FaUsers} 
          color="bg-purple-500" 
        />
        <StatsCard 
          title="Galeri Görselleri" 
          value={stats.galleryImagesCount} 
          icon={FaImages} 
          color="bg-amber-500" 
        />
      </div>
      
      {/* Recent items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Son Eklenenler</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentItems.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Henüz içerik bulunmuyor.
            </li>
          ) : (
            recentItems.map(item => (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    item.type === 'news' ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'
                  }`}>
                    {item.type === 'news' ? (
                      <FaNewspaper size={16} />
                    ) : (
                      <FaRegFileAlt size={16} />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}