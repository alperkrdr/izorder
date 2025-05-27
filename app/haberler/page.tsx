import Image from 'next/image';
import Link from 'next/link';
import { getAllNews } from '@/lib/data';

export const metadata = {
  title: 'Haberler - İzorder',
  description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği Haberleri',
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getAllNews();
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Haberler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-2">{item.date}</p>
              <h2 className="text-xl font-semibold text-primary mb-2">{item.title}</h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{item.summary}</p>
              <Link 
                href={`/haberler/${item.slug}`}
                className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
              >
                Devamını Oku
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}