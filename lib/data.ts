import { 
  NewsItem, 
  PressCoverageItem, 
  Announcement, 
  BoardMember, 
  GalleryImage, 
  ContactInfo,
  DashboardStats,
  Activity,
  HistoryContent
} from '@/types';

// Mock News Data
const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'Derneğimizin Kuruluş Yıldönümünü Kutladık',
    summary: 'İzmir-Ordu Kültür ve Dayanışma Derneği olarak 5. kuruluş yıldönümümüzü coşkuyla kutladık.',
    content: `
      <p>İzmir-Ordu Kültür ve Dayanışma Derneği olarak 5. kuruluş yıldönümümüzü coşkuyla kutladık. Etkinliğimize üyelerimiz ve ailelerinin yanı sıra çok sayıda davetli katıldı.</p>
      
      <p>Dernek başkanımız Ahmet Yılmaz açılış konuşmasında, derneğimizin kuruluşundan bu yana gerçekleştirdiği faaliyetleri ve gelecek planlarını paylaştı. Ayrıca, derneğe katkı sağlayan üyelere teşekkür plaketleri takdim edildi.</p>
      
      <p>Horon ve kemençe gösterileriyle devam eden gecede, Ordu yöresine özgü lezzetler ikram edildi. Etkinliğimiz, geleneksel halk oyunları gösterisi ve müzik dinletisiyle sona erdi.</p>
      
      <p>Bu özel günde bizimle olan tüm üyelerimize ve misafirlerimize teşekkür ederiz.</p>
    `,
    imageUrl: 'https://picsum.photos/id/1018/1200/800',
    date: '15 Mart 2023',
    slug: 'dernegimizin-kurulus-yildonumunu-kutladik',
    author: 'Dernek Yönetimi'
  },
  {
    id: '2',
    title: 'Geleneksel Yaza Merhaba Pikniğimiz Gerçekleşti',
    summary: 'Her yıl düzenlediğimiz "Yaza Merhaba" pikniğimizi bu yıl da büyük bir katılımla gerçekleştirdik.',
    content: `
      <p>Her yıl düzenlediğimiz "Yaza Merhaba" pikniğimizi bu yıl da büyük bir katılımla gerçekleştirdik. İzmir Karagöl Tabiat Parkı'nda gerçekleşen etkinliğimize 250'den fazla dernek üyemiz ve aileleri katıldı.</p>
      
      <p>Sabah saatlerinde başlayan pikniğimizde, çocuklar için çeşitli oyun etkinlikleri düzenlendi. Öğle vakti hep birlikte gerçekleştirdiğimiz mangal keyfi, ardından yapılan voleybol, futbol ve geleneksel oyunlarla devam etti.</p>
      
      <p>Pikniğimizde ayrıca, derneğimizin yeni üyeleriyle tanışma ve kaynaşma fırsatı da bulduk. Etkinlik sonunda, hep birlikte çekilen hatıra fotoğrafıyla günü sonlandırdık.</p>
      
      <p>Katılan tüm üyelerimize ve organizasyonda emeği geçen yönetim kurulu üyelerimize teşekkür ederiz.</p>
    `,
    imageUrl: 'https://picsum.photos/id/1019/1200/800',
    date: '5 Haziran 2023',
    slug: 'geleneksel-yaza-merhaba-piknigimiz-gerceklesti',
    author: 'Etkinlik Komitesi'
  },
  {
    id: '3',
    title: 'Ordulu Öğrencilere Burs Desteği Programımız Başladı',
    summary: 'İzmir\'de öğrenim gören Ordulu öğrencilere yönelik burs programımızın başvuruları başladı.',
    content: `
      <p>İzmir'de öğrenim gören Ordulu öğrencilere yönelik burs programımızın 2023-2024 eğitim yılı başvuruları başladı. Bu yıl 25 üniversite öğrencisine 9 ay boyunca burs desteği sağlayacağız.</p>
      
      <p>Başvurular 1-30 Eylül 2023 tarihleri arasında derneğimizin web sitesi üzerinden online olarak yapılabilecektir. Detaylı bilgi ve başvuru şartları için lütfen web sitemizin "Burs Başvurusu" bölümünü ziyaret ediniz.</p>
      
      <p>Burs programımıza maddi destekte bulunmak isteyen üyelerimiz ve hayırseverler, derneğimizle iletişime geçebilir. Geleceğimizin teminatı olan gençlerimize destek olmak için tüm üyelerimizi ve hemşehrilerimizi dayanışmaya davet ediyoruz.</p>
      
      <p>Eğitimde fırsat eşitliği için el ele!</p>
    `,
    imageUrl: 'https://picsum.photos/id/1035/1200/800',
    date: '1 Eylül 2023',
    slug: 'ordulu-ogrencilere-burs-destegi-programimiz-basladi',
    author: 'Eğitim Komisyonu'
  },
  {
    id: '4',
    title: 'Geleneksel Kış Yardımlaşma Kampanyası',
    summary: 'Ordu\'nun köylerindeki ihtiyaç sahibi ailelere yönelik kış yardımlaşma kampanyamız başladı.',
    content: `
      <p>Ordu'nun köylerindeki ihtiyaç sahibi ailelere yönelik geleneksel kış yardımlaşma kampanyamız başladı. Her yıl olduğu gibi bu yıl da Ordu'nun dağ köylerinde yaşayan ve ekonomik zorluk çeken ailelere kışlık giysi, gıda ve yakacak yardımı ulaştıracağız.</p>
      
      <p>Kampanyamıza katkıda bulunmak isteyen üyelerimiz, bağışlarını dernek merkezimize veya web sitemiz üzerinden yapabilirler. Ayni yardımlar için dernek merkezimize teslim saatleri: Hafta içi 10:00-18:00, hafta sonu 10:00-14:00 arasıdır.</p>
      
      <p>Toplanan yardımlar, dernek yönetim kurulu üyelerimiz tarafından 15-20 Kasım tarihleri arasında bizzat ailelere teslim edilecektir.</p>
      
      <p>Dayanışmanın gücüyle, kimse soğukta kalmasın!</p>
    `,
    imageUrl: 'https://picsum.photos/id/1056/1200/800',
    date: '15 Ekim 2023',
    slug: 'geleneksel-kis-yardimlasma-kampanyasi',
    author: 'Sosyal Yardım Komisyonu'
  },
  {
    id: '5',
    title: 'İzmir-Ordu Kültür Gecesi Büyük İlgi Gördü',
    summary: 'Düzenlediğimiz İzmir-Ordu Kültür Gecesi\'ne katılım yoğundu. Etkinlikte Ordu kültürünün zenginlikleri sergilendi.',
    content: `
      <p>Geçtiğimiz Cumartesi akşamı İzmir Kültür Merkezi'nde düzenlediğimiz "İzmir-Ordu Kültür Gecesi" büyük ilgi gördü. Salon kapasitesinin tamamının dolduğu etkinliğimiz, dernek başkanımızın açılış konuşmasıyla başladı.</p>
      
      <p>Gece boyunca, Ordu yöresine ait halk oyunları sergilendi, yöresel türküler seslendirildi. Ayrıca, genç sanatçılarımızdan Eda Yılmaz kemençe dinletisi sundu.</p>
      
      <p>Etkinlik kapsamında ayrıca, Ordu'nun geleneksel el sanatları örneklerinin yer aldığı bir sergi de ziyaretçilere açıldı. Yöresel lezzetlerin ikram edildiği gecede, katılımcılar Ordu kültürünün tadını çıkardı.</p>
      
      <p>Bu anlamlı gecede bizimle olan tüm misafirlerimize, sanatçılarımıza ve organizasyonda emeği geçen herkese teşekkür ederiz.</p>
    `,
    imageUrl: 'https://picsum.photos/id/1059/1200/800',
    date: '10 Kasım 2023',
    slug: 'izmir-ordu-kultur-gecesi-buyuk-ilgi-gordu',
    author: 'Kültür ve Sanat Komisyonu'
  },
  {
    id: '6',
    title: 'Derneğimizin Yeni Hizmet Binası Açıldı',
    summary: 'İzmir-Ordu Kültür ve Dayanışma Derneği olarak yeni hizmet binamızın açılışını gerçekleştirdik.',
    content: `
      <p>İzmir-Ordu Kültür ve Dayanışma Derneği olarak yeni hizmet binamızın açılışını gerçekleştirdik. Konak ilçesinde yer alan yeni binamız, üyelerimize daha iyi hizmet vermek için tasarlandı.</p>
      
      <p>Açılış töreni, İzmir Büyükşehir Belediye Başkanı, Konak Belediye Başkanı, Ordu'dan gelen misafirlerimiz ve çok sayıda üyemizin katılımıyla gerçekleşti. Kurdele kesimi ve açılış konuşmalarının ardından bina gezildi.</p>
      
      <p>Yeni binamızda, toplantı salonu, kütüphane, kafeterya ve çok amaçlı etkinlik salonu bulunmaktadır. Ayrıca, bilgisayar odası ve gençlik merkezi alanları da üyelerimizin hizmetine sunuldu.</p>
      
      <p>Yeni hizmet binamızın derneğimize ve tüm üyelerimize hayırlı olmasını dileriz.</p>
    `,
    imageUrl: 'https://picsum.photos/id/1071/1200/800',
    date: '5 Aralık 2023',
    slug: 'dernegimizin-yeni-hizmet-binasi-acildi',
    author: 'Dernek Yönetimi'
  }
];

