import Image from 'next/image';
import Link from 'next/link';
import { getBoardMembers } from '@/lib/data';

export const metadata = {
  title: 'Yönetim Kurulu - İzorder',
  description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği Yönetim Kurulu',
};

export default async function BoardPage() {
  const boardMembers = await getBoardMembers();
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Yönetim Kurulu</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-secondary mb-6">Kurucu Yönetim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boardMembers.filter(member => member.isFounder).map((member) => (
            <div key={member.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
              <div className="relative h-64 w-full">
                <Image
                  src={member.imageUrl}
                  alt={`${member.name} ${member.surname}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold text-primary">
                  {member.name} {member.surname}
                </h3>
                <p className="text-secondary font-medium mb-2">{member.title}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-secondary mb-6">Mevcut Yönetim</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boardMembers.filter(member => !member.isFounder).map((member) => (
            <div key={member.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
              <div className="relative h-64 w-full">
                <Image
                  src={member.imageUrl}
                  alt={`${member.name} ${member.surname}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold text-primary">
                  {member.name} {member.surname}
                </h3>
                <p className="text-secondary font-medium mb-2">{member.title}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 