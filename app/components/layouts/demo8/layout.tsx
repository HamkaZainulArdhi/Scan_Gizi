'use client';

import { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { Moon, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useBodyClass } from '@/hooks/use-body-class';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProfile } from '@/providers/profile-provider';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';
import { Toolbar, ToolbarActions, ToolbarHeading } from './components/toolbar';

export function Demo8Layout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const { setOption } = useSettings();
  const { theme, setTheme } = useTheme();
  const { profile } = useProfile();

  useBodyClass(`
    [--header-height:60px]
    [--sidebar-width:90px]
    bg-muted!
  `);

  useEffect(() => {
    setOption('layout', 'demo8');
  }, [setOption]);

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <>
      <div className="flex grow">
        {isMobile && <Header />}

        <div className="flex flex-col lg:flex-row grow pt-(--header-height) lg:pt-0">
          {!isMobile && <Sidebar />}

          <div className="flex flex-col grow rounded-xl bg-background border border-input lg:ms-(--sidebar-width) mt-0 m-4 lg:m-5">
            <div className="flex flex-col grow kt-scrollable-y-auto lg:[scrollbar-width:auto] pt-5">
              <main className="grow" role="content">
                <Toolbar>
                  <ToolbarHeading />
                  <ToolbarActions>
                    <SearchDialog
                      trigger={
                        <Button
                          variant="ghost"
                          mode="icon"
                          className="hover:[&_svg]:text-primary"
                        >
                          <Search className="size-4.5!" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleThemeToggle(theme !== 'dark')}
                      className="rounded-full"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <Sun className="size-4.5!" />
                      ) : (
                        <Moon className="size-4.5!" />
                      )}
                    </Button>

                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <Link
                            href="/user-profile"
                            className="text-sm text-mono hover:text-primary font-semibold"
                          >
                            <img
                              src={
                                profile?.avatar_url &&
                                profile?.avatar_url !== 'null' &&
                                profile?.avatar_url.trim() !== ''
                                  ? profile.avatar_url
                                  : toAbsoluteUrl('/media/add-poto.png')
                              }
                              alt="User Avatar"
                              className="h-10 w-10 rounded-full border-2 border-mono/30 shrink-0 cursor-pointer"
                            />
                            {/* halo {user?.user_metadata.full_name} */}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ToolbarActions>
                </Toolbar>

                {children}
              </main>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
