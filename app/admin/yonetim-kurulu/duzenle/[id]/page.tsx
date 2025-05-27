import BoardMemberEditForm from '@/components/admin/BoardMemberEditForm';

interface EditBoardMemberPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  // Static export için boş dizi döndür
  return [];
}

export async function generateMetadata({ params }: EditBoardMemberPageProps) {
  return {
    title: 'Yönetim Kurulu Düzenle - İzorder',
    description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Yönetim Kurulu Düzenleme Sayfası',
  };
}

export default async function EditBoardMemberPage({ params }: EditBoardMemberPageProps) {
  const { id } = params;
  return <BoardMemberEditForm id={id} />;
}