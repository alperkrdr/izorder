'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthCheckProps {
  children: React.ReactNode;
}

// 5 dakika için milisaniye
const SESSION_TIMEOUT = 5 * 60 * 1000;

export default function AuthCheck({ children }: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the admin is authenticated
    const authToken = sessionStorage.getItem('izorder_admin_auth');
    const lastActivity = sessionStorage.getItem('izorder_last_activity');
    
    const now = Date.now();
    let isSessionValid = false;

    if (authToken === 'true' && lastActivity) {
      const timeSinceLastActivity = now - parseInt(lastActivity, 10);
      isSessionValid = timeSinceLastActivity < SESSION_TIMEOUT;
    }
    
    if (!authToken || !isSessionValid) {
      // Oturumu temizle ve login sayfasına yönlendir
      sessionStorage.removeItem('izorder_admin_auth');
      sessionStorage.removeItem('izorder_last_activity');
      router.push('/admin/login');
    } else {
      // Oturum geçerli, aktivite zamanını güncelle
      sessionStorage.setItem('izorder_last_activity', now.toString());
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);

    // Aktivite dinleyicilerini ekle
    const updateLastActivity = () => {
      sessionStorage.setItem('izorder_last_activity', Date.now().toString());
    };

    // Kullanıcı etkileşimlerini dinle
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('keypress', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);
    window.addEventListener('mousemove', updateLastActivity);

    // Düzenli kontrol için zamanlayıcı
    const checkInterval = setInterval(() => {
      const lastActivity = sessionStorage.getItem('izorder_last_activity');
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        
        if (timeSinceLastActivity >= SESSION_TIMEOUT) {
          // Oturum süresi doldu
          sessionStorage.removeItem('izorder_admin_auth');
          sessionStorage.removeItem('izorder_last_activity');
          router.push('/admin/login');
          clearInterval(checkInterval);
        }
      }
    }, 60000); // Her dakika kontrol et

    return () => {
      // Temizleme işlemleri
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('keypress', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
      window.removeEventListener('mousemove', updateLastActivity);
      clearInterval(checkInterval);
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
} 