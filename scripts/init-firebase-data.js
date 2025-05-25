// Initialize Firebase with sample data for testing
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Helper function to create SVG data URIs for placeholders
function createPlaceholderSVG(width, height, text, bgColor = '#f3f4f6', textColor = '#6b7280') {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${Math.floor(width/15)}px" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Define placeholder images
const placeholders = {
  news: createPlaceholderSVG(800, 400, 'News Image', '#e6f2ff', '#3b82f6'),
  press: createPlaceholderSVG(800, 400, 'Press Coverage', '#fff7ed', '#f97316'),
  gallery: createPlaceholderSVG(800, 600, 'Gallery Image', '#f0fdf4', '#22c55e'),
  history: createPlaceholderSVG(800, 400, 'History Image', '#fef2f2', '#ef4444'),
  boardMember: createPlaceholderSVG(300, 400, 'Board Member', '#fffbeb', '#eab308'),
  historyEvents: createPlaceholderSVG(600, 400, 'Event Image', '#faf5ff', '#a855f7'),
  historyMembers: createPlaceholderSVG(600, 400, 'Members Image', '#f0f9ff', '#0ea5e9'),
};

// Check if credential file exists, otherwise use service account from env var
let serviceAccount;
const credentialPath = path.join(__dirname, '../firebase-credentials.json');

if (fs.existsSync(credentialPath)) {
  serviceAccount = require(credentialPath);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  console.error('No Firebase credentials found. Please provide firebase-credentials.json or set FIREBASE_SERVICE_ACCOUNT env var.');
  process.exit(1);
}

// Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeData() {
  console.log('Starting Firebase data initialization...');
  
  try {
    // Create sample history content
    await db.collection('history').doc('main').set({
      content: '<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneğimiz, 2005 yılında kurulmuştur. Derneğimiz, Ordu ilinden İzmir\'e göç eden vatandaşlarımızın dayanışma ve yardımlaşma ihtiyaçlarını karşılamak amacıyla kurulmuştur.</p><p>Kurulduğumuz günden bu yana pek çok sosyal ve kültürel etkinlik düzenleyerek hemşehrilerimiz arasındaki bağları güçlendirmeye çalışıyoruz.</p>',
      mainImageUrl: placeholders.history,
      foundingDate: '2005',
      foundingPresident: 'Ali Yılmaz',
      legalStatus: 'Dernek',
      initialMemberCount: '50',
      currentMemberCount: '450',
      milestones: [
        {
          id: '1',
          year: '2005',
          title: 'Kuruluş',
          description: 'Derneğimiz İzmir\'de kuruldu.'
        },
        {
          id: '2',
          year: '2010',
          title: '5. Yıl Kutlamaları',
          description: 'Derneğimiz 5. yılını coşkuyla kutladı.'
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
          url: placeholders.historyEvents,
          caption: 'Dernek Etkinlikleri'
        },
        {
          id: '2',
          url: placeholders.historyMembers,
          caption: 'Dernek Üyelerimiz'
        }
      ],
      updatedAt: new Date().toISOString()
    });
    console.log('History content created');
    
    // Create sample contact info
    await db.collection('contact_info').doc('main').set({
      address: 'İzmir, Konak Mah. Atatürk Cad. No:123',
      phone: '+90 232 123 45 67',
      email: 'info@izorder.org',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12499.249563179332!2d27.134046387646456!3d38.41916252162583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd8e3a0e3e185%3A0x7bd6d7152596bcfa!2zS29uYWssIEtvbmFrL8Swem1pcg!5e0!3m2!1str!2str!4v1623345678901!5m2!1str!2str',
      socialMedia: {
        facebook: 'https://facebook.com/izorder',
        instagram: 'https://instagram.com/izorder'
      },
      updatedAt: new Date().toISOString()
    });
    console.log('Contact info created');
    
    // Create sample news items
    const newsCollection = db.collection('news');
    await newsCollection.add({
      title: 'Derneğimizin Yeni Projesi Başladı',
      summary: 'İzorder\'in yeni sosyal sorumluluk projesi bugün başladı.',
      content: '<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneğimizin yeni sosyal sorumluluk projesi bugün başladı. Proje kapsamında ihtiyaç sahibi öğrencilere burs ve eğitim desteği sağlanacak.</p><p>Dernek başkanımız, projenin İzmir\'deki Ordulu öğrenciler için önemli bir destek olacağını belirtti.</p>',
      imageUrl: placeholders.news,
      date: new Date().toISOString(),
      slug: 'dernegimizin-yeni-projesi-basladi',
      author: 'İzorder Yönetimi'
    });
    console.log('Sample news created');
    
    // Create sample board members
    const boardCollection = db.collection('board_members');
    await boardCollection.add({
      name: 'Mehmet',
      surname: 'Yılmaz',
      title: 'Dernek Başkanı',
      bio: 'Mehmet Yılmaz, 2018 yılından beri derneğimizin başkanlığını yürütmektedir.',
      imageUrl: placeholders.boardMember,
      isFounder: false,
      order: 1
    });
    
    await boardCollection.add({
      name: 'Ayşe',
      surname: 'Kaya',
      title: 'Dernek Başkan Yardımcısı',
      bio: 'Ayşe Kaya, 2019 yılından beri derneğimizin başkan yardımcılığını yürütmektedir.',
      imageUrl: placeholders.boardMember,
      isFounder: false,
      order: 2
    });
    console.log('Sample board members created');
    
    // Create sample gallery images
    const galleryCollection = db.collection('gallery_images');
    await galleryCollection.add({
      title: 'Yıl Sonu Etkinliği',
      description: '2022 yılı sonu etkinliğimizden bir kare',
      url: placeholders.gallery,
      date: new Date().toISOString(),
      category: 'Etkinlikler'
    });
    
    await galleryCollection.add({
      title: 'Yardım Kampanyası',
      description: 'Derneğimizin düzenlediği yardım kampanyasından bir görüntü',
      url: placeholders.gallery,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      category: 'Yardım Kampanyaları'
    });
    console.log('Sample gallery images created');
    
    // Create sample press coverage
    const pressCollection = db.collection('press_coverage');
    await pressCollection.add({
      title: 'İzorder\'in Başarılı Projeleri Yerel Basında',
      summary: 'İzmir Ordu Derneği\'nin başarılı çalışmaları yerel basında geniş yer buldu.',
      content: '<p>İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği\'nin son dönemde hayata geçirdiği sosyal sorumluluk projeleri yerel basında geniş yer buldu.</p><p>İzmir Gazetesi\'nde yer alan haberde, derneğin özellikle eğitim alanındaki destekleri övgüyle bahsedildi.</p>',
      imageUrl: placeholders.press,
      date: new Date().toISOString(),
      source: 'İzmir Gazetesi',
      slug: 'izorderin-basarili-projeleri-yerel-basinda',
      externalUrl: 'https://example.com/haber/izorder'
    });
    console.log('Sample press coverage created');
    
    console.log('Firebase data initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
}

initializeData()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  }); 