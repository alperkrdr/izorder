# İzorder - İzmir-Ordu Kültür ve Dayanışma Derneği Web Sitesi

Bu proje, İzmir-Ordu Kültür ve Dayanışma Derneği (kısa adıyla İzorder) için geliştirilmiş resmi web sitesidir. Next.js ve Tailwind CSS kullanılarak oluşturulmuştur.

## Özellikler

- Responsive tasarım (Mobil, tablet ve desktop cihazlar için optimize edilmiştir)
- SEO uyumlu altyapı
- Haberler ve etkinlikler için içerik yönetimi
- Yönetim kurulu bilgileri
- Basında çıkan haberlerin listelenmesi
- Foto galeri
- İletişim ve üyelik başvuru formu
- Admin paneli ile içerik yönetimi

## Kullanılan Teknolojiler

- **Next.js**: React tabanlı web framework
- **TypeScript**: Tip güvenliği için
- **Tailwind CSS**: Stillendirme için
- **React Icons**: İkonlar için

## Kurulum

1. Projeyi bilgisayarınıza klonlayın:
   ```bash
   git clone https://github.com/your-username/izorder.git
   cd izorder
   ```

2. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   # veya
   yarn install
   ```

3. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   # veya
   yarn dev
   ```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek siteyi görüntüleyebilirsiniz.

## Proje Yapısı

```
izorder/
├── app/                  # Next.js app router klasörü
│   ├── admin/            # Admin panel sayfaları
│   ├── haberler/         # Haberler sayfaları
│   ├── basinda-biz/      # Basında biz sayfaları
│   ├── yonetim-kurulu/   # Yönetim kurulu sayfaları
│   ├── galeri/           # Galeri sayfaları 
│   ├── iletisim/         # İletişim sayfaları
│   └── page.tsx          # Ana sayfa
├── components/           # React bileşenleri
│   ├── admin/            # Admin panel bileşenleri
│   ├── home/             # Ana sayfa bileşenleri
│   └── layout/           # Header, Footer gibi genel bileşenler
├── lib/                  # Yardımcı fonksiyonlar ve data
├── public/               # Statik dosyalar (logo, görseller vb.)
└── types/                # TypeScript tip tanımlamaları
```

## Admin Panel

Admin paneline `/admin` URL'i üzerinden erişilebilir. Admin paneli aşağıdaki özellikleri içerir:

- Haberlerin eklenmesi, düzenlenmesi ve silinmesi
- Basın haberlerinin yönetimi
- Yönetim kurulu üyelerinin bilgilerinin düzenlenmesi
- Galeri görsellerinin yönetimi
- İletişim bilgilerinin düzenlenmesi

## Canlı Demo

(Demo adresi eklenecek)

## Lisans

Bu proje özel kullanım için geliştirilmiştir. Tüm hakları saklıdır. 