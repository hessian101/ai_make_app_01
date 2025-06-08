import { create } from 'zustand';
import { BookmarkItem, FilterOptions } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

interface BookmarkState {
  bookmarks: BookmarkItem[];
  isLoading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  modalOpen: boolean;
  currentBookmark: BookmarkItem | null;

  // Actions
  fetchBookmarks: () => Promise<void>;
  addBookmark: (bookmark: Omit<BookmarkItem, 'id' | 'userId'>) => Promise<void>;
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
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const bookmarks: BookmarkItem[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        type: item.type,
        url: item.url || undefined,
        title: item.title,
        siteName: item.site_name || undefined,
        description: item.description || undefined,
        thumbnail: item.thumbnail || undefined,
        customImage: item.custom_image || undefined,
        memo: item.memo || undefined,
        tags: item.tags || [],
        isBookmarked: item.is_bookmarked,
        viewCount: item.view_count,
        lastViewed: item.last_viewed_at ? new Date(item.last_viewed_at) : undefined,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        ogpData: item.ogp_data || undefined,
        imageSource: item.image_source,
      }));

      set({ bookmarks, isLoading: false });
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      set({ error: (error as Error).message, isLoading: false });
      toast.error('ブックマークの取得に失敗しました');
    }
  },

  addBookmark: async (bookmark) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          type: bookmark.type,
          url: bookmark.url,
          title: bookmark.title,
          site_name: bookmark.siteName,
          description: bookmark.description,
          thumbnail: bookmark.thumbnail,
          custom_image: bookmark.customImage,
          memo: bookmark.memo,
          tags: bookmark.tags,
          is_bookmarked: bookmark.isBookmarked,
          view_count: bookmark.viewCount,
          ogp_data: bookmark.ogpData,
          image_source: bookmark.imageSource,
        });

      if (error) throw error;

      await get().fetchBookmarks();
      toast.success('ブックマークを追加しました');
    } catch (error) {
      console.error('Error adding bookmark:', error);
      set({ error: (error as Error).message, isLoading: false });
      toast.error('ブックマークの追加に失敗しました');
    }
  },

  updateBookmark: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updateData: any = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
      if (data.customImage !== undefined) updateData.custom_image = data.customImage;
      if (data.memo !== undefined) updateData.memo = data.memo;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.isBookmarked !== undefined) updateData.is_bookmarked = data.isBookmarked;
      if (data.viewCount !== undefined) updateData.view_count = data.viewCount;
      if (data.lastViewed !== undefined) updateData.last_viewed_at = data.lastViewed.toISOString();
      if (data.ogpData !== undefined) updateData.ogp_data = data.ogpData;
      if (data.imageSource !== undefined) updateData.image_source = data.imageSource;

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('bookmarks')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await get().fetchBookmarks();
      toast.success('ブックマークを更新しました');
    } catch (error) {
      console.error('Error updating bookmark:', error);
      set({ error: (error as Error).message, isLoading: false });
      toast.error('ブックマークの更新に失敗しました');
    }
  },

  deleteBookmark: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await get().fetchBookmarks();
      toast.success('ブックマークを削除しました');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      set({ error: (error as Error).message, isLoading: false });
      toast.error('ブックマークの削除に失敗しました');
    }
  },

  incrementViewCount: async (id) => {
    try {
      const bookmark = get().bookmarks.find(b => b.id === id);
      if (!bookmark) return;

      await get().updateBookmark(id, {
        viewCount: bookmark.viewCount + 1,
        lastViewed: new Date(),
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  },

  toggleBookmark: async (id) => {
    try {
      const bookmark = get().bookmarks.find(b => b.id === id);
      if (!bookmark) return;

      await get().updateBookmark(id, {
        isBookmarked: !bookmark.isBookmarked,
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
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