'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firebase/client';

interface AuthCheckProps {
  children: React.ReactNode;
}

// 10 dakika için milisaniye - otomatik oturum sonu
const SESSION_TIMEOUT = 10 * 60 * 1000;

export default function AuthCheck({ children }: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Firebase Auth state değişikliklerini dinle
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Firebase Auth state changed:', currentUser?.email);
      
      if (currentUser) {
        // Kullanıcı giriş yapmış
        setUser(currentUser);
        setIsAuthenticated(true);
        
        // SessionStorage'a backup olarak kaydet
        sessionStorage.setItem('izorder_admin_auth', 'true');
        sessionStorage.setItem('izorder_last_activity', Date.now().toString());
        
        console.log('User authenticated:', {
          uid: currentUser.uid,
          email: currentUser.email,
          emailVerified: currentUser.emailVerified
        });
      } else {
        // Kullanıcı giriş yapmamış
        setUser(null);
        setIsAuthenticated(false);
        
        // SessionStorage'ı temizle
        sessionStorage.removeItem('izorder_admin_auth');
        sessionStorage.removeItem('izorder_last_activity');
        
        console.log('User not authenticated, redirecting to login');
        router.push('/admin/login');
      }
      
      setIsLoading(false);
    });

    // Aktivite dinleyicilerini ekle
    const updateLastActivity = () => {
      if (auth.currentUser) {
        sessionStorage.setItem('izorder_last_activity', Date.now().toString());
      }
    };

    // Kullanıcı etkileşimlerini dinle
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('keypress', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);
    window.addEventListener('mousemove', updateLastActivity);

    // Düzenli kontrol için zamanlayıcı - Firebase Auth ile ek güvenlik
    const checkInterval = setInterval(() => {
      const lastActivity = sessionStorage.getItem('izorder_last_activity');
      if (lastActivity && auth.currentUser) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        
        if (timeSinceLastActivity >= SESSION_TIMEOUT) {
          // Oturum süresi doldu - Firebase'den çıkış yap
          console.log('Session timeout, signing out');
          auth.signOut();
        }
      }
    }, 60000); // Her dakika kontrol et

    return () => {
      // Temizleme işlemleri
      unsubscribe();
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

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}