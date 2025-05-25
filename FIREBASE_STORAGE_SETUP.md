# 🔥 Firebase Storage Etkinleştirme Rehberi

## ❌ Hata: "The specified bucket does not exist"

Bu hata Firebase Storage'ın henüz etkinleştirilmediğini gösterir.

## ✅ Çözüm Adımları

### 1. Firebase Console'a Giriş
- [Firebase Console](https://console.firebase.google.com/) adresine gidin
- Google hesabınızla giriş yapın

### 2. Proje Seçimi
- **izorder-92337** projesini seçin
- Proje dashboard'una gireceksiniz

### 3. Storage'ı Etkinleştirme
1. Sol menüden **"Storage"** seçeneğini tıklayın
2. **"Get started"** veya **"Başla"** butonuna tıklayın
3. Storage security rules için seçim yapın:
   - **🔧 Geliştirme İçin (Önerilen)**: "Start in test mode" 
   - **🔒 Üretim İçin**: "Start in production mode"

### 4. Storage Konumu Seçimi
- **Önerilen konum**: `europe-west1` (Avrupa - Belçika)
- **Alternatif**: `us-central1` (ABD - Iowa)
- **Önemli**: Konum bir kez seçildikten sonra değiştirilemez!

### 5. Tamamlama
- **"Done"** veya **"Bitti"** butonuna tıklayın
- Storage bucket oluşturulacak

## 🔒 Güvenlik Kuralları (Önemli!)

Storage etkinleştirildikten sonra güvenlik kurallarını ayarlayın:

### Test Mode (Geçici - 30 gün)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.time < timestamp.date(2025, 7, 1);
    }
  }
}
```

### Production Mode (Kalıcı - Sadece Authenticated Users)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🧪 Test Etme

Storage etkinleştirildikten sonra test edin:

```powershell
# Terminal'de çalıştırın:
cd c:\Users\Alpay\Desktop\izorder
node scripts/check-storage-bucket.js
```

## 🚀 Uygulama Testi

1. **Development server'ı başlatın:**
   ```powershell
   npm run dev
   ```

2. **Storage test sayfasına gidin:**
   ```
   http://localhost:3000/admin/storage-test
   ```

3. **Dosya yükleme testi yapın**

## ⚠️ Yaygın Sorunlar

### Bucket oluşturulmadı
- Firebase Console'da Storage menüsünde "Get started" butonuna tıklamayı unutmayın

### Wrong bucket name
- Bucket adı: `izorder-92337.appspot.com` olmalı
- .env.local dosyasında doğru yazıldığından emin olun

### Security rules çok kısıtlayıcı
- Geliştirme aşamasında "test mode" kullanın
- Production'da sadece authenticated users'a izin verin

## 🔄 Storage Etkinleştirme Sonrası

Storage etkinleştirildikten sonra:

1. ✅ Bucket otomatik oluşturulur
2. ✅ Upload işlemleri çalışmaya başlar  
3. ✅ "bucket does not exist" hatası çözülür
4. ✅ Admin panel görsel yüklemeleri çalışır

## 📞 Yardım

Eğer sorun devam ederse:
- Firebase Console'da Storage menüsünün aktif olduğunu kontrol edin
- Bucket adının doğru olduğunu kontrol edin  
- İnternet bağlantınızı kontrol edin
- Bu rehberdeki adımları tekrar takip edin
