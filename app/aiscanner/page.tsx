'use client';

import { useState } from 'react';
import { Scan } from 'lucide-react';
import type { NutritionScan } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import { ImageUpload, NutritionResults } from './components';

type ViewState = 'upload' | 'review' | 'results';

export default function AIscanner() {
  const [currentScan, setCurrentScan] = useState<NutritionScan | null>(null);
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setViewState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menganalisis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startNewScan = () => {
    setCurrentScan(null);
    setViewState('upload');
    setError(null);
  };

  return (
    <div className="bg-background h-full p-7 mt-24 w-full ">
      <Header />
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

        {/* {viewState === 'review' && currentScan && (
          <div className="max-w-6xl mx-auto">
            <NutritionReview scan={currentScan} onCancel={handleCancelReview} />
          </div>
        )} */}

        {viewState === 'results' && currentScan && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              </div>
            </div>
            <NutritionResults scan={currentScan} />
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}
