'use client';

import { Fragment } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Disc, MapPin, MapPinHouse } from 'lucide-react';
import { useHistoryScans } from '@/hooks/use-history-scan';
import { useProfile } from '@/providers/profile-provider';
import { EarningsChart } from '@/app/(protected)/components/demo1';
import { UserHero } from '@/app/components/partials/common/user-hero';
import Stats from '../history/components/stats';
import { Menu } from './components/menu';

interface HistoryTableProps {
  user: SupabaseUser;
}

export function ProfileContent({ user }: HistoryTableProps) {
  const { profile } = useProfile();
  const { scans } = useHistoryScans(user);

  const safeProfile = profile || {
    nama_lengkap: 'Pengguna',
    avatar_url: '/media/benner/add-foto.png',
    sppg: {
      alamat: 'Alamat belum diatur',
      kecamatan: 'Kecamatan belum diisi',
      nama: 'Nama SPPG belum diisi',
    },
  };

  return (
    <Fragment>
      <UserHero
        name={safeProfile.nama_lengkap || 'Pengguna'}
        image={safeProfile.avatar_url || '/media/benner/add-foto.png'}
        info={[
          {
            label: safeProfile.sppg?.alamat || 'Alamat belum diatur',
            icon: MapPin,
          },
          {
            label: safeProfile.sppg?.kecamatan || 'Kecamatan belum diisi',
            icon: MapPinHouse,
          },
          {
            label: safeProfile.sppg?.nama || 'Nama SPPG belum diisi',

            icon: Disc,
          },
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
