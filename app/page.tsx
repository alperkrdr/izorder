import Image from 'next/image';
import Link from 'next/link';
import NewsSlider from '@/components/home/NewsSlider';
import AnnouncementList from '@/components/home/AnnouncementList';
import GalleryPreview from '@/components/home/GalleryPreview';
import { getLatestNews, getLatestAnnouncements, getLatestGalleryImages } from '@/lib/data';

export default async function Home() {
  // Mock data that would normally come from API or backend
  const latestNews = await getLatestNews(5);
  const announcements = await getLatestAnnouncements(3);
  const galleryImages = await getLatestGalleryImages(3);
  
  return (
    <main>
      {/* Hero Section with News Slider - Full width background */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <NewsSlider news={latestNews} />
        </div>
      </section>
      
      {/* Content Sections */}
      <div className="container-custom py-12 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements Section */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-6">Duyurular</h2>
            <AnnouncementList announcements={announcements} />
          </section>
          
          {/* Gallery Preview */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Galeri</h2>
              <Link href="/galeri" className="text-secondary hover:underline">
                Tümünü Gör &rarr;
              </Link>
            </div>
            <GalleryPreview images={galleryImages} />
          </section>
        </div>
      </div>
    </main>
  );
} 