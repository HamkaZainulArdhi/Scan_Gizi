'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: SupabaseUser;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  data: { user: SupabaseUser } | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser) as SupabaseUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      setUser(data.user);
      localStorage.setItem('auth-user', JSON.stringify(data.user));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  const data = user ? { user } : null;
  const status = isLoading
    ? 'loading'
    : user
      ? 'authenticated'
      : 'unauthenticated';

  return (
    <AuthContext.Provider
      value={{
        user: user as SupabaseUser,
        login,
        logout,
        isLoading,
        data,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useSession() {
  const { data, status } = useAuth();
  return { data, status };
}

export async function signIn(
  provider: string,
  options?: Record<string, unknown>,
) {
  void options;

  if (provider === 'credentials') {
    return { error: null };
  }
  if (provider === 'google') {
    console.log('Google sign in clicked - implement your Google auth here');
    return { error: null };
  }
  return { error: 'Provider not supported' };
}

export function signOut() {
  const authUser = localStorage.getItem('auth-user');
  if (authUser) {
    localStorage.removeItem('auth-user');
    window.location.reload();
  }
}
