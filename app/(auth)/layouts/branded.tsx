'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

export function BrandedLayout({ children }: { children: ReactNode }) {
  const messages = [
    'Selamat Datang di Platform AI-Scan Gizi MBG',
    'Analisis Menu Makan Bergizi Gratis dengan Cepat dan Akurat',
    'Pantau Transparansi Gizi untuk Kesehatan Anak Indonesia',
    'Dukung Program Makan Bergizi Gratis Pemerintah',
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/benner/bg-3.png')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/benner/bg-3-dark.png')}');
          }
        `}
      </style>

      <div className="grow relative overflow-hidden">
        {/* === video disini === */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="media/benner/loginvideo.mp4"
        />
        {/* overlay biar konten kebaca */}
        <div className="absolute inset-0 bg-black/30" />

        {/* === container utama === */}
        <div className="flex flex-col lg:flex-row max-w-6xl mx-auto h-full justify-end lg:justify-between items-center  p-8 lg:p-10 order-2 lg:order-1 relative">
          {/* === animasi teks disini === */}
          <div className="w-full lg:w-1/2 text-center lg:text-left text-white text-shadow-accent-foreground text-2xl lg:text-6xl font-bold overflow-hidden mb-6 lg:mb-0">
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {messages[index]}
            </motion.div>
          </div>

          {/* card login */}
          <Card className="w-full max-w-[400px] relative z-10 shadow-2xl backdrop-blur-lg">
            <CardContent className="p-6">{children}</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
