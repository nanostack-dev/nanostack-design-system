import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type SeparatorLength = 'full' | 'short';

type SeparatorBaseProps = ClosedProps<Omit<SeparatorPrimitive.Props, 'render' | 'orientation'>>;

export type SeparatorProps = SeparatorBaseProps &
  (
    | { orientation?: 'horizontal'; length?: never }
    | { orientation: 'vertical'; length?: SeparatorLength }
  );

export function Separator({
  orientation = 'horizontal',
  length = 'full',
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-length={orientation === 'vertical' ? length : undefined}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px',
        orientation === 'vertical' && length === 'short'
          ? 'h-4 self-center'
          : 'data-vertical:self-stretch',
      )}
      {...props}
    />
  );
}
