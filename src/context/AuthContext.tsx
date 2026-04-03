import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarPublicId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; avatarUrl?: string; avatarPublicId?: string }) => Promise<void>;
  updateUserLocal: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        setToken(session.access_token);
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatarUrl: session.user.user_metadata.avatar_url || '',
          avatarPublicId: session.user.user_metadata.avatar_public_id || ''
        });
        localStorage.setItem('token', session.access_token);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatarUrl: session.user.user_metadata.avatar_url || '',
          avatarPublicId: session.user.user_metadata.avatar_public_id || ''
        });
        localStorage.setItem('token', session.access_token);
      } else {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async ({ name, avatarUrl, avatarPublicId }: { name?: string; avatarUrl?: string; avatarPublicId?: string }) => {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
    if (avatarPublicId !== undefined) updateData.avatar_public_id = avatarPublicId;

    const { data, error } = await supabase.auth.updateUser({
      data: updateData
    });
    
    if (error) throw error;
    
    if (data.user) {
      setUser(prev => prev ? { 
        ...prev, 
        ...(name && { name }), 
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(avatarPublicId !== undefined && { avatarPublicId })
      } : null);
    }
  };

  const updateUserLocal = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, logout, updateProfile, updateUserLocal, isAuthenticated: !!token }}>
      {!loading && children}
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
