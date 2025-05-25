import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET isteği - İletişim bilgilerini getir
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Veritabanından iletişim verilerini al
    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Veri alınamadı', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT isteği - İletişim bilgilerini güncelle
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    
    // Önce kullanıcının oturumunu ve yetkisini kontrol et
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Bu işlem için giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }
    
    // Admin yetkisi kontrolü
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!adminData) {
      return NextResponse.json(
        { success: false, message: 'Bu işlem için yetkiniz bulunmuyor' },
        { status: 403 }
      );
    }
    
    // Request body'den veriyi al
    const body = await request.json();
    
    // Veri doğrulama
    if (!body.address || !body.phone || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Adres, telefon ve e-posta alanları zorunludur' },
        { status: 400 }
      );
    }
    
    // Mevcut kaydı kontrol et
    let { data: existingContact, error: fetchError } = await supabase
      .from('contact')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    let result;
    
    if (existingContact) {
      // Mevcut kaydı güncelle
      result = await supabase
        .from('contact')
        .update({
          address: body.address,
          phone: body.phone,
          email: body.email,
          social_media: body.social_media || {},
          map_url: body.map_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingContact.id)
        .select();
    } else {
      // Yeni kayıt oluştur
      result = await supabase
        .from('contact')
        .insert({
          address: body.address,
          phone: body.phone,
          email: body.email,
          social_media: body.social_media || {},
          map_url: body.map_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
    }
    
    if (result.error) {
      throw result.error;
    }
    
    return NextResponse.json({
      success: true,
      message: 'İletişim bilgileri başarıyla güncellendi',
      updatedData: result.data[0]
    });
  } catch (error) {
    console.error('Contact update error:', error);
    return NextResponse.json(
      { success: false, message: 'İşlem başarısız', error: (error as Error).message },
      { status: 500 }
    );
  }
} 