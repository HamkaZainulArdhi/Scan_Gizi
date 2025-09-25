import Image from 'next/image';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export default function SomethingWrong() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground  h-[60vh]">
      <div className="relative w-40 h-40">
        <Image
          src="/media/illustrations/4.svg"
          alt="Empty illustration"
          fill
          className="dark:hidden block object-contain opacity-80"
        />
        <Image
          src="/media/illustrations/4-dark.svg"
          alt="Empty illustration"
          fill
          className="dark:block hidden object-contain opacity-80"
        />
      </div>
      <h1 className="text-xl font-medium text-primary ">Oops!</h1>
      <p className="text-sm">Seems Like Something Went Wrong</p>
      <div className="mt-4">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
