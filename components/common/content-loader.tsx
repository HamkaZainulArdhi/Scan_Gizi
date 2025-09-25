import { LoaderCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ContentLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-center grow w-full', className)}
    >
      <div className="flex flex-col items-center gap-2.5">
        <LoaderCircleIcon
          size={70}
          className="animate-spin text-primary opacity-50"
        />
        <span className="text-muted-foreground font-medium text-sm">
          Loading...
        </span>
      </div>
    </div>
  );
}
