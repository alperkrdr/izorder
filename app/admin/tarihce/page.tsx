'use client';

import { useState, useEffect } from 'react';
import { FaHistory, FaImage, FaCalendarAlt, FaUser, FaBuilding, FaUsers, FaTrash, FaPlus } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';
import { HistoryContent } from '@/types';

export default function HistoryManagementPage() {
  const [historyContent, setHistoryContent] = useState<HistoryContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  // Kilometre taşı eklemek için
  const [newMilestone, setNewMilestone] = useState({ year: '', description: '' });
  
  // Yeni görsel eklemek için
  const [newImage, setNewImage] = useState({ url: '', caption: '' });

  useEffect(() => {
    const fetchHistoryContent = async () => {
      try {
        console.log('Fetching history content...');
        const response = await fetch('/api/admin/history');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.success) {
          setHistoryContent(data.data);
        } else {
          throw new Error(data.message || 'Veri alınamadı');
        }
      } catch (error) {
        console.error('Veri alma hatası:', error);
        setMessage({
          text: `Tarihçe içeriği alınamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      console.log('Submitting form...');
      // Form verilerini topla
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // FormData'yı JSON'a dönüştür
      const content = formData.get('content') as string;
      const mainImageUrl = formData.get('mainImageUrl') as string;
      const foundingDate = formData.get('foundingDate') as string;
      const foundingPresident = formData.get('foundingPresident') as string;
      const legalStatus = formData.get('legalStatus') as string;
      const initialMemberCount = formData.get('initialMemberCount') as string;
      const currentMemberCount = formData.get('currentMemberCount') as string;

      const dataToSend = {
        content,
        mainImageUrl,
        foundingDate,
        foundingPresident,
        legalStatus,
        initialMemberCount,
        currentMemberCount,
        // Mevcut milestone ve image verilerini koruyoruz
        milestones: historyContent?.milestones || [],
        additionalImages: historyContent?.additionalImages || []
      };
      
      console.log('Sending data:', dataToSend);

      const response = await fetch('/api/admin/history', {
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
          text: 'Tarihçe içeriği başarıyla güncellendi.',
          type: 'success'
        });
        
        // Güncel veriyi state'e yükle
        if (result.updatedData) {
          setHistoryContent(result.updatedData);
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
  
  // Kilometre taşı silme işlevi
  const deleteMilestone = async (index: number) => {
    if (!historyContent) return;
    
    try {
      const updatedMilestones = [...historyContent.milestones];
      updatedMilestones.splice(index, 1);
      
      const response = await fetch('/api/admin/history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...historyContent,
          milestones: updatedMilestones
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setHistoryContent({
          ...historyContent,
          milestones: updatedMilestones
        });
        setMessage({
          text: 'Kilometre taşı başarıyla silindi.',
          type: 'success'
        });
      } else {
        throw new Error(result.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      setMessage({
        text: `Kilometre taşı silinemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        type: 'error'
      });
    }
  };
  
  // Kilometre taşı ekleme işlevi
  const addMilestone = async () => {
    if (!historyContent || !newMilestone.year || !newMilestone.description) return;
    
    try {
      const updatedMilestones = [
        ...historyContent.milestones,
        { year: newMilestone.year, description: newMilestone.description }
      ];
      
      const response = await fetch('/api/admin/history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...historyContent,
          milestones: updatedMilestones
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setHistoryContent({
          ...historyContent,
          milestones: updatedMilestones
        });
        setMessage({
          text: 'Kilometre taşı başarıyla eklendi.',
          type: 'success'
        });
        setNewMilestone({ year: '', description: '' });
      } else {
        throw new Error(result.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Ekleme hatası:', error);
      setMessage({
        text: `Kilometre taşı eklenemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        type: 'error'
      });
    }
  };
  
  // Görsel silme işlevi
  const deleteImage = async (index: number) => {
    if (!historyContent) return;
    
    try {
      const updatedImages = [...historyContent.additionalImages];
      updatedImages.splice(index, 1);
      
      const response = await fetch('/api/admin/history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...historyContent,
          additionalImages: updatedImages
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setHistoryContent({
          ...historyContent,
          additionalImages: updatedImages
        });
        setMessage({
          text: 'Görsel başarıyla silindi.',
          type: 'success'
        });
      } else {
        throw new Error(result.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      setMessage({
        text: `Görsel silinemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        type: 'error'
      });
    }
  };
  
  // Görsel ekleme işlevi
  const addImage = async () => {
    if (!historyContent || !newImage.url) return;
    
    try {
      const updatedImages = [
        ...historyContent.additionalImages,
        { url: newImage.url, caption: newImage.caption || '' }
      ];
      
      const response = await fetch('/api/admin/history', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...historyContent,
          additionalImages: updatedImages
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setHistoryContent({
          ...historyContent,
          additionalImages: updatedImages
        });
        setMessage({
          text: 'Görsel başarıyla eklendi.',
          type: 'success'
        });
        setNewImage({ url: '', caption: '' });
      } else {
        throw new Error(result.message || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Ekleme hatası:', error);
      setMessage({
        text: `Görsel eklenemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        type: 'error'
      });
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

  if (!historyContent) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Tarihçe içeriği yüklenemedi. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tarihçe Yönetimi</h1>
        <p className="text-gray-600 mt-1">Dernek tarihçe içeriğini düzenleyebilirsiniz.</p>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <FaHistory className="mr-2 text-primary" />
            Tarihçe İçeriği
          </h2>
        </div>
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
                name="content"
                rows={12}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                defaultValue={historyContent.content}
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                HTML formatında içerik girebilirsiniz. (örn: &lt;p&gt;Paragraf&lt;/p&gt;)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ana Görsel URL
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaImage className="text-gray-500" />
                  </div>
                  <input 
                    name="mainImageUrl"
                    type="text"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={historyContent.mainImageUrl}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kuruluş Tarihi
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaCalendarAlt className="text-gray-500" />
                  </div>
                  <input 
                    name="foundingDate"
                    type="text"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={historyContent.foundingDate}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kurucu Başkan
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input 
                    name="foundingPresident"
                    type="text"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={historyContent.foundingPresident}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resmi Statü
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaBuilding className="text-gray-500" />
                  </div>
                  <input 
                    name="legalStatus"
                    type="text"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={historyContent.legalStatus}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İlk Üye Sayısı
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaUsers className="text-gray-500" />
                  </div>
                  <input 
                    name="initialMemberCount"
                    type="text"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={historyContent.initialMemberCount}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mevcut Üye Sayısı
                </label>
                <div className="flex">
                  <div className="bg-gray-100 p-2 flex items-center justify-center rounded-l-md border border-r-0 border-gray-300">
                    <FaUsers className="text-gray-500" />
                  </div>
                  <input 
                    name="currentMemberCount"
                    type="text"
                    className="block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={historyContent.currentMemberCount}
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
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">Önemli Kilometre Taşları</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {historyContent.milestones.map((milestone, index) => (
              <div key={index} className="flex items-center space-x-3 border border-gray-200 rounded-md p-3">
                <div className="w-16">
                  <input 
                    type="text" 
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    value={milestone.year}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    value={milestone.description}
                    readOnly
                  />
                </div>
                <button 
                  type="button" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteMilestone(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Yeni Kilometre Taşı Ekle</h3>
            <div className="flex items-center space-x-3">
              <div className="w-16">
                <input 
                  type="text" 
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Yıl"
                  value={newMilestone.year}
                  onChange={(e) => setNewMilestone({...newMilestone, year: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Açıklama"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                />
              </div>
              <button 
                type="button"
                className="bg-secondary hover:bg-secondary-dark text-white p-2 rounded-md"
                onClick={addMilestone}
                disabled={!newMilestone.year || !newMilestone.description}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">Tarihimizden Kareler</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyContent.additionalImages.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-3">
                <div className="relative h-32 mb-3 rounded overflow-hidden">
                  <img 
                    src={image.url} 
                    alt={image.caption}
                    className="object-cover w-full h-full"
                  />
                </div>
                <input 
                  type="text" 
                  className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Görsel URL"
                  value={image.url}
                  readOnly
                />
                <input 
                  type="text" 
                  className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Açıklama"
                  value={image.caption}
                  readOnly
                />
                <button 
                  type="button" 
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => deleteImage(index)}
                >
                  Kaldır
                </button>
              </div>
            ))}
            
            <div className="border border-dashed border-gray-300 rounded-md p-3">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Yeni Görsel Ekle</h3>
              <input 
                type="text" 
                className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Görsel URL"
                value={newImage.url}
                onChange={(e) => setNewImage({...newImage, url: e.target.value})}
              />
              <input 
                type="text" 
                className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Açıklama"
                value={newImage.caption}
                onChange={(e) => setNewImage({...newImage, caption: e.target.value})}
              />
              <button 
                type="button"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md w-full"
                onClick={addImage}
                disabled={!newImage.url}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 