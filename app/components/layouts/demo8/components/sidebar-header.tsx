'use client';

import Image from 'next/image';
import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';

export function SidebarHeader() {
  return (
    <div className="hidden lg:flex items-center justify-center shrink-0 pt-8 pb-3.5">
      <Link href="/">
        <Image
          src={toAbsoluteUrl('/media/logo/logo.png')}
          width={50}
          height={50}
          priority
          className="min-h-[20px]"
          alt="anjayyyy"
        />
      </Link>
    </div>
  );
}