// Mock Press Coverage Data
const pressCoverageData: PressCoverageItem[] = [
  {
    id: '1',
    title: 'İzmir-Ordu Kültür ve Dayanışma Derneği\'nin Yardım Kampanyası Ses Getirdi',
    summary: 'İzmir\'de faaliyet gösteren İzmir-Ordu Kültür ve Dayanışma Derneği\'nin başlattığı yardım kampanyası büyük ilgi gördü.',
    imageUrl: 'https://picsum.photos/id/1082/1200/800',
    date: '12 Ekim 2023',
    source: 'Ege Gazetesi',
    slug: 'izmir-ordu-kultur-ve-dayanisma-derneginin-yardim-kampanyasi-ses-getirdi',
    externalUrl: 'https://www.egegazetesi.com.tr/haber/izmir-ordu-dernegi-yardim'
  },
  {
    id: '2',
    title: 'Ordu Kültürü İzmir\'de Yaşatılıyor',
    summary: 'İzmir\'de yaşayan Ordulular, hemşehrilik bağlarını güçlendirmek ve kültürlerini yaşatmak için bir araya geliyor.',
    imageUrl: 'https://picsum.photos/id/1076/1200/800',
    date: '25 Kasım 2023',
    source: 'İzmir Haber',
    slug: 'ordu-kulturu-izmirde-yasatiliyor',
    externalUrl: 'https://www.izmirhaber.com.tr/kultur/ordu-kulturu-izmirde'
  },
  {
    id: '3',
    title: 'İzmirli Ordulular Dayanışma Gecesinde Buluştu',
    summary: 'İzmir-Ordu Kültür ve Dayanışma Derneği tarafından düzenlenen geceye katılım yoğundu.',
    imageUrl: 'https://picsum.photos/id/1074/1200/800',
    date: '15 Aralık 2023',
    source: 'Karadeniz Postası',
    slug: 'izmirli-ordulular-dayanisma-gecesinde-bulustu',
    externalUrl: 'https://www.karadenizpostasi.com/haber/izmir-ordu-gecesi'
  }
];

