'use client';

import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaExclamationTriangle, FaExternalLinkAlt } from 'react-icons/fa';

export default function FirebaseSetupGuide() {
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBucketStatus();
  }, []);

  const checkBucketStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try to access Firebase Storage
      const { getStorage, ref, listAll } = await import('firebase/storage');
      const { storage } = await import('@/utils/firebase/client');
      
      const storageRef = ref(storage, '');
      await listAll(storageRef);
      
      setBucketExists(true);
    } catch (err: any) {
      setBucketExists(false);
      if (err.code === 'storage/bucket-not-found' || err.message?.includes('does not exist')) {
        setError('Firebase Storage bucket henüz oluşturulmamış');
      } else if (err.code === 'storage/unauthorized') {
        setError('Storage erişim yetkisi yok');
      } else {
        setError(err.message || 'Bilinmeyen hata');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">Firebase Storage durumu kontrol ediliyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🔥 Firebase Storage Kurulum Rehberi</h1>
      
      {/* Status Check */}
      <div className={`p-6 rounded-lg border-2 mb-6 ${
        bucketExists 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center">
          {bucketExists ? (
            <FaCheck className="text-green-600 text-2xl mr-3" />
          ) : (
            <FaTimes className="text-red-600 text-2xl mr-3" />
          )}
          <div>
            <h3 className={`text-lg font-semibold ${
              bucketExists ? 'text-green-800' : 'text-red-800'
            }`}>
              {bucketExists 
                ? '✅ Firebase Storage Aktif' 
                : '❌ Firebase Storage Henüz Aktif Değil'
              }
            </h3>
            {error && (
              <p className="text-red-700 mt-1">{error}</p>
            )}
          </div>
        </div>
      </div>

      {!bucketExists && (
        <div className="space-y-6">
          {/* Firebase Console Link */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              🚀 Firebase Storage'ı Etkinleştirin
            </h3>
            <div className="space-y-4">
              <a
                href="https://console.firebase.google.com/project/izorder-92337/storage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaExternalLinkAlt className="mr-2" />
                Firebase Console'da Storage'ı Aç
              </a>
              <p className="text-blue-700 text-sm">
                Yukarıdaki butona tıklayarak doğrudan Firebase Storage sayfasına gidin.
              </p>
            </div>
          </div>

          {/* Step by Step Guide */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Adım Adım Kurulum
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                <strong>Firebase Console'a gidin:</strong> Yukarıdaki butonu kullanın veya{' '}
                <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  console.firebase.google.com
                </a> adresine gidin
              </li>
              <li><strong>Proje seçin:</strong> "izorder-92337" projesini seçin</li>
              <li><strong>Storage menüsü:</strong> Sol menüden "Storage" seçeneğini tıklayın</li>
              <li><strong>Başlatın:</strong> "Get started" veya "Başla" butonuna tıklayın</li>
              <li>
                <strong>Güvenlik kuralları:</strong> "Start in test mode" seçin 
                <span className="text-sm text-gray-600 ml-2">(30 gün boyunca herkes erişebilir)</span>
              </li>
              <li>
                <strong>Konum seçin:</strong> "europe-west1" (Avrupa) önerilir
                <span className="text-sm text-gray-600 ml-2">(sonradan değiştirilemez!)</span>
              </li>
              <li><strong>Tamamlayın:</strong> "Done" butonuna tıklayın</li>
            </ol>
          </div>

          {/* Security Rules Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <div className="flex">
              <FaExclamationTriangle className="text-yellow-400 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  ⚠️ Güvenlik Kuralları Uyarısı
                </h3>
                <p className="text-yellow-700 mb-2">
                  "Test mode" seçerseniz, Storage 30 gün boyunca herkese açık olur. 
                  Bu sadece geliştirme aşaması için uygundur.
                </p>
                <p className="text-yellow-700 text-sm">
                  Production'da mutlaka güvenlik kurallarını düzenleyin: sadece giriş yapmış kullanıcılar dosya yükleyebilsin.
                </p>
              </div>
            </div>
          </div>

          {/* Current Config Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🔧 Mevcut Yapılandırma
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div><strong>Proje ID:</strong> izorder-92337</div>
              <div><strong>Storage Bucket:</strong> izorder-92337.appspot.com</div>
              <div><strong>Beklenen URL:</strong> https://firebasestorage.googleapis.com/v0/b/izorder-92337.appspot.com/o/</div>
            </div>
          </div>
        </div>
      )}

      {bucketExists && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            🎉 Firebase Storage Hazır!
          </h3>
          <p className="text-green-700 mb-4">
            Firebase Storage başarıyla etkinleştirilmiş ve kulıma hazır. 
            Artık görsel yükleme işlemleri çalışacak.
          </p>
          <div className="space-x-4">
            <a
              href="/admin/storage-test"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🧪 Storage Testi Yap
            </a>
            <a
              href="/admin/galeri/ekle"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📸 Galeri'ye Görsel Ekle
            </a>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={checkBucketStatus}
          disabled={loading}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          🔄 Durumu Tekrar Kontrol Et
        </button>
      </div>
    </div>
  );
}
