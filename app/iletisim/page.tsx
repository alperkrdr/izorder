import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';
import { getContactInfo } from '@/lib/data';

export const metadata = {
  title: 'İletişim - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği İletişim Bilgileri',
};

export default async function ContactPage() {
  const contactInfo = await getContactInfo();
  
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
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-secondary mr-3 flex-shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-secondary mr-3 flex-shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">Sosyal Medya</h2>
            <div className="flex space-x-4">
              <a 
                href={contactInfo.socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href={contactInfo.socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Harita</h2>
          <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
            <iframe 
              src={contactInfo.mapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Üyelik Başvurusu</h2>
            <p className="mb-4">Derneğimize üye olmak için aşağıdaki butona tıklayarak başvuru formunu doldurabilirsiniz.</p>
            <a 
              href="/iletisim/uye-ol" 
              className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-dark transition-colors"
            >
              Üye Ol
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 