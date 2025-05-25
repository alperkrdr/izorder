import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Kullanıcı çıkışı yap
    await supabase.auth.signOut()
    
    return NextResponse.redirect(new URL('/admin/login', 'http://localhost:3000'))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Çıkış yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 