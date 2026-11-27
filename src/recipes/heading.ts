import { cn } from '@/lib/utils';

export type HeadingLevel = 1 | 2 | 3 | 4;

const levelClass: Record<HeadingLevel, string> = {
  1: 'text-2xl',
  2: 'text-xl',
  3: 'text-lg',
  4: 'text-base',
};

export function headingStyles({
  level,
  truncate = false,
}: {
  level: HeadingLevel;
  truncate?: boolean;
}) {
  return cn(
    'font-heading font-semibold tracking-tight text-foreground',
    levelClass[level],
    truncate ? 'min-w-0 truncate' : 'text-balance',
  );
}
