import { cn } from '@/lib/utils';

export type TextLinkTone = 'brand' | 'neutral';

export function textLinkStyles({ tone = 'brand' }: { tone?: TextLinkTone } = {}) {
  return cn(
    'rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-ring',
    tone === 'brand' ? 'text-primary' : 'text-foreground underline',
  );
}
