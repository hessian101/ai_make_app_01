import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, AuthState, LoginCredentials, RegisterCredentials } from '../types';
import toast from 'react-hot-toast';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast.error('ログインに失敗しました: ' + error.message);
        return false;
      }

      if (data.user) {
        // Update last login time
        await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', data.user.id);

        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            displayName: profile.display_name,
            profileImage: profile.profile_image || undefined,
            createdAt: new Date(profile.created_at),
            lastLoginAt: new Date(profile.last_login_at || profile.created_at),
            settings: profile.settings || {
              theme: 'light',
              defaultView: 'grid',
              itemsPerRow: 5,
            },
          };

          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('ログインしました');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('ログインエラーが発生しました');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast.error('登録に失敗しました: ' + error.message);
        return false;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: credentials.email,
            display_name: credentials.displayName,
            settings: {
              theme: 'light',
              defaultView: 'grid',
              itemsPerRow: 5,
            },
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast.error('プロフィール作成に失敗しました');
          return false;
        }

        toast.success('アカウントが作成されました。確認メールをご確認ください。');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('登録エラーが発生しました');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('ログアウトに失敗しました');
        return;
      }

      set({ user: null, isAuthenticated: false });
      toast.success('ログアウトしました');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('ログアウトエラーが発生しました');
    }
  },

  updateProfile: async (data: Partial<User>) => {
    try {
      const { user } = get();
      if (!user) return;

      const updateData: any = {};
      if (data.displayName) updateData.display_name = data.displayName;
      if (data.profileImage !== undefined) updateData.profile_image = data.profileImage;
      if (data.settings) updateData.settings = data.settings;

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        toast.error('プロフィール更新に失敗しました');
        return;
      }

      set({
        user: {
          ...user,
          ...data,
        },
      });

      toast.success('プロフィールを更新しました');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('プロフィール更新エラーが発生しました');
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error('パスワードリセットに失敗しました: ' + error.message);
        return;
      }

      toast.success('パスワードリセットメールを送信しました');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('パスワードリセットエラーが発生しました');
    }
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            displayName: profile.display_name,
            profileImage: profile.profile_image || undefined,
            createdAt: new Date(profile.created_at),
            lastLoginAt: new Date(profile.last_login_at || profile.created_at),
            settings: profile.settings || {
              theme: 'light',
              defaultView: 'grid',
              itemsPerRow: 5,
            },
          };

          set({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('Auth check error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));