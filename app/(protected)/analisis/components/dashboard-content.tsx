'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { History, LogOut, Scan, Sparkles, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { NutritionScan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

      if (!response.ok) {
        throw new Error('Gagal menganalisis gambar');
      }

      const scanResult: NutritionScan = await response.json();
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background garis">
      <main className="container mx-auto px-4 garis h-full">
        {viewState === 'upload' && (
          <div className="max-w-4xl mx-auto  garis">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Analisis Gizi & kelayakan Menu MBG biar ga pada keracunan
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Unggah foto menu untuk mendapatkan analisis nutrisi terperinci
                didukung oleh YOLO dan LLM gemini AI model.
              </p>
            </div>

            <div className="flex-1 w-full">
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                key={imageUploadKey}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {error && (
              <Card className="border-destructive/20 bg-destructive/5">
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
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Simpan Hasil Analisis
              </h2>
              <div className="flex gap-2 justify-end">
                <Button onClick={startNewScan} variant="outline">
                  <Scan className="mr-2 h-4 w-4" />
                  Analisi Menu Baru
                </Button>
                <Button
                  onClick={() => router.push('/history')}
                  variant="primary"
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
