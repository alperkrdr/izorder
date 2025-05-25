import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/utils/firebase/admin';

// Force dynamic rendering for API routes that use authentication
export const dynamic = 'force-dynamic';

// Firebase session cookie expiration (in seconds)
const SESSION_EXPIRATION = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
      if (!idToken) {
      return NextResponse.json(
        { error: 'idToken is required' },
        { status: 400 }
      );
    }
    
    // Check if adminAuth is configured
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin Auth not configured' },
        { status: 500 }
      );
    }
      // Create a session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_EXPIRATION * 1000, // Convert to milliseconds
    });
    
    // Create response and set the cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', sessionCookie, {
      maxAge: SESSION_EXPIRATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Unauthorized request' },
      { status: 401 }
    );
  }
} 