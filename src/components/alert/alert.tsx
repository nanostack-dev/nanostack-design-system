import type { Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type AlertTone = 'neutral' | 'critical' | 'success' | 'warning' | 'info';

const alertClasses = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      tone: {
        neutral: 'bg-card text-card-foreground',
        critical:
          'border-destructive/30 bg-destructive/5 text-destructive-on-tint *:data-[slot=alert-description]:text-destructive-on-tint',
        success:
          'border-success/30 bg-success/5 text-success-on-tint *:data-[slot=alert-description]:text-success-on-tint',
        warning:
          'border-warning/30 bg-warning/5 text-warning-on-tint *:data-[slot=alert-description]:text-warning-on-tint',
        info: 'border-info/30 bg-info/5 text-info-on-tint *:data-[slot=alert-description]:text-info-on-tint',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

type DivProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export type AlertProps = DivProps & {
  tone?: AlertTone;
  icon?: Icon;
};
export type AlertTitleProps = DivProps;
export type AlertDescriptionProps = DivProps;
export type AlertActionProps = DivProps;

export function Alert({ tone = 'neutral', icon: IconComponent, children, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-tone={tone}
      role="alert"
      className={cn(alertClasses({ tone }))}
      {...props}
    >
      {IconComponent ? <IconComponent aria-hidden /> : null}
      {children}
    </div>
  );
}

export function AlertTitle(props: AlertTitleProps) {
  return (
    <div
      data-slot="alert-title"
      className="font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground"
      {...props}
    />
  );
}

export function AlertDescription(props: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className="text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4"
      {...props}
    />
  );
}

export function AlertAction(props: AlertActionProps) {
  return <div data-slot="alert-action" className="absolute top-2.5 right-3" {...props} />;
}
