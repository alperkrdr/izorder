const { initializeApp } = require('firebase/app');
const { getStorage, ref, listAll } = require('firebase/storage');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyChM02saASrLICKprMcXAPMmrz4vr2vOVo",
  authDomain: "izorder-92337.firebaseapp.com",
  projectId: "izorder-92337",
  storageBucket: "izorder-92337.firebasestorage.app",
  messagingSenderId: "473659217775",
  appId: "1:473659217775:web:05df9ac7cd5d3ed4a13a9a"
};

async function checkFirebaseStorageBucket() {
  try {
    console.log('🔍 Firebase Storage Bucket Kontrolü...\n');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    
    console.log('✅ Firebase başlatıldı');
    console.log('📦 Storage bucket:', firebaseConfig.storageBucket);
    
    // Try to list files in root (this will fail if bucket doesn't exist)
    const storageRef = ref(storage, '');
    const result = await listAll(storageRef);
    
    console.log('✅ Storage bucket erişilebilir!');
    console.log('📁 Root dizininde', result.items.length, 'dosya bulundu');
    console.log('📂 Root dizininde', result.prefixes.length, 'klasör bulundu');
    
    if (result.items.length > 0) {
      console.log('\n📄 Bulunan dosyalar:');
      result.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.name}`);
      });
    }
    
    if (result.prefixes.length > 0) {
      console.log('\n📂 Bulunan klasörler:');
      result.prefixes.forEach((folder, index) => {
        console.log(`  ${index + 1}. ${folder.name}/`);
      });
    }
    
    console.log('\n🎉 Firebase Storage düzgün çalışıyor!');
    
  } catch (error) {
    console.error('❌ Firebase Storage Hatası:', error);
    
    if (error.code === 'storage/bucket-not-found' || error.message.includes('does not exist')) {
      console.error('\n🚨 SORUN: Firebase Storage bucket mevcut değil!');
      console.error('\n📋 Çözüm adımları:');
      console.error('1. https://console.firebase.google.com/ adresine gidin');
      console.error('2. "izorder-92337" projesini seçin');
      console.error('3. Sol menüden "Storage" seçeneğini tıklayın');
      console.error('4. "Get started" butonuna tıklayın');
      console.error('5. Security rules için "Start in test mode" seçin (geçici olarak)');
      console.error('6. Storage konumu seçin (önerilen: europe-west1)');
      console.error('7. "Done" butonuna tıklayın');
      console.error('\n🔧 Storage etkinleştirildikten sonra tekrar test edin.');
    } else if (error.code === 'storage/unauthorized') {
      console.error('\n🚨 SORUN: Storage erişim yetkisi yok!');
      console.error('Storage bucket var ama erişim kuralları çok kısıtlayıcı olabilir.');
    } else {
      console.error('\n💡 Diğer olası nedenler:');
      console.error('- İnternet bağlantısı sorunu');
      console.error('- Firebase proje yapılandırması hatası');
      console.error('- API anahtarı geçersiz');
    }
    
    process.exit(1);
  }
}

console.log('🧪 Firebase Storage Bucket Test Aracı');
console.log('=====================================\n');

checkFirebaseStorageBucket();
