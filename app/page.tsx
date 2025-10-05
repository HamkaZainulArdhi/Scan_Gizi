'use client';

import Features from '@/components/landing/features';
import Header from '@/components/landing/header';
import HowItWorks from '@/components/landing/how-it-works';

export default function Page() {
  return (
    <div className="min-h-screen lg:p-5">
      <Header />
      <HowItWorks />
      <Features />
    </div>
  );
}
