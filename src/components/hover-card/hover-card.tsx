import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';

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
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: HoverCardTriggerProps) {
  return <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({ side = 'bottom', align = 'center', ...props }: HoverCardContentProps) {
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
          className="z-50 w-72 origin-(--transform-origin) rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
