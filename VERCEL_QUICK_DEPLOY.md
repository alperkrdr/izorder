# Vercel Hızlı Deploy Rehberi

## ✅ Tamamlanan Hazırlıklar

- ✅ Next.js konfigürasyonu Vercel için optimize edildi
- ✅ vercel.json konfigürasyonu güncellendi  
- ✅ Package.json script'leri eklendi
- ✅ Build başarıyla test edildi
- ✅ API routes Vercel uyumlu hale getirildi

## 🚀 Deploy Adımları

### Yöntem 1: GitHub Integration (Önerilen)

1. **GitHub'a Push Et:**
   ```powershell
   git add .
   git commit -m "Vercel deployment configuration"
   git push origin main
   ```

2. **Vercel Dashboard:**
   - [vercel.com](https://vercel.com) giriş yap
   - "New Project" → GitHub repository'yi seç
   - Framework: Next.js (otomatik tespit)
   - Deploy'a tıkla

3. **Environment Variables:**
   Vercel Dashboard > Settings > Environment Variables'a şu değerleri ekle:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBOYmJH8tKQF9X...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=izorder-92337.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=izorder-92337
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=izorder-92337.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
   FIREBASE_PROJECT_ID=izorder-92337
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@izorder-92337.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   FIREBASE_STORAGE_BUCKET=izorder-92337.appspot.com
   ```

### Yöntem 2: Vercel CLI

1. **Vercel CLI Kur:**
   ```powershell
   npm install -g vercel
   ```

2. **Login:**
   ```powershell
   vercel login
   ```

3. **Deploy:**
   ```powershell
   vercel --prod
   ```

## 🔧 Önemli Notlar

### Environment Variables
- `FIREBASE_PRIVATE_KEY` değerini kopyalarken `\n` karakterlerini koruyun
- Vercel Dashboard'da "Production" environment'ı seçin
- Tüm secrets güvenli şekilde Vercel'da saklanacak

### Domain
- Otomatik Vercel domain: `izorder-[hash].vercel.app`
- Custom domain eklenebilir: `izorder.com`

### Performance
- Vercel global CDN kullanır
- API routes edge functions olarak çalışır
- Otomatik SSL sertifikası

## 🧪 Test Checklist

Deploy sonrası test edilecek özellikler:

- [ ] Ana sayfa yükleniyor
- [ ] Admin panel giriş çalışıyor  
- [ ] Resim upload çalışıyor
- [ ] Firebase bağlantısı aktif
- [ ] Tüm sayfalar erişilebilir
- [ ] Mobile responsive

## 🐛 Sorun Giderme

### Build Hataları
```powershell
# Local build test
npm run build:vercel

# Vercel logs
vercel logs
```

### Environment Variables
- Vercel Dashboard'da değişkenlerin set olduğunu kontrol edin
- Firebase console'da service account key'in aktif olduğunu kontrol edin

## 📊 Monitoring

- Vercel Analytics: Otomatik aktif
- Function logs: `vercel logs --follow`
- Performance metrics: Vercel Dashboard

## 🔄 Güncelleme

Her GitHub push otomatik deploy tetikler:
```powershell
git add .
git commit -m "Update message"
git push origin main
```

## 📝 Yararlı Komutlar

```powershell
# Vercel status
vercel

# Logs görüntüle
vercel logs

# Önceki versiyona dön
vercel rollback

# Preview URL oluştur
vercel

# Production deploy
vercel --prod
```

## 🌐 URL'ler

- **Production:** https://izorder-[hash].vercel.app
- **Preview:** Her PR için otomatik URL
- **Dashboard:** https://vercel.com/dashboard
