import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { createContext, useContext } from 'react';

import { toggleStyles, type ToggleSize, type ToggleVariant } from '@/components/toggle/toggle';
import { useMotionAttributes } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type ToggleGroupVariant = ToggleVariant;
export type ToggleGroupSize = ToggleSize;
export type ToggleGroupOrientation = 'horizontal' | 'vertical';

type ToggleGroupAppearance = {
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
};

const ToggleGroupContext = createContext<ToggleGroupAppearance>({ variant: 'ghost', size: 'md' });

export type ToggleGroupProps = ClosedProps<
  Omit<ToggleGroupPrimitive.Props, 'render' | 'orientation'>
> & {
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  orientation?: ToggleGroupOrientation;
};

export function ToggleGroup({
  variant = 'ghost',
  size = 'md',
  orientation = 'horizontal',
  children,
  ...props
}: ToggleGroupProps) {
  const spacing = variant === 'outline' ? 0 : 2;
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/toggle-group flex w-fit flex-row items-center data-[spacing=2]:gap-2 data-vertical:flex-col data-vertical:items-stretch',
        // Outline is a segmented control: the items sit on one track.
        'data-[variant=outline]:gap-0.5 data-[variant=outline]:rounded-full data-[variant=outline]:bg-segment data-[variant=outline]:p-0.5 data-[variant=outline]:inset-ring data-[variant=outline]:inset-ring-segment-edge data-vertical:data-[variant=outline]:rounded-2xl',
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

export type ToggleGroupItemProps = ClosedProps<Omit<TogglePrimitive.Props, 'render'>>;

export function ToggleGroupItem(props: ToggleGroupItemProps) {
  const motion = useMotionAttributes();
  const { variant, size } = useContext(ToggleGroupContext);
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
      data-spacing={variant === 'outline' ? 0 : 2}
      className={cn(
        toggleStyles({ variant, size }),
        'shrink-0 focus:z-10 focus-visible:z-10',
        // A segment: no edge of its own, muted until pressed, then a raised
        // thumb in strong ink with its icon in the accent.
        'data-[variant=outline]:rounded-full data-[variant=outline]:border-0 data-[variant=outline]:text-muted-foreground data-[variant=outline]:hover:bg-segment-thumb/50 data-[variant=outline]:hover:text-foreground group-data-vertical/toggle-group:data-[variant=outline]:rounded-xl',
        'data-[variant=outline]:aria-pressed:bg-segment-thumb data-[variant=outline]:aria-pressed:text-foreground data-[variant=outline]:aria-pressed:shadow-segment-thumb data-[variant=outline]:aria-pressed:[&_svg]:text-primary',
      )}
      {...props}
      {...motion}
    />
  );
}
