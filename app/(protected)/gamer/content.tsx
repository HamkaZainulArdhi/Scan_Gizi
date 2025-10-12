'use client';

import { Fragment } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Disc, MapPin } from 'lucide-react';
import { useHistoryScans } from '@/hooks/use-history-scan';
import { useProfile } from '@/providers/profile-provider';
import { ContentLoader } from '@/components/common/content-loader';
import { EarningsChart } from '@/app/(protected)/components/demo1';
import { UserHero } from '@/app/components/partials/common/user-hero';
import Stats from '../history/components/stats';
import { Menu } from './components';

interface HistoryTableProps {
  user: SupabaseUser;
}

export function ProfileContent({ user }: HistoryTableProps) {
  const { profile } = useProfile();
  const { scans } = useHistoryScans(user);

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <ContentLoader />
      </div>
    );

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
          {
            label: profile.sppg?.kecamatan || 'Kecamatan belum diisi',
            icon: MapPin,
          },
          {
            label: profile.sppg?.nama || 'Jabatan belum diisi',
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
