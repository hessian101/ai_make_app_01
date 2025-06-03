import Dexie, { Table } from 'dexie';
import { BookmarkItem } from '../types';

class BookshelfDatabase extends Dexie {
  bookmarks!: Table<BookmarkItem, string>;

  constructor() {
    super('bookshelfDb');
    this.version(2).stores({
      bookmarks: 'id, type, title, url, siteName, *tags, isBookmarked, viewCount, createdAt, updatedAt, lastViewed, imageSource'
    });
  }
}

export const db = new BookshelfDatabase();

// Generate a unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Add a new bookmark
export const addBookmark = async (bookmark: Omit<BookmarkItem, 'id'>) => {
  const id = generateId();
  return await db.bookmarks.add({
    ...bookmark,
    id
  });
};

// Get all bookmarks
export const getAllBookmarks = async () => {
  return await db.bookmarks.toArray();
};

// Get bookmarks by type
export const getBookmarksByType = async (type: 'bookmark' | 'memo') => {
  return await db.bookmarks.where('type').equals(type).toArray();
};

// Get bookmark by ID
export const getBookmarkById = async (id: string) => {
  return await db.bookmarks.get(id);
};

// Update a bookmark
export const updateBookmark = async (id: string, data: Partial<BookmarkItem>) => {
  return await db.bookmarks.update(id, {
    ...data,
    updatedAt: new Date()
  });
};

// Delete a bookmark
export const deleteBookmark = async (id: string) => {
  return await db.bookmarks.delete(id);
};

// Increment view count
export const incrementViewCount = async (id: string) => {
  const bookmark = await getBookmarkById(id);
  if (bookmark) {
    return await updateBookmark(id, {
      viewCount: bookmark.viewCount + 1,
      lastViewed: new Date()
    });
  }
};

// Toggle bookmark status
export const toggleBookmark = async (id: string) => {
  const bookmark = await getBookmarkById(id);
  if (bookmark) {
    return await updateBookmark(id, {
      isBookmarked: !bookmark.isBookmarked
    });
  }
};

// Get all unique tags with counts
export const getAllTagsWithCount = async () => {
  const bookmarks = await getAllBookmarks();
  const tagCounts = new Map<string, number>();
  
  bookmarks.forEach(bookmark => {
    bookmark.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
};

// Check for duplicate URL
export const checkDuplicateUrl = async (url: string) => {
  const count = await db.bookmarks
    .where('url')
    .equals(url)
    .count();
  return count > 0;
};

// Get bookmarks by tag
export const getBookmarksByTag = async (tag: string) => {
  return await db.bookmarks
    .filter(bookmark => bookmark.tags.includes(tag))
    .toArray();
};