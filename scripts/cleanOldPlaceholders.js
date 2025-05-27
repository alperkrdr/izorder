// Script to clean old via.placeholder.com URLs from Firestore database
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

// Firebase config (copy from your .env.local file)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDSQl57DfP4K8-P9DJVfOGJZlC1g-tLQ9w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "izorder-c0ee1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "izorder-c0ee1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "izorder-c0ee1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1032244754829",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1032244754829:web:ba59b3c26e7e4ec825fb5b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to clean via.placeholder.com URLs from a collection
async function cleanCollection(collectionName) {
  console.log(`\n🔍 Cleaning collection: ${collectionName}`);
  
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    let updatedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      let needsUpdate = false;
      const updates = {};
      
      // Check all fields for via.placeholder.com URLs
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && value.includes('via.placeholder.com')) {
          console.log(`   Found old placeholder in ${docSnapshot.id}.${key}: ${value}`);
          // Replace with appropriate placeholder
          updates[key] = getReplacementPlaceholder(collectionName, key);
          needsUpdate = true;
        }
        
        // Check arrays (like additionalImages)
        if (Array.isArray(value)) {
          const updatedArray = [];
          let arrayChanged = false;
          
          for (const item of value) {
            if (typeof item === 'object' && item.url && item.url.includes('via.placeholder.com')) {
              console.log(`   Found old placeholder in ${docSnapshot.id}.${key}[].url: ${item.url}`);
              updatedArray.push({
                ...item,
                url: getReplacementPlaceholder(collectionName, 'image')
              });
              arrayChanged = true;
            } else {
              updatedArray.push(item);
            }
          }
          
          if (arrayChanged) {
            updates[key] = updatedArray;
            needsUpdate = true;
          }
        }
      }
      
      // Update document if needed
      if (needsUpdate) {
        await updateDoc(doc(db, collectionName, docSnapshot.id), updates);
        updatedCount++;
        console.log(`   ✅ Updated document: ${docSnapshot.id}`);
      }
    }
    
    console.log(`✅ Collection ${collectionName}: ${updatedCount} documents updated`);
    return updatedCount;
    
  } catch (error) {
    console.error(`❌ Error cleaning collection ${collectionName}:`, error);
    return 0;
  }
}

// Function to get appropriate replacement placeholder
function getReplacementPlaceholder(collectionName, fieldName) {
  // Return local SVG placeholder based on collection type
  const placeholders = {
    'news': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNmYyZmYiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTNweCIgZmlsbD0iIzNiODJmNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TmV3cyBJbWFnZTwvdGV4dD4KICA8L3N2Zz4=',
    'press_coverage': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmY3ZWQiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTNweCIgZmlsbD0iI2Y5NzMxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+UHJlc3MgQ292ZXJhZ2U8L3RleHQ+CiAgPC9zdmc+',
    'gallery_images': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGZkZjQiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTNweCIgZmlsbD0iIzIyYzU1ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+R2FsbGVyeSBJbWFnZTwvdGV4dD4KICA8L3N2Zz4=',
    'board_members': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmZiZWIiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjBweCIgZmlsbD0iI2VhYjMwOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Qm9hcmQgTWVtYmVyPC90ZXh0PgogIDwvc3ZnPg==',
    'history': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZWYyZjIiLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTNweCIgZmlsbD0iI2VmNDQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+SGlzdG9yeSBJbWFnZTwvdGV4dD4KICA8L3N2Zz4='
  };
  
  return placeholders[collectionName] || placeholders['gallery_images'];
}

// Main cleanup function
async function cleanAllPlaceholders() {
  console.log('🧹 Starting cleanup of old via.placeholder.com URLs...\n');
  
  const collections = [
    'news',
    'press_coverage', 
    'gallery_images',
    'board_members',
    'history'
  ];
  
  let totalUpdated = 0;
  
  for (const collectionName of collections) {
    const updated = await cleanCollection(collectionName);
    totalUpdated += updated;
  }
  
  console.log(`\n🎉 Cleanup completed! Total documents updated: ${totalUpdated}`);
  
  if (totalUpdated > 0) {
    console.log('\n⚠️  Important: Please clear browser cache and restart your development server.');
    console.log('   The changes should be visible immediately on your website.');
  }
}

// Run the cleanup
cleanAllPlaceholders().catch(console.error);
