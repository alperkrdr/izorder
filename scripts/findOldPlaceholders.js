const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://izorder-92337.firebaseio.com`,
  storageBucket: 'izorder-92337.appspot.com'
});

const db = admin.firestore();

async function findOldPlaceholders() {
  const collections = ['news', 'press_coverage', 'gallery_images', 'board_members', 'history'];
  
  console.log('🔍 Searching for old placeholder URLs in Firestore...\n');
  
  for (const collectionName of collections) {
    console.log(`📂 Checking collection: ${collectionName}`);
    
    try {
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();
      
      let foundCount = 0;
      
      snapshot.forEach(doc => {
        const data = doc.data();
        
        // Check all fields for via.placeholder.com URLs
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string' && value.includes('via.placeholder.com')) {
            console.log(`   ❌ Found: ${doc.id}.${key} = ${value}`);
            foundCount++;
          }
          
          // Check arrays (like additionalImages)
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === 'string' && item.includes('via.placeholder.com')) {
                console.log(`   ❌ Found: ${doc.id}.${key}[${index}] = ${item}`);
                foundCount++;
              }
            });
          }
        }
      });
      
      if (foundCount === 0) {
        console.log('   ✅ No old placeholders found');
      } else {
        console.log(`   ⚠️  Found ${foundCount} old placeholder(s)`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error checking ${collectionName}:`, error.message);
    }
    
    console.log('');
  }
  
  console.log('🔍 Search completed!');
}

findOldPlaceholders()
  .then(() => {
    console.log('\n✅ Script finished successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
