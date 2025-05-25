# 🚀 İzorder Sitesi GitHub'da Test Etme Rehberi

## 📋 Hızlı Başlangıç

Sitenizi GitHub'da test etmek için 3 ana seçeneğiniz var:

### 1. 🔥 **Vercel (Önerilen - En Kolay)**

**Adımlar:**
1. [Vercel.com](https://vercel.com)'a gidin
2. GitHub hesabınızla giriş yapın
3. "New Project" → GitHub repository'nizi seçin
4. Environment Variables ekleyin:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyChM02saASrLICKprMcXAPMmrz4vr2vOVo
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=izorder-92337.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=izorder-92337
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=izorder-92337.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=473659217775
   NEXT_PUBLIC_FIREBASE_APP_ID=1:473659217775:web:05df9ac7cd5d3ed4a13a9a
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-C6NNYR3ZRH
   FIREBASE_PROJECT_ID=izorder-92337
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@izorder-92337.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=(Private key'i buraya ekleyin)
   FIREBASE_STORAGE_BUCKET=izorder-92337.firebasestorage.app
   ```
5. "Deploy" butonuna tıklayın

**Sonuç:** `https://izorder-your-username.vercel.app` gibi bir URL alacaksınız.

---

### 2. 🔗 **Netlify**

**Adımlar:**
1. [Netlify.com](https://netlify.com)'a gidin
2. "Sites" → "Add new site" → "Import from Git"
3. GitHub repository'nizi seçin
4. Build settings:
   ```
   Build command: npm run build
   Publish directory: out
   ```
5. Environment variables ekleyin (Vercel ile aynı)
6. Deploy butonuna tıklayın

---

### 3. 📄 **GitHub Pages (Sadece Static)**

**Otomatik kurulum için:**
```bash
# Repository'nizde bu dosyalar zaten var:
# .github/workflows/deploy-pages.yml
```

**Manual adımlar:**
1. GitHub repository'nizde "Settings" sekmesine gidin
2. Sol menüden "Pages" seçin
3. Source: "GitHub Actions" seçin
4. Secrets ekleyin (Settings → Secrets and variables → Actions):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - ... (diğer environment variables)

---

## 🛠️ Hızlı Test için Komutlar

```bash
# Bu dosyaları commit edin
git add .
git commit -m "Add deployment configuration"
git push origin main

# Lokal test
npm run dev
# Tarayıcıda http://localhost:3000

# Production build test
npm run build
npm start
# Tarayıcıda http://localhost:3000
```

---

## 🔍 Test Edilecek Özellikler

### ✅ Frontend Test Listesi:
- [ ] Ana sayfa yükleniyor
- [ ] Haberler sayfası çalışıyor
- [ ] Galeri sayfası çalışıyor
- [ ] İletişim formu çalışıyor
- [ ] Responsive design mobilde çalışıyor

### ✅ Admin Panel Test Listesi:
- [ ] Admin login çalışıyor
- [ ] Haber ekleme/düzenleme
- [ ] Resim yükleme (Firebase Storage)
- [ ] Galeri yönetimi
- [ ] Tarihçe düzenleme

---

## 🚨 Önemli Notlar

1. **Environment Variables**: Deployment platform'una mutlaka environment variables ekleyin
2. **Firebase Rules**: Storage rules'ları deploy etmeyi unutmayın
3. **Domain**: Production domain'inizde Firebase Authentication'ı authorize edin

---

## 📞 Hızlı Destek

**En Hızlı Çözüm:** Vercel kullanın
**Problem yaşarsanız:** Repository'deki issue açın

---

**🎯 Tavsiye:** Önce Vercel ile test edin, sonra production için kendi hosting'inizde kullanın.
