// Firebase client kullanımına geçiş için yönlendirme dosyası
import { app, auth, db, storage, analytics } from '../firebase/client';

export function createClient() {
  // Firebase kullanımı için uyumluluk katmanı
  return {
    auth: {
      signOut: () => auth.signOut(),
      getUser: () => auth.currentUser
    },
    // İhtiyaç duyulan diğer Firebase hizmetleri eklenebilir
  };
}

// Firebase servislerini direkt olarak dışa aktarıyoruz
export { app, auth, db, storage, analytics };