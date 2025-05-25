// This script adds a custom admin user to Firebase
// Run with: node scripts/addAdmin.js <email> <password>

const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Check command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Usage: node scripts/addAdmin.js <email> <password>');
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

// Create or update admin user
async function addAdminUser(email, password) {
  try {
    // Check if user exists
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log(`User with email ${email} already exists`);
    } catch (error) {
      // User doesn't exist, create it
      user = await admin.auth().createUser({
        email,
        password,
        displayName: 'Custom Admin User',
      });
      console.log(`User with email ${email} created successfully`);
    }
    
    // Add user to admin_users collection
    await db.collection('admin_users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || 'Custom Admin User',
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log(`User with email ${email} added to admin_users collection`);
    
    return user;
  } catch (error) {
    console.error('Error adding admin user:', error);
    throw error;
  }
}

// Run the function
addAdminUser(email, password)
  .then(() => {
    console.log('Admin user added successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to add admin user:', error);
    process.exit(1);
  }); 