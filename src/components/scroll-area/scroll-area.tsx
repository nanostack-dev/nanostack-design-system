import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

import { useMotionAttributes } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaHeight = 'auto' | 'fill';
export type ScrollAreaMaxHeight = 'none' | 'md';
export type ScrollAreaOverscroll = 'auto' | 'contain';

export type ScrollAreaProps = ClosedProps<Omit<ScrollAreaPrimitive.Root.Props, 'render'>> & {
  orientation?: ScrollAreaOrientation;
  height?: ScrollAreaHeight;
  maxHeight?: ScrollAreaMaxHeight;
  overscroll?: ScrollAreaOverscroll;
};

const heightClass: Record<ScrollAreaHeight, string> = {
  auto: '',
  fill: 'h-full min-h-0 flex-1',
};

const maxHeightClass: Record<ScrollAreaMaxHeight, string> = {
  none: '',
  md: 'max-h-[min(70vh,36rem)]',
};

const overscrollClass: Record<ScrollAreaOverscroll, string> = {
  auto: '',
  contain: 'overscroll-contain',
};

export function ScrollArea({
  orientation = 'vertical',
  height = 'auto',
  maxHeight = 'none',
  overscroll = 'auto',
  children,
  ...props
}: ScrollAreaProps) {
  const motion = useMotionAttributes();
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative min-w-0 rounded-[inherit]', heightClass[height])}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          'peer/viewport size-full outline-none',
          maxHeightClass[maxHeight],
          overscrollClass[overscroll],
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && <ScrollBar orientation="vertical" />}
      {orientation !== 'vertical' && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
      {/* The focus ring is on a layer that does not scroll. A ring outside the viewport is
          cut by a pane that clips, and an inset ring on the viewport is painted under the
          content. The layer is raised only while the ring shows, so a sticky header in the
          content does not cover it and the area makes no stacking context at rest. */}
      <div
        aria-hidden
        data-slot="scroll-area-focus-ring"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-[box-shadow] peer-focus-visible/viewport:z-50 peer-focus-visible/viewport:ring-[3px] peer-focus-visible/viewport:ring-ring/50 peer-focus-visible/viewport:ring-inset"
        {...motion}
      />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({ orientation }: { orientation: 'vertical' | 'horizontal' }) {
  const motion = useMotionAttributes();
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className="flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
      {...motion}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
