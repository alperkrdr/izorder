'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/utils/firebase/client';
import { signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { 
  FaHome, 
  FaNewspaper, 
  FaImages, 
  FaHistory, 
  FaUsers, 
  FaPhone, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null | undefined>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth check - direkt burada yapalım
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
        console.log("Admin panel - logged in user:", user.email);
        setAuthChecked(true);
      } else {
        setUserEmail(null);        console.log("Admin panel - no user logged in, redirecting to login");
        // Login sayfasındaysak yönlendirme yapma
        if (pathname && !pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
        setAuthChecked(true);
      }
    });
    return () => unsubscribe();
  }, [pathname]);

  // Auth check yapılmamışsa loading göster
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Login sayfasındaysak AuthMiddleware kullanma
  if (pathname && pathname.includes('/login')) {
    return <>{children}</>;
  }

  // Kullanıcı yoksa ve login sayfasında değilsek hiçbir şey gösterme
  if (!userEmail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Yönlendiriliyor...</div>
      </div>
    );
  }
  
  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FaHome },
    { name: 'Haberler', href: '/admin/haberler', icon: FaNewspaper },
    { name: 'Basında Biz', href: '/admin/basinda-biz', icon: FaNewspaper },
    { name: 'Galeri', href: '/admin/galeri', icon: FaImages },
    { name: 'Tarihçe', href: '/admin/tarihce', icon: FaHistory },
    { name: 'Yönetim Kurulu', href: '/admin/yonetim-kurulu', icon: FaUsers },
    { name: 'İletişim', href: '/admin/iletisim', icon: FaPhone },
  ];
  
  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };
    return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
          <div className="flex items-center">
            <Image src="/logo.png" alt="İzorder Logo" width={40} height={40} />
            <span className="ml-2 text-white font-medium">İzorder Admin</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <FaSignOutAlt className="mr-3 h-5 w-5" />
            Çıkış Yap
          </button>
        </div>
      </div>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <Image src="/logo.png" alt="İzorder Logo" width={40} height={40} />
              <span className="ml-2 text-white font-medium">İzorder Admin</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
              >
                <FaSignOutAlt className="mr-3 h-5 w-5" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
          >
            <FaBars size={24} />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {navigation.find(item => item.href === pathname)?.name || 'Admin Panel'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="text-sm font-medium text-gray-700">
                {userEmail ? userEmail : 'Kullanıcı girişi yapılmamış'}
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}