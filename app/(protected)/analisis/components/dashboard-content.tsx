'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { History, Scan } from 'lucide-react';
import type { NutritionScan } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUpload } from './image-upload';
import { NutritionResults } from './nutrition-results';
import { NutritionReview } from './nutrition-review';

interface DashboardContentProps {
  user: SupabaseUser;
}

type ViewState = 'upload' | 'review' | 'results';

export function DashboardContent({ user }: DashboardContentProps) {
  const [currentScan, setCurrentScan] = useState<NutritionScan | null>(null);
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [imageUploadKey, setImageUploadKey] = useState(0);

  const handleImageUploaded = async (imageUrl: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menganalisis gambar');
      }

      const scanResult: NutritionScan = data;
      setCurrentScan(scanResult);
      setViewState('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menganalisis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveScan = async (editedScan: NutritionScan) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editedScan,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save scan');
      }

      setCurrentScan(editedScan);
      setViewState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save scan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelReview = () => {
    setViewState('upload');
    setCurrentScan(null);
  };

  const startNewScan = () => {
    setCurrentScan(null);
    setViewState('upload');
    setError(null);
  };

  // const handleLogout = async () => {
  //   const supabase = createClient();
  //   await supabase.auth.signOut();
  //   router.push('/');
  // };

  return (
    <div className="bg-background h-[500px] ">
      <main className="container mx-auto px-4 h-full">
        {viewState === 'upload' && (
          <div className="max-w-4xl mx-auto  min-h-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Analisis Gizi Menu MBG
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unggah foto menu untuk mendapatkan analisis nutrisi terperinci
                didukung oleh YOLO dan LLM gemini AI model.
              </p>
            </div>

            <div className="flex-1 w-full ">
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                key={imageUploadKey}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {error && (
              <Card className="border-destructive/20 bg-destructive/5 mt-10">
                <CardContent className="p-4">
                  <p className="text-destructive text-center">{error}</p>
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setError(null);
                        setImageUploadKey((k) => k + 1);
                      }}
                    >
                      Coba Lagi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {viewState === 'review' && currentScan && (
          <div className="max-w-6xl mx-auto">
            <NutritionReview
              scan={currentScan}
              onSave={handleSaveScan}
              onCancel={handleCancelReview}
              isSaving={isSaving}
            />
          </div>
        )}

        {viewState === 'results' && currentScan && (
          <div className="space-y-6 garis">
            <div className="flex flex-col gap-4  garis sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  Simpan Hasil Analisis
                </h2>
                <p className="text-muted-foreground mt-1">
                  Hasil analisis AI akan disimpan di riwayat analisis.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
                <Button
                  onClick={startNewScan}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Scan className="mr-2 h-4 w-4" />
                  Analisis Menu Baru
                </Button>
                <Button
                  onClick={() => router.push('/history')}
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  <History className="mr-2 h-4 w-4" />
                  Riwayat Analisis
                </Button>
              </div>
            </div>
            <NutritionResults scan={currentScan} />
          </div>
        )}
      </main>
    </div>
  );
}
