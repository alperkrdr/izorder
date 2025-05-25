'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/utils/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';

export default function AuthDebug() {
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔍 Auth State Debug:', {
        user: user ? {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName
        } : null,
        authCurrentUser: auth.currentUser ? 'Available' : 'Null',
        timestamp: new Date().toISOString()
      });
      
      setAuthState(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      🔄 Checking auth state...
    </div>;
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
      <h3 className="font-bold text-blue-800 mb-2">🔍 Auth Debug Info</h3>
      <div className="text-sm">
        <div><strong>Auth State:</strong> {authState ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
        {authState && (
          <>
            <div><strong>User ID:</strong> {authState.uid}</div>
            <div><strong>Email:</strong> {authState.email}</div>
            <div><strong>Email Verified:</strong> {authState.emailVerified ? '✅' : '❌'}</div>
            <div><strong>auth.currentUser:</strong> {auth.currentUser ? '✅ Available' : '❌ Null'}</div>
          </>
        )}
        <div className="mt-2 text-xs text-gray-600">
          This debug info helps verify Firebase Auth integration
        </div>
      </div>
    </div>
  );
}
