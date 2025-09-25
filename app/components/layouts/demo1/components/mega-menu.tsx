'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MegaMenuSubAccount } from '@/partials/mega-menu/mega-menu-sub-account';
import { MegaMenuSubNetwork } from '@/partials/mega-menu/mega-menu-sub-network';
import { MegaMenuSubProfiles } from '@/partials/mega-menu/mega-menu-sub-profiles';
// import { MENU_MEGA } from '@/config/menu.config';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { MegaMenuSubApps } from '@/app/components/partials/mega-menu/mega-menu-sub-apps';

export function MegaMenu() {
  const pathname = usePathname();
  const { isActive, hasActiveChild } = useMenu(pathname);
  // const homeItem = MENU_MEGA[0];
  // const publicProfilesItem = MENU_MEGA[1];
  // const myAccountItem = MENU_MEGA[2];
  // const networkItem = MENU_MEGA[3];
  // const appsStore = MENU_MEGA[4];

  const linkClass = `
    text-sm text-secondary-foreground font-medium 
    hover:text-primary hover:bg-transparent 
    focus:text-primary focus:bg-transparent 
    data-[active=true]:text-primary data-[active=true]:bg-transparent 
    data-[state=open]:text-primary data-[state=open]:bg-transparent
  `;

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-0">
        {/* Home Item */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild></NavigationMenuLink>
        </NavigationMenuItem>

        {/* Public Profiles Item */}
        <NavigationMenuItem>
          <NavigationMenuContent className="p-0"></NavigationMenuContent>
        </NavigationMenuItem>

        {/* My Account Item */}
        <NavigationMenuItem>
          <NavigationMenuContent className="p-0"></NavigationMenuContent>
        </NavigationMenuItem>

        {/* Network Item */}
        <NavigationMenuItem>
          <NavigationMenuContent className="p-0"></NavigationMenuContent>
        </NavigationMenuItem>

        {/* Apps Item */}
        <NavigationMenuItem>
          <NavigationMenuContent className="p-0"></NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
