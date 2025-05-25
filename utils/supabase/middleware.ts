// Firebase Authentication için middleware
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../firebase/admin';

export async function updateSession(request: NextRequest) {
  try {
    // Response oluştur
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Session cookie kontrolü
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return response;
    }

    // Firebase ile session doğrulama
    try {
      // Session cookie ile kullanıcı bilgilerini doğrula
      await adminAuth.verifySessionCookie(sessionCookie, true);
      // Session geçerli ise response döndür
    } catch (error) {
      // Session geçersiz ise cookie'yi sil
      response.cookies.set({
        name: 'session',
        value: '',
        maxAge: 0,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Firebase middleware error:', error);
    return NextResponse.next();
  }
}