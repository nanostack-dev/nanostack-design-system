import { Progress as ProgressPrimitive } from '@base-ui/react/progress';

import type { ClosedProps } from '@/lib/closed-props';

export type ProgressProps = ClosedProps<Omit<ProgressPrimitive.Root.Props, 'render'>>;
export type ProgressLabelProps = ClosedProps<Omit<ProgressPrimitive.Label.Props, 'render'>>;
export type ProgressValueProps = ClosedProps<Omit<ProgressPrimitive.Value.Props, 'render'>>;

export function Progress({ children, ...props }: ProgressProps) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className="flex w-full flex-wrap gap-3" {...props}>
      {children}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="relative flex h-3 w-full items-center overflow-x-hidden rounded-full bg-muted"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full bg-primary transition-all motion-reduce:transition-none"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
}

export function ProgressLabel(props: ProgressLabelProps) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className="text-sm font-medium"
      {...props}
    />
  );
}

export function ProgressValue(props: ProgressValueProps) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className="ml-auto text-sm text-muted-foreground tabular-nums"
      {...props}
    />
  );
}
