
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  favorites: any[];
  toggleFavorite: (item: any) => Promise<void>;
  isFavorite: (id: string) => boolean;
  signOut: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchFavorites(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchFavorites(session.user.id);
      } else {
        setFavorites([]);
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
          console.error("Error fetching favorites:", error.message);
        }
        return;
      }
      setFavorites(data || []);
    } catch (e: any) {
      console.error("Unexpected error fetching favorites:", e.message || String(e));
    }
  };

  const refreshFavorites = async () => {
    if (user) await fetchFavorites(user.id);
  };

  const toggleFavorite = async (item: any) => {
    if (!user) return;

    const itemIdString = String(item.id || item.item_id);
    const existing = favorites.find(f => String(f.item_id) === itemIdString);
    
    try {
      if (existing) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
          
        if (error) {
          if (error.code === 'PGRST103') alert("Database Setup Required: Please create the 'favorites' table in your Supabase dashboard.");
          console.error("Error removing favorite:", error.message);
        } else {
          setFavorites(prev => prev.filter(f => f.id !== existing.id));
        }
      } else {
        const newItem = {
          user_id: user.id,
          item_id: itemIdString,
          item_type: item.type || 'track',
          title: item.title,
          subtitle: item.host || item.author || item.subtitle || '',
          image: item.image,
        };
        
        const { data, error } = await supabase
          .from('favorites')
          .insert([newItem])
          .select();
          
        if (error) {
          if (error.code === 'PGRST103') alert("Database Setup Required: Please create the 'favorites' table in your Supabase dashboard.");
          console.error("Error adding favorite:", error.message);
        } else if (data && data.length > 0) {
          setFavorites(prev => [...prev, data[0]]);
        }
      }
    } catch (err: any) {
      console.error("Toggle favorite failed:", err.message);
    }
  };

  const isFavorite = (id: string) => {
    const searchId = String(id);
    return favorites.some(f => String(f.item_id) === searchId);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e: any) {
      console.error("Sign out error:", e.message);
    } finally {
      setUser(null);
      setSession(null);
      setFavorites([]);
      window.location.hash = '#/login';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      favorites, 
      toggleFavorite, 
      isFavorite, 
      signOut,
      refreshFavorites 
    }}>
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
