import Link from 'next/link';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Atom, AtomIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  const handleConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      angle: 140, // arah ke tengah atas kanan, bisa ubah sesuai posisi tombol
      origin: { x, y },
      startVelocity: 45,
    });
  };

  const handleConfettimobile = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  return (
    <section className="relative flex justify-center items-center py-6 px-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-600  to-yellow-400 shadow-lg">
        {/* Pattern opsional */}
        <div className="absolute inset-0 pointer-events-none" />

        <div className="relative z-10 p-4 sm:p-5 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-5"
          >
            {/* Kiri: Icon + Teks */}
            <div className="flex items-start sm:items-center gap-3 text-left w-full md:w-auto">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400/20">
                <AtomIcon className="text-yellow-50" size={26} />
              </div>
              <div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-white font-semibold text-base sm:text-lg"
                >
                  Ingin Mencoba AI GiziKita?
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-white/80 text-sm sm:text-base leading-snug"
                >
                  Silakan akses AI Scanner dan rasakan kemudahannya
                </motion.p>
              </div>
            </div>

            {/* Kanan: Tombol */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="w-full md:w-auto"
            >
              <Link href="/aiscanner">
                <Button
                  size="lg"
                  className="w-full md:w-auto font-semibold rounded-3xl bg-amber-600 hover:bg-amber-600/80"
                  onMouseEnter={(e) => {
                    if (window.innerWidth < 768) {
                      handleConfettimobile();
                    } else {
                      handleConfetti(e);
                    }
                  }}
                >
                  <Atom />
                  Coba AI
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
