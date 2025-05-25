const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase Admin SDK'yi başlat
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'izorder-92337.firebasestorage.app'
});

async function deployStorageRules() {
  try {
    console.log('🔧 Firebase Storage kuralları güncelleniyor...');
    
    // Storage kurallarını oku
    const rulesPath = path.join(__dirname, '..', 'firebase-storage.rules');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');
    
    console.log('📝 Mevcut kurallar:');
    console.log(rulesContent);
    
    // Storage yönetim API'si kullanarak kuralları güncelle
    const bucket = admin.storage().bucket();
    
    console.log('📦 Storage bucket:', bucket.name);
    console.log('✅ Kurallar okundu, manuel deploy gerekli.');
    console.log('🚀 Firebase konsolundan Storage Rules sekmesinde kuralları güncelleyin:');
    console.log('https://console.firebase.google.com/project/izorder-92337/storage/rules');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

deployStorageRules();
