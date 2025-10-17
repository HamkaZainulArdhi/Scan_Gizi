import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileContent } from './content';

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/signin');
  }

  return <ProfileContent user={user} />;
}
