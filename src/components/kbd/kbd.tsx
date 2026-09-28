import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export type KbdProps = ClosedProps<ComponentPropsWithRef<'kbd'>>;
export type KbdGroupProps = ClosedProps<ComponentPropsWithRef<'kbd'>>;

export function Kbd(props: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className="pointer-events-none inline-flex h-5.5 w-fit min-w-5.5 items-center justify-center gap-1 rounded-lg bg-muted px-1.5 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=input-group]:bg-input in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3"
      {...props}
    />
  );
}

export function KbdGroup(props: KbdGroupProps) {
  return <kbd data-slot="kbd-group" className="inline-flex items-center gap-1" {...props} />;
}
