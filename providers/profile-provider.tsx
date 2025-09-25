'use client';

import { createContext, useContext } from 'react';
import useSWR from 'swr';

type ProfileContextType = {
  profile: any | null;
  isLoading: boolean;
  error: any;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useSWR('/api/profile', fetcher);

  const profile = data?.data?.[0] ?? null;

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
