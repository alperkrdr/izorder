'use client';

import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaRedo, FaExternalLinkAlt } from 'react-icons/fa';

interface StorageErrorProps {
  error: string;
  onRetry?: () => void;
}

export default function StorageErrorHandler({ error, onRetry }: StorageErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Firebase Storage bucket bulunamadı hatası kontrolü
  const isBucketNotFound = error.includes('bucket-not-found') || 
                          error.includes('does not exist') ||
                          error.includes('Firebase Storage bucket bulunamadı');

  const getErrorMessage = () => {
    if (isBucketNotFound) {
      return {
        title: 'Firebase Storage Yapılandırma Gerekli',
        message: 'Firebase Storage bucket\'ı henüz oluşturulmamış. Lütfen aşağıdaki adımları takip edin.',
        type: 'warning' as const
      };
    }
    
    return {
      title: 'Dosya Yükleme Hatası',
      message: 'Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
      type: 'error' as const
    };
  };

  const { title, message, type } = getErrorMessage();

  return (
    <div className={`rounded-lg border-2 p-6 ${
      type === 'warning' 
        ? 'bg-yellow-50 border-yellow-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start">
        {type === 'warning' ? (
          <FaExclamationTriangle className="text-yellow-500 text-xl mr-3 mt-1 flex-shrink-0" />
        ) : (
          <FaExclamationTriangle className="text-red-500 text-xl mr-3 mt-1 flex-shrink-0" />
        )}
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${
            type === 'warning' ? 'text-yellow-800' : 'text-red-800'
          }`}>
            {title}
          </h3>
          
          <p className={`mb-3 ${
            type === 'warning' ? 'text-yellow-700' : 'text-red-700'
          }`}>
            {message}
          </p>

          {isBucketNotFound && (
            <div className="space-y-4">
              <div className="bg-yellow-100 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <FaInfoCircle className="mr-2" />
                  Firebase Storage Kurulum Adımları
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>
                    <a 
                      href="https://console.firebase.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                    >
                      Firebase Console <FaExternalLinkAlt className="ml-1 text-xs" />
                    </a>
                    'a gidin
                  </li>
                  <li>Projenizi seçin: <code className="bg-yellow-200 px-1 rounded">izorder-92337</code></li>
                  <li>Sol menüden <strong>Storage</strong> seçeneğini tıklayın</li>
                  <li><strong>"Get started"</strong> butonuna tıklayın</li>
                  <li>Güvenlik kurallarını seçin (test mode önerilir)</li>
                  <li>Storage konumunu seçin (varsayılan: us-central1)</li>
                  <li><strong>"Done"</strong> butonuna tıklayın</li>
                </ol>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Beklenen Bucket Adresi</h4>
                <code className="text-sm bg-blue-100 px-2 py-1 rounded text-blue-800">
                  {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'izorder-92337.appspot.com'}
                </code>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 mt-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaRedo className="mr-2" />
                Tekrar Dene
              </button>
            )}
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`text-sm ${
                type === 'warning' ? 'text-yellow-600 hover:text-yellow-800' : 'text-red-600 hover:text-red-800'
              } underline`}
            >
              {showDetails ? 'Detayları Gizle' : 'Detayları Göster'}
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <h5 className="font-medium text-gray-800 mb-1">Hata Detayı:</h5>
              <pre className="text-gray-700 whitespace-pre-wrap break-words">{error}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
