'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaBroom, FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

export default function DatabaseCleanupPage() {
  const { user } = useAuth();
  const [cleaning, setCleaning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Function to clean database using API endpoint
  const cleanDatabase = async () => {
    setCleaning(true);
    setError(null);
    setSuccess(null);
    setResults([]);

    try {
      console.log('🧹 Starting database cleanup...');
      
      const response = await fetch('/api/admin/cleanup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.results || []);
      setSuccess(`✅ Database cleanup completed! Total updated: ${data.totalUpdated || 0}`);
      console.log('✅ Database cleanup completed:', data);
      
    } catch (err) {
      console.error('❌ Database cleanup failed:', err);
      setError(err instanceof Error ? err.message : 'Database cleanup failed');
    } finally {
      setCleaning(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Erişim Engellendi</h3>
        <p className="mt-1 text-sm text-gray-500">
          Bu sayfaya erişmek için admin olarak giriş yapmalısınız.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-6">
            <FaBroom className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Veritabanı Temizlik Aracı
              </h1>
              <p className="text-sm text-gray-600">
                Firestore veritabanından eski placeholder URL'lerini temizleyin
              </p>
            </div>
          </div>

          {/* Uyarı Alerti */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Önemli Bilgiler
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Bu araç eski <code>via.placeholder.com</code> URL'lerini
                      yeni yerel SVG placeholder'larla değiştirir.
                    </li>
                    <li>
                      İşlem haberler, basın bültenleri, galeri görselleri, 
                      yönetim kurulu ve tarihçe gibi tüm koleksiyonları tarayacaktır.
                    </li>
                    <li>
                      Bu işlem geri alınamaz. Gerekirse yedeğinizi aldığınızdan emin olun.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* İşlem Butonu */}
          <div className="mb-6">
            <button
              onClick={cleanDatabase}
              disabled={cleaning}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                cleaning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {cleaning ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-3 h-4 w-4" />
                  Veritabanı Temizleniyor...
                </>
              ) : (
                <>
                  <FaBroom className="-ml-1 mr-3 h-4 w-4" />
                  Veritabanı Temizliğini Başlat
                </>
              )}
            </button>
          </div>

          {/* Hata Alerti */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Hata</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Başarı Alerti */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheck className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Başarılı</h3>
                  <div className="mt-2 text-sm text-green-700">
                    {success}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sonuçlar */}
          {results.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Temizlik Sonuçları
              </h3>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="bg-white rounded-md p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-medium text-gray-900">
                        Koleksiyon: {result.collection}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? 'Başarılı' : 'Hata'}
                      </span>
                    </div>
                    
                    {result.success ? (
                      <div className="text-sm text-gray-600">
                        <p>Taranan belgeler: {result.documentsScanned}</p>
                        <p>Güncellenen belgeler: {result.documentsUpdated}</p>
                        <p>Değiştirilen placeholder'lar: {result.placeholdersReplaced}</p>
                        
                        {result.foundUrls && result.foundUrls.length > 0 && (
                          <div className="mt-3">
                            <p className="font-medium">Bulunan eski URL'ler:</p>
                            <ul className="mt-1 list-disc list-inside space-y-1">
                              {result.foundUrls.map((url: string, urlIndex: number) => (
                                <li key={urlIndex} className="text-xs text-gray-500 break-all">
                                  {url}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-red-600">
                        Hata: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
