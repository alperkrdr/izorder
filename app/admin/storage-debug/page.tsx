// Firebase Storage Hata Çözümleme ve Test Aracı
'use client';

import { useState, useEffect } from 'react';
import { auth, storage, db } from '@/utils/firebase/client';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function StorageDebugPage() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runStorageTests = async () => {
    setTesting(true);
    setTestResults([]);

    try {
      addTestResult('🔧 Firebase Storage testleri başlıyor...');

      // 1. Auth durumu kontrolü
      if (!authUser) {
        addTestResult('❌ HATA: Kullanıcı oturumu açık değil!');
        setTesting(false);
        return;
      }

      addTestResult(`✅ Kullanıcı oturumu açık: ${authUser.email}`);
      addTestResult(`   - UID: ${authUser.uid}`);
      addTestResult(`   - Email doğrulandı: ${authUser.emailVerified}`);

      // 2. Firebase Storage erişimi testi
      try {
        addTestResult('📦 Storage bucket erişimi test ediliyor...');
        const storageRef = ref(storage, 'test_permissions/');
        const listResult = await listAll(storageRef);
        addTestResult(`✅ Storage bucket'a erişim başarılı (${listResult.items.length} item)`);
      } catch (listError: any) {
        addTestResult(`❌ Storage bucket erişim hatası: ${listError.code} - ${listError.message}`);
      }

      // 3. Test dosyası yükleme
      try {
        addTestResult('📤 Test dosyası yükleniyor...');
        const testBlob = new Blob(['Test data'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
        
        const uploadRef = ref(storage, `test_uploads/${Date.now()}-test.txt`);
        const uploadResult = await uploadBytes(uploadRef, testFile);
        addTestResult('✅ Test dosyası yükleme başarılı');

        const downloadURL = await getDownloadURL(uploadResult.ref);
        addTestResult(`✅ Download URL alındı: ${downloadURL.substring(0, 50)}...`);
      } catch (uploadError: any) {
        addTestResult(`❌ Dosya yükleme hatası: ${uploadError.code} - ${uploadError.message}`);
        
        if (uploadError.code === 'storage/unauthorized') {
          addTestResult('💡 ÇÖZÜMLENECEKLER:');
          addTestResult('   1. Firebase Storage Rules güncellenmelidir');
          addTestResult('   2. Auth user\'ın write iznine ihtiyacı var');
          addTestResult('   3. Firebase konsoldan Rules kontrol edilmelidir');
        }
      }

      // 4. Press coverage klasörü test
      try {
        addTestResult('📁 Press coverage klasörü test ediliyor...');
        const testBlob = new Blob(['Press test'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'press-test.txt', { type: 'text/plain' });
        
        const pressRef = ref(storage, `press_coverage/${Date.now()}-press-test.txt`);
        await uploadBytes(pressRef, testFile);
        addTestResult('✅ Press coverage klasörüne yazma başarılı');
      } catch (pressError: any) {
        addTestResult(`❌ Press coverage yazma hatası: ${pressError.code} - ${pressError.message}`);
      }

      // 5. Firestore yazma testi
      try {
        addTestResult('🗃️ Firestore yazma test ediliyor...');
        await addDoc(collection(db, 'test_collection'), {
          message: 'Test message',
          timestamp: new Date(),
          userId: authUser.uid
        });
        addTestResult('✅ Firestore yazma başarılı');
      } catch (firestoreError: any) {
        addTestResult(`❌ Firestore yazma hatası: ${firestoreError.code} - ${firestoreError.message}`);
      }

    } catch (error: any) {
      addTestResult(`❌ Test hatası: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  if (authLoading) {
    return <div className="p-6">🔄 Auth durumu kontrol ediliyor...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Storage Debug Aracı</h1>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Auth Durumu</h2>
        {authUser ? (
          <div className="text-green-700">
            <p>✅ Kullanıcı oturumu açık</p>
            <p>📧 Email: {authUser.email}</p>
            <p>🆔 UID: {authUser.uid}</p>
            <p>✉️ Email doğrulandı: {authUser.emailVerified ? 'Evet' : 'Hayır'}</p>
          </div>
        ) : (
          <p className="text-red-700">❌ Kullanıcı oturumu açık değil</p>
        )}
      </div>

      <button
        onClick={runStorageTests}
        disabled={testing || !authUser}
        className={`px-6 py-3 rounded-lg text-white font-medium mb-6 ${
          testing || !authUser
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {testing ? '🧪 Testler çalışıyor...' : '🧪 Storage Testlerini Çalıştır'}
      </button>

      {testResults.length > 0 && (
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
          <h3 className="text-white font-bold mb-3">Test Sonuçları:</h3>
          {testResults.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h3 className="font-semibold text-yellow-800">Firebase Storage Kuralları</h3>
        <p className="text-yellow-700 mt-2">
          Eğer "storage/unauthorized" hatası alıyorsanız, Firebase konsolundan Storage Rules 
          sekmesine gidip aşağıdaki kuralları uygulayın:
        </p>
        <pre className="bg-gray-800 text-white p-3 rounded mt-3 text-sm">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
}
