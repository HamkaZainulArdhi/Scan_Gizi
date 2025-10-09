'use client';

import { Fragment, useEffect, useState } from 'react';
// pastikan path sesuai dengan tempat kamu simpan file client.ts
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Disc, MapPin } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useHistoryScans } from '@/hooks/use-history-scan';
import { ScreenLoader } from '@/components/common/screen-loader';
import { EarningsChart } from '@/app/(protected)/components/demo1';
import { UserHero } from '@/app/components/partials/common/user-hero';
import Stats from '../history/components/stats';
import { Menu } from './components';

interface HistoryTableProps {
  user: SupabaseUser;
}

interface ProfileData {
  nama_lengkap: string | null;
  avatar_url: string | null;
  sppg: {
    nama: string | null;
    wilayah: string | null;
    alamat: string | null;
  } | null;
}

export function ProfileContent({ user }: HistoryTableProps) {
  const { scans } = useHistoryScans(user);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          `
    nama_lengkap,
    jabatan,
    avatar_url,
    sppg:sppg_id (
      nama,
      wilayah,
      alamat
    )
  `,
        )
        .eq('id_user', user.id)
        .single();

      if (error) {
        console.error('Gagal mengambil data profil:', error);
      } else {
        setProfile({
          ...data,
          sppg: Array.isArray(data.sppg)
            ? data.sppg[0] || null
            : (data.sppg ?? null),
        });
      }
    };

    fetchProfile();
  }, [user]);

  if (!profile) return <ScreenLoader />;

  return (
    <Fragment>
      <UserHero
        name={profile.nama_lengkap || 'Tanpa Nama'}
        image={profile.avatar_url || '/default-avatar.png'}
        info={[
          {
            label: profile.sppg?.alamat || 'Alamat belum diatur',
            icon: MapPin,
          },
          { label: profile.sppg?.nama || 'Jabatan belum diisi', icon: Disc },
          // {
          //   label: profile.sppg?.wilayah || 'Wilayah belum diatur',
          //   icon: ScanEye,
          // },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-7.5 p-5">
        <div className="col-span-2 lg:col-span-3">
          <Stats scans={scans} />
          <div className="flex flex-col gap-5 lg:gap-7.5 mt-5">
            <EarningsChart />
            <Menu />
          </div>
        </div>

        <div className="col-span-1"></div>
      </div>
    </Fragment>
  );
}
