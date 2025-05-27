// Firebase Admin SDK cleanup script
const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: "058ac7d3aa8a84c3f5d7b8e2a3b9c4d5e6f7a8b9",
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: "108234567890123456789",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

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

// Function to clean via.placeholder.com URLs from a collection
async function cleanCollection(collectionName) {
  console.log(`\n🔍 Cleaning collection: ${collectionName}`);
  
  try {
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    
    let updatedCount = 0;
    const foundUrls = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let needsUpdate = false;
      const updates = {};
      
      // Check all fields for via.placeholder.com URLs
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && value.includes('via.placeholder.com')) {
          console.log(`   📍 Found old placeholder in ${doc.id}.${key}: ${value}`);
          foundUrls.push(`${doc.id}.${key}: ${value}`);
          updates[key] = getReplacementPlaceholder(collectionName);
          needsUpdate = true;
        }
        
        // Check arrays (like additionalImages)
        if (Array.isArray(value)) {
          const updatedArray = value.map(item => {
            if (typeof item === 'string' && item.includes('via.placeholder.com')) {
              console.log(`   📍 Found old placeholder in ${doc.id}.${key}[]: ${item}`);
              foundUrls.push(`${doc.id}.${key}[]: ${item}`);
              return getReplacementPlaceholder(collectionName);
            }
            return item;
          });
          
          if (JSON.stringify(updatedArray) !== JSON.stringify(value)) {
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
    
    console.log(`✅ Collection ${collectionName}: ${updatedCount} documents updated`);
    return {
      collection: collectionName,
      success: true,
      documentsScanned: snapshot.docs.length,
      documentsUpdated: updatedCount,
      placeholdersReplaced: foundUrls.length,
      foundUrls: foundUrls
    };
    
  } catch (error) {
    console.error(`❌ Error cleaning collection ${collectionName}:`, error);
    return {
      collection: collectionName,
      success: false,
      error: error.message
    };
  }
}

// Main function
async function main() {
  console.log('🧹 Starting Firebase Admin cleanup...');
  console.log(`🔥 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  
  const collections = ['news', 'press_coverage', 'gallery_images', 'board_members', 'history'];
  const results = [];
  let totalUpdated = 0;
  
  for (const collectionName of collections) {
    const result = await cleanCollection(collectionName);
    results.push(result);
    if (result.success) {
      totalUpdated += result.documentsUpdated;
    }
  }
  
  console.log('\n🎉 Database cleanup completed!');
  console.log(`📊 Total documents updated: ${totalUpdated}`);
  console.log('\n📋 Summary:');
  results.forEach(result => {
    if (result.success) {
      console.log(`  ${result.collection}: ${result.documentsUpdated}/${result.documentsScanned} updated`);
      if (result.foundUrls.length > 0) {
        console.log(`    Found URLs: ${result.foundUrls.length}`);
      }
    } else {
      console.log(`  ${result.collection}: ERROR - ${result.error}`);
    }
  });
  
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
