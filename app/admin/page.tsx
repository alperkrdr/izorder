import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentActivities from '@/components/admin/RecentActivities';
import { getDashboardData } from '@/lib/data';

export const metadata = {
  title: 'Yönetim Paneli - İzorder',
  description: 'İzmir-Ordu Kültür ve Dayanışma Derneği Yönetim Paneli',
};

export default async function AdminDashboard() {
  const dashboardData = await getDashboardData();
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Yönetim Paneli</h1>
      
      <DashboardStats stats={dashboardData.stats} />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Son Aktiviteler</h2>
        <RecentActivities activities={dashboardData.recentActivities} />
      </div>
    </AdminLayout>
  );
} 