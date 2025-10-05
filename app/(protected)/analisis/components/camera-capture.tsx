'use client';

import { Camera, Circle, RotateCcw, X } from 'lucide-react';
import type { UseCameraReturn } from '@/hooks/use-camera';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  camera: UseCameraReturn;
  onCapture: (file: File) => void;
  isUploading: boolean;
  isAnalyzing: boolean;
}

export function CameraCapture({
  camera,
  onCapture,
  isUploading,
  isAnalyzing,
}: CameraCaptureProps) {
  const {
    isCameraActive,
    isCameraSupported,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = camera;

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      onCapture(file);
    }
  };

  if (isCameraActive) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-full  aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <Badge
            variant="success"
            appearance="outline"
            onClick={handleCapture}
            disabled={isUploading}
            className="hover:opacity-80 transition cursor-pointer h-8"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Circle className="w-4 h-4 mr-2" />
            )}
            Ambil Foto
          </Badge>

          <Badge
            variant="outline"
            appearance="light"
            onClick={switchCamera}
            disabled={isUploading}
            className="hover:opacity-80 transition cursor-pointer h-8 "
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Ganti Kamera
          </Badge>

          <Badge
            variant="outline"
            appearance="light"
            onClick={stopCamera}
            className="hover:opacity-80 transition cursor-pointer h-8 "
            disabled={isUploading}
          >
            <X className="w-4 h-4 mr-2" />
            Tutup
          </Badge>
        </div>
      </div>
    );
  }

  // Camera buttons when not active
  if (isCameraSupported) {
    return (
      <>
        <Badge
          variant="success"
          appearance="outline"
          onClick={() => startCamera('environment')}
          disabled={isUploading || isAnalyzing}
          className="mt-4 cursor-pointer hover:opacity-80 transition h-8 "
        >
          <Camera className="w-4 h-4 mr-2" />
          Ambil Gambar
        </Badge>

        {/* <Badge
          variant="warning"
          appearance="outline"
          size="lg"
          onClick={() => startCamera('user')}
          disabled={isUploading || isAnalyzing}
          className="mt-4 cursor-pointer hover:opacity-80 transition "
        >
          <Camera className="w-4 h-4 mr-2" />
          Kamera Depan
        </Badge> */}
      </>
    );
  }

  return null;
}
