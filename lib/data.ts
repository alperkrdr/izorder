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

import { db } from '@/utils/firebase/client';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, where } from 'firebase/firestore';

// Get latest news
export async function getLatestNews(count: number = 3): Promise<NewsItem[]> {
  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('date', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<NewsItem, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
}

// Get all news
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<NewsItem, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching all news:', error);
    return [];
  }
}

// Get news by ID
export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  try {
    const newsRef = doc(db, 'news', id);
    const snapshot = await getDoc(newsRef);
    
    if (!snapshot.exists()) {
      return undefined;
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data() as Omit<NewsItem, 'id'>
    };
  } catch (error) {
    console.error(`Error fetching news with ID ${id}:`, error);
    return undefined;
  }
}

// Get news by slug
export async function getNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return undefined;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as Omit<NewsItem, 'id'>
    };
  } catch (error) {
    console.error(`Error fetching news with slug ${slug}:`, error);
    return undefined;
  }
}

// Get latest announcements
export async function getLatestAnnouncements(count: number = 3): Promise<Announcement[]> {
  try {
    const announcementsRef = collection(db, 'announcements');
    const q = query(announcementsRef, orderBy('date', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Announcement, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching latest announcements:', error);
    return [];
  }
}

// Get all announcements
export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    const announcementsRef = collection(db, 'announcements');
    const q = query(announcementsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Announcement, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching all announcements:', error);
    return [];
  }
}

// Get press coverage
export async function getPressCoverage(): Promise<PressCoverageItem[]> {
  try {
    const pressRef = collection(db, 'press_coverage');
    const q = query(pressRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<PressCoverageItem, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching press coverage:', error);
    return [];
  }
}

// Get press coverage by slug
export async function getPressCoverageBySlug(slug: string): Promise<PressCoverageItem | undefined> {
  try {
    const pressRef = collection(db, 'press_coverage');
    const q = query(pressRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return undefined;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as Omit<PressCoverageItem, 'id'>
    };
  } catch (error) {
    console.error(`Error fetching press coverage with slug ${slug}:`, error);
    return undefined;
  }
}

// Get board members
export async function getBoardMembers(): Promise<BoardMember[]> {
  try {
    const boardRef = collection(db, 'board_members');
    const q = query(boardRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<BoardMember, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching board members:', error);
    return [];
  }
}

// Get latest gallery images
export async function getLatestGalleryImages(count: number = 3): Promise<GalleryImage[]> {
  try {
    const galleryRef = collection(db, 'gallery_images');
    const q = query(galleryRef, orderBy('date', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<GalleryImage, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching latest gallery images:', error);
    return [];
  }
}

// Get all gallery images
export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  try {
    const galleryRef = collection(db, 'gallery_images');
    const q = query(galleryRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<GalleryImage, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching all gallery images:', error);
    return [];
  }
}

// Get contact info
export async function getContactInfo(): Promise<ContactInfo | null> {
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

// Get dashboard data
export async function getDashboardData(): Promise<DashboardStats> {
  try {
    // Get news count
    const newsRef = collection(db, 'news');
    const newsSnapshot = await getDocs(newsRef);
    const newsCount = newsSnapshot.size;
    
    // Get gallery count
    const galleryRef = collection(db, 'gallery_images');
    const gallerySnapshot = await getDocs(galleryRef);
    const galleryCount = gallerySnapshot.size;
    
    // Get board members count
    const boardRef = collection(db, 'board_members');
    const boardSnapshot = await getDocs(boardRef);
    const boardCount = boardSnapshot.size;
    
    // Get press coverage count
    const pressRef = collection(db, 'press_coverage');
    const pressSnapshot = await getDocs(pressRef);
    const pressCount = pressSnapshot.size;
    
    // Get recent activities
    const activitiesRef = collection(db, 'admin_activities');
    const activitiesQuery = query(activitiesRef, orderBy('timestamp', 'desc'), limit(5));
    const activitiesSnapshot = await getDocs(activitiesQuery);
    const recentActivities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Activity, 'id'>
    }));
    
    return {
      newsCount,
      galleryCount,
      boardMembersCount: boardCount,
      pressCoverageCount: pressCount,
      recentActivities
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      newsCount: 0,
      galleryCount: 0,
      boardMembersCount: 0,
      pressCoverageCount: 0,
      recentActivities: []
    };
  }
}

// Get history content
export async function getHistoryContent(): Promise<HistoryContent | null> {
  try {
    return await import('@/utils/firebase/dataService').then(
      module => module.getHistoryContent()
    );
  } catch (error) {
    console.error('Error fetching history content:', error);
    return null;
  }
} 