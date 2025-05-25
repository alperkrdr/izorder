'use client';

import { DashboardStats } from '@/types';
import { FaNewspaper, FaRegFileAlt, FaImages, FaUsers } from 'react-icons/fa';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      label: 'Toplam Haber',
      value: stats.newsCount,
      icon: FaNewspaper,
      color: 'bg-blue-500',
    },
    {
      label: 'Basın Haberleri',
      value: stats.pressCoverageCount,
      icon: FaRegFileAlt,
      color: 'bg-green-500',
    },
    {
      label: 'Galeri Görselleri',
      value: stats.galleryCount,
      icon: FaImages,
      color: 'bg-amber-500',
    },
    {
      label: 'Yönetim Kurulu Üyeleri',
      value: stats.boardMembersCount,
      icon: FaUsers,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex items-center p-4">
            <div className={`${item.color} rounded-full p-3 text-white mr-4`}>
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <h3 className="text-2xl font-semibold">{item.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 