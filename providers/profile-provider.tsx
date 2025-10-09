'use client';

import { createContext, useContext } from 'react';
import useSWRImmutable from 'swr';

type ProfileContextType = {
  profile: any | null;
  isLoading: boolean;
  error: any;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch profile');
  }
  return data;
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useSWRImmutable('/api/profile', fetcher);

  const profile = data?.data ?? null; // Remove array access since it's a single object

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
