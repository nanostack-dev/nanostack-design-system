import { ArrowDownIcon } from '@phosphor-icons/react';
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from '@shadcn/react/message-scroller';
import type { ComponentProps } from 'react';

import { buttonStyles } from '@/components/button/button';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type MessageScrollerProviderProps = ComponentProps<typeof MessageScrollerPrimitive.Provider>;
export type MessageScrollerProps = ClosedProps<
  ComponentProps<typeof MessageScrollerPrimitive.Root>
>;
export type MessageScrollerViewportProps = ClosedProps<
  ComponentProps<typeof MessageScrollerPrimitive.Viewport>
>;
export type MessageScrollerContentProps = ClosedProps<
  Omit<ComponentProps<typeof MessageScrollerPrimitive.Content>, 'spacerClassName'>
>;
export type MessageScrollerItemProps = ClosedProps<
  ComponentProps<typeof MessageScrollerPrimitive.Item>
>;
export type MessageScrollerButtonDirection = 'start' | 'end';
export type MessageScrollerButtonProps = ClosedProps<
  Omit<ComponentProps<typeof MessageScrollerPrimitive.Button>, 'render' | 'direction'>
> & {
  direction?: MessageScrollerButtonDirection;
};

export { useMessageScroller, useMessageScrollerScrollable, useMessageScrollerVisibility };

export function MessageScrollerProvider(props: MessageScrollerProviderProps) {
  return <MessageScrollerPrimitive.Provider {...props} />;
}

export function MessageScroller(props: MessageScrollerProps) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className="group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden"
      {...props}
    />
  );
}

export function MessageScrollerViewport(props: MessageScrollerViewportProps) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className="size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin scrollbar-gutter-stable overflow-y-auto overscroll-contain contain-content data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent data-pending-scroll:invisible"
      {...props}
    />
  );
}

export function MessageScrollerContent(props: MessageScrollerContentProps) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className="flex h-max min-h-full flex-col gap-8 p-4"
      {...props}
    />
  );
}

export function MessageScrollerItem({ scrollAnchor = false, ...props }: MessageScrollerItemProps) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className="min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]"
      {...props}
    />
  );
}

export function MessageScrollerButton({
  direction = 'end',
  children,
  ...props
}: MessageScrollerButtonProps) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      direction={direction}
      className={cn(
        buttonStyles({ variant: 'outline', size: 'sm', iconOnly: true }),
        'absolute inset-s-1/2 -translate-x-1/2 bg-background dark:bg-background transition-[translate,scale,opacity] duration-200 data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-4 data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-4 data-[direction=start]:data-[active=false]:-translate-y-full rtl:translate-x-1/2 data-[direction=start]:[&_svg]:rotate-180',
      )}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon aria-hidden />
          <span className="sr-only">
            {direction === 'end' ? 'Scroll to end' : 'Scroll to start'}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  );
}
