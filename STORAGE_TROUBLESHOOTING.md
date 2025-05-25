# Firebase Storage "Unauthorized" Hatası Çözüm Rehberi

## Sorun
`Firebase Storage: User does not have permission to access 'press_coverage/xxxxx.png'. (storage/unauthorized)` hatası alınıyor.

## Ana Nedenler
1. **Firebase Storage Rules**: Storage kuralları kullanıcı authentication'ını gerektiriyor ama auth state doğru aktarılmıyor
2. **Auth State**: Firebase Auth state ile Storage operations arasında senkronizasyon sorunu  
3. **Permission Configuration**: Storage bucket izinleri yanlış yapılandırılmış

## Çözüm Adımları

### 1. Firebase Console'dan Storage Rules Güncelle
1. https://console.firebase.google.com/project/izorder-92337/storage/rules adresine git
2. Aşağıdaki kuralları kopyala ve yapıştır:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Genel okuma izni, yazma için authentication gerekli
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Admin yükleme klasörleri için özel kurallar
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
  }
}
```

3. "Publish" butonuna tıkla

### 2. Auth State Kontrol Et
Admin panele giriş yaptıktan sonra:
1. `/admin/storage-debug` sayfasına git
2. "Storage Testlerini Çalıştır" butonuna tıkla
3. Test sonuçlarını kontrol et

### 3. Auth Token Yenile
Eğer auth problemi varsa:
1. Admin panelden logout yap
2. Tekrar login yap
3. Upload işlemini tekrar dene

### 4. Browser Cache Temizle
1. F12 Developer Tools aç
2. Network tab'inde "Disable cache" işaretle
3. Sayfayı yenile (Ctrl+F5)

### 5. Firebase Project Settings Kontrol
1. Firebase Console > Project Settings > General
2. Storage bucket URL'in doğru olduğunu kontrol et: `izorder-92337.firebasestorage.app`
3. Project ID: `izorder-92337`

## Test Adımları
1. Admin panele giriş yap: `http://localhost:3000/admin/login`
2. Tarihçe sayfasına git: `http://localhost:3000/admin/tarihce`
3. Ana görsel yükle
4. Basında Biz sayfasına git: `http://localhost:3000/admin/basinda-biz/ekle`
5. Yeni haber ekle ve görsel yükle

## Sorun Devam Ederse
1. Firebase Console'dan Authentication > Users sekmesini kontrol et
2. Admin kullanıcının mevcut olduğunu doğrula
3. Storage > Usage sekmesinden bucket'ın aktif olduğunu kontrol et

## Debug Komutları
```bash
# Firebase login durumunu kontrol et
npx firebase login --reauth

# Kuralları tekrar deploy et
npx firebase deploy --only storage

# Storage bucket erişimini test et
node scripts/check-storage-bucket.js
```
