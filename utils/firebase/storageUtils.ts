// Firebase Storage yardımcı fonksiyonları ve error handling
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, storage } from '@/utils/firebase/client';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  storageRef?: string;
}

export async function uploadImageWithAuth(
  file: File, 
  path: string, 
  fileName?: string
): Promise<UploadResult> {
  try {
    console.log('🔧 Upload işlemi başlıyor...', { path, fileName: fileName || file.name });
    
    // 1. Auth kontrolü
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('❌ Auth hatası: Kullanıcı oturumu açık değil');
      return {
        success: false,
        error: 'Oturum açmanız gerekiyor. Lütfen çıkış yapıp tekrar giriş yapın.'
      };
    }
    
    console.log('✅ Kullanıcı oturumu doğrulandı:', {
      uid: currentUser.uid,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified
    });
    
    // 2. Dosya validasyonu
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Sadece görsel dosyaları yükleyebilirsiniz.'
      };
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return {
        success: false,
        error: 'Dosya boyutu 5MB\'dan küçük olmalıdır.'
      };
    }
    
    // 3. Storage referansı oluştur
    const finalFileName = fileName || `${Date.now()}-${file.name}`;
    const storageRefPath = `${path}/${finalFileName}`;
    const storageRef = ref(storage, storageRefPath);
    
    console.log('📦 Storage referansı oluşturuldu:', storageRefPath);
    
    // 4. Auth token'ı yenile (optional ama sorun çözücü olabilir)
    try {
      const token = await currentUser.getIdToken(true); // Force refresh
      console.log('🔑 Auth token yenilendi');
    } catch (tokenError) {
      console.warn('⚠️ Token yenileme hatası (devam ediliyor):', tokenError);
    }
    
    // 5. Dosyayı yükle
    console.log('⬆️ Dosya yükleniyor...');
    const uploadResult = await uploadBytes(storageRef, file);
    console.log('✅ Dosya yükleme başarılı');
    
    // 6. Download URL al
    console.log('🔗 Download URL alınıyor...');
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('✅ Download URL alındı:', downloadURL.substring(0, 50) + '...');
    
    return {
      success: true,
      url: downloadURL,
      storageRef: storageRefPath
    };
      } catch (error: any) {
    console.error('❌ Upload hatası:', error);
    
    // Error code'a göre özel mesajlar
    let errorMessage = 'Dosya yüklenirken bir hata oluştu.';
    
    if (error.code === 'storage/unauthorized') {
      errorMessage = `🚨 FIREBASE STORAGE RULES DEPLOY EDİLMEMİŞ!
      
Firebase Storage kuralları henüz deploy edilmemiş. Çözüm:

1. Firebase Console'a git: https://console.firebase.google.com/project/izorder-92337/storage/rules
2. Aşağıdaki kuralları yapıştır ve Publish et:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /press_coverage/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /history_images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /gallery_images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /board_members/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /news_images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

3. Sayfayı yenile ve tekrar dene
        
Alternatif: Terminal'de 'firebase deploy --only storage' komutunu çalıştır
        
Teknik detay: ${error.message}`;
    } else if (error.code === 'storage/canceled') {
      errorMessage = 'Dosya yükleme işlemi iptal edildi.';
    } else if (error.code === 'storage/unknown') {
      errorMessage = `Bilinmeyen storage hatası. Lütfen internet bağlantınızı kontrol edin.
        Teknik detay: ${error.message}`;
    } else if (error.code) {
      errorMessage = `Storage hatası (${error.code}): ${error.message}`;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

export async function deleteImageWithAuth(storageRefPath: string): Promise<boolean> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('❌ Delete auth hatası: Kullanıcı oturumu açık değil');
      return false;
    }
    
    const { deleteObject } = await import('firebase/storage');
    const storageRef = ref(storage, storageRefPath);
    await deleteObject(storageRef);
    
    console.log('✅ Dosya silme başarılı:', storageRefPath);
    return true;
  } catch (error: any) {
    console.error('❌ Dosya silme hatası:', error);
    return false;
  }
}
