/**
 * Fallback image service for when Firebase Storage is not available
 */

interface FallbackUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  storagePath?: string;
}

/**
 * Creates a data URL from uploaded file as fallback
 * This is temporary until Firebase Storage bucket is set up
 */
export async function uploadToFallbackStorage(
  file: File,
  path: string
): Promise<FallbackUploadResult> {
  try {
    // Validate file
    if (!file || file.size === 0) {
      return {
        success: false,
        error: 'Geçersiz dosya'
      };
    }

    // Check file size (max 5MB for fallback to avoid memory issues)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Dosya boyutu 5MB\'dan büyük olamaz (geçici çözüm)'
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

    // Convert file to base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        resolve({
          success: true,
          url: dataUrl,
          storagePath: `fallback/${path}${Date.now()}-${file.name}`
        });
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Dosya okunamadı'
        });
      };
      
      reader.readAsDataURL(file);
    });

  } catch (error: any) {
    console.error('Fallback storage error:', error);
    
    return {
      success: false,
      error: 'Dosya işlenirken hata oluştu'
    };
  }
}

/**
 * Get placeholder image URLs for different categories
 */
export const getPlaceholderImage = (category: string): string => {
  const placeholders: Record<string, string> = {
    'board_members': 'https://via.placeholder.com/300x400/4f46e5/ffffff?text=Yönetim+Kurulu',
    'gallery': 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Galeri+Görseli',
    'news': 'https://via.placeholder.com/600x400/8b5cf6/ffffff?text=Haber+Görseli',
    'press': 'https://via.placeholder.com/500x350/06b6d4/ffffff?text=Basın+Haberi',
    'default': 'https://via.placeholder.com/400x300/64748b/ffffff?text=Görsel'
  };

  return placeholders[category] || placeholders.default;
};

/**
 * Check if a URL is a fallback/temporary URL
 */
export const isFallbackUrl = (url: string): boolean => {
  return url.startsWith('data:') || url.includes('via.placeholder.com');
};

/**
 * Display warning message about fallback storage
 */
export const FALLBACK_WARNING = `
⚠️ Firebase Storage henüz yapılandırılmadığı için geçici depolama kullanılıyor.
Görseller tarayıcı hafızasında saklanıyor ve sayfa yenilendiğinde kaybolabilir.
Kalıcı depolama için Firebase Storage bucket'ını kurmanız gerekmektedir.
`;
