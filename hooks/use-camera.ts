'use client';

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCameraReturn {
  // Camera state
  stream: MediaStream | null;
  isCameraActive: boolean;
  isCameraSupported: boolean;
  facingMode: 'user' | 'environment';
  error: string | null;

  // Camera controls
  startCamera: (facing: 'user' | 'environment') => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => void;
  capturePhoto: () => Promise<File | null>;

  // Refs for video and canvas
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fix: ref boleh null dulu
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check camera support on mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsCameraSupported(false);
    }
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = useCallback(
    async (facing: 'user' | 'environment') => {
      try {
        setError(null);

        // Stop existing stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        const newStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        setStream(newStream);
        setFacingMode(facing);
        setIsCameraActive(true);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        setError(
          'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.',
        );
        setIsCameraSupported(false);
      }
    },
    [stream],
  );

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const switchCamera = useCallback(() => {
    const newFacing = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newFacing);
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback(async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          const file = new File([blob], `camera-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          });
          resolve(file);
        },
        'image/jpeg',
        0.9,
      );
    });
  }, []);

  return {
    stream,
    isCameraActive,
    isCameraSupported,
    facingMode,
    error,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  };
}
