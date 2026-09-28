import type { ComponentProps } from 'react';

import { Slider as SliderPrimitive } from '@/components/ui/slider';

export type SliderProps = ComponentProps<typeof SliderPrimitive>;

type SliderValue = number | readonly number[];

function toThumbValues(value: SliderValue | undefined) {
  return typeof value === 'number' ? [value] : value;
}

function firstThumbValue(value: SliderValue) {
  return typeof value === 'number' ? value : value[0];
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
      <SliderPrimitive
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
        {...props}
      />
    );
  }
  return (
    <SliderPrimitive
      value={toThumbValues(value)}
      defaultValue={toThumbValues(defaultValue)}
      onValueChange={(next, details) => onValueChange?.(firstThumbValue(next), details)}
      onValueCommitted={(next, details) => onValueCommitted?.(firstThumbValue(next), details)}
      {...props}
    />
  );
}
