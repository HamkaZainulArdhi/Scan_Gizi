'use client';

import { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { NutritionAnalysis, NutritionScan } from '@/types/types';
import type { NutritionSummary } from '@/types/types';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Nodata from '../../history/components/no-data';

export function Menu() {
  const [scans, setScans] = useState<NutritionScan[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase: SupabaseClient = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 ambil user aktif dulu
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error('User belum login');

        // 🔹 ambil data nutrition_scans milik user ini aja
        const { data, error } = await supabase
          .from('nutrition_scans')
          .select('*')
          .eq('user_id', user.id) // ⬅️ pakai user.id karena dari auth.uid
          .order('scan_date', { ascending: false });

        if (error) throw error;

        const parsedData: NutritionScan[] = (data || []).map(
          (item: NutritionScan) => {
            let parsedFacts = item.nutrition_facts;
            if (typeof parsedFacts === 'string') {
              try {
                parsedFacts = JSON.parse(parsedFacts);
              } catch {
                parsedFacts = {
                  items: [],
                  nutrition_summary: {
                    calories_kcal: 0,
                    protein_g: 0,
                    fat_g: 0,
                    carbs_g: 0,
                    sodium_mg: 0,
                    fiber_g: 0,
                  },
                };
              }
            }
            return { ...item, nutrition_facts: parsedFacts };
          },
        );

        setScans(parsedData);
      } catch (err) {
        console.error('Gagal memuat data nutrition_scans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  const getNutritionScore = (summary: NutritionSummary) => {
    const { calories_kcal, protein_g, fat_g, carbs_g, sodium_mg, fiber_g } =
      summary;
    const values = [
      calories_kcal,
      protein_g,
      fat_g,
      carbs_g,
      sodium_mg,
      fiber_g,
    ];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.min(Math.round(avg), 100);
  };

  if (!loading && scans.length === 0) {
    return <Nodata />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Scan Makanan</CardTitle>
      </CardHeader>

      <CardContent className="p-5 lg:p-7.5 lg:pb-7">
        <ScrollArea>
          <div className="flex flex-no-wrap gap-5">
            {scans.map((scan) => {
              const facts = scan.nutrition_facts as NutritionAnalysis;
              const score = getNutritionScore(facts.nutrition_summary);
              const formattedDate = new Date(scan.scan_date).toLocaleString(
                'id-ID',
                { dateStyle: 'medium', timeStyle: 'short' },
              );

              // Limit 4 item saja
              const items = facts.items || [];
              const displayItems = items.slice(0, 5).map((i) => i.name);
              const remainingItems = items.length > 5 ? items.length - 5 : 0;

              // Limit 4 nutrisi saja
              const summaryEntries = Object.entries(
                facts.nutrition_summary || {},
              );
              const displaySummary = summaryEntries.slice(0, 4);
              const remainingSummary =
                summaryEntries.length > 4 ? summaryEntries.length - 4 : 0;

              return (
                <Card key={scan.id} className="w-[250px] shrink-0">
                  <img
                    src={scan.image_url}
                    alt="Scan result"
                    className="w-full h-[150px] object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-1">
                      {displayItems.join(', ') || 'Tanpa Nama Menu'}{' '}
                      {remainingItems > 0 && (
                        <span className="text-muted-foreground text-sm">
                          (+{remainingItems} lainnya)
                        </span>
                      )}
                    </h3>

                    <p className="text-xs text-muted-foreground mb-2">
                      {formattedDate}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {displaySummary.map(([key, value]) => (
                        <Badge key={key} variant="secondary">
                          {key}: {value}
                        </Badge>
                      ))}
                      {remainingSummary > 0 && (
                        <Badge variant="outline">
                          +{remainingSummary} lainnya
                        </Badge>
                      )}
                    </div>

                    <Progress value={score} className="h-2 mb-1" />
                    <p className="text-xs text-right text-muted-foreground">
                      {score}% bergizi
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
