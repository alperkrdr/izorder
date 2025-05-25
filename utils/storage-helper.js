import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase/client';

/**
 * Uploads a file to Firebase Storage using a Base64 approach to avoid CORS issues
 * @param {File} file - The file to upload
 * @param {string} path - The storage path (e.g., 'news/')
 * @param {string} filename - Optional custom filename
 * @returns {Promise<string>} - The download URL
 */
export async function uploadFileBase64(file, path, customFilename = null) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          // Get base64 string
          const base64String = event.target.result;
          
          // Generate filename with timestamp to avoid conflicts
          const timestamp = Date.now();
          const filename = customFilename || `${timestamp}-${file.name}`;
          const fullPath = `${path}${filename}`;

          // Create reference to upload location
          const storageRef = ref(storage, fullPath);
          
          // Convert base64 to Blob for upload
          const response = await fetch(base64String);
          const blob = await response.blob();
          
          // Create form data
          const formData = new FormData();
          formData.append('file', blob, filename);
          
          // Upload directly to Firebase Storage REST API with authentication
          const uploadResponse = await fetch(`/api/upload?path=${fullPath}`, {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
          }
          
          // Get the download URL
          const downloadURL = await getDownloadURL(storageRef);
          resolve(downloadURL);
        } catch (error) {
          console.error("Upload error:", error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };
      
      // Read file as data URL (base64)
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Initial upload error:", error);
      reject(error);
    }
  });
} 