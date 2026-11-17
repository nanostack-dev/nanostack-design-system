import { cn } from '@/lib/utils';

export type NanostackMarkSize = 'sm' | 'md' | 'lg';

export interface NanostackMarkProps {
  size?: NanostackMarkSize;
  /** Names the mark for assistive technology. Omit it when text next to the mark names it. */
  label?: string;
}

const sizeClass: Record<NanostackMarkSize, string> = {
  sm: 'size-5',
  md: 'size-6',
  lg: 'size-8',
};

// The brand accent is part of the logo, not a theme colour: it stays the same in
// light and dark. Source: marketing/nanostack/public/brand/nanostack-mark.svg.
const BRAND_ACCENT = '#3a5cf5';

/**
 * The Nanostack mark. Its body takes the current text colour, so it reads on
 * light and dark surfaces; its corner keeps the brand blue.
 */
export function NanostackMark({ size = 'md', label }: NanostackMarkProps) {
  return (
    <svg
      data-slot="nanostack-mark"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', sizeClass[size])}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path
        d="M3.25 12.25a5.5 5.5 0 0 1 5.5-5.5h6a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 1 1.5 1.5v6a5.5 5.5 0 0 1-5.5 5.5h-11a5.5 5.5 0 0 1-5.5-5.5Z"
        fill="currentColor"
      />
      <path
        d="M21.25 3.25h2a5.5 5.5 0 0 1 5.5 5.5v2a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5Z"
        fill={BRAND_ACCENT}
      />
    </svg>
  );
}
