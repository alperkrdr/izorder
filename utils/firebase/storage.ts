import { ref, getDownloadURL, StorageReference } from 'firebase/storage';
import { storage, auth } from '@/utils/firebase/client';
import { uploadToFallbackStorage, FALLBACK_WARNING } from './fallbackStorage';
import { uploadFile } from '@/utils/upload-helper';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  storagePath?: string;
}

/**
 * Upload file to Firebase Storage with error handling
 * @param file File to upload
 * @param path Storage path (e.g., 'gallery/', 'board_members/')
 * @returns Upload result with success status and URL or error
 */
export async function uploadToFirebaseStorage(
  file: File,
  path: string
): Promise<UploadResult> {
  try {
    // Check authentication first
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn('No authenticated user found for storage upload');
      return {
        success: false,
        error: 'Dosya yüklemek için giriş yapmanız gerekiyor. Lütfen sayfayı yenileyin ve tekrar giriş yapın.'
      };
    }

    console.log('Authenticated user:', {
      uid: currentUser.uid,
      email: currentUser.email,
      emailVerified: currentUser.emailVerified
    });

    // Validate file
    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'Geçersiz dosya'
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Dosya boyutu 10MB\'dan büyük olamaz'
      };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Sadece JPEG, PNG ve WebP formatları destekleniyor'
      };
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fullPath = `${path}${filename}`;

    console.log('Uploading file to:', fullPath);

    try {
      // Use server-side API for upload
      const downloadURL = await uploadFile(file, path);
      console.log('File uploaded successfully via server API');

      return {
        success: true,
        url: downloadURL,
        storagePath: fullPath
      };
    } catch (uploadError: any) {
      console.error('Server API upload failed:', uploadError);
      
      // If server API fails, try fallback storage
      console.log('Switching to fallback storage...');
      
      try {
        const fallbackResult = await uploadToFallbackStorage(file, path);
        
        if (fallbackResult.success) {
          console.warn(FALLBACK_WARNING);
          
          return {
            success: true,
            url: fallbackResult.url!,
            storagePath: fallbackResult.storagePath!,
            error: `Geçici depolama kullanıldı. ${FALLBACK_WARNING}`
          };
        } else {
          return fallbackResult;
        }
      } catch (fallbackError: any) {
        console.error('Fallback storage also failed:', fallbackError);
        throw fallbackError;
      }
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    
    let errorMessage = 'Dosya yüklenirken bir hata oluştu';
    
    if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Delete file from Firebase Storage
 * @param storagePath Full storage path of the file to delete
 * @returns Success status
 */
export async function deleteFromFirebaseStorage(storagePath: string): Promise<boolean> {
  try {
    const { deleteObject } = await import('firebase/storage');
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    console.log('File deleted successfully:', storagePath);
    return true;
  } catch (error: any) {
    console.error('Error deleting file from Firebase Storage:', error);
    return false;
  }
}

/**
 * Check if Firebase Storage is properly configured
 * @returns Configuration status
 */
export async function checkStorageConfiguration(): Promise<{
  isConfigured: boolean;
  error?: string;
}> {
  try {
    // Try to create a reference to test bucket access
    const testRef = ref(storage, 'test/config-check.txt');
    
    // If ref creation succeeds, storage is configured
    return {
      isConfigured: true
    };
  } catch (error: any) {
    console.error('Storage configuration check failed:', error);
    
    let errorMessage = 'Firebase Storage yapılandırması hatalı';
    
    if (error.code === 'storage/no-default-bucket') {
      errorMessage = 'Firebase Storage bucket yapılandırılmamış';
    } else if (error.code === 'storage/bucket-not-found') {
      errorMessage = 'Firebase Storage bucket bulunamadı';
    }
    
    return {
      isConfigured: false,
      error: errorMessage
    };
  }
}
