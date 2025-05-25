import { Metadata } from 'next';

// Sayfa dinamik olarak çalışmalı
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'İzorder Yönetim Paneli Giriş',
  description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği Yönetim Paneli Giriş',
};

// Basitleştirilmiş login layout
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hiçbir koşul kontrol etmeden sadece çocuk bileşenleri render et
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}