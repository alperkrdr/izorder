// Simple test to check Firebase Storage accessibility
require('dotenv').config({ path: '.env.local' });

console.log('Starting Firebase Storage accessibility test...');

const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

console.log('Project ID:', projectId);
console.log('Storage Bucket:', bucketName);

// Test the bucket URL accessibility
const bucketUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o`;

console.log('Testing bucket URL:', bucketUrl);

const https = require('https');

https.get(bucketUrl, (res) => {
  console.log('✅ Bucket is accessible');
  console.log('Status Code:', res.statusCode);
  console.log('Status Message:', res.statusMessage);
  
  if (res.statusCode === 200) {
    console.log('🎉 Firebase Storage bucket exists and is accessible!');
  } else if (res.statusCode === 404) {
    console.log('❌ Storage bucket not found');
    console.log('🔧 SOLUTION: Create Storage bucket in Firebase Console');
  } else {
    console.log('⚠️  Unexpected status code');
  }
}).on('error', (err) => {
  console.error('❌ Error accessing bucket:', err.message);
  
  if (err.code === 'ENOTFOUND') {
    console.log('🔧 SOLUTION: Check bucket name in .env.local file');
    console.log('Current bucket name:', bucketName);
  }
});
