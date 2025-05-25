# Vercel Deployment Rehberi

Bu rehber, İzorder Next.js uygulamasını Vercel'a deploy etmek için gerekli adımları içerir.

## Ön Hazırık

### 1. Vercel CLI Kurulumu
```bash
npm i -g vercel
```

### 2. Vercel'a Giriş
```bash
vercel login
```

## Vercel Dashboard Kurulumu

### 1. Proje Oluşturma
1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi seçin (`izorder`)
4. Framework olarak "Next.js" seçildiğinden emin olun

### 2. Environment Variables Ayarlama

Vercel Dashboard'da projenizin Settings > Environment Variables bölümünde şu değişkenleri ekleyin:

#### Production Environment Variables

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` | Production |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `izorder-92337.firebaseapp.com` | Production |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `izorder-92337` | Production |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `izorder-92337.appspot.com` | Production |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123...` | Production |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123...` | Production |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-...` | Production |
| `FIREBASE_PROJECT_ID` | `izorder-92337` | Production |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-...@izorder-92337.iam.gserviceaccount.com` | Production |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | Production |
| `FIREBASE_STORAGE_BUCKET` | `izorder-92337.appspot.com` | Production |

> **Önemli:** `FIREBASE_PRIVATE_KEY` değerini eklerken `\n` karakterlerinin korunduğundan emin olun.

## Deployment Seçenekleri

### Option 1: GitHub Integration (Önerilen)
1. Vercel Dashboard'da projeyi GitHub repository'ye bağlayın
2. Her main branch'e push otomatik deploy tetikler
3. Pull request'ler için preview deployments oluşturulur

### Option 2: CLI ile Manual Deploy
```bash
# Projeyi Vercel'a deploy et
vercel --prod

# Veya build script kullan
npm run deploy:vercel
```

## Build Komutları

### Vercel için build:
```bash
npm run build:vercel
```

### GitHub Pages için build:
```bash
npm run build:github
```

## Domain Ayarları

### 1. Custom Domain (Opsiyonel)
1. Vercel Dashboard > Settings > Domains
2. Custom domain ekleyin (örn: `izorder.com`)
3. DNS kayıtlarını güncelleyin

### 2. Vercel Domain
- Otomatik oluşturulan domain: `izorder-[hash].vercel.app`
- Production domain olarak ayarlanabilir

## Vercel Özel Ayarları

### Performance Monitoring
- Vercel Analytics otomatik aktif
- Core Web Vitals tracking mevcut

### Edge Functions
- API routes otomatik edge functions olarak deploy
- Global CDN üzerinden hızlı erişim

### Preview Deployments
- Her PR için otomatik preview URL
- Değişiklikleri production'a geçmeden test etme

## Troubleshooting

### Build Hataları
```bash
# Local'de build test et
npm run build:vercel

# Vercel logs kontrol et
vercel logs
```

### Environment Variables
- Vercel Dashboard'da değişkenlerin doğru set edildiğini kontrol edin
- `FIREBASE_PRIVATE_KEY` değerinin doğru format olduğundan emin olun

### Domain Issues
- DNS propagation için 24-48 saat bekleyin
- Vercel DNS records'u domain sağlayıcısında doğru ayarlayın

## İzleme ve Maintenance

### Analytics
- Vercel Analytics dashboard'dan performans metrikleri
- Real User Monitoring (RUM) verileri

### Logs
```bash
# Function logs
vercel logs --follow

# Build logs
vercel logs --scope=builds
```

### Rollback
```bash
# Önceki deployment'a geri dön
vercel rollback
```

## Deployment Checklist

- [ ] Environment variables set edildi
- [ ] Firebase konfigürasyonu test edildi
- [ ] Build başarılı şekilde tamamlandı
- [ ] Admin panel erişimi test edildi
- [ ] Image upload işlevi test edildi
- [ ] Domain konfigürasyonu (varsa) yapıldı
- [ ] SSL sertifikası aktif
- [ ] Analytics kuruldu

## Faydalı Linkler

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
