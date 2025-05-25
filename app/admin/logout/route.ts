import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Client-side Firebase auth logout'u handle edilecek
    // Server-side'da sadece redirect yapıyoruz
    
    return NextResponse.redirect(new URL('/admin/login', request.url))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Çıkış yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
}