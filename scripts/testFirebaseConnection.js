// Test Firebase connection and storage bucket
const { initializeApp } = require('firebase/app');
const { getStorage, ref, listAll } = require('firebase/storage');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '[HIDDEN]' : 'MISSING'
});

async function testFirebaseConnection() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    
    console.log('Getting storage instance...');
    const storage = getStorage(app);
    
    console.log('Storage bucket:', storage.app.options.storageBucket);
    
    console.log('Testing storage access...');
    const storageRef = ref(storage, '/');
    
    console.log('Listing files in root...');
    const result = await listAll(storageRef);
    
    console.log('Success! Found', result.items.length, 'files and', result.prefixes.length, 'folders');
    console.log('Storage connection test passed!');
    
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    
    if (error.code === 'storage/bucket-not-found') {
      console.error('Storage bucket does not exist. Please check your Firebase project settings.');
    } else if (error.code === 'storage/unauthorized') {
      console.error('Unauthorized access to storage. Please check your Firebase rules.');
    }
  }
}

testFirebaseConnection();
