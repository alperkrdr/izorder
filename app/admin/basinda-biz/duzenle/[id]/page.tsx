import AdminLayout from '@/components/admin/AdminLayout';
import PressCoverageEditForm from '@/components/admin/PressCoverageEditForm';

interface EditPressCoveragePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // Static export için boş dizi döndür
  return [];
}

export async function generateMetadata({ params }: EditPressCoveragePageProps) {
  return {
    title: 'Basın Haberi Düzenle - İzorder',
    description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Basın Haberi Düzenleme Sayfası',
  };
}

export default async function EditPressCoveragePage({ params }: EditPressCoveragePageProps) {
  const { id } = params;
  
  return (
    <AdminLayout>
      <PressCoverageEditForm id={id} />
    </AdminLayout>
  );
}