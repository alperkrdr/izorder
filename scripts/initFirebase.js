// This script initializes Firebase collections with some basic data
// Run with: node scripts/initFirebase.js

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK
try {
  // Service account credentials
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };

  // Initialize the admin app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
  process.exit(1);
}

// Get Firestore instance
const db = admin.firestore();

// Create an admin user
async function createAdminUser() {
  try {
    // Check if user exists
    const email = 'admin@izorder.org';
    const password = 'Admin123!';
    
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log('Admin user already exists');
    } catch (error) {
      // User doesn't exist, create it
      user = await admin.auth().createUser({
        email,
        password,
        displayName: 'Admin User',
      });
      console.log('Admin user created successfully');
    }
    
    // Add user to admin_users collection
    await db.collection('admin_users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || 'Admin User',
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log('Admin user added to admin_users collection');
    
    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

// Create sample news
async function createSampleNews() {
  try {
    const newsCollection = db.collection('news');
    
    // Check if news collection is empty
    const snapshot = await newsCollection.limit(1).get();
    if (!snapshot.empty) {
      console.log('News collection already has data, skipping sample news creation');
      return;
    }
    
    // Sample news data
    const sampleNews = [
      {
        title: 'Derneğimizin Yeni Web Sitesi Yayında',
        summary: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği olarak yeni web sitemiz yayına girmiştir.',
        content: '<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği olarak yeni web sitemiz yayına girmiştir. Yeni web sitemizde derneğimizin faaliyetleri, etkinliklerimiz ve haberlerimizi takip edebilirsiniz.</p><p>Sitemizin hazırlanmasında emeği geçen herkese teşekkür ederiz.</p>',
        imageUrl: 'https://picsum.photos/id/1/800/400',
        date: new Date().toISOString(),
        slug: 'dernegimizin-yeni-web-sitesi-yayinda',
        author: 'Dernek Yönetimi',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'Geleneksel İftar Yemeğimiz Gerçekleşti',
        summary: 'Derneğimizin düzenlediği geleneksel iftar yemeği büyük bir katılımla gerçekleşti.',
        content: '<p>Derneğimizin her yıl düzenlediği geleneksel iftar yemeği bu yıl da büyük bir katılımla gerçekleşti. Üyelerimiz ve ailelerinin katıldığı etkinlikte, hemşehrilerimizle bir araya geldik.</p><p>İftar yemeğimize katılan tüm üyelerimize ve misafirlerimize teşekkür ederiz.</p>',
        imageUrl: 'https://picsum.photos/id/2/800/400',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        slug: 'geleneksel-iftar-yemegimiz-gerceklesti',
        author: 'Dernek Yönetimi',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Yeni Yönetim Kurulumuz Göreve Başladı',
        summary: 'Derneğimizin yeni yönetim kurulu seçimleri sonucunda göreve başladı.',
        content: '<p>Derneğimizin olağan genel kurulu sonucunda seçilen yeni yönetim kurulumuz göreve başlamıştır. Yeni yönetim kurulumuz, derneğimizin faaliyetlerini daha da geliştirmek ve hemşehrilerimize daha iyi hizmet vermek için çalışmalarına başlamıştır.</p><p>Yeni yönetim kurulumuza başarılar dileriz.</p>',
        imageUrl: 'https://picsum.photos/id/3/800/400',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        slug: 'yeni-yonetim-kurulumuz-goreve-basladi',
        author: 'Dernek Yönetimi',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Add sample news to Firestore
    for (const news of sampleNews) {
      await newsCollection.add(news);
    }
    
    console.log('Sample news created successfully');
  } catch (error) {
    console.error('Error creating sample news:', error);
    throw error;
  }
}

// Create sample history content
async function createSampleHistory() {
  try {
    const historyRef = db.collection('history_content').doc('main');
    
    // Check if history document exists
    const doc = await historyRef.get();
    if (doc.exists) {
      console.log('History content already exists, skipping sample history creation');
      return;
    }
    
    // Sample history data
    const historyData = {
      content: '<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneğimiz, 2005 yılında kurulmuştur. Derneğimiz, İzmir\'de yaşayan Ordulu hemşehrilerimizin bir araya gelmesini, dayanışmasını ve kültürel değerlerimizin yaşatılmasını amaçlamaktadır.</p><p>Kuruluşundan bu yana çeşitli sosyal ve kültürel etkinlikler düzenleyen derneğimiz, hemşehrilerimizin sorunlarına çözüm bulmak ve onların İzmir\'deki yaşamlarını kolaylaştırmak için çalışmaktadır.</p>',
      mainImageUrl: 'https://picsum.photos/id/10/800/400',
      foundingDate: '2005',
      foundingPresident: 'Ahmet Yılmaz',
      legalStatus: 'Resmi Dernek',
      initialMemberCount: '35',
      currentMemberCount: '250',
      milestones: [
        {
          id: '1',
          year: '2005',
          title: 'Derneğimizin Kuruluşu',
          description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği kuruldu.'
        },
        {
          id: '2',
          year: '2010',
          title: 'İlk Büyük Etkinlik',
          description: 'Derneğimizin ilk büyük etkinliği olan "Ordu Günleri" düzenlendi.'
        },
        {
          id: '3',
          year: '2015',
          title: 'Yeni Dernek Binası',
          description: 'Derneğimiz yeni binasına taşındı.'
        }
      ],
      additionalImages: [
        {
          id: '1',
          url: 'https://picsum.photos/id/11/800/400',
          caption: 'Derneğimizin Kuruluş Toplantısı'
        },
        {
          id: '2',
          url: 'https://picsum.photos/id/12/800/400',
          caption: '10. Yıl Kutlaması'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add sample history to Firestore
    await historyRef.set(historyData);
    
    console.log('Sample history created successfully');
  } catch (error) {
    console.error('Error creating sample history:', error);
    throw error;
  }
}

// Create sample board members
async function createSampleBoardMembers() {
  try {
    const boardCollection = db.collection('board_members');
    
    // Check if board_members collection is empty
    const snapshot = await boardCollection.limit(1).get();
    if (!snapshot.empty) {
      console.log('Board members collection already has data, skipping sample board members creation');
      return;
    }
    
    // Sample board members data
    const sampleBoardMembers = [
      {
        name: 'Mehmet Yılmaz',
        title: 'Başkan',
        imageUrl: 'https://picsum.photos/id/20/400/400',
        bio: 'Dernek başkanımız Mehmet Yılmaz, 2005 yılından beri derneğimize hizmet etmektedir.',
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'Ayşe Kaya',
        title: 'Başkan Yardımcısı',
        imageUrl: 'https://picsum.photos/id/21/400/400',
        bio: 'Başkan Yardımcımız Ayşe Kaya, derneğimizin kurucu üyelerindendir.',
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'Ali Demir',
        title: 'Genel Sekreter',
        imageUrl: 'https://picsum.photos/id/22/400/400',
        bio: 'Genel Sekreterimiz Ali Demir, derneğimizin tüm resmi işlemlerini yürütmektedir.',
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'Fatma Şahin',
        title: 'Sayman',
        imageUrl: 'https://picsum.photos/id/23/400/400',
        bio: 'Saymanımız Fatma Şahin, derneğimizin mali işlerini yürütmektedir.',
        order: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'Hasan Yıldız',
        title: 'Üye',
        imageUrl: 'https://picsum.photos/id/24/400/400',
        bio: 'Yönetim kurulu üyemiz Hasan Yıldız, derneğimizin etkinliklerinin organizasyonunda görev almaktadır.',
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Add sample board members to Firestore
    for (const member of sampleBoardMembers) {
      await boardCollection.add(member);
    }
    
    console.log('Sample board members created successfully');
  } catch (error) {
    console.error('Error creating sample board members:', error);
    throw error;
  }
}

// Create sample press coverage
async function createSamplePressCoverage() {
  try {
    const pressCollection = db.collection('press_coverage');
    
    // Check if press_coverage collection is empty
    const snapshot = await pressCollection.limit(1).get();
    if (!snapshot.empty) {
      console.log('Press coverage collection already has data, skipping sample press coverage creation');
      return;
    }
    
    // Sample press coverage data
    const samplePressCoverage = [
      {
        title: 'İzmir\'deki Ordulular Bir Araya Geldi',
        source: 'İzmir Gazetesi',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        imageUrl: 'https://picsum.photos/id/30/800/400',
        content: '<p>İzmir\'de yaşayan Ordulu hemşehriler, İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği\'nin düzenlediği etkinlikte bir araya geldi.</p>',
        externalUrl: 'https://example.com/news/1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'Ordu Kültürü İzmir\'de Yaşatılıyor',
        source: 'Anadolu Ajansı',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        imageUrl: 'https://picsum.photos/id/31/800/400',
        content: '<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği, Ordu kültürünü İzmir\'de yaşatmak için çeşitli etkinlikler düzenliyor.</p>',
        externalUrl: 'https://example.com/news/2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'İzmir\'deki Ordululardan Anlamlı Yardım',
        source: 'Ordu Haberleri',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        imageUrl: 'https://picsum.photos/id/32/800/400',
        content: '<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği, Ordu\'daki ihtiyaç sahibi öğrencilere burs desteği sağladı.</p>',
        externalUrl: 'https://example.com/news/3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Add sample press coverage to Firestore
    for (const press of samplePressCoverage) {
      await pressCollection.add(press);
    }
    
    console.log('Sample press coverage created successfully');
  } catch (error) {
    console.error('Error creating sample press coverage:', error);
    throw error;
  }
}

// Create sample gallery images
async function createSampleGalleryImages() {
  try {
    const galleryCollection = db.collection('gallery_images');
    
    // Check if gallery_images collection is empty
    const snapshot = await galleryCollection.limit(1).get();
    if (!snapshot.empty) {
      console.log('Gallery images collection already has data, skipping sample gallery images creation');
      return;
    }
    
    // Sample gallery images data
    const sampleGalleryImages = [
      {
        title: 'Dernek Binası Açılışı',
        description: 'Derneğimizin yeni binasının açılış töreni',
        imageUrl: 'https://picsum.photos/id/40/800/600',
        category: 'Etkinlikler',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'İftar Yemeği',
        description: 'Geleneksel iftar yemeğimizden bir kare',
        imageUrl: 'https://picsum.photos/id/41/800/600',
        category: 'Etkinlikler',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'Ordu Günleri',
        description: 'İzmir\'de düzenlenen Ordu Günleri etkinliğinden bir görüntü',
        imageUrl: 'https://picsum.photos/id/42/800/600',
        category: 'Etkinlikler',
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'Yönetim Kurulu Toplantısı',
        description: 'Yönetim kurulumuzun aylık olağan toplantısı',
        imageUrl: 'https://picsum.photos/id/43/800/600',
        category: 'Toplantılar',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Add sample gallery images to Firestore
    for (const image of sampleGalleryImages) {
      await galleryCollection.add(image);
    }
    
    console.log('Sample gallery images created successfully');
  } catch (error) {
    console.error('Error creating sample gallery images:', error);
    throw error;
  }
}

// Create sample contact info
async function createSampleContactInfo() {
  try {
    const contactRef = db.collection('contact_info').doc('main');
    
    // Check if contact document exists
    const doc = await contactRef.get();
    if (doc.exists) {
      console.log('Contact info already exists, skipping sample contact info creation');
      return;
    }
    
    // Sample contact info data
    const contactData = {
      address: 'Konak Mahallesi, Atatürk Caddesi No: 123, 35000 Konak/İzmir',
      phone: '+90 232 123 45 67',
      email: 'info@izorder.org',
      workingHours: 'Pazartesi - Cuma: 09:00 - 17:00',
      googleMapsUrl: 'https://goo.gl/maps/1234567890',
      socialMedia: {
        facebook: 'https://facebook.com/izorder',
        twitter: 'https://twitter.com/izorder',
        instagram: 'https://instagram.com/izorder'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add sample contact info to Firestore
    await contactRef.set(contactData);
    
    console.log('Sample contact info created successfully');
  } catch (error) {
    console.error('Error creating sample contact info:', error);
    throw error;
  }
}

// Main function to run all initialization tasks
async function main() {
  try {
    await createAdminUser();
    await createSampleNews();
    await createSampleHistory();
    await createSampleBoardMembers();
    await createSamplePressCoverage();
    await createSampleGalleryImages();
    await createSampleContactInfo();
    
    console.log('Firebase initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 