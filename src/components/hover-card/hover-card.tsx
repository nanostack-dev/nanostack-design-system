import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';

import { useMotionAttributes, useMotionInput } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';

export type HoverCardSide = NonNullable<PreviewCardPrimitive.Positioner.Props['side']>;
export type HoverCardAlign = NonNullable<PreviewCardPrimitive.Positioner.Props['align']>;

export type HoverCardProps = PreviewCardPrimitive.Root.Props;
export type HoverCardTriggerProps = ClosedProps<PreviewCardPrimitive.Trigger.Props>;
export type HoverCardContentProps = ClosedProps<
  Omit<PreviewCardPrimitive.Popup.Props, 'render'>
> & {
  side?: HoverCardSide;
  align?: HoverCardAlign;
};

function HoverCard({ ...props }: HoverCardProps) {
  useMotionInput();
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: HoverCardTriggerProps) {
  return <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({ side = 'bottom', align = 'center', ...props }: HoverCardContentProps) {
  const motion = useMotionAttributes();
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={4}
        side={side}
        sideOffset={4}
        className="isolate z-50"
      >
        <PreviewCardPrimitive.Popup
          data-slot="hover-card-content"
          className="z-50 w-72 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden dark:ring-foreground/10"
          {...props}
          {...motion}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
