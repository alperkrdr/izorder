// Test script for Firebase Auth + Storage integration
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { readFileSync } = require('fs');
const path = require('path');

// Firebase config (using environment variables)
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testAuthAndStorage() {
  try {
    console.log('🚀 Firebase Auth + Storage Test Starting...\n');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    console.log('✅ Firebase initialized');
    console.log('📦 Storage bucket:', firebaseConfig.storageBucket);
    
    // Test authentication (you'll need to provide valid credentials)
    const email = 'admin@izorder.org'; // Replace with your admin email
    const password = 'your-password'; // Replace with your admin password
    
    console.log('\n🔐 Testing authentication...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Authentication successful');
    console.log('👤 User:', user.email);
    console.log('🆔 UID:', user.uid);
    console.log('📧 Email verified:', user.emailVerified);
    
    // Test storage upload with a dummy file
    console.log('\n📁 Testing storage upload...');
    
    // Create a dummy file content
    const dummyContent = Buffer.from('Test file content for Firebase Storage upload');
    const fileName = `test-${Date.now()}.txt`;
    const storagePath = `test-uploads/${fileName}`;
    
    // Create storage reference
    const storageRef = ref(storage, storagePath);
    
    // Upload file
    console.log('⬆️ Uploading file to:', storagePath);
    const uploadResult = await uploadBytes(storageRef, dummyContent);
    console.log('✅ Upload successful');
    
    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('🔗 Download URL:', downloadURL);
    
    // Test with image file if exists
    const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
    try {
      const logoBuffer = readFileSync(logoPath);
      const imageStoragePath = `test-uploads/logo-${Date.now()}.png`;
      const imageRef = ref(storage, imageStoragePath);
      
      console.log('\n🖼️ Testing image upload...');
      const imageUpload = await uploadBytes(imageRef, logoBuffer);
      const imageURL = await getDownloadURL(imageUpload.ref);
      console.log('✅ Image upload successful');
      console.log('🔗 Image URL:', imageURL);
      
    } catch (imgError) {
      console.log('ℹ️ Logo file not found, skipping image test');
    }
    
    console.log('\n🎉 All tests passed! Firebase Auth + Storage integration is working correctly.');
    
    // Sign out
    await auth.signOut();
    console.log('👋 Signed out successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.code) {
      console.error('🔑 Error code:', error.code);
      
      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          console.error('💡 Check your email and password in the script');
          break;
        case 'storage/bucket-not-found':
          console.error('💡 Check your Firebase Storage bucket configuration');
          break;
        case 'storage/unauthorized':
          console.error('💡 Check your Firebase Storage security rules');
          break;
        default:
          console.error('💡 Check your Firebase configuration and network connection');
      }
    }
    
    process.exit(1);
  }
}

// Instructions
console.log('📋 Before running this test:');
console.log('1. Make sure .env.local has all Firebase config variables');
console.log('2. Update the email/password in this script with valid admin credentials');
console.log('3. Ensure Firebase Storage bucket exists and has proper rules');
console.log('4. Run: node scripts/test-auth-storage.js\n');

// Only run if called directly
if (require.main === module) {
  testAuthAndStorage();
}

module.exports = { testAuthAndStorage };
