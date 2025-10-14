'use client';

import CallToAction from '@/components/landing/call-to-action';
import Fitur from '@/components/landing/features';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import HowItWorks from '@/components/landing/how-it-works';
import { MenuView } from '@/components/landing/menuview';
import RecognitionSection from '@/components/landing/regonisi';

export default function Page() {
  return (
    <div className="min-h-screen w-full justify-center items-center ">
      <Header />
      <Hero />
      <MenuView />
      <RecognitionSection />
      <HowItWorks />
      <Fitur />
      <CallToAction />
      <Footer />
    </div>
  );
}