// Mock Announcements Data
const announcementsData: Announcement[] = [
  {
    id: '1',
    title: 'Olağan Genel Kurul Toplantısı',
    content: 'Derneğimizin yıllık olağan genel kurul toplantısı 15 Ocak 2024 Pazar günü saat 14:00\'te dernek merkezimizde yapılacaktır. Tüm üyelerimizin katılımını bekleriz.',
    date: '20 Aralık 2023',
    isImportant: true
  },
  {
    id: '2',
    title: 'Kış Şenliği Düzenlenecektir',
    content: 'Geleneksel kış şenliğimiz 20 Şubat 2024 tarihinde İzmir Fuar alanında gerçekleştirilecektir. Tüm üyelerimiz ve aileleri davetlidir.',
    date: '5 Ocak 2024',
    isImportant: false
  },
  {
    id: '3',
    title: 'Ordu Gezisi Kayıtları Başladı',
    content: 'Nisan ayında düzenlenecek Ordu gezimiz için kayıtlar başlamıştır. Kontenjan sınırlı olup, katılmak isteyen üyelerimizin dernek merkezimize başvurmaları rica olunur.',
    date: '10 Ocak 2024',
    isImportant: true
  }
];

// Mock Board Members Data
const boardMembersData: BoardMember[] = [
  {
    id: '1',
    name: 'Ahmet',
    surname: 'Yılmaz',
    title: 'Dernek Başkanı',
    bio: 'İzmir\'de 25 yıldır yaşayan Ahmet Yılmaz, Ordu\'nun Ünye ilçesi doğumludur. İş insanı olarak çalışan Yılmaz, derneğimizin kuruluşundan bu yana başkanlık görevini yürütmektedir.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    isFounder: true,
    order: 1
  },
  {
    id: '2',
    name: 'Fatma',
    surname: 'Kaya',
    title: 'Başkan Yardımcısı',
    bio: 'Eğitimci olan Fatma Kaya, Ordu Perşembe doğumludur. 15 yıldır İzmir\'de yaşamakta olup, derneğimizde çeşitli görevlerde bulunmuştur.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    isFounder: true,
    order: 2
  },
  {
    id: '3',
    name: 'Mehmet',
    surname: 'Demir',
    title: 'Genel Sekreter',
    bio: 'Ordu Fatsa doğumlu olan Mehmet Demir, İzmir\'e 20 yıl önce yerleşmiştir. Mali müşavir olarak çalışan Demir, derneğimizin kurucu üyelerindendir.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    isFounder: true,
    order: 3
  },
  {
    id: '4',
    name: 'Zeynep',
    surname: 'Şahin',
    title: 'Sayman',
    bio: 'Bankacı olan Zeynep Şahin, Ordu merkez doğumludur. 10 yıldır İzmir\'de yaşamaktadır.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    isFounder: false,
    order: 4
  },
  {
    id: '5',
    name: 'Hasan',
    surname: 'Öztürk',
    title: 'Üye',
    bio: 'Emekli öğretmen olan Hasan Öztürk, Ordu Akkuş ilçesi doğumludur. 30 yıldır İzmir\'de yaşamaktadır.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    isFounder: false,
    order: 5
  }
];

