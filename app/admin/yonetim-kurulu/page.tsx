import AdminLayout from '@/components/admin/AdminLayout';
import { getBoardMembers } from '@/lib/data';
import Image from 'next/image';

export const metadata = {
  title: 'Yönetim Kurulu Yönetimi - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Yönetim Kurulu Yönetimi',
};

export default async function BoardMembersPage() {
  const boardMembers = await getBoardMembers();
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Yönetim Kurulu Yönetimi</h1>
        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md">
          Yeni Üye Ekle
        </button>
      </div>
      
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
              <p className="text-sm text-primary">{member.title}</p>
              {member.isFounder && (
                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  Kurucu
                </span>
              )}
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{member.bio}</p>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-between">
              <button className="text-primary hover:text-primary-dark text-sm">
                Düzenle
              </button>
              <button className="text-red-600 hover:text-red-900 text-sm">
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
} 