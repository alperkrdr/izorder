// News Item Type
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  slug: string;
  author?: string;
}

// Press Coverage Type
export interface PressCoverageItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  imageUrl: string;
  date: string;
  source: string;
  slug: string;
  externalUrl?: string;
}

// Announcement Type
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
}

// Board Member Type
export interface BoardMember {
  id: string;
  name: string;
  surname: string;
  title: string;
  bio: string;
  imageUrl: string;
  isFounder: boolean;
  order: number;
}

// Gallery Image Type
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  url: string;
  date: string;
  category?: string;
}

// Contact Info Type
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  socialMedia: {
    facebook: string;
    instagram: string;
  };
}

// Dashboard Stats Type
export interface DashboardStats {
  totalNews: number;
  totalPressCoverage: number;
  totalGalleryImages: number;
  totalBoardMembers: number;
}

// Activity Type
export interface Activity {
  id: string;
  action: string;
  user: string;
  date: string;
  entityType: 'news' | 'pressCoverage' | 'boardMember' | 'galleryImage' | 'contactInfo';
  entityId?: string;
}

// Membership Form Type
export interface MembershipFormSettings {
  title: string;
  description: string;
  emailNotifications: boolean;
  fields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    birthplace: boolean;
    district: boolean;
    message: boolean;
  };
}

export interface MembershipApplication {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthplace?: string;
  district?: string;
  message?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Tarihçe Tipi
export interface HistoryContent {
  content: string;
  mainImageUrl: string;
  foundingDate: string;
  foundingPresident: string;
  legalStatus: string;
  initialMemberCount: string;
  currentMemberCount: string;
  milestones: {
    year: string;
    description: string;
  }[];
  additionalImages: {
    url: string;
    caption: string;
  }[];
} 