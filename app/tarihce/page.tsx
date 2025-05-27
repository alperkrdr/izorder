'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const [historyContent, setHistoryContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchHistoryContent() {
      try {
        setLoading(true);
        const historyRef = doc(db, 'history', 'main');
        console.log('Fetching history content from Firestore path: history/main');
        const snapshot = await getDoc(historyRef);
        
        if (snapshot.exists()) {
          console.log('History content loaded from Firestore:', snapshot.data());
          setHistoryContent(snapshot.data());
        } else {
          console.error('No history content found in Firestore at path: history/main');
          setError('Tarihçe içeriği bulunamadı.');
        }
      } catch (err: any) {
        console.error('Error fetching history content:', err);
        setError('Tarihçe içeriği yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistoryContent();
  }, []);
  
  // Loading state
  if (loading) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Derneğimizin Tarihçesi</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Derneğimizin Tarihçesi</h1>
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
        <div className="bg-gray-100 p-8 rounded-lg text-center mt-6">
          <p className="text-lg text-gray-600">Tarihçe içeriği hazırlanıyor. Lütfen daha sonra tekrar ziyaret edin.</p>
        </div>
      </div>
    );
  }
  
  // No content case
  if (!historyContent) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Derneğimizin Tarihçesi</h1>
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-lg text-gray-600">Tarihçe içeriği hazırlanıyor. Lütfen daha sonra tekrar ziyaret edin.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Derneğimizin Tarihçesi</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: historyContent.content }} />
        </div>
        
        <div className="space-y-6">
          {historyContent.mainImageUrl && (
            <div className="relative rounded-lg overflow-hidden shadow-md h-64">
              <Image
                src={historyContent.mainImageUrl}
                alt="Dernek Kurucuları"
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-3">Kuruluş Bilgileri</h3>
            <ul className="space-y-2 text-gray-700">
              <li><span className="font-medium">Kuruluş Tarihi:</span> {historyContent.foundingDate || 'Belirtilmemiş'}</li>
              <li><span className="font-medium">Kurucu Başkan:</span> {historyContent.foundingPresident || 'Belirtilmemiş'}</li>
              <li><span className="font-medium">Resmi Statü:</span> {historyContent.legalStatus || 'Belirtilmemiş'}</li>
              <li><span className="font-medium">İlk Üye Sayısı:</span> {historyContent.initialMemberCount || 'Belirtilmemiş'}</li>
              <li><span className="font-medium">Mevcut Üye Sayısı:</span> {historyContent.currentMemberCount || 'Belirtilmemiş'}</li>
            </ul>
          </div>
          
          {historyContent.milestones && historyContent.milestones.length > 0 && (
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-3">Önemli Kilometre Taşları</h3>
              <ul className="space-y-4">
                {historyContent.milestones.map((milestone: any, index: number) => (
                  <li key={index} className="border-l-2 border-primary pl-4 pb-1">
                    <span className="block text-sm text-gray-500">{milestone.year}</span>
                    <span className="block text-gray-800">{milestone.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {historyContent.additionalImages && historyContent.additionalImages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Tarihimizden Kareler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyContent.additionalImages.map((image: any, index: number) => (
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