// Mock Gallery Images Data
const galleryImagesData: GalleryImage[] = [
  {
    id: '1',
    title: 'Kültür Gecesi',
    description: 'İzmir-Ordu Kültür Gecesi etkinliğinden bir kare',
    url: 'https://picsum.photos/id/1059/800/600',
    date: '10 Kasım 2023',
    category: 'Etkinlikler'
  },
  {
    id: '2',
    title: 'Yaza Merhaba Pikniği',
    description: 'Geleneksel piknik etkinliğimizden bir görüntü',
    url: 'https://picsum.photos/id/1082/800/600',
    date: '5 Haziran 2023',
    category: 'Piknik'
  },
  {
    id: '3',
    title: 'Horon Ekibimiz',
    description: 'Derneğimizin horon ekibi gösteri sırasında',
    url: 'https://picsum.photos/id/1070/800/600',
    date: '15 Mart 2023',
    category: 'Halk Oyunları'
  },
  {
    id: '4',
    title: 'Yeni Hizmet Binamız',
    description: 'Derneğimizin yeni hizmet binasının dış görünümü',
    url: 'https://picsum.photos/id/1076/800/600',
    date: '5 Aralık 2023',
    category: 'Dernek Merkezi'
  },
  {
    id: '5',
    title: 'Yönetim Kurulu Toplantısı',
    description: 'Dernek yönetim kurulumuz aylık olağan toplantısında',
    url: 'https://picsum.photos/id/1075/800/600',
    date: '20 Aralık 2023',
    category: 'Toplantılar'
  },
  {
    id: '6',
    title: 'Ordu Gezimiz',
    description: 'Dernek üyelerimizle Ordu iline düzenlediğimiz geziden bir görüntü',
    url: 'https://picsum.photos/id/1061/800/600',
    date: '25 Temmuz 2023',
    category: 'Geziler'
  }
];

// Mock Contact Info Data
const contactInfoData: ContactInfo = {
  address: 'Alsancak Mahallesi, 1456 Sokak, No: 12, Konak/İzmir',
  phone: '0232 123 45 67',
  email: 'info@izorder.org.tr',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12586.90843338867!2d27.1418!3d38.4288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbd9ca0ef200b9%3A0x340f84fcc56eb9f4!2sAlsancak%2C%20Konak%2F%C4%B0zmir!5e0!3m2!1str!2str!4v1641825286693!5m2!1str!2str',
  socialMedia: {
    facebook: 'https://www.facebook.com/izorder',
    instagram: 'https://www.instagram.com/izorder'
  }
};

// Mock Dashboard Data
const dashboardData = {
  stats: {
    totalNews: newsData.length,
    totalPressCoverage: pressCoverageData.length,
    totalGalleryImages: galleryImagesData.length,
    totalBoardMembers: boardMembersData.length
  },
  recentActivities: [
    {
      id: '1',
      action: 'Haber eklendi',
      user: 'admin',
      date: '5 Aralık 2023',
      entityType: 'news',
      entityId: '6'
    },
    {
      id: '2',
      action: 'Basın haberi eklendi',
      user: 'admin',
      date: '15 Aralık 2023',
      entityType: 'pressCoverage',
      entityId: '3'
    },
    {
      id: '3',
      action: 'Galeri görseli yüklendi',
      user: 'editor',
      date: '20 Aralık 2023',
      entityType: 'galleryImage',
      entityId: '5'
    }
  ] as Activity[]
};

