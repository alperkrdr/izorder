'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './client';

interface AuthMiddlewareProps {
  children: ReactNode;
}

export default function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Kullanıcı oturum açmamışsa login sayfasına yönlendir
        console.log('Oturum açılmamış, login sayfasına yönlendiriliyor...');
        router.push('/admin/login');
      } else {
        console.log('Oturum açık, kullanıcı:', user.email);
        setLoading(false);
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 