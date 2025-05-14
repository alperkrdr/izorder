import { NextResponse } from 'next/server';
import { getHistoryContent } from '@/lib/data';

// Bu dosya normalde veritabanı işlemleri yapardı
// Şu anda sadece başarılı yanıt döndüren demo bir API
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Gerçek uygulamada burada veritabanı güncelleme işlemi yapılırdı
    // Örneğin: await updateHistoryInDatabase(data);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tarihçe içeriği başarıyla güncellendi',
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
    const historyContent = await getHistoryContent();
    return NextResponse.json({ success: true, data: historyContent });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Veri alınamadı', error: (error as Error).message },
      { status: 500 }
    );
  }
} 