console.log('Starting Firebase Storage test...');

require('dotenv').config({ path: '.env.local' });

// Firebase configuration
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
  apiKey: firebaseConfig.apiKey ? '***' : 'MISSING'
});

async function testFirebaseStorage() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    
    console.log('✅ Firebase Storage initialized successfully');
    console.log('Storage bucket:', firebaseConfig.storageBucket);
    
    // Create a simple test file
    const testData = Buffer.from('Test file content', 'utf8');
    const testRef = ref(storage, 'test/test.txt');
    
    console.log('📤 Attempting to upload test file...');
    
    // Upload test file
    const uploadResult = await uploadBytes(testRef, testData);
    console.log('✅ File uploaded successfully');
    
    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('✅ Download URL obtained:', downloadURL);
    
    console.log('🎉 Firebase Storage test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase Storage test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // Provide specific guidance based on error type
    if (error.code === 'storage/bucket-not-found') {
      console.log('\n🔧 SOLUTION: Storage bucket not found');
      console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.log('2. Select your project: izorder-92337');
      console.log('3. Go to Storage section');
      console.log('4. Create a new Storage bucket if it doesn\'t exist');
      console.log('5. Make sure the bucket name matches:', firebaseConfig.storageBucket);
    } else if (error.code === 'storage/unauthorized') {
      console.log('\n🔧 SOLUTION: Unauthorized access');
      console.log('1. Check Firebase Storage Security Rules');
      console.log('2. Make sure authentication is working');
      console.log('3. Update Storage rules if needed');
    }
  }
}

testFirebaseStorage();
