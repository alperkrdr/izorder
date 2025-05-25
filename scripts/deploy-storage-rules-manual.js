#!/usr/bin/env node

// Firebase Storage Rules deployment script
const { initializeApp, cert } = require('firebase-admin/app');
const admin = require('firebase-admin');

async function deployStorageRules() {
  try {
    console.log('🔥 Starting Firebase Storage rules deployment...');
    
    // Initialize Firebase Admin
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
    }

    console.log('✅ Firebase Admin initialized');
    console.log('📝 Storage rules need to be deployed manually via Firebase Console or CLI');
    console.log('🌐 Go to: https://console.firebase.google.com/project/izorder-92337/storage/rules');
    console.log('📋 Copy the rules from firebase-storage.rules file');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deploying storage rules:', error);
    process.exit(1);
  }
}

deployStorageRules();
