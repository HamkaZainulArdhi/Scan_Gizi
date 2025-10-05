// app/history/[id]/page.tsx
import { notFound } from 'next/navigation';
import type { NutritionScan } from '@/types/types';
import { createClient } from '@/lib/supabase/server';
import { NutritionResults } from '../../analisis/components/nutrition-results';

export default async function ScanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('nutrition_scans')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error(error.message);
    notFound();
  }

  if (!data) {
    notFound();
  }

  const scan = data as NutritionScan;

  return <NutritionResults scan={scan} />;
}
