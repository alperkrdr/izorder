import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'İzorder - İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği',
  description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği (İzorder) resmi web sitesi',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://izorder.github.io'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 