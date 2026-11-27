import type { Icon } from '@phosphor-icons/react';
import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { useMaterialAttributes } from '@/lib/material';
import { cn } from '@/lib/utils';

import { cardStyles, type CardSize, type CardVariant } from '@/recipes/card';

export type { CardSize, CardVariant };
export type CardTitleSize = 'sm' | 'md' | 'lg';

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
  const material = useMaterialAttributes();
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cardStyles({ variant, size })}
      {...props}
      {...material}
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
