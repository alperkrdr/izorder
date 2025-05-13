import Image from 'next/image';
import { getHistoryContent } from '@/lib/data';

export const metadata = {
  title: 'Tarihçe - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Tarihçesi',
};

export default async function HistoryPage() {
  const historyContent = await getHistoryContent();
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Derneğimizin Tarihçesi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: historyContent.content }} />
        </div>
        
        <div className="space-y-6">
          <div className="relative rounded-lg overflow-hidden shadow-md h-64">
            <Image
              src={historyContent.mainImageUrl}
              alt="Dernek Kurucuları"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-3">Kuruluş Bilgileri</h3>
            <ul className="space-y-2 text-gray-700">
              <li><span className="font-medium">Kuruluş Tarihi:</span> {historyContent.foundingDate}</li>
              <li><span className="font-medium">Kurucu Başkan:</span> {historyContent.foundingPresident}</li>
              <li><span className="font-medium">Resmi Statü:</span> {historyContent.legalStatus}</li>
              <li><span className="font-medium">İlk Üye Sayısı:</span> {historyContent.initialMemberCount}</li>
              <li><span className="font-medium">Mevcut Üye Sayısı:</span> {historyContent.currentMemberCount}</li>
            </ul>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-3">Önemli Kilometre Taşları</h3>
            <ul className="space-y-4">
              {historyContent.milestones.map((milestone, index) => (
                <li key={index} className="border-l-2 border-primary pl-4 pb-1">
                  <span className="block text-sm text-gray-500">{milestone.year}</span>
                  <span className="block text-gray-800">{milestone.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {historyContent.additionalImages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Tarihimizden Kareler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyContent.additionalImages.map((image, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden h-48 shadow-md">
                <Image
                  src={image.url}
                  alt={image.caption}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 p-3 text-white">
                  <p className="text-sm">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 