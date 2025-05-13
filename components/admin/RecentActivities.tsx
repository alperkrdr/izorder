'use client';

import { Activity } from '@/types';
import { FaNewspaper, FaRegFileAlt, FaUsers, FaImages, FaPhone } from 'react-icons/fa';

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  // Get icon based on entity type
  const getIcon = (entityType: string) => {
    switch (entityType) {
      case 'news':
        return <FaNewspaper className="text-blue-500" size={18} />;
      case 'pressCoverage':
        return <FaRegFileAlt className="text-green-500" size={18} />;
      case 'boardMember':
        return <FaUsers className="text-purple-500" size={18} />;
      case 'galleryImage':
        return <FaImages className="text-amber-500" size={18} />;
      case 'contactInfo':
        return <FaPhone className="text-red-500" size={18} />;
      default:
        return null;
    }
  };

  // Get entity type name in Turkish
  const getEntityTypeName = (entityType: string) => {
    switch (entityType) {
      case 'news':
        return 'Haber';
      case 'pressCoverage':
        return 'Basın Haberi';
      case 'boardMember':
        return 'Yönetim Kurulu Üyesi';
      case 'galleryImage':
        return 'Galeri Görseli';
      case 'contactInfo':
        return 'İletişim Bilgileri';
      default:
        return entityType;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <li className="p-4 text-center text-gray-500">Henüz aktivite bulunmuyor.</li>
        ) : (
          activities.map((activity) => (
            <li key={activity.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getIcon(activity.entityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {getEntityTypeName(activity.entityType)}
                    {activity.entityId ? ` #${activity.entityId}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">{activity.date}</span>
                  <span className="text-xs text-gray-400">{activity.user}</span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
} 