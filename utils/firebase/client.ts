import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import firebaseConfig from './config';

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

try {
  // Initialize Firebase
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Analytics with a conditional check for browser environment
  if (typeof window !== 'undefined') {
    // Only initialize analytics on the client side
    isSupported()
      .then(yes => yes && (analytics = getAnalytics(app)))
      .catch(e => console.error('Firebase Analytics error:', e));
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, auth, db, storage, analytics };