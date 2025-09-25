import Image from 'next/image';

interface EmptyMessageProps {
  message?: string;
  description?: string;
}

export default function EmptyMessage({
  message,
  description,
}: EmptyMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground  h-[60vh]">
      <div className="relative w-40 h-40">
        <Image
          src="/media/illustrations/3.svg"
          alt="Empty illustration"
          fill
          className=" block dark:hidden object-contain opacity-80"
        />
        <Image
          src="/media/illustrations/3-dark.svg"
          alt="Empty illustration"
          fill
          className=" hidden dark:block object-contain opacity-80"
        />
      </div>
      <h1 className="text-base font-medium text-primary">{message}</h1>
      <p className="text-sm">{description}</p>
    </div>
  );
}
