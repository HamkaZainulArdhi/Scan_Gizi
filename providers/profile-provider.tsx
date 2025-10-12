'use client';

import { createContext, useContext } from 'react';
import useSWRImmutable from 'swr';
import { Profile, Sppg } from '@/types/profil.type';

// ✅ Gabungan Profile dan Sppg
type ProfileWithSppg = Profile & { sppg?: Sppg | null };

type ProfileContextType = {
  profile: ProfileWithSppg | null;
  isLoading: boolean;
  error: Error | { message: string } | null;
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

  const profile = data?.data ?? null;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error: error
          ? error instanceof Error
            ? error
            : { message: String(error) }
          : null,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
