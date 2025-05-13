import Image from 'next/image';
import Link from 'next/link';
import { getPressCoverageBySlug, getPressCoverage } from '@/lib/data';
import { FaArrowLeft, FaCalendarAlt, FaNewspaper } from 'react-icons/fa';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const pressCoverage = await getPressCoverageBySlug(params.slug);
  
  if (!pressCoverage) {
    return {
      title: 'Basın Haberi Bulunamadı - İzorder',
      description: 'İzmir-Ordu Kültür ve Dayanışma Derneği',
    };
  }
  
  return {
    title: `${pressCoverage.title} - İzorder`,
    description: pressCoverage.summary,
  };
}

export async function generateStaticParams() {
  const pressCoverage = await getPressCoverage();
  // Only for internal articles (no external URL)
  return pressCoverage
    .filter(item => !item.externalUrl)
    .map(item => ({ slug: item.slug }));
}

export default async function PressCoverageDetailPage({ params }: { params: { slug: string } }) {
  const pressCoverage = await getPressCoverageBySlug(params.slug);
  
  if (!pressCoverage) {
    notFound();
  }
  
  // If there's an external URL, redirect to the original source
  if (pressCoverage.externalUrl) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-gray-600 mb-6">Bu basın haberi harici bir kaynakta yer almaktadır.</p>
        <a 
          href={pressCoverage.externalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        >
          Haberi Kaynağında Görüntüle
        </a>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <Link 
        href="/basinda-biz" 
        className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Tüm Basın Haberlerine Dön
      </Link>
      
      <article>
        <h1 className="text-3xl font-bold text-primary mb-4">{pressCoverage.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-6">
          <FaCalendarAlt className="mr-2" />
          <span>{pressCoverage.date}</span>
          <div className="flex items-center ml-6">
            <FaNewspaper className="mr-2" />
            <span>{pressCoverage.source}</span>
          </div>
        </div>
        
        <div className="relative w-full h-[400px] mb-6">
          <Image
            src={pressCoverage.imageUrl}
            alt={pressCoverage.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover rounded-lg"
            priority
          />
        </div>
        
        {pressCoverage.content ? (
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: pressCoverage.content }}
          />
        ) : (
          <div className="prose prose-lg max-w-none">
            <p>{pressCoverage.summary}</p>
          </div>
        )}
      </article>
    </div>
  );
} 