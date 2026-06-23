'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync profile details from public.users table
  const fetchUserProfile = async (authUser: SupabaseAuthUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        // User profile doesn't exist yet, insert a new record
        if (error.code === 'PGRST116') {
          const newProfile: Partial<User> = {
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
            avatar_url: authUser.user_metadata?.avatar_url || null,
            user_role: 'user',
            is_banned: false,
          };

          const { data: insertedData, error: insertError } = await supabase
            .from('users')
            .insert(newProfile)
            .select()
            .single();

          if (insertError) {
            console.error('Error inserting profile:', insertError);
            return null;
          }
          return insertedData as User;
        }
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as User;
    } catch (err) {
      console.error('Fetch profile catch:', err);
      return null;
    }
  };

  const syncAuth = async (sessionUser: SupabaseAuthUser | null) => {
    if (!sessionUser) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    const profile = await fetchUserProfile(sessionUser);
    if (profile) {
      if (profile.is_banned) {
        // Sign out banned user immediately
        await supabase.auth.signOut();
        setUser(null);
        alert('Your account has been banned by the administrator.');
      } else {
        setUser(profile);
      }
    } else {
      setUser(null);
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuth(session?.user ?? null);
    });

    // Listen to changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        syncAuth(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    setAuthLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setAuthLoading(false);
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await syncAuth(session.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        loginWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
