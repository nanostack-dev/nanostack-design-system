import type { ComponentProps } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export const labelClasses =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50';

export type LabelProps = ClosedProps<ComponentProps<'label'>>;

export function Label(props: LabelProps) {
  return <label data-slot="label" className={labelClasses} {...props} />;
}
