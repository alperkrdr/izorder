# Firebase Storage Kuralları Manuel Deploy Rehberi

## Sorun
Firebase Storage upload işlemlerinde `403 Forbidden` hatası alınıyor:
```
POST https://firebasestorage.googleapis.com/v0/b/izorder-92337.firebasestorage.app/o?name=press_coverage%2F1748174565366-2024-12-15_23-13.png 403 (Forbidden)
```

Bu hata, Storage kurallarının henüz deploy edilmemiş olmasından kaynaklanıyor.

## Çözüm 1: Firebase Console'dan Manuel Deploy

### Adım 1: Firebase Console'a Git
1. https://console.firebase.google.com/ adresine git
2. `izorder-92337` projesini seç

### Adım 2: Storage Rules'a Git  
1. Sol menüden **Storage** sekmesine tıkla
2. Üst menüden **Rules** tab'ına tıkla

### Adım 3: Kuralları Güncelle
Mevcut kuralları sil ve aşağıdaki kuralları yapıştır:

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
    
    match /board_members/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /news_images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Test klasörü için açık izinler
    match /test_uploads/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Adım 4: Publish Et
1. **Publish** butonuna tıkla
2. Onay vererek kuralları yayınla

## Çözüm 2: Firebase CLI'dan Deploy

Terminal'de şu komutları çalıştır:

```bash
# Firebase'e login ol
firebase login

# Proje seç
firebase use izorder-92337

# Storage kurallarını deploy et
firebase deploy --only storage
```

## Test Etme

Kurallar deploy edildikten sonra:

1. Admin panele git: http://localhost:3000/admin/login
2. Giriş yap
3. Basında Biz > Ekle sayfasına git: http://localhost:3000/admin/basinda-biz/ekle
4. Yeni haber ekle ve görsel yükle
5. Tarihçe sayfasına git: http://localhost:3000/admin/tarihce
6. Ana görsel veya ek görsel yükle

## Beklenen Sonuç

Upload işlemi başarılı olmalı ve şu console logları görülmeli:
```
✅ Kullanıcı oturumu doğrulandı
🔑 Auth token yenilendi  
⬆️ Dosya yükleniyor...
✅ Dosya yükleme başarılı
🔗 Download URL alındı
```

## Sorun Devam Ederse

1. **Auth State Kontrol**: `/admin/storage-debug` sayfasında auth durumunu kontrol et
2. **Browser Cache**: F12 > Application > Storage > Clear storage
3. **Logout/Login**: Admin panelden çıkış yap ve tekrar giriş yap
4. **Firewall**: Antivirus/firewall Firebase'i bloke ediyor olabilir

## Storage Rules Dosyası

Yerel dosya: `firebase-storage.rules`
Bu dosya Firebase Console'daki kurallara eş değer olmalı.
