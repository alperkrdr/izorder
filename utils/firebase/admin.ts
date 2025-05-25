// This module should only be imported in server components
// Make sure never to import this in client components

import * as admin from 'firebase-admin';

// Prevent multiple initializations
let adminApp: admin.app.App | undefined;
let adminAuth: admin.auth.Auth | undefined;
let adminDb: admin.firestore.Firestore | undefined;
let adminStorage: any | undefined;

// Check if we're on the server side
const isServer = typeof window === 'undefined';

if (isServer) {
  try {
    if (!admin.apps.length) {
      // Service account credentials
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      };

      // Initialize the admin app
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });

      console.log('Firebase Admin SDK initialized successfully');
    } else {
      adminApp = admin.app();
    }

    // Initialize services
    adminAuth = admin.auth(adminApp);
    adminDb = admin.firestore(adminApp);
    adminStorage = admin.storage(adminApp).bucket(process.env.FIREBASE_STORAGE_BUCKET);
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
} else {
  console.warn('Attempted to load Firebase Admin SDK on the client side. This is not supported.');
}

export { adminApp, adminAuth, adminDb, adminStorage };