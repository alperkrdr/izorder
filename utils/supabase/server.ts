// Firebase Admin SDK kullanımına geçiş için yönlendirme dosyası
import { adminAuth, adminDb, adminStorage } from '../firebase/admin';
import { cookies } from 'next/headers';

export async function createClient() {
  // Firebase Admin SDK için uyumluluk katmanı
  return {
    auth: adminAuth,
    firestore: adminDb,
    storage: adminStorage,
    // Çerez işlemleri için yardımcı fonksiyonlar
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookies().set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookies().set({ name, value: '', ...options });
      }
    }
  };
}

// Firebase Admin servislerini direkt olarak dışa aktarıyoruz
export { adminAuth, adminDb, adminStorage };