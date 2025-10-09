'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/auth-provider';
import { ProfileProvider } from '@/providers/profile-provider';
import { ScreenLoader } from '@/components/common/screen-loader';
import { Demo8Layout } from '../components/layouts/demo8/layout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <ScreenLoader />;
  }

  return session ? (
    <ProfileProvider>
      <Demo8Layout>{children}</Demo8Layout>
    </ProfileProvider>
  ) : null;
}
