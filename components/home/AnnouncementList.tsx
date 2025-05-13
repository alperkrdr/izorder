'use client';

import { Announcement } from '@/types';
import { FaBullhorn, FaClock } from 'react-icons/fa';

interface AnnouncementListProps {
  announcements: Announcement[];
}

export default function AnnouncementList({ announcements }: AnnouncementListProps) {
  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div 
          key={announcement.id} 
          className={`p-4 rounded-lg shadow-md ${
            announcement.isImportant 
              ? 'bg-primary/10 border-l-4 border-primary' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${announcement.isImportant ? 'bg-primary text-white' : 'bg-gray-100'}`}>
              <FaBullhorn size={16} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {announcement.title}
              </h3>
              <p className="text-gray-700 mb-2">{announcement.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FaClock className="mr-1" size={14} />
                <span>{announcement.date}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 