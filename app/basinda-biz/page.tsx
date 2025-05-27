import Image from 'next/image';
import Link from 'next/link';
import { getPressCoverage } from '@/lib/data';

export const metadata = {
  title: 'Basında Biz - İzorder',
  description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği basın haberleri',
};

export const dynamic = "force-dynamic";

export default async function PressCoveragePage() {
  const pressCoverage = await getPressCoverage();
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Basında Biz</h1>
      
      <div className="space-y-8">
        {pressCoverage.map((item) => (
          <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative h-60 md:h-auto">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 mr-3">{item.date}</span>
                  <span className="px-3 py-1 rounded-full text-xs bg-secondary text-white">
                    {item.source}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-primary mb-3">{item.title}</h2>
                <p className="text-gray-700 mb-4">{item.summary}</p>
                {item.externalUrl ? (
                  <a 
                    href={item.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                  >
                    Haberi Görüntüle
                  </a>
                ) : (
                  <Link 
                    href={`/basinda-biz/${item.slug}`}
                    className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                  >
                    Devamını Oku
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}