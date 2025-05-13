import AdminLayout from '@/components/admin/AdminLayout';
import NewsTable from '@/components/admin/NewsTable';
import { getAllNews } from '@/lib/data';
import Link from 'next/link';

export const metadata = {
  title: 'Haber Yönetimi - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Haber Yönetimi',
};

export default async function NewsManagement() {
  const news = await getAllNews();
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Haber Yönetimi</h1>
        <Link
          href="/admin/haberler/ekle"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Yeni Haber Ekle
        </Link>
      </div>
      
      <NewsTable news={news} />
    </AdminLayout>
  );
} 