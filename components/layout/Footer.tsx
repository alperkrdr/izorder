'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getContactInfoClient } from '@/utils/firebase/firestore';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    address: 'Yükleniyor...',
    phone: 'Yükleniyor...',
    email: 'Yükleniyor...',
    socialMedia: {
      facebook: '#',
      instagram: '#'
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getContactInfoClient();
      if (data) {
        setContactInfo(data);
      }
    };
    
    fetchData().catch(console.error);
  }, []);
  
  return (
    <footer className="bg-primary text-white pt-10 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-10 h-10 bg-white rounded-full overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="İzorder Logo" 
                  fill 
                  className="object-contain p-1"
                />
              </div>
              <span className="text-xl font-bold">İzorder</span>
            </div>
            <p className="text-white/80 mb-4">
              İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği, kültürel değerlerimizi yaşatmak ve dayanışmayı güçlendirmek amacıyla kurulmuştur.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white/80 transition">Anasayfa</Link>
              </li>
              <li>
                <Link href="/haberler" className="hover:text-white/80 transition">Haberler</Link>
              </li>
              <li>
                <Link href="/basinda-biz" className="hover:text-white/80 transition">Basında Biz</Link>
              </li>
              <li>
                <Link href="/yonetim-kurulu" className="hover:text-white/80 transition">Yönetim Kurulu</Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-white/80 transition">Galeri</Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white/80 transition">İletişim</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-secondary mt-1 mr-3 flex-shrink-0" />
                <span className="text-white/80">{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-secondary mr-3 flex-shrink-0" />
                <span className="text-white/80">{contactInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-secondary mr-3 flex-shrink-0" />
                <span className="text-white/80">{contactInfo.email}</span>
              </li>
            </ul>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Bizi Takip Edin</h4>
              <div className="flex space-x-3">
                <a 
                  href={contactInfo.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
                >
                  <FaFacebook />
                </a>
                <a 
                  href={contactInfo.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 