export interface BookmarkItem {
  id: string;
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
    hasOgp: boolean;
  };
  imageSource: 'ogp' | 'custom' | 'fallback';
}

export interface ShelfSection {
  id: string;
  type: 'bookmark' | 'memo';
  title: string;
  items: BookmarkItem[];
  isCollapsed: boolean;
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