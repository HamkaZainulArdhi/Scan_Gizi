'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderClock,
  Handshake,
  LayoutGrid,
  Search,
  TicketCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyMessage from '../empty-massege';

const SEARCH_ITEMS = [
  { icon: LayoutGrid, info: 'Dashboard', type: 'page', path: '/' },
  { icon: Handshake, info: 'Partners', type: 'page', path: '/analisis' },
  { icon: FolderClock, info: 'Order', type: 'page', path: '/history' },
  { icon: TicketCheck, info: 'Referral', type: 'page', path: '/user-setting' },
];

export function SearchDialog({ trigger }: { trigger: ReactNode }) {
  const [searchInput, setSearchInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const filteredItems = SEARCH_ITEMS.filter((item) =>
    item.info.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const renderItems = (items: typeof SEARCH_ITEMS) => (
    <div className="space-y-1">
      {items.map((item, index) => (
        <button
          key={`page-${index}`}
          onClick={() => {
            setIsOpen(false);
            router.push(item.path);
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
        >
          <item.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium">{item.info}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Navigate to {item.info}
            </div>
          </div>
          <Badge variant="success" appearance="outline">
            Page
          </Badge>
        </button>
      ))}
    </div>
  );

  const hasResults = filteredItems.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="lg:max-w-[600px] lg:top-[10%] lg:translate-y-0 p-0">
        <DialogHeader className="px-4 py-3">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search pages
          </DialogDescription>

          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 size-4 left-3 text-muted-foreground" />
            <Input
              type="text"
              value={searchInput}
              className="pl-10 border-0 shadow-none focus-visible:ring-0"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search pages..."
              autoFocus
            />
          </div>
        </DialogHeader>

        <DialogBody className="p-0">
          <ScrollArea className="h-[520px]">
            <div className="px-4 pb-4">
              {!hasResults && searchInput ? (
                <EmptyMessage
                  message={`No results found for "${searchInput}"`}
                />
              ) : (
                hasResults && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
                        Pages
                      </h3>
                      {renderItems(filteredItems)}
                    </div>
                  </div>
                )
              )}
            </div>
          </ScrollArea>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
