# 🚀 GitHub Pages Kurulum Rehberi (Türkçe)

## 📋 Ön Hazırlık
✅ Kod GitHub'a yüklendi  
✅ Build sorunları çözüldü  
✅ GitHub Actions workflow hazır  

## 🔧 1. GitHub Pages Ayarları

### GitHub Repository Settings:
1. **GitHub deposuna gidin**: https://github.com/alperkrdr/izorder
2. **Settings** sekmesine tıklayın
3. Sol menüden **Pages** seçin
4. **Source** olarak **GitHub Actions** seçin

## 🔑 2. Environment Variables (Çevre Değişkenleri)

### Repository Secrets Ekleyin:
1. **Settings > Secrets and variables > Actions** gidin
2. **New repository secret** tıklayın
3. Aşağıdaki değişkenleri tek tek ekleyin:

#### Firebase Public Keys (Herkese açık):
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyChM02saASrLICKprMcXAPMmrz4vr2vOVo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = izorder-92337.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = izorder-92337
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = izorder-92337.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 473659217775
NEXT_PUBLIC_FIREBASE_APP_ID = 1:473659217775:web:05df9ac7cd5d3ed4a13a9a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = G-C6NNYR3ZRH
```

#### Firebase Admin Keys (Gizli - sadece admin paneli için):
```
FIREBASE_PROJECT_ID = izorder-92337
FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@izorder-92337.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC24/eeKNoRFJRz
qpX/fH2STTU7twXarGaOi76tHGyRl7UtJJVvEZu3p80crp3ZDzFJg2TMpW4A52Cl
RrEsrx6Yg5izSXCRPBF36gtD57NN+yejxqKL4oIGqATgiTHAwcZ9pveSIB/DJKym
W13Rjb1nQsMlr+ETC0GEE0caRhqW6t1Rrj+F6Ny7ixj+jCtHz5FV1/qPM2LHjx/H
7fAxbLRMUMb3Y3E/pvHDFxvb+Cs8m8PYouPwt8KfHCefUGsBuiPfRtOZe+GPhsfR
m9wVAqrRVBVVXU4fMBz3o3Av3rUmt3JgsnLEe9sNjt8dVtkhxb17fAJU6xvVygeZ
YLHUBxYbAgMBAAECggEACXA8tFqrB6xLuFJqjkuoQVd0XVdl2Rys6ENZp55qvfLE
hLFkIt4XmVlIEmhdOLlPflnmZvyh74WsAlY3yN9lZqfinAdjZKNjIBCh3Ihwbkr9
XIw2PEjdaVGHeueppnx5mBIjVFUNvpOTHhIOBpqtgSQ8D6MC1xRCy872Nuq87uKB
PMiyYR/mtOa6Nw276mD6RpY+Iq8JtrXmiEEaxWgaIYN62lLrLkcLubfTiNdpllUb
ot3uWpq5pf9QeiscqIx+G0iva5jUKmF46/qyWfN0g5ps/1c7A+G7CHuSYeoQ3IRd
BpbeayvSpw5xgS7ijzJTA6xgAcACn9/R9Qj0t1wiqQKBgQDyaMFZWfCVW0jAa462
/KWd1ezWECIg35AZEkvbRDp3Jg7JRQx7GQhIPDjb7nuxynzn4VPGnZXp2gpJ2BaN
TDtwllzgQOoWQaG4qk72hScf+tXwrZs7u0qkfiQIQNHl9VC1BGfEBAznMAW5hsKU
1TME9uSJnvkVKYBobArm/57s2QKBgQDBJPQT0H0NxwPNv3zYQqtYl8j59qisNU5Y
QUXc4F0Tw0u9cyEx+4JXRLkKgJVU6zye74hyTEazqhBA5aWpz376jWRqfNg0ctjJ
dVD798vQV9c/zuk3DdeZr9YBwHdPpavN+nGWVplT5rzQY2UksR/+skeXVLgH6wO1
ZAqJS45SEwKBgDLvtikbUAViUBA2yZ9DyV04FXMJotI7h+DsyknBtXNR6Ot7+dpn
8SiUlvIH07ARN1vWKi9i75xa96x6noqEST0oK03n9ghFNEFEcCE263i50XioUiUj
/tQ/uTyOukxS1umiildS7o8ptRo96ecyQW06n90XLYm31cabZVMSxYdJAoGAJsNk
3Qkt3/L+N2/j/X875lboNgqkBZPZOms3O0IoTAwZClet5NsmaJ9ZR9tQnS9tBjTq
vI3EbtCF3JB6dB85y81OxvRxa+1UxvHto/QyiojmoV7EfZEgoS6iE83t5CVK2tcV
rueIdEdNw8D/DqMh2bssFRoiqSwonWILn0xzrtMCgYEArJno2A2pQVBD07FRL4em
kvDjCIIcK/hd7M2FLrzXpCKHj6yr9RTidzUSHPikeMcAH2fJtx5YgGfG4sFWEw9g
kTocTYYAz++3fvlIp4rfQaFnrJmKfxehyT6CWJ321GA+0QZX2TyGOcnm46Pwo+VF
zILWT1Mm3HmcBzGTmt3pXEw=
-----END PRIVATE KEY-----
FIREBASE_STORAGE_BUCKET = izorder-92337.firebasestorage.app
```

## 🔄 3. Deployment İşlemi

### Otomatik Deployment:
- Kod `main` branch'e her push edildiğinde otomatik deploy olacak
- GitHub Actions workflow çalışacak
- Site `https://alperkrdr.github.io/izorder/` adresinde yayınlanacak

