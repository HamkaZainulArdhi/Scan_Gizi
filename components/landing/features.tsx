import { motion } from 'framer-motion';
import { BarChart3, Globe, Table, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { CustomBadge } from '@/components/custom/badge';
import { CustomSubtitle } from '@/components/custom/subtitle';
import { CustomTitle } from '@/components/custom/title';

const Fitur = () => {
  const features = [
    {
      id: 'Dashboard Analitik',
      icon: BarChart3,
      title: 'Dashboard Analitik',
      description:
        'Pantau hasil pemindaian gizi, sebaran menu, dan data penerima MBG secara real-time melalui dashboard interaktif yang mudah dipahami.',
      stats: '100%',
      metric: 'Data Tervisualisasi',
      colors: {
        bg: 'bg-sky-100/40 dark:bg-sky-950/40',
        icon: 'text-sky-600',
        hover: 'hover:border-sky-500',
        shadow: 'group-hover:shadow-sky-500/30',
        gradient: 'from-sky-500 via-sky-600 to-sky-700',
        text: 'group-hover:text-sky-700',
      },
    },
    {
      id: 'Scan Gizi Menu MBG',
      icon: Zap,
      title: 'Scan Gizi Menu MBG',
      description:
        'Lakukan pemindaian cepat yang didukung oleh Kecerdasan Buatan terupdate untuk mengetahui nilai gizi makanan di program MBG secara otomatis dan akurat.',
      stats: '5 detik',
      metric: 'Waktu Analisis',
      colors: {
        bg: 'bg-green-100/40 dark:bg-green-950/40',
        icon: 'text-green-600',
        hover: 'hover:border-green-500',
        shadow: 'group-hover:shadow-green-500/30',
        gradient: 'from-green-500 via-green-600 to-green-700',
        text: 'group-hover:text-green-700',
      },
    },
    {
      id: 'menu-mbg-convert',
      icon: Table,
      title: 'Menu MBG & Desain Sosmed',
      description:
        'Simpan, kelola, dan update data menu MBG Setiap data bisa langsung dikonversi otomatis menjadi desain visual yang siap diposting di berbagai platform media sosial.',
      stats: '500+',
      metric: 'Menu Terdata',
      colors: {
        bg: 'bg-emerald-100/40 dark:bg-emerald-950/40',
        icon: 'text-emerald-600',
        hover: 'hover:border-emerald-500',
        shadow: 'group-hover:shadow-emerald-500/30',
        gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
        text: 'group-hover:text-emerald-700',
      },
    },
    {
      id: 'Transparansi Menu MBG',
      icon: Globe,
      title: 'Transparansi Menu MBG',
      description:
        'Menampilkan menu dan data gizi di laman publik agar masyarakat dapat memantau pelaksanaan MBG secara transparan di setiap wilayah.',
      stats: '100%',
      metric: 'Akses Publik',
      colors: {
        bg: 'bg-amber-100/40 dark:bg-amber-950/20',
        icon: 'text-amber-600',
        hover: 'hover:border-amber-500',
        shadow: 'group-hover:shadow-amber-500/30',
        gradient: 'from-amber-500 via-amber-600 to-amber-700',
        text: 'group-hover:text-amber-700',
      },
    },
  ];

  return (
    <section
      id="fitur"
      className="py-24 bg-background border-b border-border/50"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center flex-col text-center gap-5 mb-16"
        >
          <CustomBadge>Fitur Utama</CustomBadge>

          <CustomTitle>
            Fitur <span className="text-primary">GiziKita</span>
          </CustomTitle>

          <CustomSubtitle>
            Scan Gizi Menu MBG menghadirkan inovasi digital untuk mendukung
            program Makan Bergizi Gratis, dengan fitur analisis gizi otomatis
            dan pelaporan data yang akurat untuk meningkatkan efisiensi program
            pemerintah.
          </CustomSubtitle>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card
                className={cn(
                  'h-full bg-background border border-border transition-all duration-500 p-8 relative overflow-hidden hover:shadow-lg',
                  feature.colors.hover,
                )}
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div
                      className={cn(
                        'size-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 relative overflow-hidden',
                        feature.colors.bg,
                      )}
                    >
                      <feature.icon
                        className={cn(
                          'size-5 relative z-10',
                          feature.colors.icon,
                        )}
                      />
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-semibold text-foreground mb-1">
                        {feature.stats}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                        {feature.metric}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-6 group-hover:text-foreground transition-colors leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Hover effect gradient border */}
                <div
                  className={cn(
                    'absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left',
                    feature.colors.gradient,
                    feature.colors.gradient,
                  )}
                />

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/0 group-hover:from-slate-50/30 group-hover:to-slate-100/10 dark:from-slate-900/0 dark:to-slate-800/0 transition-all duration-500 pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fitur;
