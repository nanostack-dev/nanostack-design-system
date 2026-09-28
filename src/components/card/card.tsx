import type { Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type CardVariant = 'solid' | 'outline' | 'soft';
export type CardSize = 'sm' | 'md';
export type CardTitleSize = 'sm' | 'md' | 'lg';

const cardClasses = cva(
  'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-4xl py-(--card-spacing) text-sm text-card-foreground has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl',
  {
    variants: {
      variant: {
        solid: 'bg-card shadow-md ring-1 ring-foreground/5 dark:ring-foreground/10',
        outline: 'border border-border bg-card',
        soft: 'bg-muted/50',
      },
      size: {
        sm: '[--card-spacing:--spacing(4)]',
        md: '[--card-spacing:--spacing(6)]',
      },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
);

type DivProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export type CardProps = DivProps & {
  variant?: CardVariant;
  size?: CardSize;
};
export type CardHeaderProps = DivProps;
export type CardTitleProps = DivProps & { icon?: Icon; size?: CardTitleSize };
export type CardDescriptionProps = DivProps;
export type CardActionProps = DivProps;
export type CardContentProps = DivProps;
export type CardFooterProps = DivProps;

export function Card({ variant = 'solid', size = 'md', ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(cardClasses({ variant, size }))}
      {...props}
    />
  );
}

export function CardHeader(props: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className="group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]"
      {...props}
    />
  );
}

const cardTitleSizeClass: Record<CardTitleSize, string> = {
  sm: 'text-sm [&>svg]:size-4',
  md: 'text-base [&>svg]:size-4',
  lg: 'text-xl [&>svg]:size-5',
};

export function CardTitle({
  icon: IconComponent,
  size = 'md',
  children,
  ...props
}: CardTitleProps) {
  return (
    <div
      data-slot="card-title"
      data-size={size}
      className={cn(
        'flex min-w-0 items-center gap-2 font-heading font-medium [&>svg]:shrink-0 [&>svg]:text-muted-foreground',
        cardTitleSizeClass[size],
      )}
      {...props}
    >
      {IconComponent ? <IconComponent aria-hidden /> : null}
      {children}
    </div>
  );
}

export function CardDescription(props: CardDescriptionProps) {
  return <div data-slot="card-description" className="text-sm text-muted-foreground" {...props} />;
}

export function CardAction(props: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
      {...props}
    />
  );
}

export function CardContent(props: CardContentProps) {
  return <div data-slot="card-content" className="px-(--card-spacing)" {...props} />;
}

export function CardFooter(props: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className="flex items-center gap-2 rounded-b-4xl px-(--card-spacing)"
      {...props}
    />
  );
}
