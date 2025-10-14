'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CustomBadge } from '../custom/badge';
import { CustomSubtitle } from '../custom/subtitle';
import { CustomTitle } from '../custom/title';

const partnersTop = [
  { src: '/media/collab/BGN_LOGO.png', alt: 'Kampus Merdeka' },
  { src: '/media/collab/kemenhan.png', alt: 'Kedaireka' },
  { src: '/media/collab/kemendikbut.png', alt: 'Telkom University' },
  { src: '/media/collab/pemkab.png', alt: 'Telkom University' },
];

const partnersBottom = [
  { src: '/media/collab/bpom.png', alt: 'Telkom University' },
  { src: '/media/collab/desa.png', alt: 'Telkom University' },
  { src: '/media/collab/kemenkes.png', alt: 'Telkom University' },
  { src: '/media/collab/bpn.png', alt: 'Telkom University' },
  { src: '/media/collab/kemendagri.png', alt: 'Telkom University' },
  { src: '/media/collab/komdigi.png', alt: 'Telkom University' },
  { src: '/media/collab/bumn.svg', alt: 'Telkom University' },
  { src: '/media/collab/tani.png', alt: 'Telkom University' },
  { src: '/media/collab/bapernas.png', alt: 'Telkom University' },
  { src: '/media/collab/panrb.png', alt: 'Telkom University' },
  { src: '/media/collab/uang.png', alt: 'Telkom University' },
];

export default function RecognitionSection() {
  return (
    <section
      id="recognition"
      className="w-full bg-background py-16 md:py-24 px-4 text-center"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center flex-col text-center gap-5 mb-16"
        >
          <CustomBadge>Rekognisi</CustomBadge>

          <CustomTitle>
            Kolabrasi <span className="text-primary">Berbagai Mitra</span>
          </CustomTitle>

          <CustomSubtitle>
            Sebagai inisiatif pendukung program MBG, GiziKita berkolaborasi
            dengan berbagai pihak untuk menjamin transparansi pelaksanaan MBG.
          </CustomSubtitle>
        </motion.div>

        {/* Top Partner Logos */}
        <div className="flex flex-wrap justify-center gap-10 mb-10">
          {partnersTop.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative h-12 md:h-18 w-auto"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={180}
                height={60}
                className="object-contain h-full w-auto mx-auto"
              />
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-200 my-8 max-w-5xl mx-auto" />

        {/* Bottom Partner Logos */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {partnersBottom.map((partner, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="relative h-10 md:h-12 w-auto"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={150}
                height={50}
                className="object-contain h-full w-auto mx-auto"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
