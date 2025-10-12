'use client';

import Fitur from '@/components/landing/features';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import HowItWorks from '@/components/landing/how-it-works';
import { MenuView } from '@/components/landing/menuview';
import { Menu } from './(protected)/gamer/components';

export default function Page() {
  return (
    <div className="min-h-screen mx-auto justify-center items-center  lg:p-5">
      <Header />
      <MenuView />
      <HowItWorks />
      <Fitur />
      <Footer />
    </div>
  );
}
