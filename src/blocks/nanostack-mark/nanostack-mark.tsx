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

/**
 * PLACEHOLDER. The final Nanostack mark is being drawn; replace MARK_VIEW_BOX and
 * MARK_PATHS with it. Until then this is the mark of
 * marketing/nanostack/public/brand/nanostack-lockup.svg (its first group).
 * Every path fills with currentColor, so the mark follows the text colour.
 */
const MARK_VIEW_BOX = '0 0 32 32';
const MARK_PATHS = [
  'M3.25 12.25a5.5 5.5 0 0 1 5.5-5.5h6a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 1 1.5 1.5v6a5.5 5.5 0 0 1-5.5 5.5h-11a5.5 5.5 0 0 1-5.5-5.5Z',
  'M21.25 3.25h2a5.5 5.5 0 0 1 5.5 5.5v2a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5Z',
];

/** The Nanostack mark, drawn in the current text colour. */
export function NanostackMark({ size = 'md', label }: NanostackMarkProps) {
  return (
    <svg
      data-slot="nanostack-mark"
      viewBox={MARK_VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', sizeClass[size])}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
