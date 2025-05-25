/**
 * Uploads a file through the server-side API to bypass CORS issues
 * @param {File} file - The file to upload
 * @param {string} path - The storage path (e.g., 'news/')
 * @returns {Promise<string>} - The download URL
 */
export async function uploadFile(file, path) {
  try {
    // Form data for the upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Get the filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const fullPath = `${path}${filename}`;
    
    // Upload using our server-side API
    const response = await fetch(`/api/upload?path=${fullPath}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Upload failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
} 