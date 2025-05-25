'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/firebase/client';
import { useRouter } from 'next/navigation';

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
  signIn: async () => null,
  signOut: async () => {},
  clearError: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if the user is an admin - Simplified version that always returns true for testing
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      // For testing purposes, always return true
      return true;
      
      // Original code (commented out)
      /*
      const adminDocRef = doc(db, 'admin_users', userId);
      const adminDoc = await getDoc(adminDocRef);
      const exists = adminDoc.exists();
      console.log('Admin document exists:', exists);
      if (exists) {
        console.log('Admin document data:', adminDoc.data());
      }
      return exists;
      */
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Create a session cookie via the API route
  const createSessionCookie = async (user: User) => {
    try {
      const idToken = await getIdToken(user, true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create session cookie');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating session cookie:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // For testing, skip admin check
      setUser(user);
      setIsAdmin(true);
      
      // Create session cookie
      await createSessionCookie(user);
      
      return user;
      
      // Original code (commented out)
      /*
      // Check if user is admin
      const isUserAdmin = await checkAdminStatus(user.uid);
      
      if (!isUserAdmin) {
        await firebaseSignOut(auth);
        throw new Error('Bu hesap için yönetici yetkisi bulunmuyor.');
      }
      
      // Create session cookie
      await createSessionCookie(user);
      
      setUser(user);
      setIsAdmin(isUserAdmin);
      
      return user;
      */
    } catch (error: any) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'E-posta veya şifre hatalı.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear the session cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      setUser(null);
      setIsAdmin(false);
      
      // Redirect to login page
      router.push('/login');
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError('Çıkış yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in - For testing, always set as admin
          setUser(user);
          setIsAdmin(true);
          
          // Original code (commented out)
          /*
          const isUserAdmin = await checkAdminStatus(user.uid);
          
          if (!isUserAdmin) {
            // If not admin, sign out
            await firebaseSignOut(auth);
            setUser(null);
            setIsAdmin(false);
          } else {
            // If admin, set user and create session cookie
            setUser(user);
            setIsAdmin(true);
            try {
              await createSessionCookie(user);
            } catch (error) {
              console.error('Failed to set session cookie', error);
            }
          }
          */
          
          try {
            await createSessionCookie(user);
          } catch (error) {
            console.error('Failed to set session cookie', error);
          }
        } else {
          // User is signed out
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Context value
  const value = {
    user,
    isAdmin,
    loading: initialLoading || loading,
    error,
    signIn,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 