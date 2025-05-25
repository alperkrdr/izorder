import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Explicitly set the runtime to experimental-edge
export const runtime = 'experimental-edge';

// Admin sayfaları için kimlik doğrulama middleware'i - Edge Runtime için optimize edilmiş
export async function middleware(request: NextRequest) {
  // Middleware'i devre dışı bırakıyoruz - her zaman devam et
  return NextResponse.next();
  
  /*
  const session = request.cookies.get('session')?.value || '';
  const pathname = request.nextUrl.pathname;
  
  // Only protect admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  
  // Redirect to login if no session cookie
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // For admin routes, we'll check the session on the client side
  // and let the AuthContext handle the authentication
  return NextResponse.next();
  */
}

// Sadece /admin path'i için middleware'i çalıştır
export const config = {
  matcher: ['/admin/:path*'],
}