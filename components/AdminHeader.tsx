'use client';

import Link from 'next/link';
import { 
  FaBars, 
  FaSignOutAlt, 
  FaHome, 
  FaNewspaper, 
  FaRegFileAlt,
  FaUsers, 
  FaImages, 
  FaHistory, 
  FaPhone,
  FaCog,
  FaDatabase
} from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();
  const pathname = usePathname();

  // Ana menü öğeleri
  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: FaHome },
    { name: 'Haberler', href: '/admin/haberler', icon: FaNewspaper },
    { name: 'Basında Biz', href: '/admin/basinda-biz', icon: FaRegFileAlt },
    { name: 'Yönetim Kurulu', href: '/admin/yonetim-kurulu', icon: FaUsers },
    { name: 'Galeri', href: '/admin/galeri', icon: FaImages },
    { name: 'Tarihçe', href: '/admin/tarihce', icon: FaHistory },
    { name: 'İletişim', href: '/admin/iletisim', icon: FaPhone },
  ];

  // Sistem ayarları menü öğeleri
  const settingsItems = [
    { name: 'Storage Test', href: '/admin/storage-test', icon: FaDatabase },
  ];

  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Çıkış işlemi
  const handleLogout = async () => {
    try {
      // Firebase ile çıkış yap
      await signOut();
      // Login sayfasına yönlendir - admin/login yerine login sayfasına
      router.push('/login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Aktif menü elemanını belirlemek için
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xl font-bold">
              İzorder Admin
            </Link>
          </div>          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${
                  isActive(item.href)
                    ? 'text-white font-medium'
                    : 'text-white/85 hover:text-white'
                } transition`}
              >
                <item.icon className="mr-1" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center text-white/85 hover:text-white transition"
              >
                <FaCog className="mr-1" />
                <span>Ayarlar</span>
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {settingsItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        <item.icon className="mr-2" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center text-white/85 hover:text-white transition"
            >
              <FaSignOutAlt className="mr-1" />
              <span>Çıkış</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2 pb-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${
                  isActive(item.href)
                    ? 'text-white font-medium'
                    : 'text-white/85 hover:text-white'
                } transition px-3 py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="mr-2" />
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center text-white/85 hover:text-white transition px-3 py-2 w-full text-left"
            >
              <FaSignOutAlt className="mr-2" />
              <span>Çıkış</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}