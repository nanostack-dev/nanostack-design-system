import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { useMotionAttributes, useMotionInput } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';

export type TooltipSide = NonNullable<TooltipPrimitive.Positioner.Props['side']>;
export type TooltipAlign = NonNullable<TooltipPrimitive.Positioner.Props['align']>;

export type TooltipProviderProps = TooltipPrimitive.Provider.Props;
export type TooltipProps = TooltipPrimitive.Root.Props;
export type TooltipTriggerProps = ClosedProps<TooltipPrimitive.Trigger.Props>;
export type TooltipContentProps = ClosedProps<Omit<TooltipPrimitive.Popup.Props, 'render'>> & {
  side?: TooltipSide;
  align?: TooltipAlign;
};

function TooltipProvider({ delay = 0, ...props }: TooltipProviderProps) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip({ ...props }: TooltipProps) {
  useMotionInput();
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipTriggerProps) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  side = 'top',
  align = 'center',
  children,
  ...props
}: TooltipContentProps) {
  const motion = useMotionAttributes();
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={0}
        side={side}
        sideOffset={4}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className="z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-lg"
          {...props}
          {...motion}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:translate-x-[1.5px] data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:translate-x-[-1.5px] data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:translate-x-[-1.5px] data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:translate-x-[1.5px] data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
