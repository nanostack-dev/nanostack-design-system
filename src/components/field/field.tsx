import { cva } from 'class-variance-authority';
import { useMemo, type ComponentProps, type ReactNode } from 'react';

import { labelClasses } from '@/components/label/label';
import { Separator } from '@/components/ui/separator';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';
export type FieldLegendSize = 'sm' | 'md';

export type FieldSetProps = ClosedProps<ComponentProps<'fieldset'>>;

export function FieldSet(props: FieldSetProps) {
  return (
    <fieldset
      data-slot="field-set"
      className="flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3"
      {...props}
    />
  );
}

export type FieldLegendProps = ClosedProps<ComponentProps<'legend'>> & {
  size?: FieldLegendSize;
};

export function FieldLegend({ size = 'md', ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={size === 'md' ? 'legend' : 'label'}
      className={cn('mb-3 font-medium', size === 'md' ? 'text-base' : 'text-sm')}
      {...props}
    />
  );
}

export type FieldGroupProps = ClosedProps<ComponentProps<'div'>>;

export function FieldGroup(props: FieldGroupProps) {
  return (
    <div
      data-slot="field-group"
      className="group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4"
      {...props}
    />
  );
}

const fieldClasses = cva('group/field flex w-full gap-3 data-[invalid=true]:text-destructive', {
  variants: {
    orientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export type FieldProps = ClosedProps<ComponentProps<'div'>> & {
  orientation?: FieldOrientation;
  invalid?: boolean;
  disabled?: boolean;
};

export function Field({ orientation = 'vertical', invalid, disabled, ...props }: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(fieldClasses({ orientation }))}
      {...props}
    />
  );
}

export type FieldContentProps = ClosedProps<ComponentProps<'div'>>;

export function FieldContent(props: FieldContentProps) {
  return (
    <div
      data-slot="field-content"
      className="group/field-content flex flex-1 flex-col gap-1 leading-snug"
      {...props}
    />
  );
}

export type FieldLabelProps = ClosedProps<ComponentProps<'label'>>;

export function FieldLabel(props: FieldLabelProps) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        labelClasses,
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:bg-input/30 has-[>[data-slot=field]]:rounded-2xl has-[>[data-slot=field]]:border has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-input/40 has-[>[data-slot=field]]:has-[:focus-visible]:border-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-3 has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring/50 *:data-[slot=field]:p-4',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        'group-has-[>[role=checkbox]]/field:font-normal group-has-[>[role=radio]]/field:font-normal',
      )}
      {...props}
    />
  );
}

export type FieldTitleProps = ClosedProps<ComponentProps<'div'>>;

export function FieldTitle(props: FieldTitleProps) {
  return (
    <div
      data-slot="field-label"
      className="flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50"
      {...props}
    />
  );
}

export type FieldDescriptionProps = ClosedProps<ComponentProps<'p'>>;

export function FieldDescription(props: FieldDescriptionProps) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
      )}
      {...props}
    />
  );
}

export type FieldSeparatorProps = ClosedProps<ComponentProps<'div'>> & {
  children?: ReactNode;
};

export function FieldSeparator({ children, ...props }: FieldSeparatorProps) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className="relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

export type FieldErrorProps = ClosedProps<ComponentProps<'div'>> & {
  errors?: Array<{ message?: string } | undefined>;
};

export function FieldError({ children, errors, ...props }: FieldErrorProps) {
  const content = useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];
    if (uniqueErrors.length === 1) return uniqueErrors[0]?.message;

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      className="text-sm font-normal text-destructive"
      {...props}
    >
      {content}
    </div>
  );
}
