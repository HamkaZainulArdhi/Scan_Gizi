import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ScreenLoader } from '@/components/common/screen-loader';
import { HistoryTable } from './components/history-table';

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/signin');
  }

  return <HistoryTable user={user} />;
}
