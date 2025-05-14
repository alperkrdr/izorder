'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaUserPlus } from 'react-icons/fa';
import { ContactInfo } from '@/types';

export default function ContactManagementPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log('Fetching contact information...');
        const response = await fetch('/api/admin/contact');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received contact data:', data);
        
        if (data.success) {
          setContactInfo(data.data);
        } else {
          throw new Error(data.message || 'Veri alınamadı');
        }
      } catch (error) {
        console.error('Veri alma hatası:', error);
        setMessage({
          text: `İletişim bilgileri alınamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      console.log('Submitting contact form...');
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const address = formData.get('address') as string;
      const phone = formData.get('phone') as string;
      const email = formData.get('email') as string;
      const mapEmbedUrl = formData.get('mapEmbedUrl') as string;
      const facebook = formData.get('facebook') as string;
      const instagram = formData.get('instagram') as string;

      const dataToSend = {
        address,
        phone,
        email,
        mapEmbedUrl,
        socialMedia: {
          facebook,
          instagram
        }
      };
      
      console.log('Sending contact data:', dataToSend);

      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Received result:', result);

      if (result.success) {
        setMessage({
          text: 'İletişim bilgileri başarıyla güncellendi.',
          type: 'success'
        });
        
        // Güncel veriyi state'e yükle
        if (result.updatedData) {
          setContactInfo(result.updatedData);
        }
      } else {
        setMessage({
          text: `Hata: ${result.message}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      setMessage({
        text: `Bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!contactInfo) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>İletişim bilgileri yüklenemedi. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">İletişim Bilgileri Yönetimi</h1>
        <p className="text-gray-600 mt-1">Dernek iletişim bilgilerini düzenleyebilirsiniz.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
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
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={contactInfo.address}
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
                    name="phone"
                    type="text"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={contactInfo.phone}
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
                    name="email"
                    type="email"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={contactInfo.email}
                  />
                </div>
              </div>
              
              {/* Google Maps Embed URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps Embed URL
                </label>
                <input 
                  name="mapEmbedUrl"
                  type="text"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  defaultValue={contactInfo.mapEmbedUrl}
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
                      name="facebook"
                      type="text"
                      className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      defaultValue={contactInfo.socialMedia.facebook}
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
                      name="instagram"
                      type="text"
                      className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      defaultValue={contactInfo.socialMedia.instagram}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={saving}
                  className={`bg-primary ${saving ? 'opacity-75' : 'hover:bg-primary-dark'} text-white px-4 py-2 rounded-md`}
                >
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Üyelik Formu Ayarları */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800">Üyelik Formu Ayarları</h2>
          </div>
          <div className="p-6">
            <form className="space-y-6">
              {/* Form Başlığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Başlığı
                </label>
                <input 
                  type="text"
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  defaultValue="Üyelik Başvuru Formu"
                />
              </div>

              {/* Form Açıklaması */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Form Açıklaması
                </label>
                <textarea 
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  defaultValue="İzmir-Ordu Kültür ve Dayanışma Derneği'ne üyelik başvurusu yapmak için lütfen aşağıdaki formu doldurunuz."
                ></textarea>
              </div>
              
              {/* E-posta Bildirimi */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    defaultChecked={true}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notifications" className="font-medium text-gray-700">E-posta bildirimleri</label>
                  <p className="text-gray-500">Yeni üyelik başvuruları olduğunda e-posta bildirimi al</p>
                </div>
              </div>
              
              {/* Başvuru Formu Alanları */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Başvuru Formu Alanları
                </label>
                
                <div className="space-y-3">
                  {/* Ad Soyad */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        disabled
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Ad Soyad</span>
                    </div>
                    <span className="text-xs text-red-500">Zorunlu Alan</span>
                  </div>
                  
                  {/* E-posta */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        disabled
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">E-posta</span>
                    </div>
                    <span className="text-xs text-red-500">Zorunlu Alan</span>
                  </div>
                  
                  {/* Telefon */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Telefon</span>
                    </div>
                    <span className="text-xs text-gray-500">İsteğe Bağlı</span>
                  </div>
                  
                  {/* Doğum Yeri */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Doğum Yeri</span>
                    </div>
                    <span className="text-xs text-gray-500">İsteğe Bağlı</span>
                  </div>
                  
                  {/* Ordu'daki İlçe */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Ordu'daki İlçe</span>
                    </div>
                    <span className="text-xs text-gray-500">İsteğe Bağlı</span>
                  </div>
                  
                  {/* Mesaj */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Mesaj</span>
                    </div>
                    <span className="text-xs text-gray-500">İsteğe Bağlı</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
                >
                  Ayarları Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 