'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaUserPlus, FaSave } from 'react-icons/fa';

// Contact info type
interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  workingHours: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export default function ContactManagementPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: '',
    mapEmbedUrl: '',
    workingHours: '',
    socialMedia: {
      facebook: '',
      instagram: '',
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Fetch contact info
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        
        // Get the contact info document from Firestore
        const contactRef = doc(db, 'contact_info', 'main');
        const contactDoc = await getDoc(contactRef);
        
        if (contactDoc.exists()) {
          setContactInfo(contactDoc.data() as ContactInfo);
        }
      } catch (error: any) {
        console.error('Error fetching contact info:', error);
        setError('İletişim bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactInfo();
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Save to Firestore
      const contactRef = doc(db, 'contact_info', 'main');
      await setDoc(contactRef, {
        ...contactInfo,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setSuccess('İletişim bilgileri başarıyla kaydedildi.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error saving contact info:', error);
      setError('İletişim bilgileri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested social media properties
    if (name.startsWith('socialMedia.')) {
      const socialMediaProp = name.split('.')[1];
      setContactInfo(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialMediaProp]: value
        }
      }));
    } else {
      setContactInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">İletişim Bilgileri Yönetimi</h1>
        <p className="text-gray-600 mt-1">Dernek iletişim bilgilerini düzenleyebilirsiniz.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* İletişim Bilgileri Formu */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800">İletişim Bilgileri</h2>
          </div>
          <div className="p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Adres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaMapMarkerAlt className="text-gray-500" />
                  </div>
                  <textarea 
                    name="address"
                    rows={3}
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={contactInfo.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              
              {/* Telefon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaPhone className="text-gray-500" />
                  </div>
                  <input 
                    type="text"
                    name="phone"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={contactInfo.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* E-posta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaEnvelope className="text-gray-500" />
                  </div>
                  <input 
                    type="email"
                    name="email"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={contactInfo.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Çalışma Saatleri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Çalışma Saatleri
                </label>
                <input 
                  type="text"
                  name="workingHours"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={contactInfo.workingHours}
                  onChange={handleChange}
                  placeholder="Örn: Pazartesi - Cuma: 09:00 - 17:00"
                />
              </div>
              
              {/* Google Maps Embed URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps Embed URL
                </label>
                <input 
                  type="text"
                  name="mapEmbedUrl"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={contactInfo.mapEmbedUrl}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Google Maps embed kodunun src kısmındaki URL'i buraya yapıştırın.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facebook */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook Sayfası
                  </label>
                  <div className="flex">
                    <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                      <FaFacebook className="text-gray-500" />
                    </div>
                    <input 
                      type="text"
                      name="socialMedia.facebook"
                      className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={contactInfo.socialMedia.facebook || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Instagram */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram Sayfası
                  </label>
                  <div className="flex">
                    <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                      <FaInstagram className="text-gray-500" />
                    </div>
                    <input 
                      type="text"
                      name="socialMedia.instagram"
                      className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={contactInfo.socialMedia.instagram || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaSave className="mr-2" />
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 