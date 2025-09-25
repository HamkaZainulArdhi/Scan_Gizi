'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Download,
  ImageIcon,
  Scale,
  Share2,
} from 'lucide-react';
import {
  exportHistoryToExcel,
  generateShareCard,
  shareNutritionScan,
} from '@/lib/export-utils';
import type { NutritionScan } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface NutritionResultsProps {
  scan: NutritionScan;
}

export function NutritionResults({ scan }: NutritionResultsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const { image_url, menu_items, nutrition_facts, scan_date } = scan;
  const { nutrition_summary, items } = nutrition_facts;

  const dailyValues = {
    calories: Math.round((nutrition_summary.calories_kcal / 2000) * 100),
    protein: Math.round((nutrition_summary.protein_g / 50) * 100),
    fat: Math.round((nutrition_summary.fat_g / 65) * 100),
    carbs: Math.round((nutrition_summary.carbs_g / 300) * 100),
    sodium: Math.round((nutrition_summary.sodium_mg / 2300) * 100),
    fiber: Math.round((nutrition_summary.fiber_g / 25) * 100),
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    try {
      const result = await shareNutritionScan(scan);
      if (result === true) {
        setShareStatus('Shared successfully!');
      } else if (result === 'clipboard') {
        setShareStatus('Copied to clipboard!');
      } else {
        setShareStatus('Share failed. Please try again.');
      }

      setTimeout(() => setShareStatus(null), 3000);
    } catch (error) {
      setShareStatus('Share failed. Please try again.');
      setTimeout(() => setShareStatus(null), 3000);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportHistoryToExcel([scan]);
      setShareStatus('Excel file downloaded!');
      setTimeout(() => setShareStatus(null), 3000);
    } catch (error) {
      setShareStatus('Export failed. Please try again.');
      setTimeout(() => setShareStatus(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareCard = async () => {
    setIsGeneratingCard(true);
    try {
      const cardUrl = await generateShareCard(scan);
      const link = document.createElement('a');
      link.href = cardUrl;
      link.download = `nutrition-card-${new Date(scan.scan_date).toISOString().split('T')[0]}.png`;
      link.click();

      URL.revokeObjectURL(cardUrl);
      setShareStatus('Nutrition card downloaded!');
      setTimeout(() => setShareStatus(null), 3000);
    } catch (error) {
      setShareStatus('Card generation failed. Please try again.');
      setTimeout(() => setShareStatus(null), 3000);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  return (
    <div className="space-y-6 px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <img
              src={image_url || '/placeholder.svg'}
              alt="Analyzed food"
              className="w-full h-64 object-cover rounded-lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Scan Information History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Scan Date</p>
              <p className="font-medium">{formatDate(scan_date)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Items Detected</p>
              <p className="font-medium">{menu_items.length} food items</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                disabled={!!shareStatus}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                disabled={isExporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Excel'}
              </Button>
              <Button
                onClick={handleShareCard}
                variant="outline"
                size="sm"
                disabled={isGeneratingCard}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {isGeneratingCard ? 'Generating...' : 'Share Card'}
              </Button>
            </div>

            {shareStatus && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <CheckCircle className="w-4 h-4" />
                {shareStatus}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Nutrition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Calories */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-primary">
                {Math.round(nutrition_summary.calories_kcal)} kcal
              </div>
              <div className="text-sm text-muted-foreground mb-2">Calories</div>
              <Progress
                value={Math.min(dailyValues.calories, 100)}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {dailyValues.calories}% Daily Value
              </div>
            </div>

            {/* Protein */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-primary">
                {Math.round(nutrition_summary.protein_g)}g
              </div>
              <div className="text-sm text-muted-foreground mb-2">Protein</div>
              <Progress
                value={Math.min(dailyValues.protein, 100)}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {dailyValues.protein}% Daily Value
              </div>
            </div>

            {/* Fat */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-primary">
                {Math.round(nutrition_summary.fat_g)}g
              </div>
              <div className="text-sm text-muted-foreground mb-2">Fat</div>
              <Progress
                value={Math.min(dailyValues.fat, 100)}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {dailyValues.fat}% Daily Value
              </div>
            </div>

            {/* Carbs */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-primary">
                {Math.round(nutrition_summary.carbs_g)}g
              </div>
              <div className="text-sm text-muted-foreground mb-2">Carbs</div>
              <Progress
                value={Math.min(dailyValues.carbs, 100)}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {dailyValues.carbs}% Daily Value
              </div>
            </div>

            {/* Sodium */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-primary">
                {Math.round(nutrition_summary.sodium_mg)}mg
              </div>
              <div className="text-sm text-muted-foreground mb-2">Sodium</div>
              <Progress
                value={Math.min(dailyValues.sodium, 100)}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {dailyValues.sodium}% Daily Value
              </div>
            </div>

            {/* Fiber */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-primary">
                {Math.round(nutrition_summary.fiber_g)}g
              </div>
              <div className="text-sm text-muted-foreground mb-2">Fiber</div>
              <Progress
                value={Math.min(dailyValues.fiber, 100)}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {dailyValues.fiber}% Daily Value
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Detected Food Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {menu_items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.nama_menu}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {item.estimasi_gram}g
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.deskripsi}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Preparation:</strong> {item.proses_pengolahan}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Nutrition Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge variant="outline">{item.grams}g</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">
                      {item.calories_kcal}
                    </div>
                    <div className="text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{item.protein_g}g</div>
                    <div className="text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{item.fat_g}g</div>
                    <div className="text-muted-foreground">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{item.carbs_g}g</div>
                    <div className="text-muted-foreground">Carbs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{item.sodium_mg}mg</div>
                    <div className="text-muted-foreground">Sodium</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{item.fiber_g}g</div>
                    <div className="text-muted-foreground">Fiber</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
