'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/utils/firebase/client';
import { getHistoryContent, updateHistoryContent } from '@/utils/firebase/dataService';
import { FaSave, FaUpload, FaExclamationCircle, FaPlus, FaTrash } from 'react-icons/fa';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase/client';
import { uploadImageWithAuth } from '@/utils/firebase/storageUtils';

// Define the history content type
interface HistoryContent {
  content: string;
  mainImageUrl: string;
  foundingDate: string;
  foundingPresident: string;
  legalStatus: string;
  initialMemberCount: string;
  currentMemberCount: string;
  milestones: Array<{
    id?: string;
    year: string;
    title?: string;
    description: string;
  }>;
  additionalImages: Array<{
    id?: string;
    url: string;
    caption: string;
  }>;
}

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface AdditionalImage {
  id: string;
  url: string;
  caption: string;
}

export default function HistoryPage() {
  // State for form fields
  const [content, setContent] = useState('');
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [foundingDate, setFoundingDate] = useState('');
  const [foundingPresident, setFoundingPresident] = useState('');
  const [legalStatus, setLegalStatus] = useState('');
  const [initialMemberCount, setInitialMemberCount] = useState('');
  const [currentMemberCount, setCurrentMemberCount] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // New milestone form state
  const [newMilestone, setNewMilestone] = useState({
    year: '',
    title: '',
    description: ''
  });
  
  // New additional image form state
  const [newAdditionalImage, setNewAdditionalImage] = useState<{
    file: File | null;
    preview: string | null;
    caption: string;
  }>({
    file: null,
    preview: null,
    caption: ''
  });
  
  // Track additional image files to upload
  const [additionalImageFiles, setAdditionalImageFiles] = useState<Array<{id: string, file: File}>>([]);
  
  // Fetch history content on component mount
  useEffect(() => {
    const fetchHistoryContent = async () => {
      try {
        setLoading(true);
        
        // Get the history document using our data service
        const historyData = await getHistoryContent();
        
        if (historyData) {
          // Set form fields with data from Firestore
          setContent(historyData.content || '');
          setMainImageUrl(historyData.mainImageUrl || '');
          setMainImagePreview(historyData.mainImageUrl || null);
          setFoundingDate(historyData.foundingDate || '');
          setFoundingPresident(historyData.foundingPresident || '');
          setLegalStatus(historyData.legalStatus || '');
          setInitialMemberCount(historyData.initialMemberCount || '');
          setCurrentMemberCount(historyData.currentMemberCount || '');
          
          // Ensure the milestones have the required id and title properties
          if (historyData.milestones) {
            const formattedMilestones: Milestone[] = historyData.milestones.map(m => ({
              id: (m as any).id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
              year: m.year || '',
              title: (m as any).title || '',
              description: m.description || ''
            }));
            setMilestones(formattedMilestones);
          } else {
            setMilestones([]);
          }
          
          // Ensure additional images have the required id property
          if (historyData.additionalImages) {
            const formattedImages: AdditionalImage[] = historyData.additionalImages.map(img => ({
              id: (img as any).id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
              url: img.url || '',
              caption: img.caption || ''
            }));
            setAdditionalImages(formattedImages);
          } else {
            setAdditionalImages([]);
          }
        } else {
          // Set default values if document doesn't exist
          setContent('<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneğimiz, 2005 yılında kurulmuştur...</p>');
          setMainImageUrl('/images/history-main.jpg');
        }
      } catch (error: any) {
        console.error('Error fetching history content:', error);
        setError('Tarihçe içeriği yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoryContent();
  }, []);
    // Handle main image selection
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Görsel dosyası 5MB\'dan küçük olmalıdır.');
      return;
    }
    
    setMainImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle additional image selection
  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image/')) {
      setError('Lütfen geçerli bir görsel dosyası seçin.');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Görsel dosyası 5MB\'dan küçük olmalıdır.');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAdditionalImage({
        ...newAdditionalImage,
        file,
        preview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };
  
  // Add a new milestone
  const addMilestone = () => {
    if (!newMilestone.year || !newMilestone.title) {
      setError('Yıl ve başlık alanları zorunludur.');
      return;
    }
    
    const milestone: Milestone = {
      id: Date.now().toString(),
      ...newMilestone
    };
    
    setMilestones([...milestones, milestone]);
    setNewMilestone({ year: '', title: '', description: '' });
    setSuccess('Dönüm noktası eklendi.');
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };
  
  // Remove a milestone
  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };
  
  // Add a new additional image
  const addAdditionalImage = async () => {
    if (!newAdditionalImage.file || !newAdditionalImage.caption) {
      setError('Görsel ve başlık alanları zorunludur.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create temporary ID for the image
      const imageId = Date.now().toString();
      
      // Add to additionalImages array with a temporary local URL
      const newImage: AdditionalImage = {
        id: imageId,
        url: URL.createObjectURL(newAdditionalImage.file),
        caption: newAdditionalImage.caption
      };
      
      // Add to additional images array
      setAdditionalImages([...additionalImages, newImage]);
      
      // Add to files to be uploaded on save
      setAdditionalImageFiles([
        ...additionalImageFiles,
        { id: imageId, file: newAdditionalImage.file }
      ]);
      
      setNewAdditionalImage({ file: null, preview: null, caption: '' });
      setSuccess('Görsel eklendi. Değişiklikleri kaydetmek için "Kaydet" butonuna tıklayın.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error adding additional image:', error);
      setError('Görsel eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  // Remove an additional image
  const removeAdditionalImage = (id: string) => {
    setAdditionalImages(additionalImages.filter(img => img.id !== id));
    setAdditionalImageFiles(additionalImageFiles.filter(img => img.id !== id));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saving) return;
    
    // Validate form
    if (!content.trim()) {
      setError('İçerik alanı zorunludur.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Get current user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('Oturum açmanız gerekiyor.');
        console.error('Firebase kimlik doğrulama hatası: Kullanıcı oturumu açık değil');
        return;
      }
      
      // Log the current user details for debugging
      console.log('Current user:', {
        uid: currentUser.uid,
        email: currentUser.email,
        isAnonymous: currentUser.isAnonymous,
        emailVerified: currentUser.emailVerified,
      });
      
      // Prepare history content data
      const historyData: HistoryContent = {
        content,
        mainImageUrl,
        foundingDate,
        foundingPresident,
        legalStatus,
        initialMemberCount,
        currentMemberCount,
        milestones,
        additionalImages
      };
      
      // Test Firebase izinlerini kontrol et
      try {
        console.log('Firebase izinleri kontrol ediliyor...');
        
        // Firebase'e basit bir veri yazarak izinleri kontrol et
        const testCollection = collection(db, '__test_permissions');
        const testDoc = await addDoc(testCollection, { 
          testValue: 'test', 
          timestamp: new Date().toISOString(),
          userId: currentUser.uid
        });
        
        // Test belgesi başarıyla oluşturulduysa sil
        await deleteDoc(doc(db, '__test_permissions', testDoc.id));
        console.log('Firebase izinleri doğrulandı.');
      } catch (permError: any) {
        console.error('Firebase izin hatası:', permError);
        const errorCode = permError.code || '';
        const errorMessage = permError.message || 'Bilinmeyen hata';
        
        setError(`Firebase izin hatası: ${errorCode} - ${errorMessage}. Lütfen aşağıdaki adımları deneyin:
          1. Firebase konsolundan kuralları güncelleyin
          2. Oturumunuzu yenileyin
          3. Yönetici ile iletişime geçin`);
        setSaving(false);
        return;
      }
        // Handle main image upload first if a new image is selected
      if (mainImageFile) {
        console.log('Ana görsel yükleniyor:', mainImageFile.name);
        setError(null);
        
        try {
          const uploadResult = await uploadImageWithAuth(
            mainImageFile, 
            'history_images', 
            `main-${Date.now()}-${mainImageFile.name}`
          );
          
          if (!uploadResult.success) {
            setError(`Ana görsel yükleme hatası: ${uploadResult.error}`);
            setSaving(false);
            return;
          }
          
          // Update the main image URL with uploaded image
          historyData.mainImageUrl = uploadResult.url!;
          console.log('Ana görsel yükleme başarılı:', uploadResult.url);
        } catch (uploadError: any) {
          console.error('Ana görsel yükleme hatası:', uploadError);
          setError(`Ana görsel yükleme hatası: ${uploadError.message}`);
          setSaving(false);
          return;
        }
      }
      
      // Use the data service to update history content with detailed error handling
      try {
        await updateHistoryContent(
          historyData, 
          mainImageFile, 
          additionalImageFiles,
          currentUser.uid
        );
      } catch (updateError: any) {
        console.error('İçerik güncelleme hatası:', updateError);
        const errorCode = updateError.code || '';
        const errorMessage = updateError.message || 'Bilinmeyen hata';
        
        if (errorCode.includes('permission-denied')) {
          setError(`Firebase yetki hatası: Veritabanına yazma izniniz yok. Lütfen yönetici ile iletişime geçin.`);
        } else {
          setError(`Tarihçe içeriği kaydedilirken bir hata oluştu: ${errorMessage}`);
        }
        throw updateError; // Hatayı yeniden fırlat
      }
      
      // Clear uploaded files tracking
      setAdditionalImageFiles([]);
      setMainImageFile(null);
      
      setSuccess('Tarihçe içeriği başarıyla kaydedildi.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error('Error saving history content:', error);
      if (!error.message.includes('Firebase')) {
        // Eğer yukarıda özel hata mesajı belirlenmemişse genel hata mesajı göster
        setError(error.message || 'Tarihçe içeriği kaydedilirken bir hata oluştu.');
      }
    } finally {
      setSaving(false);
    }
  };
  
  if (loading && !saving) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Tarihçe Sayfası Düzenleme</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ana İçerik*
          </label>
          <div className="border border-gray-300 rounded-md">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 min-h-[300px] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tarihçe içeriğini buraya girin..."
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">HTML içeriği desteklenmektedir (&lt;p&gt;, &lt;h1&gt;, &lt;strong&gt; vb.)</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ana Görsel
            </label>
            <div className="flex items-center mb-2">
              <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
                <FaUpload className="mr-2" />
                <span>Görsel Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                />
              </label>
              {mainImageFile && (
                <span className="ml-2 text-sm text-gray-500">
                  {mainImageFile.name}
                </span>
              )}
            </div>
            {mainImagePreview && (
              <div className="mt-2">
                <img
                  src={mainImagePreview}
                  alt="Ana Görsel"
                  className="max-h-40 rounded-md"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="foundingDate" className="block text-sm font-medium text-gray-700 mb-1">
                Kuruluş Yılı
              </label>
              <input
                type="text"
                id="foundingDate"
                value={foundingDate}
                onChange={(e) => setFoundingDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="foundingPresident" className="block text-sm font-medium text-gray-700 mb-1">
                Kurucu Başkan
              </label>
              <input
                type="text"
                id="foundingPresident"
                value={foundingPresident}
                onChange={(e) => setFoundingPresident(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="legalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Yasal Statü
              </label>
              <input
                type="text"
                id="legalStatus"
                value={legalStatus}
                onChange={(e) => setLegalStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="initialMemberCount" className="block text-sm font-medium text-gray-700 mb-1">
                İlk Üye Sayısı
              </label>
              <input
                type="text"
                id="initialMemberCount"
                value={initialMemberCount}
                onChange={(e) => setInitialMemberCount(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="currentMemberCount" className="block text-sm font-medium text-gray-700 mb-1">
                Mevcut Üye Sayısı
              </label>
              <input
                type="text"
                id="currentMemberCount"
                value={currentMemberCount}
                onChange={(e) => setCurrentMemberCount(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Dönüm Noktaları</h3>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label htmlFor="milestoneYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Yıl*
                </label>
                <input
                  type="text"
                  id="milestoneYear"
                  value={newMilestone.year}
                  onChange={(e) => setNewMilestone({ ...newMilestone, year: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="milestoneTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık*
                </label>
                <input
                  type="text"
                  id="milestoneTitle"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="milestoneDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <input
                  type="text"
                  id="milestoneDescription"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPlus className="mr-2" /> Ekle
              </button>
            </div>
          </div>
          
          {milestones.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Yıl
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {milestones.map((milestone) => (
                    <tr key={milestone.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {milestone.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {milestone.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {milestone.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="inline" /> Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">Henüz dönüm noktası eklenmemiş.</p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Ek Görseller</h3>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Görsel*
                </label>
                <div className="flex items-center">
                  <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
                    <FaUpload className="mr-2" />
                    <span>Görsel Seç</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdditionalImageChange}
                      className="hidden"
                    />
                  </label>
                  {newAdditionalImage.file && (
                    <span className="ml-2 text-sm text-gray-500">
                      {newAdditionalImage.file.name}
                    </span>
                  )}
                </div>
                {newAdditionalImage.preview && (
                  <div className="mt-2">
                    <img
                      src={newAdditionalImage.preview}
                      alt="Ek Görsel"
                      className="max-h-40 rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="imageCaption" className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık*
                </label>
                <input
                  type="text"
                  id="imageCaption"
                  value={newAdditionalImage.caption}
                  onChange={(e) => setNewAdditionalImage({ ...newAdditionalImage, caption: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={addAdditionalImage}
                    disabled={!newAdditionalImage.file || !newAdditionalImage.caption}
                    className={`flex items-center px-4 py-2 rounded-md text-white ${
                      !newAdditionalImage.file || !newAdditionalImage.caption
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <FaPlus className="mr-2" /> Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {additionalImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {additionalImages.map((image) => (
                <div key={image.id} className="bg-white border border-gray-200 rounded-md overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900">{image.caption}</p>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(image.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        <FaTrash className="inline mr-1" /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">Henüz ek görsel eklenmemiş.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center px-4 py-2 rounded-md text-white ${
              saving
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <FaSave className="mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}