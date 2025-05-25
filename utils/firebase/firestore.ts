import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './client';
import { adminDb, adminStorage } from './admin';
import { ContactInfo } from '@/types';

// Collection references
const newsCollection = collection(db, 'news');
const pressCoverageCollection = collection(db, 'press_coverage');
const announcementsCollection = collection(db, 'announcements');
const boardMembersCollection = collection(db, 'board_members');
const galleryImagesCollection = collection(db, 'gallery_images');
const contactInfoCollection = collection(db, 'contact_info');
const activitiesCollection = collection(db, 'activities');
const historyContentCollection = collection(db, 'history_content');

// Functions for News
export async function getLatestNews(count = 3) {
  const newsQuery = query(newsCollection, orderBy('createdAt', 'desc'), limit(count));
  const snapshot = await getDocs(newsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getAllNews() {
  const newsQuery = query(newsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(newsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getNewsById(id: string) {
  const docRef = doc(db, 'news', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function getNewsBySlug(slug: string) {
  const newsQuery = query(newsCollection, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(newsQuery);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

export async function createNews(newsData: any, imageFile: File | null) {
  let imageUrl = newsData.imageUrl;
  
  // If there's a new image, upload it
  if (imageFile) {
    const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }
  
  // Add news with image URL
  const docRef = await addDoc(newsCollection, {
    ...newsData,
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  // Log activity
  await addActivity('Haber eklendi', docRef.id, 'news');
  
  return docRef.id;
}

export async function updateNews(id: string, newsData: any, imageFile: File | null) {
  let imageUrl = newsData.imageUrl;
  
  // If there's a new image, upload it
  if (imageFile) {
    const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }
  
  // Update news
  const docRef = doc(db, 'news', id);
  await updateDoc(docRef, {
    ...newsData,
    imageUrl,
    updatedAt: serverTimestamp()
  });
  
  // Log activity
  await addActivity('Haber güncellendi', id, 'news');
  
  return id;
}

export async function deleteNews(id: string) {
  await deleteDoc(doc(db, 'news', id));
  
  // Log activity
  await addActivity('Haber silindi', id, 'news');
  
  return id;
}

// Functions for Press Coverage
export async function getPressCoverage() {
  const pressQuery = query(pressCoverageCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(pressQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getPressCoverageBySlug(slug: string) {
  const pressQuery = query(pressCoverageCollection, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(pressQuery);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

// Functions for Announcements
export async function getLatestAnnouncements(count = 3) {
  const announcementsQuery = query(announcementsCollection, orderBy('date', 'desc'), limit(count));
  const snapshot = await getDocs(announcementsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getAllAnnouncements() {
  const announcementsQuery = query(announcementsCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(announcementsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Functions for Board Members
export async function getBoardMembers() {
  const boardMembersQuery = query(boardMembersCollection, orderBy('order', 'asc'));
  const snapshot = await getDocs(boardMembersQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Functions for Gallery Images
export async function getLatestGalleryImages(count = 3) {
  const galleryQuery = query(galleryImagesCollection, orderBy('date', 'desc'), limit(count));
  const snapshot = await getDocs(galleryQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getAllGalleryImages() {
  const galleryQuery = query(galleryImagesCollection, orderBy('date', 'desc'));
  const snapshot = await getDocs(galleryQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Function for Contact Info
export async function getContactInfo() {
  const snapshot = await getDocs(contactInfoCollection);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

// Functions for Dashboard Data
export async function getDashboardData() {
  // Get counts
  const newsSnapshot = await getDocs(newsCollection);
  const pressCoverageSnapshot = await getDocs(pressCoverageCollection);
  const galleryImagesSnapshot = await getDocs(galleryImagesCollection);
  const boardMembersSnapshot = await getDocs(boardMembersCollection);
  
  // Get recent activities
  const activitiesQuery = query(activitiesCollection, orderBy('date', 'desc'), limit(5));
  const activitiesSnapshot = await getDocs(activitiesQuery);
  
  return {
    stats: {
      totalNews: newsSnapshot.size,
      totalPressCoverage: pressCoverageSnapshot.size,
      totalGalleryImages: galleryImagesSnapshot.size,
      totalBoardMembers: boardMembersSnapshot.size
    },
    recentActivities: activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  };
}

// Function for History Content
export async function getHistoryContent() {
  const snapshot = await getDocs(historyContentCollection);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

// Helper function to add activity
async function addActivity(action: string, entityId: string, entityType: string) {
  await addDoc(activitiesCollection, {
    action,
    entityId,
    entityType,
    date: new Date().toLocaleDateString('tr-TR'),
    createdAt: serverTimestamp()
  });
}

// Client-side function to get contact info
export async function getContactInfoClient(): Promise<ContactInfo | null> {
  try {
    const contactRef = doc(db, 'contact_info', 'main');
    const snapshot = await getDoc(contactRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return snapshot.data() as ContactInfo;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
} 