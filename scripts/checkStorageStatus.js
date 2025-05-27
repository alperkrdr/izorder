const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Firebase Admin SDK'yı başlat
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

async function checkAndCreateStorage() {
  try {
    console.log('Firebase Admin SDK ile Storage kontrolü...');
    
    const bucket = admin.storage().bucket();
    
    console.log('Bucket bilgileri:', {
      name: bucket.name,
      id: bucket.id
    });
    
    // Bucket'ın var olup olmadığını kontrol et
    const [exists] = await bucket.exists();
    
    if (exists) {
      console.log('✅ Storage bucket başarıyla bulundu:', bucket.name);
      
      // Dosyaları listele
      const [files] = await bucket.getFiles({ maxResults: 5 });
      console.log(`📁 Bucket'ta ${files.length} dosya bulundu`);
      
      // CORS ayarlarını kontrol et
      try {
        const [metadata] = await bucket.getMetadata();
        console.log('🔧 Bucket metadata:', {
          cors: metadata.cors || 'CORS ayarları yok',
          location: metadata.location
        });
      } catch (corsError) {
        console.log('⚠️ CORS ayarları okunamadı:', corsError.message);
      }
      
    } else {
      console.log('❌ Storage bucket bulunamadı. Firebase Console\'dan Storage\'ı etkinleştirin.');
      console.log('📋 Yapılması gerekenler:');
      console.log('1. https://console.firebase.google.com/project/izorder-92337/storage adresine gidin');
      console.log('2. "Get started" butonuna tıklayın');
      console.log('3. Production mode\'u seçin');
      console.log('4. Lokasyon olarak "europe-west1" seçin');
    }
    
  } catch (error) {
    console.error('❌ Storage kontrolü başarısız:', error.message);
    
    if (error.code === 5) {
      console.log('📋 Firebase Storage henüz etkinleştirilmemiş.');
      console.log('https://console.firebase.google.com/project/izorder-92337/storage adresine gidin ve Storage\'ı etkinleştirin.');
    }
  }
}

checkAndCreateStorage();
