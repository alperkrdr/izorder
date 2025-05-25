import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/admin';
import { cookies } from 'next/headers';

// Firebase session cookie expiration (in seconds)
const SESSION_EXPIRATION = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'idToken is required' },
        { status: 400 }
      );
    }
    
    // Check if Firebase Admin is initialized
    if (!adminAuth) {
      throw new Error('Firebase Admin is not initialized');
    }
    
    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Skip admin check for testing purposes
    
    // Create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRATION * 1000, // Convert to milliseconds
    });
    
    // Set the cookie
    cookies().set('session', sessionCookie, {
      maxAge: SESSION_EXPIRATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating session:', error);
    
    let errorMessage = 'Unauthorized request';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 401 }
    );
  }
} 