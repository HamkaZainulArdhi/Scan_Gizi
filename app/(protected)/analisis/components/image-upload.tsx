'use client';

import { useCallback, useState } from 'react';
import { ImageIcon, Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CameraCapture } from './camera-capture';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  isAnalyzing?: boolean;
}

export function ImageUpload({
  onImageUploaded,
  isAnalyzing = false,
}: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const camera = useCamera();

  const uploadToSupabase = async (file: File): Promise<string> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('food-images').getPublicUrl(data.path);

    return publicUrl;
  };

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('file harus berupa gambar');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('file tidak boleh lebih besar dari 10MB');
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        const previewUrl = URL.createObjectURL(file);
        setUploadedImage(previewUrl);
        const publicUrl = await uploadToSupabase(file);
        onImageUploaded(publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload gagal');
        setUploadedImage(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUploaded],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile],
  );

  const handleCameraCapture = useCallback(
    async (file: File) => {
      await processFile(file);
    },
    [processFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
    disabled: isUploading || isAnalyzing || camera.isCameraActive,
  });

  const clearImage = () => {
    setUploadedImage(null);
    setError(null);
    if (camera.isCameraActive) {
      camera.stopCamera();
    }
  };

  return (
    <div className="w-full max-w-6xl ">
      {!uploadedImage ? (
        <Card
          className={cn(
            'transition-colors h-full sm:h-84 border-transparent',
            !camera.isCameraActive &&
              'border-2 border-dashed border-border hover:border-primary/50',
          )}
        >
          <CardContent className="space-y-3 bg-secondary dark:bg-secondary/50 rounded-xl ">
            {/* Kalau kamera aktif → tampil kamera */}
            {camera.isCameraActive ? (
              <CameraCapture
                camera={camera}
                onCapture={handleCameraCapture}
                isUploading={isUploading}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              /* Kalau kamera belum aktif → tampil dropzone */
              <div
                {...getRootProps()}
                className={cn(
                  'flex flex-col items-center justify-center space-y-4 cursor-pointer h-full',
                  isDragActive && 'opacity-50',
                  (isUploading || isAnalyzing) &&
                    'cursor-not-allowed opacity-50',
                )}
              >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div className="text-center items-center justify-center ">
                  <h3 className="text-lg font-semibold text-foreground">
                    {isUploading ? 'Uploading...' : 'Upload Menu'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isDragActive
                      ? 'jatuhkan foto menu di sini...'
                      : 'Seret dan jatuhkan foto menu, atau klik untuk memilih'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Support JPEG, PNG, WebP (max 10MB)
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons selalu di bawah */}
            {!camera.isCameraActive && (
              <div className="flex gap-2 justify-center flex-col sm:flex-row mt-5">
                <CameraCapture
                  camera={camera}
                  onCapture={handleCameraCapture}
                  isUploading={isUploading}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Kalau sudah ada uploaded image */
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={uploadedImage || '/placeholder.svg'}
                alt="Uploaded food"
                className="w-full h-84 object-cover rounded-lg"
              />
              {!isAnalyzing && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm">Menganalisis Menu</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {(error || camera.error) && (
        <div className="mt-10 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error || camera.error}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
