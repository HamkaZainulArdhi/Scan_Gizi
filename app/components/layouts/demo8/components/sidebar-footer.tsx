'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChatSheet } from '@/partials/topbar/chat-sheet';
import { BotMessageSquare, LogOut, UserRoundCog } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';

export function SidebarFooter() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  return (
    <div className="flex flex-col gap-5 items-center shrink-0 pb-5">
      <div className="flex flex-col gap-1.5">
        <ChatSheet
          trigger={
            <Button
              variant="ghost"
              mode="icon"
              className="hover:bg-background hover:[&_svg]:text-primary"
            >
              <BotMessageSquare className="size-4.5!" />
            </Button>
          }
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Link href="/user-profile">
          <Button
            variant="ghost"
            mode="icon"
            className="hover:bg-background hover:[&_svg]:text-primary"
          >
            <UserRoundCog className="size-4.5!" />
          </Button>
        </Link>
      </div>
      <div className="p-2">
        <Button variant="destructive" size="md" onClick={handleLogout}>
          <LogOut />
        </Button>
      </div>
    </div>
  );
}
