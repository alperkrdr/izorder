'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/utils/firebase/client';

// Board member type
interface BoardMember {
  id: string;
  name: string;
  surname: string;
  title: string;
  imageUrl: string;
  bio: string;
  order: number;
  isFounder?: boolean;
  storageRef?: string;
}

export default function BoardMembersPage() {
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fetch board members
  const fetchBoardMembers = async () => {
    try {
      setLoading(true);
      
      // Create a query against the board_members collection
      const boardQuery = query(collection(db, 'board_members'), orderBy('order'));
      const querySnapshot = await getDocs(boardQuery);
      
      // Map the documents to BoardMember objects
      const members: BoardMember[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<BoardMember, 'id'>
      }));
      
      setBoardMembers(members);
    } catch (error: any) {
      console.error('Error fetching board members:', error);
      setError('Yönetim kurulu üyeleri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete board member
  const handleDelete = async (member: BoardMember) => {
    if (!confirm(`${member.name} ${member.surname} kişisini silmek istediğinize emin misiniz?`)) {
      return;
    }
    
    try {
      setDeleting(member.id);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'board_members', member.id));
      
      // Delete profile image from storage if storageRef exists
      if (member.storageRef) {
        try {
          const imageRef = ref(storage, member.storageRef);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error('Error deleting profile image from storage:', storageError);
          // Continue even if storage deletion fails
        }
      }
      
      // Update the state
      setBoardMembers(boardMembers.filter(m => m.id !== member.id));
      setSuccessMessage('Yönetim kurulu üyesi başarıyla silindi.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error deleting board member:', error);
      setError('Yönetim kurulu üyesi silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setDeleting(null);
    }
  };
  
  useEffect(() => {
    fetchBoardMembers();
  }, []);
  
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
        <h1 className="text-2xl font-semibold">Yönetim Kurulu Yönetimi</h1>
        <Link
          href="/admin/yonetim-kurulu/ekle"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <FaPlus className="mr-2" /> Yeni Üye Ekle
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
      
      {boardMembers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">Henüz yönetim kurulu üyesi bulunmuyor. Yeni bir üye ekleyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boardMembers.map((member) => (
            <div key={member.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="flex justify-center p-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image 
                    src={member.imageUrl}
                    alt={`${member.name} ${member.surname}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">{member.name} {member.surname}</h3>
                <p className="text-sm text-blue-600">{member.title}</p>
                {member.isFounder && (
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                    Kurucu
                  </span>
                )}
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{member.bio}</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 flex justify-between">
                <Link
                  href={`/admin/yonetim-kurulu/duzenle/${member.id}`}
                  className="text-blue-600 hover:text-blue-900 text-sm flex items-center"
                >
                  <FaEdit className="mr-1" /> Düzenle
                </Link>
                <button 
                  className="text-red-600 hover:text-red-900 text-sm flex items-center"
                  onClick={() => handleDelete(member)}
                  disabled={deleting === member.id}
                >
                  <FaTrash className="mr-1" /> 
                  {deleting === member.id ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 