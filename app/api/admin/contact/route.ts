import { NextResponse } from 'next/server';

// GET isteği - İletişim bilgilerini getir
export async function GET() {
  try {
    // Firebase Admin olmadan da çalışabilmesi için mock data döndürelim
    const mockContactData = {
      id: '1',
      address: 'Ege Üniversitesi Kampüsü İçi, 35100 Bornova/İzmir',
      phone: '+90 232 XXX XX XX',
      email: 'info@izorder.org.tr',
      socialMedia: {
        facebook: 'https://facebook.com/izorder',
        twitter: 'https://twitter.com/izorder',
        instagram: 'https://instagram.com/izorder'
      },
      workingHours: 'Pazartesi - Cuma: 09:00 - 17:00',
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ success: true, data: mockContactData });
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
    // Request body'den veriyi al
    const body = await request.json();
    
    // Veri doğrulama
    if (!body.address || !body.phone || !body.email) {
      return NextResponse.json(
        { success: false, message: 'Adres, telefon ve e-posta alanları zorunludur' },
        { status: 400 }
      );
    }

    // Mock response - gerçek database update yapmadan
    const updatedData = {
      id: '1',
      address: body.address,
      phone: body.phone,
      email: body.email,
      socialMedia: body.socialMedia || {},
      workingHours: body.workingHours || 'Pazartesi - Cuma: 09:00 - 17:00',
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'İletişim bilgileri başarıyla güncellendi',
      data: updatedData
    });
  } catch (error) {
    console.error('Contact update error:', error);
    return NextResponse.json(
      { success: false, message: 'İşlem başarısız', error: (error as Error).message },
      { status: 500 }
    );
  }
}