// Mock History Content Data
const historyContentData: HistoryContent = {
  content: `
    <p>İzmir-Ordu Kültür ve Dayanışma Derneği (İZORDER), 2016 yılında İzmir'de yaşayan Ordulu hemşehrilerin bir araya gelmesiyle kurulmuştur. Derneğimiz, Ordu ilinden İzmir'e göç etmiş vatandaşlarımızın sosyal ve kültürel ihtiyaçlarını karşılamak, hemşehrilik bağlarını güçlendirmek ve Ordu kültürünü yaşatmak amacıyla faaliyetlerini sürdürmektedir.</p>
    
    <p>Kuruluşundan bu yana derneğimiz, üyelerimizin özverili çalışmaları ve destekleriyle hızla büyümüş, İzmir'deki hemşehri dernekleri arasında önemli bir konuma gelmiştir. Her yıl düzenlediğimiz kültürel etkinlikler, yardım kampanyaları ve sosyal organizasyonlarla hem Ordu kültürünü yaşatmaya hem de İzmir'deki Ordulu hemşehrilerimiz arasındaki dayanışmayı güçlendirmeye devam ediyoruz.</p>
    
    <p>Derneğimiz, faaliyetlerini daha verimli sürdürebilmek için 2020 yılında şu anki hizmet binasına taşınmış olup, üyelerimize daha geniş ve konforlu bir ortamda hizmet vermeye başlamıştır. Yönetim kurulumuz ve aktif üyelerimizin katkılarıyla her geçen yıl faaliyet alanlarımızı genişletmekte ve daha fazla hemşehrimize ulaşmayı hedeflemekteyiz.</p>
    
    <p>İzmir-Ordu Kültür ve Dayanışma Derneği olarak, gelecek nesillere kültürümüzü aktarmak, üyelerimiz arasında sosyal dayanışmayı sağlamak ve ihtiyaç sahibi hemşehrilerimize destek olmak temel misyonumuz olmaya devam edecektir.</p>
  `,
  mainImageUrl: 'https://picsum.photos/id/1018/800/600',
  foundingDate: '15 Mart 2016',
  foundingPresident: 'Ahmet Yılmaz',
  legalStatus: 'Resmi Dernek (Kültür ve Dayanışma Derneği)',
  initialMemberCount: '37',
  currentMemberCount: '412',
  milestones: [
    {
      year: '2016',
      description: 'İzmir-Ordu Kültür ve Dayanışma Derneği\'nin kuruluşu'
    },
    {
      year: '2017',
      description: 'İlk büyük kültür gecesinin düzenlenmesi'
    },
    {
      year: '2018',
      description: 'Ordulu öğrencilere burs programının başlatılması'
    },
    {
      year: '2019',
      description: 'İlk Ordu gezisinin düzenlenmesi'
    },
    {
      year: '2020',
      description: 'Yeni dernek binasına taşınılması'
    },
    {
      year: '2021',
      description: 'Üye sayısının 300\'ü aşması'
    },
    {
      year: '2022',
      description: 'Web sitesinin yenilenmesi ve dijital dönüşüm'
    }
  ],
  additionalImages: [
    {
      url: 'https://picsum.photos/id/1019/800/600',
      caption: 'Derneğimizin kuruluş toplantısı (2016)'
    },
    {
      url: 'https://picsum.photos/id/1035/800/600',
      caption: 'İlk kültür gecemizden bir kare (2017)'
    },
    {
      url: 'https://picsum.photos/id/1059/800/600',
      caption: 'Yeni dernek binamızın açılışı (2020)'
    }
  ]
};

// API Functions
export async function getLatestNews(count: number = 3): Promise<NewsItem[]> {
  return newsData.slice(0, count);
}

export async function getAllNews(): Promise<NewsItem[]> {
  return newsData;
}

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  return newsData.find(news => news.id === id);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  return newsData.find(news => news.slug === slug);
}

export async function getLatestAnnouncements(count: number = 3): Promise<Announcement[]> {
  return announcementsData.slice(0, count);
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  return announcementsData;
}

export async function getPressCoverage(): Promise<PressCoverageItem[]> {
  return pressCoverageData;
}

export async function getPressCoverageBySlug(slug: string): Promise<PressCoverageItem | undefined> {
  return pressCoverageData.find(item => item.slug === slug);
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  return boardMembersData.sort((a, b) => a.order - b.order);
}

export async function getLatestGalleryImages(count: number = 3): Promise<GalleryImage[]> {
  return galleryImagesData.slice(0, count);
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  return galleryImagesData;
}

export async function getContactInfo(): Promise<ContactInfo> {
  return contactInfoData;
}

export async function getDashboardData() {
  return dashboardData;
}

export async function getHistoryContent(): Promise<HistoryContent> {
  return historyContentData;
} 