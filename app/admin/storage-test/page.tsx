'use client';

import { useState, useEffect } from 'react';
import { checkStorageConfiguration, uploadToFirebaseStorage } from '@/utils/firebase/storage';
import { auth } from '@/utils/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { FaCheck, FaTimes, FaExclamationTriangle, FaRedo, FaUpload } from 'react-icons/fa';

export default function StorageTestPage() {
  const [status, setStatus] = useState<{
    isConfigured: boolean;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      console.log('🔍 Storage Test - Auth State:', user ? 'Authenticated' : 'Not Authenticated');
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadResult(null);
    setUploadError(null);

    try {
      console.log('🚀 Starting upload test...');
      console.log('📁 File:', file.name, file.size, 'bytes');
      console.log('🔐 Auth state:', {
        currentUser: !!auth.currentUser,
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email
      });      const result = await uploadToFirebaseStorage(file, 'test-uploads');
      
      if (result.success && result.url) {
        console.log('✅ Upload successful:', result.url);
        setUploadResult(result.url);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (uploadErr: any) {
      console.error('❌ Upload failed:', uploadErr);
      setUploadError(uploadErr.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const checkStorage = async () => {
    setLoading(true);
    try {
      const result = await checkStorageConfiguration();
      setStatus(result);
    } catch (error: any) {
      setStatus({
        isConfigured: false,
        error: error.message || 'Bilinmeyen hata'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStorage();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Firebase Storage Test
            </h1>
            <button
              onClick={checkStorage}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <FaRedo className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Tekrar Test Et
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Storage yapılandırması kontrol ediliyor...</p>
            </div>
          )}

          {!loading && status && (
            <div className="space-y-6">
              <div className={`p-6 rounded-lg border-2 ${
                status.isConfigured 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  {status.isConfigured ? (
                    <FaCheck className="text-green-600 text-2xl mr-3" />
                  ) : (
                    <FaTimes className="text-red-600 text-2xl mr-3" />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      status.isConfigured ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {status.isConfigured 
                        ? 'Firebase Storage Yapılandırması Başarılı' 
                        : 'Firebase Storage Yapılandırma Hatası'
                      }
                    </h3>
                    {status.error && (
                      <p className="text-red-700 mt-1">{status.error}</p>
                    )}
                  </div>
                </div>
              </div>

              {!status.isConfigured && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <div className="flex">
                    <FaExclamationTriangle className="text-yellow-400 mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-yellow-800 mb-2">
                        Firebase Storage Kurulum Adımları
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-yellow-700">
                        <li>
                          <a 
                            href="https://console.firebase.google.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Firebase Console
                          </a>
                          'a gidin
                        </li>
                        <li>Projenizi seçin: <strong>izorder-92337</strong></li>
                        <li>Sol menüden <strong>Storage</strong> seçeneğini tıklayın</li>
                        <li><strong>"Get started"</strong> veya <strong>"Başla"</strong> butonuna tıklayın</li>
                        <li>Güvenlik kurallarını seçin (geliştirme için test mode önerilir)</li>
                        <li>Storage konumunu seçin (varsayılan: us-central1)</li>
                        <li><strong>"Done"</strong> veya <strong>"Bitti"</strong> butonuna tıklayın</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                <div className="flex">
                  <div className="text-blue-400 mr-3 mt-1">ℹ️</div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-800 mb-2">
                      Mevcut Yapılandırma
                    </h3>
                    <div className="space-y-1 text-blue-700 text-sm">
                      <p><strong>Proje ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
                      <p><strong>Storage Bucket:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}</p>
                      <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
                    </div>
                  </div>
                </div>              </div>

              {/* Authentication Status */}
              <div className={`p-6 rounded-lg border-2 ${
                authUser 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center">
                  {authUser ? (
                    <FaCheck className="text-green-600 text-2xl mr-3" />
                  ) : (
                    <FaExclamationTriangle className="text-yellow-600 text-2xl mr-3" />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      authUser ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {authUser 
                        ? 'Firebase Authentication: Authenticated' 
                        : 'Firebase Authentication: Not Authenticated'
                      }
                    </h3>
                    {authUser && (
                      <div className="text-green-700 mt-1 text-sm">
                        <p>User: {authUser.email}</p>
                        <p>UID: {authUser.uid}</p>
                        <p>auth.currentUser: {auth.currentUser ? 'Available' : 'Null'}</p>
                      </div>
                    )}
                    {!authUser && (
                      <p className="text-yellow-700 mt-1">
                        You need to be authenticated to upload files to Firebase Storage
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {status.isConfigured && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Dosya Yükleme Testi
                  </h2>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-700 mb-4">
                      Firebase Storage entegrasyonunu test etmek için aşağıdaki dosya yükleme alanını kullanın.
                    </p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    {uploading && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-gray-700">Yükleniyor...</span>
                      </div>
                    )}
                    {uploadResult && (
                      <div className="mt-4 text-green-600">
                        <FaCheck className="inline-block mr-2" />
                        Yükleme başarılı! 
                        <a 
                          href={uploadResult} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Dosyayı görüntüle
                        </a>
                      </div>
                    )}
                    {uploadError && (
                      <div className="mt-4 text-red-600">
                        <FaTimes className="inline-block mr-2" />
                        Yükleme hatası: {uploadError}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
