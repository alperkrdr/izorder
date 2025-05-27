import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase/admin';

// Function to get replacement placeholder
const getReplacementPlaceholder = (collectionName: string) => {
  const placeholders = {
    'news': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U2ZjJmZiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiMzYjgyZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5ld3MgSW1hZ2U8L3RleHQ+PC9zdmc+',
    'press_coverage': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZjdlZCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiNmOTczMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPlByZXNzIENvdmVyYWdlPC90ZXh0Pjwvc3ZnPg==',
    'gallery_images': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZmRmNCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiMyMmM1NWUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkdhbGxlcnkgSW1hZ2U8L3RleHQ+PC9zdmc+',
    'board_members': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZmJlYiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwcHgiIGZpbGw9IiNlYWIzMDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkJvYXJkIE1lbWJlcjwvdGV4dD48L3N2Zz4=',
    'history': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZlZjJmMiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjUzcHgiIGZpbGw9IiNlZjQ0NDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkhpc3RvcnkgSW1hZ2U8L3RleHQ+PC9zdmc+'
  };
  
  return placeholders[collectionName as keyof typeof placeholders] || placeholders['gallery_images'];
};

export async function POST() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    const collections = ['news', 'press_coverage', 'gallery_images', 'board_members', 'history'];
    const results = [];
    let totalUpdated = 0;

    for (const collectionName of collections) {
      console.log(`🔍 Cleaning collection: ${collectionName}`);
      
      try {
        const collectionRef = adminDb.collection(collectionName);
        const snapshot = await collectionRef.get();
        
        let updatedCount = 0;
        const foundUrls: string[] = [];
        
        for (const doc of snapshot.docs) {
          const data = doc.data();
          let needsUpdate = false;
          const updates: any = {};
          
          // Check all fields for via.placeholder.com URLs
          for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string' && value.includes('via.placeholder.com')) {
              console.log(`   Found old placeholder in ${doc.id}.${key}: ${value}`);
              foundUrls.push(`${doc.id}.${key}: ${value}`);
              updates[key] = getReplacementPlaceholder(collectionName);
              needsUpdate = true;
            }
            
            // Check arrays (like additionalImages)
            if (Array.isArray(value)) {
              const updatedArray = [];
              let arrayChanged = false;
              
              for (const item of value) {
                if (typeof item === 'object' && item !== null && item.url && item.url.includes('via.placeholder.com')) {
                  console.log(`   Found old placeholder in ${doc.id}.${key}[].url: ${item.url}`);
                  foundUrls.push(`${doc.id}.${key}[].url: ${item.url}`);
                  updatedArray.push({
                    ...item,
                    url: getReplacementPlaceholder(collectionName)
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
            await doc.ref.update(updates);
            updatedCount++;
            console.log(`   ✅ Updated document: ${doc.id}`);
          }
        }
        
        results.push({
          collection: collectionName,
          updated: updatedCount,
          foundUrls: foundUrls
        });

        totalUpdated += updatedCount;
        
      } catch (error: any) {
        console.error(`❌ Error cleaning collection ${collectionName}:`, error);
        results.push({
          collection: collectionName,
          updated: 0,
          foundUrls: [],
          error: error.message
        });
      }
    }

    console.log(`🎉 Cleanup completed! Total documents updated: ${totalUpdated}`);

    return NextResponse.json({
      success: true,
      message: `Cleanup completed! Total documents updated: ${totalUpdated}`,
      results: results,
      totalUpdated: totalUpdated
    });

  } catch (error: any) {
    console.error('API cleanup error:', error);
    return NextResponse.json({
      error: `Cleanup failed: ${error.message}`
    }, { status: 500 });
  }
}
