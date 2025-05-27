const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check if service account key exists
const serviceAccountPath = './serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Service account key not found at:', serviceAccountPath);
  console.log('Please ensure you have the Firebase service account key file.');
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://izorder-92337.firebaseio.com`,
    storageBucket: 'izorder-92337.appspot.com'
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Function to get replacement placeholder
const getReplacementPlaceholder = (collectionName) => {
  const placeholders = {
    'news': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U2ZjJmZiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiMzYjgyZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5ld3MgSW1hZ2U8L3RleHQ+PC9zdmc+',
    'press_coverage': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZjdlZCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiNmOTczMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByZXNzIENvdmVyYWdlPC90ZXh0Pjwvc3ZnPg==',
    'gallery_images': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZmRmNCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiMyMmM1NWUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkdhbGxlcnkgSW1hZ2U8L3RleHQ+PC9zdmc+',
    'board_members': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZmJlYiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiNlYWIzMDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkJvYXJkIE1lbWJlcjwvdGV4dD48L3N2Zz4=',
    'history': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZlZjJmMiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiNlZjQ0NDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkhpc3RvcnkgSW1hZ2U8L3RleHQ+PC9zdmc+'
  };
  
  return placeholders[collectionName] || placeholders['gallery_images'];
};

async function cleanOldPlaceholders() {
  const collections = ['news', 'press_coverage', 'gallery_images', 'board_members', 'history'];
  const results = [];
  let totalUpdated = 0;

  console.log('🧹 Starting database cleanup...\n');

  for (const collectionName of collections) {
    console.log(`📂 Processing collection: ${collectionName}`);
    
    try {
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();
      
      let updatedCount = 0;
      let documentsScanned = 0;
      let placeholdersReplaced = 0;
      const foundUrls = [];
      
      for (const doc of snapshot.docs) {
        documentsScanned++;
        const data = doc.data();
        let needsUpdate = false;
        const updates = {};
        
        // Check all fields for via.placeholder.com URLs
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string' && value.includes('via.placeholder.com')) {
            console.log(`   ❌ Found old placeholder: ${doc.id}.${key}`);
            foundUrls.push(`${doc.id}.${key}: ${value}`);
            updates[key] = getReplacementPlaceholder(collectionName);
            needsUpdate = true;
            placeholdersReplaced++;
          }
          
          // Check arrays (like additionalImages)
          if (Array.isArray(value)) {
            const updatedArray = [];
            let arrayChanged = false;
            
            for (const item of value) {
              if (typeof item === 'object' && item !== null && item.url && item.url.includes('via.placeholder.com')) {
                console.log(`   ❌ Found old placeholder in array: ${doc.id}.${key}[].url`);
                foundUrls.push(`${doc.id}.${key}[].url: ${item.url}`);
                updatedArray.push({
                  ...item,
                  url: getReplacementPlaceholder(collectionName)
                });
                arrayChanged = true;
                placeholdersReplaced++;
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
          await doc.ref.update(updates);
          updatedCount++;
          console.log(`   ✅ Updated document: ${doc.id}`);
        }
      }
      
      const result = {
        collection: collectionName,
        success: true,
        documentsScanned,
        documentsUpdated: updatedCount,
        placeholdersReplaced,
        foundUrls
      };
      
      results.push(result);
      totalUpdated += updatedCount;
      
      if (updatedCount > 0) {
        console.log(`   ✅ ${collectionName}: ${updatedCount} documents updated, ${placeholdersReplaced} placeholders replaced`);
      } else {
        console.log(`   ✅ ${collectionName}: No old placeholders found`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error processing ${collectionName}:`, error.message);
      results.push({
        collection: collectionName,
        success: false,
        error: error.message,
        documentsScanned: 0,
        documentsUpdated: 0,
        placeholdersReplaced: 0,
        foundUrls: []
      });
    }
    
    console.log('');
  }

  console.log('🧹 Cleanup completed!');
  console.log(`📊 Summary: ${totalUpdated} total documents updated`);
  
  // Return results in the same format as API endpoint
  return {
    success: true,
    message: `Database cleanup completed successfully! ${totalUpdated} documents updated.`,
    totalUpdated,
    results
  };
}

// Run the cleanup
cleanOldPlaceholders()
  .then(result => {
    console.log('\n✅ Cleanup script finished successfully');
    console.log('📋 Final Results:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Cleanup script failed:', error);
    process.exit(1);
  });
