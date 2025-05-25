# Firebase Setup Instructions

Bu rehber, İzorder uygulaması için Firebase'i nasıl kuracağınızı ve yapılandıracağınızı açıklar.

## 1. Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com)'a gidin ve Google hesabınızla giriş yapın.
2. "Proje Ekle" butonuna tıklayın.
3. Proje adı olarak "izorder" (veya istediğiniz bir ad) girin.
4. Google Analytics'i etkinleştirin (isteğe bağlı) ve projeyi oluşturun.

## 2. Firebase Servislerini Etkinleştirme

### Authentication

1. Firebase konsolunda, "Authentication" bölümüne gidin.
2. "Sign-in method" sekmesinde, "Email/Password" seçeneğini etkinleştirin.
3. Admin kullanıcıları oluşturmak için "Users" sekmesine gidin ve "Add user" butonuna tıklayın.
4. Yönetici e-posta adresi ve şifresini girin ve kullanıcıyı oluşturun.

### Firestore Database

1. Firebase konsolunda, "Firestore Database" bölümüne gidin.
2. "Create database" butonuna tıklayın.
3. "Start in production mode" seçeneğini seçin (önerilen) ve "Next" tıklayın.
4. Bölge olarak size en yakın bölgeyi seçin (örn. "eur3" - Avrupa) ve "Enable" tıklayın.
5. Veritabanı oluşturulduktan sonra, şu koleksiyonları oluşturun:
   - `news`
   - `press_coverage`
   - `announcements`
   - `board_members`
   - `gallery_images`
   - `contact_info`
   - `activities`
   - `history_content`
   - `admin_users`

### Storage

1. Firebase konsolunda, "Storage" bölümüne gidin.
2. "Get started" butonuna tıklayın.
3. Varsayılan güvenlik kurallarını kabul edin ve "Next" tıklayın.
4. Bölge olarak Firestore Database için seçtiğiniz aynı bölgeyi seçin ve "Done" tıklayın.

## 3. Firebase Admin SDK Ayarları

1. Firebase konsolunda, "Project settings" (dişli simgesi) bölümüne gidin.
2. "Service accounts" sekmesine gidin.
3. "Generate new private key" butonuna tıklayın ve indirilen JSON dosyasını güvenli bir yerde saklayın.
4. Bu dosyadaki bilgileri kullanarak `.env.local` dosyanızdaki şu değişkenleri doldurun:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`

## 4. Firebase Web SDK Ayarları

1. Firebase konsolunda, "Project settings" bölümüne gidin.
2. "General" sekmesinde, "Your apps" bölümünde "</>" simgesine tıklayarak yeni bir web uygulaması ekleyin.
3. Uygulama takma adı olarak "izorder-web" girin ve "Register app" tıklayın.
4. Firebase yapılandırma nesnesini (SDK yapılandırması) kopyalayın ve `.env.local` dosyanızdaki şu değişkenleri doldurun:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

## 5. Admin Kullanıcıları Yapılandırma

Kullanıcıları admin olarak işaretlemek için Firebase Authentication kullanıcılarını Firestore'daki `admin_users` koleksiyonuna ekleyin:

1. Firebase Authentication'da oluşturduğunuz kullanıcının UID'sini alın.
2. Firebase Firestore'da `admin_users` koleksiyonuna gidin.
3. Kullanıcının UID'sini koleksiyona belge ID'si olarak ekleyin ve içeriğine basit bir boolean değeri ekleyin:
   ```
   {
     "isAdmin": true
   }
   ```

## 6. Çevresel Değişkenleri Ayarlama

Projenin kök dizininde bir `.env.local` dosyası oluşturun ve şu değişkenleri doldurun:

```
# Firebase Client SDK Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK Configuration (Server-side, Private)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

## 7. Firestore Güvenlik Kuralları

Firestore güvenlik kurallarını yapılandırmak için Firebase konsolunda "Firestore Database" > "Rules" sekmesine gidin ve şu kuralları ekleyin:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin users can read and write all documents
    match /{document=**} {
      allow read, write: if request.auth != null && exists(/databases/$(database)/documents/admin_users/$(request.auth.uid));
    }
    
    // Public can read specific collections
    match /news/{document} {
      allow read: if true;
    }
    match /press_coverage/{document} {
      allow read: if true;
    }
    match /announcements/{document} {
      allow read: if true;
    }
    match /board_members/{document} {
      allow read: if true;
    }
    match /gallery_images/{document} {
      allow read: if true;
    }
    match /contact_info/{document} {
      allow read: if true;
    }
    match /history_content/{document} {
      allow read: if true;
    }
  }
}
```

## 8. Storage Güvenlik Kuralları

Storage güvenlik kurallarını yapılandırmak için Firebase konsolunda "Storage" > "Rules" sekmesine gidin ve şu kuralları ekleyin:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Admin users can upload and delete files
    match /{allPaths=**} {
      allow write, delete: if request.auth != null && 
                            firestore.exists(/databases/(default)/documents/admin_users/$(request.auth.uid));
      allow read: if true; // Public can read all files
    }
  }
}
```

## 9. Uygulamayı Çalıştırma

Tüm yapılandırmalar tamamlandıktan sonra, uygulamayı geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Artık admin panelini `http://localhost:3000/admin` adresinden ziyaret edebilir ve Firebase ile yönetilen içeriği düzenleyebilirsiniz. Giriş yapmak için Firebase Authentication'da oluşturduğunuz ve `admin_users` koleksiyonuna eklediğiniz kullanıcı bilgilerini kullanın. 