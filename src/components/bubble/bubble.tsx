import { cva } from 'class-variance-authority';
import { createContext, useContext, type ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type BubbleVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type BubbleTone = 'neutral' | 'brand' | 'critical';
export type BubbleAlign = 'start' | 'end';
export type BubbleReactionsSide = 'top' | 'bottom';

type BubbleAppearance = { variant: BubbleVariant; tone: BubbleTone };

const BubbleContext = createContext<BubbleAppearance>({ variant: 'soft', tone: 'neutral' });

const bubbleContentClasses = cva(
  'w-fit max-w-full min-w-0 overflow-hidden rounded-3xl border border-transparent px-3.5 py-2.5 text-sm leading-relaxed wrap-break-word group-data-[align=end]/bubble:self-end',
  {
    variants: {
      variant: {
        solid: '',
        soft: '',
        outline: 'bg-background',
        ghost: 'rounded-none bg-transparent p-0',
      },
      tone: { neutral: '', brand: '', critical: '' },
      interactive: {
        true: 'text-left transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'neutral', class: 'bg-foreground text-background' },
      { variant: 'solid', tone: 'brand', class: 'bg-primary text-primary-foreground' },
      {
        variant: 'solid',
        tone: 'critical',
        class: 'bg-destructive text-destructive-foreground',
      },
      { variant: 'soft', tone: 'neutral', class: 'bg-secondary text-secondary-foreground' },
      {
        variant: 'soft',
        tone: 'brand',
        class: 'bg-primary/10 text-foreground dark:bg-primary/20',
      },
      {
        variant: 'soft',
        tone: 'critical',
        class: 'bg-destructive/10 text-destructive-on-tint dark:bg-destructive/20',
      },
      { variant: 'outline', tone: 'neutral', class: 'border-border text-foreground' },
      { variant: 'outline', tone: 'brand', class: 'border-primary/40 text-foreground' },
      {
        variant: 'outline',
        tone: 'critical',
        class: 'border-destructive/40 text-destructive-on-tint',
      },
      { variant: 'ghost', tone: 'neutral', class: 'text-foreground' },
      { variant: 'ghost', tone: 'brand', class: 'text-primary' },
      { variant: 'ghost', tone: 'critical', class: 'text-destructive-on-tint' },
      { interactive: true, variant: 'solid', tone: 'neutral', class: 'hover:bg-foreground/85' },
      { interactive: true, variant: 'solid', tone: 'brand', class: 'hover:bg-primary/85' },
      {
        interactive: true,
        variant: 'solid',
        tone: 'critical',
        class: 'hover:bg-destructive/85',
      },
      { interactive: true, variant: 'soft', tone: 'neutral', class: 'hover:bg-secondary/70' },
      {
        interactive: true,
        variant: 'soft',
        tone: 'brand',
        class: 'hover:bg-primary/15 dark:hover:bg-primary/25',
      },
      {
        interactive: true,
        variant: 'soft',
        tone: 'critical',
        class: 'hover:bg-destructive/20 dark:hover:bg-destructive/30',
      },
      {
        interactive: true,
        variant: ['outline', 'ghost'],
        class: 'hover:bg-muted dark:hover:bg-muted/50',
      },
    ],
    defaultVariants: { variant: 'soft', tone: 'neutral', interactive: false },
  },
);

const bubbleReactionsClasses = cva(
  'absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0',
  {
    variants: {
      side: { top: 'top-0 -translate-y-3/4', bottom: 'bottom-0 translate-y-3/4' },
      align: { start: 'left-3', end: 'right-3' },
    },
    defaultVariants: { side: 'bottom', align: 'end' },
  },
);

type DivProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export type BubbleGroupProps = DivProps;
export type BubbleProps = DivProps & {
  variant?: BubbleVariant;
  tone?: BubbleTone;
  align?: BubbleAlign;
};
export type BubbleContentProps = DivProps;
export type BubbleButtonProps = ClosedProps<Omit<ComponentPropsWithRef<'button'>, 'type'>>;
export type BubbleReactionsProps = DivProps & {
  side?: BubbleReactionsSide;
  align?: BubbleAlign;
};

export function BubbleGroup(props: BubbleGroupProps) {
  return <div data-slot="bubble-group" className="flex min-w-0 flex-col gap-2" {...props} />;
}

export function Bubble({
  variant = 'soft',
  tone = 'neutral',
  align = 'start',
  ...props
}: BubbleProps) {
  return (
    <BubbleContext.Provider value={{ variant, tone }}>
      <div
        data-slot="bubble"
        data-variant={variant}
        data-tone={tone}
        data-align={align}
        className={cn(
          'group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end',
          variant === 'ghost' && 'max-w-full',
        )}
        {...props}
      />
    </BubbleContext.Provider>
  );
}

export function BubbleContent(props: BubbleContentProps) {
  const appearance = useContext(BubbleContext);
  return (
    <div
      data-slot="bubble-content"
      className={cn(bubbleContentClasses({ ...appearance, interactive: false }))}
      {...props}
    />
  );
}

export function BubbleButton(props: BubbleButtonProps) {
  const appearance = useContext(BubbleContext);
  return (
    <button
      type="button"
      data-slot="bubble-content"
      className={cn(bubbleContentClasses({ ...appearance, interactive: true }))}
      {...props}
    />
  );
}

export function BubbleReactions({
  side = 'bottom',
  align = 'end',
  ...props
}: BubbleReactionsProps) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={bubbleReactionsClasses({ side, align })}
      {...props}
    />
  );
}
