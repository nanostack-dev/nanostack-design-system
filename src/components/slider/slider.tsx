import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import type { ClosedProps } from '@/lib/closed-props';

export type SliderValue = number | readonly number[];

export type SliderProps = ClosedProps<Omit<SliderPrimitive.Root.Props, 'render'>>;

function toThumbValues(value: SliderValue | undefined) {
  return typeof value === 'number' ? [value] : value;
}

function firstThumbValue(value: SliderValue) {
  return typeof value === 'number' ? value : value[0];
}

function SliderRoot({ defaultValue, value, min = 0, max = 100, ...props }: SliderProps) {
  const thumbValues = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      className="data-horizontal:w-full data-vertical:h-full"
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-input/90 select-none data-horizontal:h-2 data-horizontal:w-full data-vertical:h-full data-vertical:w-2"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-primary select-none data-horizontal:h-full data-vertical:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbValues.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="block h-4 w-6 shrink-0 rounded-full bg-card shadow-md ring-1 ring-foreground/10 dark:bg-foreground transition-[color,box-shadow,background-color] select-none not-dark:bg-clip-padding hover:ring-4 hover:ring-ring/30 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-vertical:h-6 data-vertical:w-4"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export function Slider({
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  ...props
}: SliderProps) {
  if (typeof (value ?? defaultValue) !== 'number') {
    return (
      <SliderRoot
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        {...props}
      />
    );
  }
  return (
    <SliderRoot
      value={toThumbValues(value)}
      defaultValue={toThumbValues(defaultValue)}
      onValueChange={(next, details) => onValueChange?.(firstThumbValue(next), details)}
      onValueCommitted={(next, details) => onValueCommitted?.(firstThumbValue(next), details)}
      {...props}
    />
  );
}
