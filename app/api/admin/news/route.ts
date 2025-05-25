import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/admin';
import { cookies } from 'next/headers';

// GET isteği - Haberleri getir
export async function GET() {
  try {
    // Session cookie kontrolü
    const sessionCookie = cookies().get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }
    
    try {
      // Firebase ile session doğrulama
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userId = decodedClaims.uid;
      
      if (!userId) {
        return NextResponse.json(
          { success: false, message: 'Geçersiz oturum' },
          { status: 401 }
        );
      }
      
      // Firestore'dan haberleri getir
      const newsRef = adminDb.collection('news');
      const snapshot = await newsRef.orderBy('date', 'desc').get();
      
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json({ success: true, data: news });
    } catch (error) {
      console.error('Session doğrulama hatası:', error);
      return NextResponse.json(
        { success: false, message: 'Oturum doğrulanamadı' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Haber getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Veri alınamadı', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT isteği - Haber güncelle
export async function PUT(request: Request) {
  try {
    // Session cookie kontrolü
    const sessionCookie = cookies().get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }
    
    try {
      // Firebase ile session doğrulama
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userId = decodedClaims.uid;
      
      if (!userId) {
        return NextResponse.json(
          { success: false, message: 'Geçersiz oturum' },
          { status: 401 }
        );
      }
      
      // Admin yetkisi kontrolü
      const adminRef = adminDb.collection('admin_users').doc(userId);
      const adminDoc = await adminRef.get();
      
      if (!adminDoc.exists) {
        return NextResponse.json(
          { success: false, message: 'Bu işlem için yetkiniz bulunmuyor' },
          { status: 403 }
        );
      }
      
      // Request body'den veriyi al
      const body = await request.json();
      
      // Veri doğrulama
      if (!body.title || !body.content) {
        return NextResponse.json(
          { success: false, message: 'Başlık ve içerik alanları zorunludur' },
          { status: 400 }
        );
      }
      
      let result;
      
      if (body.id) {
        // Mevcut haberi güncelle
        const newsRef = adminDb.collection('news').doc(body.id);
        await newsRef.update({
          title: body.title,
          summary: body.summary || '',
          content: body.content,
          imageUrl: body.imageUrl || '',
          date: body.date || new Date().toISOString(),
          slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          author: body.author || 'Dernek Yönetimi',
          updatedAt: new Date().toISOString()
        });
        
        const updatedDoc = await newsRef.get();
        result = {
          id: updatedDoc.id,
          ...updatedDoc.data()
        };
      } else {
        // Yeni haber oluştur
        const newsRef = adminDb.collection('news');
        const newNews = {
          title: body.title,
          summary: body.summary || '',
          content: body.content,
          imageUrl: body.imageUrl || '',
          date: body.date || new Date().toISOString(),
          slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
          author: body.author || 'Dernek Yönetimi',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const docRef = await newsRef.add(newNews);
        result = {
          id: docRef.id,
          ...newNews
        };
      }
      
      return NextResponse.json({
        success: true,
        message: body.id ? 'Haber başarıyla güncellendi' : 'Haber başarıyla eklendi',
        updatedData: result
      });
    } catch (error) {
      console.error('Session doğrulama hatası:', error);
      return NextResponse.json(
        { success: false, message: 'Oturum doğrulanamadı' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Haber güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'İşlem başarısız', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE isteği - Haber sil
export async function DELETE(request: Request) {
  try {
    // URL'den ID parametresini al
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Haber ID\'si gereklidir' },
        { status: 400 }
      );
    }
    
    // Session cookie kontrolü
    const sessionCookie = cookies().get('session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, message: 'Oturum bulunamadı' },
        { status: 401 }
      );
    }
    
    try {
      // Firebase ile session doğrulama
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userId = decodedClaims.uid;
      
      if (!userId) {
        return NextResponse.json(
          { success: false, message: 'Geçersiz oturum' },
          { status: 401 }
        );
      }
      
      // Admin yetkisi kontrolü
      const adminRef = adminDb.collection('admin_users').doc(userId);
      const adminDoc = await adminRef.get();
      
      if (!adminDoc.exists) {
        return NextResponse.json(
          { success: false, message: 'Bu işlem için yetkiniz bulunmuyor' },
          { status: 403 }
        );
      }
      
      // Haberi sil
      await adminDb.collection('news').doc(id).delete();
      
      return NextResponse.json({
        success: true,
        message: 'Haber başarıyla silindi'
      });
    } catch (error) {
      console.error('Session doğrulama hatası:', error);
      return NextResponse.json(
        { success: false, message: 'Oturum doğrulanamadı' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Haber silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'İşlem başarısız', error: (error as Error).message },
      { status: 500 }
    );
  }
} 