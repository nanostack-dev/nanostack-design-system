import { CaretDownIcon } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export type NativeSelectSize = 'sm' | 'md';

export type NativeSelectProps = ClosedProps<Omit<ComponentProps<'select'>, 'size'>> & {
  size?: NativeSelectSize;
};

export function NativeSelect({ size = 'md', ...props }: NativeSelectProps) {
  return (
    <div
      className="group/native-select relative w-fit has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
      data-size={size}
    >
      <select
        data-slot="native-select"
        data-size={size}
        className="h-9 w-full min-w-0 appearance-none rounded-3xl border border-transparent bg-input/50 py-1 pr-8 pl-3 text-sm transition-[color,box-shadow,background-color] outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=sm]:h-8 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        {...props}
      />
      <CaretDownIcon
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

export type NativeSelectOptionProps = ClosedProps<ComponentProps<'option'>>;

export function NativeSelectOption(props: NativeSelectOptionProps) {
  return (
    <option data-slot="native-select-option" className="bg-[Canvas] text-[CanvasText]" {...props} />
  );
}

export type NativeSelectOptGroupProps = ClosedProps<ComponentProps<'optgroup'>>;

export function NativeSelectOptGroup(props: NativeSelectOptGroupProps) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className="bg-[Canvas] text-[CanvasText]"
      {...props}
    />
  );
}
