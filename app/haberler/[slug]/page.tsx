import Image from 'next/image';
import Link from 'next/link';
import { getNewsBySlug, getAllNews } from '@/lib/data';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const news = await getNewsBySlug(params.slug);
  
  if (!news) {
    return {
      title: 'Haber Bulunamadı - İzorder',
      description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği',
    };
  }
  
  return {
    title: `${news.title} - İzorder`,
    description: news.summary,
  };
}

export async function generateStaticParams() {
  const news = await getAllNews();
  return news.map((item) => ({ slug: item.slug }));
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNewsBySlug(params.slug);
  
  if (!news) {
    notFound();
  }
  
  return (
    <div className="container-custom py-8">
      <Link 
        href="/haberler" 
        className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Tüm Haberlere Dön
      </Link>
      
      <article>
        <h1 className="text-3xl font-bold text-primary mb-4">{news.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-6">
          <FaCalendarAlt className="mr-2" />
          <span>{news.date}</span>
          {news.author && (
            <span className="ml-4">Yazar: {news.author}</span>
          )}
        </div>
        
        <div className="relative w-full h-[400px] mb-6">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover rounded-lg"
            priority
          />
        </div>
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </article>
    </div>
  );
}