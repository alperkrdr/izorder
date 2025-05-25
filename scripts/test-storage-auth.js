// Test Firebase Storage authentication and permissions
const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword,
  onAuthStateChanged 
} = require('firebase/auth');
const { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject 
} = require('firebase/storage');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDNR1FWOuqnD0_P5nH-K5cS13wqllHJoKQ",
  authDomain: "izorder-92337.firebaseapp.com",
  projectId: "izorder-92337",
  storageBucket: "izorder-92337.firebasestorage.app",
  messagingSenderId: "431427942468",
  appId: "1:431427942468:web:4b1938ea8aba8dc1b43b3b"
};

// Test data
const TEST_EMAIL = "admin@izorder.com"; // Replace with actual admin email
const TEST_PASSWORD = "admin123456"; // Replace with actual admin password

async function testStorageAuth() {
  try {
    console.log('🔧 Firebase Storage Auth Testi Başlıyor...\n');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    console.log('✅ Firebase uygulaması başlatıldı');
    console.log('📦 Storage bucket:', storage.app.options.storageBucket);
    
    // Test 1: Check auth state
    console.log('\n📝 Test 1: Auth State Kontrolü');
    const currentUser = auth.currentUser;
    console.log('🔑 Mevcut kullanıcı:', currentUser ? currentUser.email : 'Yok');
    
    // Test 2: Sign in if not authenticated
    if (!currentUser) {
      console.log('\n📝 Test 2: Admin Girişi');
      try {
        const userCredential = await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
        console.log('✅ Admin girişi başarılı:', userCredential.user.email);
        console.log('🔑 UID:', userCredential.user.uid);
        console.log('✉️ Email doğrulandı:', userCredential.user.emailVerified);
      } catch (authError) {
        console.error('❌ Admin girişi başarısız:', authError.message);
        console.log('⚠️ Lütfen TEST_EMAIL ve TEST_PASSWORD değerlerini güncelleyin');
        return;
      }
    }
    
    // Test 3: Create test file
    console.log('\n📝 Test 3: Test Dosyası Oluşturma');
    const testData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header
    const testBlob = new Blob([testData], { type: 'image/png' });
    const testFile = new File([testBlob], 'test-upload.png', { type: 'image/png' });
    console.log('✅ Test dosyası oluşturuldu:', testFile.name, '/', testFile.size, 'bytes');
    
    // Test 4: Upload to different folders
    const testFolders = [
      'press_coverage',
      'history_images', 
      'gallery_images',
      'board_members'
    ];
    
    const uploadResults = [];
    
    for (const folder of testFolders) {
      console.log(`\n📝 Test 4.${testFolders.indexOf(folder) + 1}: ${folder} Klasörüne Yükleme`);
      
      try {
        // Get current user token
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Kullanıcı oturumu bulunamadı');
        }
        
        const token = await user.getIdToken(true);
        console.log('🔑 Auth token alındı:', token.substring(0, 20) + '...');
        
        // Upload file
        const fileName = `test-${Date.now()}.png`;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        
        console.log('⬆️ Dosya yükleniyor:', storageRef.fullPath);
        const uploadResult = await uploadBytes(storageRef, testFile);
        console.log('✅ Yükleme başarılı');
        
        // Get download URL
        const downloadURL = await getDownloadURL(uploadResult.ref);
        console.log('🔗 Download URL alındı:', downloadURL.substring(0, 50) + '...');
        
        uploadResults.push({
          folder,
          fileName,
          storageRef,
          downloadURL,
          success: true
        });
        
      } catch (uploadError) {
        console.error(`❌ ${folder} yükleme hatası:`, uploadError.message);
        uploadResults.push({
          folder,
          success: false,
          error: uploadError.message
        });
      }
    }
    
    // Test 5: Clean up - Delete test files
    console.log('\n📝 Test 5: Test Dosyalarını Temizleme');
    for (const result of uploadResults) {
      if (result.success && result.storageRef) {
        try {
          await deleteObject(result.storageRef);
          console.log(`✅ ${result.folder}/${result.fileName} silindi`);
        } catch (deleteError) {
          console.error(`❌ ${result.folder}/${result.fileName} silinemedi:`, deleteError.message);
        }
      }
    }
    
    // Test Results Summary
    console.log('\n📊 TEST SONUÇLARI');
    console.log('='.repeat(50));
    
    const successCount = uploadResults.filter(r => r.success).length;
    const totalCount = uploadResults.length;
    
    console.log(`✅ Başarılı: ${successCount}/${totalCount}`);
    console.log(`❌ Başarısız: ${totalCount - successCount}/${totalCount}`);
    
    if (successCount === totalCount) {
      console.log('\n🎉 TÜM TESTLER BAŞARILI!');
      console.log('✅ Firebase Storage authentication çalışıyor');
      console.log('✅ Tüm klasörlere yazma izni var');
      console.log('✅ Upload ve delete işlemleri çalışıyor');
    } else {
      console.log('\n⚠️ BAZI TESTLER BAŞARISIZ');
      console.log('🔧 Kontrol edilmesi gerekenler:');
      console.log('   - Firebase Storage rules deploy edildi mi?');
      console.log('   - Admin kullanıcı yetkisi var mı?');
      console.log('   - Internet bağlantısı stabil mi?');
    }
    
    uploadResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${result.folder}: ${result.success ? 'OK' : result.error}`);
    });
    
  } catch (error) {
    console.error('\n💥 Test sırasında kritik hata:', error);
    console.log('🔧 Kontrol edilmesi gerekenler:');
    console.log('   - Firebase config doğru mu?');
    console.log('   - Internet bağlantısı var mı?');
    console.log('   - Firebase projesine erişim var mı?');
  }
}

// Run the test
testStorageAuth().then(() => {
  console.log('\n🏁 Test tamamlandı');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test başlatılamadı:', error);
  process.exit(1);
});
