export interface User {
  id: string;
  email: string;
  displayName: string;
  profileImage?: string;
  createdAt: Date;
  lastLoginAt: Date;
  settings: {
    theme: 'light' | 'dark';
    defaultView: 'grid' | 'list';
    itemsPerRow: number;
  };
}

export interface BookmarkItem {
  id: string;
  userId?: string; // For Supabase integration
  type: 'bookmark' | 'memo';
  url?: string;
  title: string;
  siteName?: string;
  description?: string;
  thumbnail?: string;
  customImage?: string;
  memo?: string;
  tags: string[];
  isBookmarked: boolean;
  viewCount: number;
  lastViewed?: Date;
  createdAt: Date;
  updatedAt: Date;
  ogpData?: {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    hasOgp?: boolean;
  };
  imageSource: 'ogp' | 'custom' | 'fallback';
}

export interface ShelfSection {
  id: string;
  userId?: string;
  type: 'bookmark' | 'memo';
  title: string;
  items: BookmarkItem[];
  isCollapsed: boolean;
  order: number;
}

export interface FilterOptions {
  search: string;
  tags: string[];
  tagFilterType: 'AND' | 'OR';
  onlyBookmarked: boolean;
  sortBy: 'createdAt' | 'updatedAt' | 'viewCount' | 'title' | 'lastViewed';
  sortDirection: 'asc' | 'desc';
  shelfType?: 'bookmark' | 'memo' | 'all';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}