import { NextResponse } from 'next/server';
import { adminStorage } from '@/utils/firebase/admin';

export async function GET() {
  try {
    if (!adminStorage) {
      return NextResponse.json(
        { error: 'Firebase Admin Storage is not initialized' },
        { status: 500 }
      );
    }

    // Test bucket access
    const bucket = adminStorage;
    const [exists] = await bucket.exists();
    
    if (!exists) {
      return NextResponse.json(
        { error: 'Storage bucket does not exist' },
        { status: 404 }
      );
    }

    // Get bucket info
    const [metadata] = await bucket.getMetadata();
    
    return NextResponse.json({
      success: true,
      bucket: {
        name: metadata.name,
        location: metadata.location,
        storageClass: metadata.storageClass,
        timeCreated: metadata.timeCreated
      }
    });
  } catch (error: any) {
    console.error('Storage test error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Storage test failed',
        details: error
      },
      { status: 500 }
    );
  }
} 