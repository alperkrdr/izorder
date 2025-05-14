import { NextResponse } from 'next/server';
import { getContactInfo } from '@/lib/data';

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Gerçek uygulamada burada veritabanı güncelleme işlemi yapılırdı
    // Örneğin: await updateContactInfoInDatabase(data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'İletişim bilgileri başarıyla güncellendi',
      updatedData: data
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'İşlem başarısız', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const contactInfo = await getContactInfo();
    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Veri alınamadı', error: (error as Error).message },
      { status: 500 }
    );
  }
} 