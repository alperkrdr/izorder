// This script checks and lists all admin users in the database
// Run with: node scripts/checkAdmins.js

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK
try {
  // Service account credentials
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };

  // Initialize the admin app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();

// List all admin users
async function listAdminUsers() {
  try {
    console.log('Fetching admin users from database...');
    
    // Get all documents from admin_users collection
    const snapshot = await db.collection('admin_users').get();
    
    if (snapshot.empty) {
      console.log('No admin users found in the database.');
      return;
    }
    
    console.log(`Found ${snapshot.size} admin user(s):`);
    
    // List all admin users
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- User ID: ${doc.id}`);
      console.log(`  Email: ${data.email}`);
      console.log(`  Display Name: ${data.displayName}`);
      console.log(`  Role: ${data.role}`);
      console.log('-----------------------------------');
    });
    
    // Also check Firebase Auth users
    const listUsersResult = await admin.auth().listUsers(1000);
    console.log(`\nFound ${listUsersResult.users.length} user(s) in Firebase Auth:`);
    
    listUsersResult.users.forEach((userRecord) => {
      console.log(`- User ID: ${userRecord.uid}`);
      console.log(`  Email: ${userRecord.email}`);
      console.log(`  Display Name: ${userRecord.displayName}`);
      console.log('-----------------------------------');
    });
    
  } catch (error) {
    console.error('Error listing admin users:', error);
    throw error;
  }
}

// Run the function
listAdminUsers()
  .then(() => {
    console.log('Admin users check completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to check admin users:', error);
    process.exit(1);
  }); 