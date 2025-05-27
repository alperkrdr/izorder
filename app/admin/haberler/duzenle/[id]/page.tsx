import NewsForm from '@/components/admin/NewsForm';
import { getNewsById } from '@/utils/firebase/dataService';
import { notFound } from 'next/navigation';

interface EditNewsPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // Static export için boş dizi döndür
  return [];
}

export async function generateMetadata({ params }: EditNewsPageProps) {
  return {
    title: 'Haber Düzenle - İzorder',
    description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Haber Düzenleme Sayfası',
  };
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = params;
  const news = await getNewsById(id);
  
  if (!news) {
    notFound();
  }
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Haber Düzenle</h1>
      <NewsForm initialData={news} isEditing={true} />
    </>
  );
}