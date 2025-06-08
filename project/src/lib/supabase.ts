import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using fallback values for development.');
}

// Use fallback values for development if environment variables are not set
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey || fallbackKey
);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          profile_image: string | null;
          settings: any;
          created_at: string;
          last_login_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          display_name: string;
          profile_image?: string | null;
          settings?: any;
          created_at?: string;
          last_login_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          profile_image?: string | null;
          settings?: any;
          created_at?: string;
          last_login_at?: string | null;
          updated_at?: string;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          type: 'bookmark' | 'memo';
          url: string | null;
          title: string;
          site_name: string | null;
          description: string | null;
          thumbnail: string | null;
          custom_image: string | null;
          memo: string | null;
          tags: string[];
          is_bookmarked: boolean;
          view_count: number;
          last_viewed_at: string | null;
          ogp_data: any | null;
          image_source: 'ogp' | 'custom' | 'fallback';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'bookmark' | 'memo';
          url?: string | null;
          title: string;
          site_name?: string | null;
          description?: string | null;
          thumbnail?: string | null;
          custom_image?: string | null;
          memo?: string | null;
          tags?: string[];
          is_bookmarked?: boolean;
          view_count?: number;
          last_viewed_at?: string | null;
          ogp_data?: any | null;
          image_source?: 'ogp' | 'custom' | 'fallback';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'bookmark' | 'memo';
          url?: string | null;
          title?: string;
          site_name?: string | null;
          description?: string | null;
          thumbnail?: string | null;
          custom_image?: string | null;
          memo?: string | null;
          tags?: string[];
          is_bookmarked?: boolean;
          view_count?: number;
          last_viewed_at?: string | null;
          ogp_data?: any | null;
          image_source?: 'ogp' | 'custom' | 'fallback';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}