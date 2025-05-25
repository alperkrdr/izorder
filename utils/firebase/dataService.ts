import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './client';
import { uploadImageWithAuth } from './storageUtils';
import {
  NewsItem,
  PressCoverageItem,
  BoardMember,
  GalleryImage,
  ContactInfo,
  HistoryContent
} from '@/types';

// Activity Logging
export const logActivity = async (
  action: string,
  user: string,
  entityType: string,
  entityId?: string,
  entityTitle?: string
) => {
  try {
    await addDoc(collection(db, 'admin_activities'), {
      action,
      user,
      entityType,
      entityId,
      entityTitle,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// ======== NEWS MANAGEMENT ========
export const getNews = async (count?: number) => {
  try {
    const newsRef = collection(db, 'news');
    let newsQuery = query(newsRef, orderBy('date', 'desc'));
    
    if (count) {
      newsQuery = query(newsRef, orderBy('date', 'desc'), limit(count));
    }
    
    const snapshot = await getDocs(newsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<NewsItem, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getNewsBySlug = async (slug: string) => {
  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as Omit<NewsItem, 'id'>
    };
  } catch (error) {
    console.error(`Error fetching news with slug ${slug}:`, error);
    return null;
  }
};

export const getNewsById = async (id: string) => {
  try {
    const docRef = doc(db, 'news', id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data() as Omit<NewsItem, 'id'>
    };
  } catch (error) {
    console.error(`Error fetching news with ID ${id}:`, error);
    return null;
  }
};

export const createNews = async (
  newsData: Omit<NewsItem, 'id'>, 
  imageFile: File | null,
  userId: string
) => {
  try {
    let imageUrl = newsData.imageUrl;
    
    // If a new image is provided, upload it
    if (imageFile) {
      console.log('Haber görseli yükleniyor:', imageFile.name);
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'news_images', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      imageUrl = uploadResult.url!;
      console.log('Haber görseli yükleme başarılı:', imageUrl);
    }
    
    // Create news doc with image URL
    const docRef = await addDoc(collection(db, 'news'), {
      ...newsData,
      imageUrl,
      date: newsData.date || new Date().toISOString()
    });
    
    // Log activity
    await logActivity('created', userId, 'news', docRef.id, newsData.title);
    
    return { id: docRef.id, ...newsData, imageUrl };
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const updateNews = async (
  id: string,
  newsData: Partial<Omit<NewsItem, 'id'>>,
  imageFile: File | null,
  userId: string
) => {
  try {
    let updateData = { ...newsData };
    
    // If a new image is provided, upload it
    if (imageFile) {
      console.log('Haber görseli güncelleniyor:', imageFile.name);
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'news_images', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      updateData.imageUrl = uploadResult.url!;
      console.log('Haber görseli güncelleme başarılı:', updateData.imageUrl);
    }
    
    // Update the news document
    const docRef = doc(db, 'news', id);
    await updateDoc(docRef, updateData);
    
    // Log activity
    await logActivity('updated', userId, 'news', id, newsData.title);
    
    return { id, ...updateData };
  } catch (error) {
    console.error(`Error updating news with ID ${id}:`, error);
    throw error;
  }
};

export const deleteNews = async (id: string, userId: string, title: string) => {
  try {
    // Get the news item to get the image URL
    const newsDoc = await getDoc(doc(db, 'news', id));
    
    if (newsDoc.exists()) {
      const newsData = newsDoc.data();
      
      // Delete the image if it exists and is stored in Firebase
      if (newsData.imageUrl && newsData.imageUrl.includes('firebasestorage')) {
        try {
          const imageRef = ref(storage, newsData.imageUrl);
          await deleteObject(imageRef);
        } catch (imgError) {
          console.error('Error deleting image:', imgError);
          // Continue with deletion even if image delete fails
        }
      }
    }
    
    // Delete the news document
    await deleteDoc(doc(db, 'news', id));
    
    // Log activity
    await logActivity('deleted', userId, 'news', id, title);
    
    return true;
  } catch (error) {
    console.error(`Error deleting news with ID ${id}:`, error);
    throw error;
  }
};

// ======== PRESS COVERAGE MANAGEMENT ========
export const getPressCoverage = async (count?: number) => {
  try {
    const pressRef = collection(db, 'press_coverage');
    let pressQuery = query(pressRef, orderBy('date', 'desc'));
    
    if (count) {
      pressQuery = query(pressRef, orderBy('date', 'desc'), limit(count));
    }
    
    const snapshot = await getDocs(pressQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<PressCoverageItem, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching press coverage:', error);
    return [];
  }
};

export const getPressCoverageBySlug = async (slug: string) => {
  try {
    const pressRef = collection(db, 'press_coverage');
    const q = query(pressRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as Omit<PressCoverageItem, 'id'>
    };
  } catch (error) {
    console.error(`Error fetching press coverage with slug ${slug}:`, error);
    return null;
  }
};

export const createPressCoverage = async (
  data: Omit<PressCoverageItem, 'id'>,
  imageFile: File | null,
  userId: string
) => {
  try {
    let imageUrl = data.imageUrl;
    
    // If a new image is provided, upload it
    if (imageFile) {
      console.log('Basın görseli yükleniyor:', imageFile.name);
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'press_coverage', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      imageUrl = uploadResult.url!;
      console.log('Basın görseli yükleme başarılı:', imageUrl);
    }
    
    // Create press coverage doc with image URL
    const docRef = await addDoc(collection(db, 'press_coverage'), {
      ...data,
      imageUrl,
      date: data.date || new Date().toISOString()
    });
    
    // Log activity
    await logActivity('created', userId, 'press', docRef.id, data.title);
    
    return { id: docRef.id, ...data, imageUrl };
  } catch (error) {
    console.error('Error creating press coverage:', error);
    throw error;
  }
};

export const updatePressCoverage = async (
  id: string,
  data: Partial<Omit<PressCoverageItem, 'id'>>,
  imageFile: File | null,
  userId: string
) => {
  try {
    let updateData = { ...data };
    
    // If a new image is provided, upload it
    if (imageFile) {
      console.log('Basın görseli güncelleniyor:', imageFile.name);
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'press_coverage', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      updateData.imageUrl = uploadResult.url!;
      console.log('Basın görseli güncelleme başarılı:', updateData.imageUrl);
    }
    
    // Update the press coverage document
    const docRef = doc(db, 'press_coverage', id);
    await updateDoc(docRef, updateData);
    
    // Log activity
    await logActivity('updated', userId, 'press', id, data.title);
    
    return { id, ...updateData };
  } catch (error) {
    console.error(`Error updating press coverage with ID ${id}:`, error);
    throw error;
  }
};

export const deletePressCoverage = async (id: string, userId: string, title: string) => {
  try {
    // Get the press coverage to get the image URL
    const pressDoc = await getDoc(doc(db, 'press_coverage', id));
    
    if (pressDoc.exists()) {
      const pressData = pressDoc.data();
      
      // Delete the image if it exists and is stored in Firebase
      if (pressData.imageUrl && pressData.imageUrl.includes('firebasestorage')) {
        try {
          const imageRef = ref(storage, pressData.imageUrl);
          await deleteObject(imageRef);
        } catch (imgError) {
          console.error('Error deleting image:', imgError);
          // Continue with deletion even if image delete fails
        }
      }
    }
    
    // Delete the press coverage document
    await deleteDoc(doc(db, 'press_coverage', id));
    
    // Log activity
    await logActivity('deleted', userId, 'press', id, title);
    
    return true;
  } catch (error) {
    console.error(`Error deleting press coverage with ID ${id}:`, error);
    throw error;
  }
};

// ======== BOARD MEMBERS MANAGEMENT ========
export const getBoardMembers = async () => {
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
};

export const createBoardMember = async (
  data: Omit<BoardMember, 'id'>,
  imageFile: File | null,
  userId: string
) => {
  try {
    let imageUrl = data.imageUrl;
    
    // If a new image is provided, upload it
    if (imageFile) {
      console.log('Yönetim kurulu görseli yükleniyor:', imageFile.name);
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'board_members', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      imageUrl = uploadResult.url!;
      console.log('Yönetim kurulu görseli yükleme başarılı:', imageUrl);
    }
    
    // Create board member doc with image URL
    const docRef = await addDoc(collection(db, 'board_members'), {
      ...data,
      imageUrl
    });
    
    // Log activity
    await logActivity('created', userId, 'boardMember', docRef.id, `${data.name} ${data.surname}`);
    
    return { id: docRef.id, ...data, imageUrl };
  } catch (error) {
    console.error('Error creating board member:', error);
    throw error;
  }
};

export const updateBoardMember = async (
  id: string,
  data: Partial<Omit<BoardMember, 'id'>>,
  imageFile: File | null,
  userId: string
) => {
  try {
    let updateData = { ...data };
    
    // If a new image is provided, upload it
    if (imageFile) {
      console.log('Yönetim kurulu görseli güncelleniyor:', imageFile.name);
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'board_members', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      updateData.imageUrl = uploadResult.url!;
      console.log('Yönetim kurulu görseli güncelleme başarılı:', updateData.imageUrl);
    }
    
    // Update the board member document
    const docRef = doc(db, 'board_members', id);
    await updateDoc(docRef, updateData);
    
    // Log activity
    const fullName = `${data.name || ''} ${data.surname || ''}`.trim();
    await logActivity('updated', userId, 'boardMember', id, fullName);
    
    return { id, ...updateData };
  } catch (error) {
    console.error(`Error updating board member with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBoardMember = async (id: string, userId: string, name: string) => {
  try {
    // Get the board member to get the image URL
    const memberDoc = await getDoc(doc(db, 'board_members', id));
    
    if (memberDoc.exists()) {
      const memberData = memberDoc.data();
      
      // Delete the image if it exists and is stored in Firebase
      if (memberData.imageUrl && memberData.imageUrl.includes('firebasestorage')) {
        try {
          const imageRef = ref(storage, memberData.imageUrl);
          await deleteObject(imageRef);
        } catch (imgError) {
          console.error('Error deleting image:', imgError);
          // Continue with deletion even if image delete fails
        }
      }
    }
    
    // Delete the board member document
    await deleteDoc(doc(db, 'board_members', id));
    
    // Log activity
    await logActivity('deleted', userId, 'boardMember', id, name);
    
    return true;
  } catch (error) {
    console.error(`Error deleting board member with ID ${id}:`, error);
    throw error;
  }
};

// ======== GALLERY MANAGEMENT ========
export const getGalleryImages = async (count?: number) => {
  try {
    const galleryRef = collection(db, 'gallery_images');
    let galleryQuery = query(galleryRef, orderBy('date', 'desc'));
    
    if (count) {
      galleryQuery = query(galleryRef, orderBy('date', 'desc'), limit(count));
    }
    
    const snapshot = await getDocs(galleryQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<GalleryImage, 'id'>
    }));
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
};

export const createGalleryImage = async (
  data: Omit<GalleryImage, 'id' | 'url'>,
  imageFile: File,
  userId: string
) => {
  try {
    // Upload the image
    console.log('Galeri görseli yükleniyor:', imageFile.name);
    const uploadResult = await uploadImageWithAuth(
      imageFile, 
      'gallery_images', 
      `${Date.now()}-${imageFile.name}`
    );
    
    if (!uploadResult.success) {
      throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
    }
    
    const url = uploadResult.url!;
    console.log('Galeri görseli yükleme başarılı:', url);
    
    // Create gallery image doc with image URL
    const docRef = await addDoc(collection(db, 'gallery_images'), {
      ...data,
      url,
      date: data.date || new Date().toISOString()
    });
    
    // Log activity
    await logActivity('created', userId, 'galleryImage', docRef.id, data.title);
    
    return { id: docRef.id, ...data, url };
  } catch (error) {
    console.error('Error creating gallery image:', error);
    throw error;
  }
};

export const updateGalleryImage = async (
  id: string,
  data: Partial<Omit<GalleryImage, 'id'>>,
  imageFile: File | null,
  userId: string
) => {
  try {
    let updateData = { ...data };
    
    // If a new image is provided, upload it
    if (imageFile) {
      console.log('Galeri görseli güncelleniyor:', imageFile.name);
      const uploadResult = await uploadImageWithAuth(
        imageFile, 
        'gallery_images', 
        `${Date.now()}-${imageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      updateData.url = uploadResult.url!;
      console.log('Galeri görseli güncelleme başarılı:', updateData.url);
    }
    
    // Update the gallery image document
    const docRef = doc(db, 'gallery_images', id);
    await updateDoc(docRef, updateData);
    
    // Log activity
    await logActivity('updated', userId, 'galleryImage', id, data.title);
    
    return { id, ...updateData };
  } catch (error) {
    console.error(`Error updating gallery image with ID ${id}:`, error);
    throw error;
  }
};

export const deleteGalleryImage = async (id: string, userId: string, title: string) => {
  try {
    // Get the gallery image to get the image URL
    const imageDoc = await getDoc(doc(db, 'gallery_images', id));
    
    if (imageDoc.exists()) {
      const imageData = imageDoc.data();
      
      // Delete the image if it exists and is stored in Firebase
      if (imageData.url && imageData.url.includes('firebasestorage')) {
        try {
          const imageRef = ref(storage, imageData.url);
          await deleteObject(imageRef);
        } catch (imgError) {
          console.error('Error deleting image:', imgError);
          // Continue with deletion even if image delete fails
        }
      }
    }
    
    // Delete the gallery image document
    await deleteDoc(doc(db, 'gallery_images', id));
    
    // Log activity
    await logActivity('deleted', userId, 'galleryImage', id, title);
    
    return true;
  } catch (error) {
    console.error(`Error deleting gallery image with ID ${id}:`, error);
    throw error;
  }
};

// ======== CONTACT INFO MANAGEMENT ========
export const getContactInfo = async () => {
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
};

export const updateContactInfo = async (
  data: ContactInfo,
  userId: string
) => {
  try {
    // Update the contact info document
    const contactRef = doc(db, 'contact_info', 'main');
    await setDoc(contactRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    // Log activity
    await logActivity('updated', userId, 'contactInfo', 'contact', 'İletişim Bilgileri');
    
    return data;
  } catch (error) {
    console.error('Error updating contact info:', error);
    throw error;
  }
};

// ======== HISTORY CONTENT MANAGEMENT ========
export const getHistoryContent = async () => {
  try {
    const historyRef = doc(db, 'history', 'main');
    const snapshot = await getDoc(historyRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return snapshot.data() as HistoryContent;
  } catch (error) {
    console.error('Error fetching history content:', error);
    return null;
  }
};

interface AdditionalImageFile {
  id: string;
  file: File;
}

export const updateHistoryContent = async (
  data: HistoryContent,
  mainImageFile: File | null,
  additionalImageFiles: AdditionalImageFile[],
  userId: string
) => {
  try {
    let updatedData = { ...data };
    
    // If a new main image is provided, upload it
    if (mainImageFile) {
      console.log('Ana görsel yükleniyor:', mainImageFile.name);
      const uploadResult = await uploadImageWithAuth(
        mainImageFile, 
        'history_images', 
        `main-${Date.now()}-${mainImageFile.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Ana görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      updatedData.mainImageUrl = uploadResult.url!;
      console.log('Ana görsel yükleme başarılı:', uploadResult.url);
    }
    
    // Upload any new additional images
    for (const imgData of additionalImageFiles) {
      console.log('Ek görsel yükleniyor:', imgData.file.name);
      const uploadResult = await uploadImageWithAuth(
        imgData.file, 
        'history_images', 
        `${Date.now()}-${imgData.file.name}`
      );
      
      if (!uploadResult.success) {
        throw new Error(`Ek görsel yükleme hatası: ${uploadResult.error}`);
      }
      
      const url = uploadResult.url!;
      console.log('Ek görsel yükleme başarılı:', url);
      
      // Find and update the correct image in the additionalImages array
      const imageIndex = updatedData.additionalImages.findIndex(img => 
        'id' in img && img.id === imgData.id
      );
      if (imageIndex !== -1) {
        updatedData.additionalImages[imageIndex].url = url;
      }
    }
    
    // Update the history content document
    const historyRef = doc(db, 'history', 'main');
    await setDoc(historyRef, {
      ...updatedData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    // Log activity
    await logActivity('updated', userId, 'historyContent', 'history', 'Tarihçe İçeriği');
    
    return updatedData;
  } catch (error) {
    console.error('Error updating history content:', error);
    throw error;
  }
}; 