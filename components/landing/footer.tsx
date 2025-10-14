import React from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, MapPin, Phone } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';

const Footer: React.FC = () => {
  return (
    <div className="flex justify-center w-full px-4 py-8 ">
      <footer className="bg-[#262626] text-white py-8 px-6 rounded-2xl max-w-6xl w-full shadow-lg">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <img
                    className="h-[45px] max-w-none"
                    src={toAbsoluteUrl('/media/logo/logo1.png')}
                    alt="logo"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-300">
                GiziKita adalah platform AI-Scanner yang membantu orang tua
                memantau menu dan kandungan gizi anak setiap hari, memastikan
                asupan mereka bergizi dan sesuai standar program Makan Bergizi
                Gratis.
              </p>

              <div className="flex flex-col text-sm text-gray-300 mt-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Banyumas, Indonesia</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={16} />
                  <span>+62 852-5055-2000</span>
                </div>
              </div>
            </div>

            {/* Program */}
            <div className=" p-6">
              <h3 className="font-medium text-primary  mb-4">Program</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    LLM Gemini
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    YOLO v11
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Corporate Training
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="p-6">
              <h3 className="font-medium mb-4 text-primary ">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/donasi"
                    className="hover:text-white transition-colors"
                  >
                    Donasi
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="p-6">
              <h3 className="font-medium mb-4 text-primary ">Support</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    href="/error"
                    className="hover:text-white transition-colors"
                  >
                    Hubungi Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/error"
                    className="hover:text-white transition-colors"
                  >
                    Syarat dan Ketentuan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/error"
                    className="hover:text-white transition-colors"
                  >
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              © 2025 GiziKita. All Rights Reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="https://instagram.com"
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={20} />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-gray-400 hover:text-white"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
