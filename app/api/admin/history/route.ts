import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/admin';
import { cookies } from 'next/headers';

// GET isteği - Tarihçe verilerini getir
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
      
      // Firestore'dan tarihçe verilerini al
      const historyRef = adminDb.collection('history_content').doc('main');
      const doc = await historyRef.get();
      
      if (!doc.exists) {
        return NextResponse.json({ 
          success: true, 
          data: {
            content: "<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneğimiz, 2005 yılında kurulmuştur...</p>",
            mainImageUrl: "/images/history-main.jpg",
            foundingDate: "2005",
            foundingPresident: "Ahmet Yılmaz",
            legalStatus: "Resmi Dernek",
            initialMemberCount: "35",
            currentMemberCount: "250",
            milestones: [],
            additionalImages: []
          }
        });
      }
      
      return NextResponse.json({ success: true, data: doc.data() });
    } catch (error) {
      console.error('Session doğrulama hatası:', error);
      return NextResponse.json(
        { success: false, message: 'Oturum doğrulanamadı' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Veri alınamadı', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT isteği - Tarihçe verilerini güncelle
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
      if (!body.content) {
        return NextResponse.json(
          { success: false, message: 'İçerik alanı zorunludur' },
          { status: 400 }
        );
      }
      
      // Tarihçe verisini güncelle
      const historyRef = adminDb.collection('history_content').doc('main');
      
      // Güncellenecek veriyi hazırla
      const historyData = {
        content: body.content,
        mainImageUrl: body.mainImageUrl || '/images/history-main.jpg',
        foundingDate: body.foundingDate || '',
        foundingPresident: body.foundingPresident || '',
        legalStatus: body.legalStatus || '',
        initialMemberCount: body.initialMemberCount || '',
        currentMemberCount: body.currentMemberCount || '',
        milestones: body.milestones || [],
        additionalImages: body.additionalImages || [],
        updatedAt: new Date().toISOString()
      };
      
      // Veriyi güncelle (veya oluştur)
      await historyRef.set(historyData, { merge: true });
      
      // Güncel veriyi al
      const updatedDoc = await historyRef.get();
      
      return NextResponse.json({
        success: true,
        message: 'Tarihçe içeriği başarıyla güncellendi',
        updatedData: updatedDoc.data()
      });
    } catch (error) {
      console.error('Session doğrulama hatası:', error);
      return NextResponse.json(
        { success: false, message: 'Oturum doğrulanamadı' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('History update error:', error);
    return NextResponse.json(
      { success: false, message: 'İşlem başarısız', error: (error as Error).message },
      { status: 500 }
    );
  }
} 