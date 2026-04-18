import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface FavoriteItem {
  id?: string | number;
  user_id?: string;
  item_id: string;
  item_type?: string;
  title?: string;
  subtitle?: string;
  image?: string;
}

interface ToggleFavoriteInput {
  id?: string | number;
  item_id?: string | number;
  item_type?: string;
  title?: string;
  subtitle?: string;
  image?: string;
}

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  favorites: FavoriteItem[];
  toggleFavorite: (item: ToggleFavoriteInput) => Promise<void>;
  isFavorite: (id: string) => boolean;
  signOut: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const auth = (supabase as any).auth;

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        if (error.code === 'PGRST103') {
          console.warn("Supabase: 'favorites' table not found. Please run the migration SQL.");
        } else {
          console.error('Error fetching favorites:', error.message);
        }
        return;
      }

      setFavorites((data as FavoriteItem[]) || []);
    } catch (e: any) {
      console.error('Unexpected error fetching favorites:', e?.message || String(e));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const response = await auth.getSession();
        const currentSession = response?.data?.session ?? null;

        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user?.id) {
          await fetchFavorites(currentSession.user.id);
        }
      } catch (e: any) {
        console.error('Auth init error:', e?.message || String(e));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const authListener = auth.onAuthStateChange(
      async (_event: any, nextSession: any) => {
        setSession(nextSession ?? null);
        setUser(nextSession?.user ?? null);

        if (nextSession?.user?.id) {
          await fetchFavorites(nextSession.user.id);
        } else {
          setFavorites([]);
        }

        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      authListener?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const refreshFavorites = async () => {
    if (user?.id) {
      await fetchFavorites(user.id);
    }
  };

  const toggleFavorite = async (item: ToggleFavoriteInput) => {
    if (!user?.id) return;

    const itemIdString = String(item.id ?? item.item_id ?? '');
    if (!itemIdString) return;

    const existing = favorites.find((f) => String(f.item_id) === itemIdString);

    try {
      if (existing?.id) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (error) {
          if (error.code === 'PGRST103') {
            alert("Database Setup Required: Please create the 'favorites' table in your Supabase dashboard.");
          }
          console.error('Error removing favorite:', error.message);
        } else {
          setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        }
      } else {
        const newItem: FavoriteItem = {
          user_id: user.id,
          item_id: itemIdString,
          item_type: item.item_type || 'track',
          title: item.title || '',
          subtitle: item.subtitle || '',
          image: item.image || '',
        };

        const { data, error } = await supabase
          .from('favorites')
          .insert([newItem])
          .select();

        if (error) {
          if (error.code === 'PGRST103') {
            alert("Database Setup Required: Please create the 'favorites' table in your Supabase dashboard.");
          }
          console.error('Error adding favorite:', error.message);
        } else if (data && data.length > 0) {
          setFavorites((prev) => [...prev, data[0] as FavoriteItem]);
        }
      }
    } catch (err: any) {
      console.error('Toggle favorite failed:', err?.message || String(err));
    }
  };

  const isFavorite = (id: string) => {
    const searchId = String(id);
    return favorites.some((f) => String(f.item_id) === searchId);
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (e: any) {
      console.error('Sign out error:', e?.message || String(e));
    } finally {
      setUser(null);
      setSession(null);
      setFavorites([]);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        favorites,
        toggleFavorite,
        isFavorite,
        signOut,
        refreshFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};