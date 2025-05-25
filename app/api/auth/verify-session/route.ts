import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/utils/firebase/admin';

// Add type declaration for the session claims
interface SessionClaims {
  uid: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = body.session || '';
    
    if (!session) {
      return NextResponse.json(
        { valid: false, error: 'No session provided' },
        { status: 400 }
      );
    }
    
    // Check if adminAuth is initialized
    if (!adminAuth) {
      throw new Error('Firebase Admin Auth is not initialized');
    }
    
    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(session, true) as SessionClaims;
    
    return NextResponse.json({ 
      valid: true, 
      uid: decodedClaims.uid 
    });
  } catch (error: any) {
    console.error('Error verifying session:', error);
    
    return NextResponse.json(
      { valid: false, error: error.message || 'Invalid session' },
      { status: 401 }
    );
  }
} 