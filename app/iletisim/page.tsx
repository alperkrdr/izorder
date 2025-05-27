'use client';  // Add this at the top

import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchContactInfo() {
      try {
        setLoading(true);
        const contactRef = doc(db, 'contact_info', 'main');
        const snapshot = await getDoc(contactRef);
        
        if (snapshot.exists()) {
          console.log('Contact info loaded from Firestore:', snapshot.data());
          setContactInfo(snapshot.data());
        } else {
          console.log('No contact info found in Firestore, using defaults');
          // If no document exists, set default values
          setContactInfo({
            address: 'İzmir, Konak Mah. Atatürk Cad. No:123',
            phone: '+90 232 123 45 67',
            email: 'info@izorder.org',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12499.249563179332!2d27.134046387646456!3d38.41916252162583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd8e3a0e3e185%3A0x7bd6d7152596bcfa!2zS29uYWssIEtvbmFrL8Swem1pcg!5e0!3m2!1str!2str!4v1623345678901!5m2!1str!2str',
            socialMedia: {
              facebook: 'https://facebook.com/izorder',
              instagram: 'https://instagram.com/izorder'
            }
          });
        }
      } catch (err: any) {
        console.error('Error fetching contact info:', err);
        setError('İletişim bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchContactInfo();
  }, []);
  
  if (loading) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">İletişim</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">İletişim</h1>
        <div className="bg-red-100 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">İletişim</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">İletişim Bilgileri</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-secondary mt-1 mr-3 flex-shrink-0" />
                <span>{contactInfo?.address || 'Adres bilgisi mevcut değil'}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-secondary mr-3 flex-shrink-0" />
                <span>{contactInfo?.phone || 'Telefon bilgisi mevcut değil'}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-secondary mr-3 flex-shrink-0" />
                <span>{contactInfo?.email || 'E-posta bilgisi mevcut değil'}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Sosyal Medya</h2>
            <div className="flex space-x-4">
              {contactInfo?.socialMedia?.facebook && (
                <a 
                  href={contactInfo.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
              )}
              {contactInfo?.socialMedia?.instagram && (
                <a 
                  href={contactInfo.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Harita</h2>
          <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
            {contactInfo?.mapEmbedUrl ? (
              <iframe 
                src={contactInfo.mapEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Harita bilgisi mevcut değil</p>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Üyelik Başvurusu</h2>
            <p className="mb-4">Derneğimize üye olmak için aşağıdaki butona tıklayarak başvuru formunu doldurabilirsiniz.</p>
            <a 
              href={contactInfo?.googleFormUrl || "/iletisim/uye-ol"}
              className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-dark transition-colors"
              target={contactInfo?.googleFormUrl ? "_blank" : undefined}
              rel={contactInfo?.googleFormUrl ? "noopener noreferrer" : undefined}
            >
              Üye Ol
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}