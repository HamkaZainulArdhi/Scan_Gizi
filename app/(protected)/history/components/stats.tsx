'use client';

import { File, FileText, HelpCircle } from 'lucide-react';
import { NutritionScan } from '@/types/types';
import { Card, CardContent } from '@/components/ui/card';

// konfigurasi stat cards
const STATS_CONFIG = [
  {
    key: 'scans',
    label: 'Total Scan Menu',
    color: 'text-primary',
    Background: 'bg-gradient-to-r from-blue-500 to-blue-600',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    key: 'calories',
    label: 'Total Kalori Terdeteksi',
    color: 'text-chart-1',
    Background: 'bg-gradient-to-r from-green-500 to-green-600',
    icon: <HelpCircle className="w-6 h-6" />,
  },
  {
    key: 'items',
    label: 'Jenis menu terdeteksi',
    color: 'text-chart-2',
    Background: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    icon: <File className="w-6 h-6" />,
  },
];
// fungsi hitung nilai dari scans
const getStatsValues = (scans: NutritionScan[]) => ({
  scans: scans.length,
  calories: Math.round(
    scans.reduce(
      (t, s) => t + (s.nutrition_facts.nutrition_summary?.calories_kcal || 0),
      0,
    ),
  ),
  items: scans.reduce((t, s) => t + (s.menu_items?.length || 0), 0),
});

interface StatsProps {
  scans: NutritionScan[];
}

export default function Stats({ scans }: StatsProps) {
  const statsValues = getStatsValues(scans);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {STATS_CONFIG.map((stat) => (
        <Card key={stat.key} className={`rounded-xl ${stat.Background}`}>
          <CardContent className="p-6 flex flex-col justify-between relative">
            <div className="text-sm text-white">{stat.label}</div>
            <div className="text-3xl font-bold text-white mb-2">
              {statsValues[stat.key as keyof typeof statsValues]}
            </div>
            <div className="absolute top-4 right-4 opacity-80">
              <span className="text-2xl text-white">{stat.icon}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
