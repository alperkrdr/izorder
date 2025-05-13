import AdminLayout from '@/components/admin/AdminLayout';
import { getHistoryContent } from '@/lib/data';
import { FaHistory, FaCalendarAlt, FaUser, FaBuilding, FaUsers, FaImage } from 'react-icons/fa';

export const metadata = {
  title: 'Tarihçe Yönetimi - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Tarihçe Yönetimi',
};

export default async function HistoryManagementPage() {
  const historyContent = await getHistoryContent();
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tarihçe Yönetimi</h1>
        <p className="text-gray-600 mt-1">Dernek tarihçe içeriğini düzenleyebilirsiniz.</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <FaHistory className="mr-2 text-primary" />
            Tarihçe İçeriği
          </h2>
        </div>
        <div className="p-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İçerik
              </label>
              <textarea
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
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
              >
                Değişiklikleri Kaydet
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
                    defaultValue={milestone.year}
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    defaultValue={milestone.description}
                  />
                </div>
                <button 
                  type="button" 
                  className="text-red-500 hover:text-red-700"
                >
                  Sil
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <button 
              type="button"
              className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md"
            >
              Yeni Kilometre Taşı Ekle
            </button>
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
                  defaultValue={image.url}
                />
                <input 
                  type="text" 
                  className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Açıklama"
                  defaultValue={image.caption}
                />
                <button 
                  type="button" 
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Kaldır
                </button>
              </div>
            ))}
            
            <div className="border border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-400 transition">
              <div className="p-4">
                <FaImage className="mx-auto h-12 w-12" />
                <p className="mt-1 text-sm text-center">Yeni Görsel Ekle</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="button"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
            >
              Görselleri Güncelle
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 