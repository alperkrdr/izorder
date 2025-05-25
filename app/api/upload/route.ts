import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminStorage } from '@/utils/firebase/admin';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminStorage) {
      throw new Error('Firebase Admin is not initialized');
    }

    // Get the path from query parameters
    const url = new URL(request.url);
    const path = url.searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    // Check session
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized - No session' },
        { status: 401 }
      );
    }

    try {
      // Verify session
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      if (!decodedClaims.uid) {
        return NextResponse.json(
          { error: 'Unauthorized - Invalid session' },
          { status: 401 }
        );
      }

      // Get the file from the request
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Firebase Storage
      const bucket = adminStorage;
      const fileRef = bucket.file(path);
      
      await fileRef.save(buffer, {
        metadata: {
          contentType: file.type,
        },
      });

      // Make the file publicly accessible
      await fileRef.makePublic();

      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;

      return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: error.message || 'Upload failed' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 