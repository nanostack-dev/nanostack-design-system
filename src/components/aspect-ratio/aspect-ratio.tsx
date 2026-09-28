import type { ComponentPropsWithRef, CSSProperties } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export type AspectRatioProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  ratio: number;
};

export function AspectRatio({ ratio, ...props }: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ '--ratio': ratio } as CSSProperties}
      className="relative aspect-(--ratio) w-full overflow-hidden"
      {...props}
    />
  );
}
