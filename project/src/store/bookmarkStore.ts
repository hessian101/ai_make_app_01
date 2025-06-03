import { create } from 'zustand';
import { BookmarkItem, FilterOptions } from '../types';
import * as db from '../db';

interface BookmarkState {
  bookmarks: BookmarkItem[];
  isLoading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  modalOpen: boolean;
  currentBookmark: BookmarkItem | null;

  // Actions
  fetchBookmarks: () => Promise<void>;
  addBookmark: (bookmark: Omit<BookmarkItem, 'id'>) => Promise<void>;
  updateBookmark: (id: string, data: Partial<BookmarkItem>) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  incrementViewCount: (id: string) => Promise<void>;
  toggleBookmark: (id: string) => Promise<void>;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  setModalOpen: (open: boolean) => void;
  setCurrentBookmark: (bookmark: BookmarkItem | null) => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  isLoading: false,
  error: null,
  filterOptions: {
    search: '',
    tags: [],
    tagFilterType: 'OR',
    onlyBookmarked: false,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  },
  modalOpen: false,
  currentBookmark: null,

  fetchBookmarks: async () => {
    set({ isLoading: true, error: null });
    try {
      const bookmarks = await db.getAllBookmarks();
      set({ bookmarks, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addBookmark: async (bookmark) => {
    set({ isLoading: true, error: null });
    try {
      await db.addBookmark(bookmark);
      await get().fetchBookmarks();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateBookmark: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await db.updateBookmark(id, data);
      await get().fetchBookmarks();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteBookmark: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await db.deleteBookmark(id);
      await get().fetchBookmarks();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  incrementViewCount: async (id) => {
    try {
      await db.incrementViewCount(id);
      await get().fetchBookmarks();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  toggleBookmark: async (id) => {
    try {
      await db.toggleBookmark(id);
      await get().fetchBookmarks();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  setFilterOptions: (options) => {
    set({ 
      filterOptions: {
        ...get().filterOptions,
        ...options
      }
    });
  },

  resetFilters: () => {
    set({
      filterOptions: {
        search: '',
        tags: [],
        tagFilterType: 'OR',
        onlyBookmarked: false,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      }
    });
  },

  setModalOpen: (open) => {
    set({ modalOpen: open });
    if (!open) {
      set({ currentBookmark: null });
    }
  },

  setCurrentBookmark: (bookmark) => {
    set({ currentBookmark: bookmark });
  }
}));