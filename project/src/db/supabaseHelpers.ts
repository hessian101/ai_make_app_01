import { supabase } from '../lib/supabase';
import { BookmarkItem } from '../types';

// Get all unique tags with counts for the current user
export const getAllTagsWithCount = async (): Promise<{ tag: string; count: number }[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('bookmarks')
      .select('tags')
      .eq('user_id', user.id);

    if (error) throw error;

    const tagCounts = new Map<string, number>();
    
    data.forEach(bookmark => {
      if (bookmark.tags) {
        bookmark.tags.forEach((tag: string) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });
    
    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

// Check for duplicate URL for the current user
export const checkDuplicateUrl = async (url: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { count, error } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('url', url);

    if (error) throw error;

    return (count || 0) > 0;
  } catch (error) {
    console.error('Error checking duplicate URL:', error);
    return false;
  }
};

// Get bookmarks by tag for the current user
export const getBookmarksByTag = async (tag: string): Promise<BookmarkItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .contains('tags', [tag])
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
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
  } catch (error) {
    console.error('Error fetching bookmarks by tag:', error);
    return [];
  }
};