### Manuel Deployment Tetikleme:
1. GitHub repository ana sayfasına gidin
2. **Actions** sekmesine tıklayın
3. **Deploy to GitHub Pages** workflow'unu seçin
4. **Run workflow** butonuna tıklayın

## 📱 4. Next.js Static Export Ayarı

Site zaten static export için yapılandırılmış:

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

## 🌐 5. Deployment Sonrası Kontrol

### Site URL'leri:
- **Ana Site**: https://alperkrdr.github.io/izorder/
- **Admin Panel**: https://alperkrdr.github.io/izorder/admin/login

### Kontrol Edilecekler:
- [ ] Ana sayfa yükleniyor mu?
- [ ] Navigation menüsü çalışıyor mu?
- [ ] Firebase bağlantısı kurulmuş mu?
- [ ] Resimler görünüyor mu?
- [ ] Admin panel erişilebilir mi?

## 🔧 6. Firebase Storage Rules

Firebase Storage rules'ları ayrıca manuel olarak deploy edilmeli:

```bash
# PowerShell'de çalıştırın:
.\deploy-storage-rules-manual.ps1
```

Veya Firebase Console'dan manuel olarak:
1. https://console.firebase.google.com/project/izorder-92337/storage/rules
2. `firebase-storage.rules` dosyasındaki içeriği kopyalayın
3. Firebase Console'da yapıştırın ve **Publish** tıklayın

## ⚠️ 7. Bilinen Sınırlamalar

### GitHub Pages'de Çalışmayacak Özellikler:
- Admin panel (server-side authentication gerekiyor)
- Image upload işlemleri
- Database write işlemleri

### Çalışacak Özellikler:
- Ana website
- Static sayfalar (Hakkımızda, İletişim, vb.)
- Firebase read işlemleri
- Responsive tasarım

## 📞 8. Sorun Giderme

### Deployment Başarısız Olursa:
1. GitHub Actions logs'unu kontrol edin
2. Environment variables'ların doğru tanımlandığından emin olun
3. Firebase config'in doğru olduğunu kontrol edin

### Site Açılmıyor:
1. URL'nin doğru olduğunu kontrol edin: `https://alperkrdr.github.io/izorder/`
2. Browser cache'ini temizleyin
3. Developer tools'da console error'larını kontrol edin

## ✅ Başarı Kriterleri

- [x] GitHub repository hazır
- [x] GitHub Actions workflow hazır
- [x] Build başarılı
- [ ] Repository secrets tanımlandı
- [ ] GitHub Pages aktif
- [ ] Site erişilebilir
- [ ] Firebase bağlantısı çalışıyor

---

**🎉 Deployment tamamlandıktan sonra siteniz `https://alperkrdr.github.io/izorder/` adresinde yayında olacak!**
