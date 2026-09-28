import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area';

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
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('relative min-w-0', heightClass[height])}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          'size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1',
          maxHeightClass[maxHeight],
          overscrollClass[overscroll],
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && <ScrollBar orientation="vertical" />}
      {orientation !== 'vertical' && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({ orientation }: { orientation: 'vertical' | 'horizontal' }) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className="flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}
