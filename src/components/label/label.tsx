import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

import { labelStyles, type LabelSize, type LabelTone } from '@/recipes/label';

export { labelStyles };
export type { LabelSize, LabelTone };

export type LabelProps = ClosedProps<ComponentProps<'label'>> & {
  size?: LabelSize;
  tone?: LabelTone;
};

export function Label({ size = 'md', tone = 'default', ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      data-size={size}
      data-tone={tone}
      className={labelStyles({ size, tone })}
      {...props}
    />
  );
}
