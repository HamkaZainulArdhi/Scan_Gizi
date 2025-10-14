'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MenuItemDetection,
  NutritionAnalysis,
  NutritionScan,
} from '@/types/types';
import { supabasePublic } from '@/lib/supabase/public-client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomBadge } from '../custom/badge';
import { CustomSubtitle } from '../custom/subtitle';
import { CustomTitle } from '../custom/title';

export function MenuView() {
  const [scans, setScans] = useState<NutritionScan[]>([]);
  // sppg rows returned by the query only include some fields
  type SppgRow = {
    id: string;
    nama?: string | null;
    kecamatan?: string | null;
  };

  type ProfileRef = {
    id_user: string;
    sppg_id?: string | null;
  };

  const [sppgList, setSppgList] = useState<SppgRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRef[]>([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(
    null,
  );
  const [selectedSppg, setSelectedSppg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const ease = [0.16, 1, 0.3, 1] as const;

  // 🟡 Ambil data sppg
  useEffect(() => {
    const fetchSppg = async () => {
      const { data, error } = await supabasePublic
        .from('sppg')
        .select('id, nama, kecamatan');

      if (error) console.error('Gagal ambil sppg:', error);
      else setSppgList(data || []);
    };
    fetchSppg();
  }, []);

  // 🟡 Ambil data profiles (hubungan user -> sppg)
  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabasePublic
        .from('profiles')
        .select('id_user, sppg_id');

      if (error) console.error('Gagal ambil profiles:', error);
      else setProfiles(data || []);
    };
    fetchProfiles();
  }, []);

  // 🟡 Ambil nutrition_scans secara publik
  useEffect(() => {
    const fetchScans = async () => {
      if (!selectedKecamatan || !selectedSppg) {
        setScans([]);
        return;
      }

      setLoading(true);
      try {
        const today = new Date();
        const days = [0, 1, 2].map((i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          return d.toISOString().split('T')[0];
        });

        const { data, error } = await supabasePublic
          .from('nutrition_scans')
          .select('*')
          .order('scan_date', { ascending: false });

        if (error) throw error;

        // Parse & join sppg
        type DbScan = {
          id: string;
          image_url: string;
          scan_date: string;
          menu_items?: MenuItemDetection[];
          nutrition_facts?: string | NutritionAnalysis | unknown;
          created_at?: string;
          user_id?: string;
          user_name?: string;
        };

        const parsedData = (data || []).map((item: DbScan) => {
          const emptySummary = {
            calories_kcal: 0,
            protein_g: 0,
            fat_g: 0,
            carbs_g: 0,
            sodium_mg: 0,
            fiber_g: 0,
          } as const;

          let parsedFacts: NutritionAnalysis | Record<string, number> =
            (item.nutrition_facts as NutritionAnalysis) || {
              items: [],
              nutrition_summary: emptySummary,
            };
          if (typeof item.nutrition_facts === 'string') {
            try {
              parsedFacts = JSON.parse(item.nutrition_facts as string);
            } catch {
              parsedFacts = { items: [], nutrition_summary: emptySummary };
            }
          }

          const profile = profiles.find((p) => p.id_user === item.user_id);
          const sppg = sppgList.find((s) => s.id === profile?.sppg_id);

          type NutritionScanRow = Omit<NutritionScan, 'profile'> & {
            profile?: ProfileRef;
            sppg?: SppgRow;
          };

          const scanObj: NutritionScanRow = {
            id: item.id,
            image_url: item.image_url,
            scan_date: item.scan_date,
            menu_items: item.menu_items || [],
            nutrition_facts: parsedFacts as NutritionAnalysis,
            created_at: item.created_at || '',
            user_name: item.user_name,
            profile,
            sppg,
          };

          return scanObj;
        });

        // Filter sppg & 3 hari terakhir
        const filtered = parsedData
          .filter((scan) => {
            const scanDate = new Date(scan.scan_date)
              .toISOString()
              .split('T')[0];
            return scan.sppg?.id === selectedSppg && days.includes(scanDate);
          })
          .sort(
            (a, b) =>
              new Date(b.scan_date).getTime() - new Date(a.scan_date).getTime(),
          )
          .slice(0, 3);
        setScans(filtered as unknown as NutritionScan[]);
      } catch (err) {
        console.error('Gagal memuat data nutrition_scans:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sppgList.length > 0 && profiles.length > 0) {
      fetchScans();
    }
  }, [sppgList, profiles, selectedKecamatan, selectedSppg]);

  // Kecamatan unik
  const kecamatanList = Array.from(
    new Set(sppgList.map((s) => s.kecamatan).filter(Boolean)),
  ) as string[];

  // Filter sppg berdasarkan kecamatan
  const sppgFiltered = selectedKecamatan
    ? sppgList.filter((s) => s.kecamatan === selectedKecamatan)
    : [];

  const getNutritionScore = (facts: Record<string, number>) => {
    const values = Object.values(facts);
    if (!values.length) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.min(Math.round(avg), 100);
  };

  const pop = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
  };

  return (
    <section className="py-2 mb-7 relative">
      {/* Header */}
      <motion.div
        variants={pop}
        className="absolute bottom-0 left-0 -z-1 top-2"
      >
        <Image
          src="/media/benner/beside.png"
          alt=""
          width={426}
          height={851}
          className="h-auto w-24 md:w-36 lg:w-48 [transform:scaleY(-1)]"
        />
      </motion.div>

      <motion.div
        variants={pop}
        className="absolute bottom-0 right-0 -z-1 top-2"
      >
        <Image
          src="/media/benner/beside.png"
          alt=""
          width={426}
          height={851}
          className="h-auto w-24 md:w-36 lg:w-48 [transform:scale(-1,-1)]"
        />
      </motion.div>

      <div className="text-center mb-4 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center justify-center flex-col text-center gap-5 mb-5"
        >
          <CustomBadge>Menu Kita</CustomBadge>

          <CustomTitle>
            Cek & Lihat
            <span className="text-primary"> Menu Kita </span>
            Hari ini
          </CustomTitle>

          <CustomSubtitle>
            Orang tua memantau menu dan gizi anak dengan mudah melalui analisis
            otomatis dan data yang transparan.
          </CustomSubtitle>

          <div className="flex justify-center">
            <Select
              onValueChange={(value) => {
                setSelectedKecamatan(value);
                setSelectedSppg(null);
              }}
            >
              <SelectTrigger className="w-[300px] rounded-md font-semibold">
                <SelectValue placeholder="Pilih Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                {kecamatanList.map((kec) => (
                  <SelectItem key={kec} value={kec}>
                    {kec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      </div>

      {/* Navbar sppg */}
      {selectedKecamatan && (
        <div className="flex justify-center mb-4">
          <div className="flex gap-4 overflow-x-auto p-2 rounded-xl shadow-inner max-w-[800px] bg-muted">
            {sppgFiltered.map((sppg) => (
              <button
                key={sppg.id}
                onClick={() => setSelectedSppg(sppg.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedSppg === sppg.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {sppg.nama}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Card Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-screen px-6"
      >
        <Card className="max-w-[853px] mx-auto border">
          <CardHeader>
            <CardTitle>Riwayat Scan Makanan</CardTitle>
          </CardHeader>
          <CardHeader>
            <Badge variant="success" appearance="outline" size="lg">
              SD
            </Badge>
            <Badge>SMP</Badge>
            <Badge>SMA</Badge>
          </CardHeader>

          <CardContent className="p-5 lg:p-7.5 lg:pb-7">
            {!selectedKecamatan || !selectedSppg ? (
              <p className="text-center text-sm text-muted-foreground">
                Silakan pilih kecamatan dan SPPG terlebih dahulu.
              </p>
            ) : loading ? (
              <p className="text-center text-sm text-muted-foreground">
                Loading...
              </p>
            ) : scans.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Tidak ada data scan dalam 3 hari terakhir untuk filter ini.
              </p>
            ) : (
              <ScrollArea>
                <div className="flex flex-no-wrap gap-5">
                  {scans.map((scan) => {
                    const facts = scan.nutrition_facts as NutritionAnalysis;
                    const score = getNutritionScore(
                      facts.nutrition_summary as unknown as Record<
                        string,
                        number
                      >,
                    );
                    const formattedDate = new Date(
                      scan.scan_date,
                    ).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    });

                    const items = facts.items || [];
                    // menu makananya
                    const displayItems = items.map((i) => i.name);
                    const summaryEntries = Object.entries(
                      facts.nutrition_summary || {},
                    );
                    // nutrisi
                    const displaySummary = summaryEntries;

                    return (
                      <Card key={scan.id} className="w-[250px] shrink-0">
                        <img
                          src={scan.image_url}
                          alt="Scan result"
                          className="w-full h-[150px] object-cover rounded-t-xl"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-base mb-1">
                            {displayItems.join(', ') || 'Tanpa Nama Menu'}{' '}
                          </h3>

                          <p className="text-xs text-muted-foreground mb-2">
                            {formattedDate}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {displaySummary.map(([key, value]) => (
                              <Badge key={key} variant="secondary">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>

                          <Progress value={score} className="h-2 mb-1" />
                          <p className="text-xs text-right text-muted-foreground">
                            {score}% bergizi
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
