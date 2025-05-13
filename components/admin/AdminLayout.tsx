'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaNewspaper, 
  FaRegFileAlt, 
  FaUsers, 
  FaImages, 
  FaPhone, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaHistory
} from 'react-icons/fa';
import AuthCheck from './AuthCheck';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: FaHome },
  { name: 'Haberler', href: '/admin/haberler', icon: FaNewspaper },
  { name: 'Basında Biz', href: '/admin/basinda-biz', icon: FaRegFileAlt },
  { name: 'Yönetim Kurulu', href: '/admin/yonetim-kurulu', icon: FaUsers },
  { name: 'Galeri', href: '/admin/galeri', icon: FaImages },
  { name: 'Tarihçe', href: '/admin/tarihce', icon: FaHistory },
  { name: 'İletişim Bilgileri', href: '/admin/iletisim', icon: FaPhone },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    // Clear authentication
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('izorder_admin_auth');
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-100">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:z-auto`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className="px-4 py-6 bg-primary-dark flex items-center justify-between">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="relative w-10 h-10 bg-white rounded-full overflow-hidden">
                  <Image 
                    src="/logo.png" 
                    alt="İzorder Logo" 
                    fill 
                    className="object-contain p-1"
                  />
                </div>
                <span className="text-white font-bold">İzorder Admin</span>
              </Link>
              <button
                className="text-white md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto bg-primary">
              <ul className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition ${
                        isActive(item.href)
                          ? 'bg-primary-dark text-white'
                          : 'text-white/80 hover:bg-primary-dark/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="mr-3" size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sidebar footer */}
            <div className="px-4 py-4 bg-primary-dark">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 rounded-lg text-white/80 hover:bg-primary hover:text-white transition"
              >
                <FaSignOutAlt className="mr-3" size={18} />
                <span>Çıkış Yap</span>
              </button>
              <Link 
                href="/"
                className="flex items-center mt-2 px-4 py-2 rounded-lg text-white/80 hover:bg-primary hover:text-white transition"
              >
                <FaSignOutAlt className="mr-3" size={18} />
                <span>Siteye Dön</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <header className="bg-white shadow">
            <div className="px-4 py-4 flex justify-between items-center">
              <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <FaBars size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 md:hidden">İzorder Admin</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Admin Kullanıcı</span>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
} 