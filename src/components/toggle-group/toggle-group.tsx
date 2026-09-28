import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { createContext, useContext } from 'react';

import { toggleStyles, type ToggleSize, type ToggleVariant } from '@/components/toggle/toggle';
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
      className="group/toggle-group flex w-fit flex-row items-center data-[spacing=0]:data-[variant=outline]:rounded-3xl data-[spacing=2]:gap-2 data-vertical:flex-col data-vertical:items-stretch"
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
  const { variant, size } = useContext(ToggleGroupContext);
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={variant}
      data-size={size}
      data-spacing={variant === 'outline' ? 0 : 2}
      className={cn(
        'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-3 group-data-[spacing=0]/toggle-group:shadow-none focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-2.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-2.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-3xl group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-3xl group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-3xl group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-3xl data-[state=on]:bg-muted group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
        toggleStyles({ variant, size }),
      )}
      {...props}
    />
  );
}
