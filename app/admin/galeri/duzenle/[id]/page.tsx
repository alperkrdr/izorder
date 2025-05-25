import AdminLayout from '@/components/admin/AdminLayout';
import GalleryEditForm from '@/components/admin/GalleryEditForm';

interface EditGalleryPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: EditGalleryPageProps) {
  return {
    title: 'Galeri Düzenle - İzorder',
    description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Galeri Düzenleme Sayfası',
  };
}

export default async function EditGalleryImagePage({ params }: EditGalleryPageProps) {
  const { id } = params;
  
  return (
    <AdminLayout>
      <GalleryEditForm id={id} />
    </AdminLayout>
  );
}