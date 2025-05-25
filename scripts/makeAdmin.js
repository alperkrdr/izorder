// This script makes an existing user an admin by email
// Run with: node scripts/makeAdmin.js <email>

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Check command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/makeAdmin.js <email>');
  process.exit(1);
}

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

// Make user an admin
async function makeAdmin(email) {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`Found user with email ${email}, UID: ${userRecord.uid}`);
    
    // Add user to admin_users collection
    await db.collection('admin_users').doc(userRecord.uid).set({
      email: userRecord.email,
      displayName: userRecord.displayName || email.split('@')[0],
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log(`User with email ${email} has been made an admin`);
    
    return userRecord;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`User with email ${email} does not exist. Create the user first.`);
    } else {
      console.error('Error making user an admin:', error);
    }
    throw error;
  }
}

// Run the function
makeAdmin(email)
  .then(() => {
    console.log('Operation completed successfully');
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  }); 