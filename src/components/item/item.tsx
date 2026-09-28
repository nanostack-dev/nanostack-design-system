import type { Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import {
  createElement,
  type AnchorHTMLAttributes,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
} from 'react';

import { Separator } from '@/components/separator/separator';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

export type ItemVariant = 'ghost' | 'outline' | 'soft';
export type ItemSize = 'xs' | 'sm' | 'md';

const itemClasses = cva(
  'group/item flex w-full flex-wrap items-center rounded-2xl border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        ghost: 'border-transparent',
        outline: 'border-border',
        soft: 'border-transparent bg-muted/50',
      },
      size: {
        md: 'gap-3.5 px-4 py-3.5',
        sm: 'gap-3.5 px-3.5 py-3',
        xs: 'gap-2.5 px-3 py-2.5 in-data-[slot=dropdown-menu-content]:p-0',
      },
      link: { true: 'hover:bg-muted', false: '' },
    },
    defaultVariants: { variant: 'ghost', size: 'md', link: false },
  },
);

type ItemAppearance = { variant?: ItemVariant; size?: ItemSize };
type DivProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export type ItemProps = DivProps & ItemAppearance;
export type ItemLinkProps = ClosedProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'color'>
> &
  ItemAppearance & {
    href: string;
    children: ReactNode;
    ref?: Ref<HTMLAnchorElement>;
  };
export type ItemGroupProps = DivProps;
export type ItemSeparatorProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type ItemMediaProps = DivProps & { icon?: Icon; image?: boolean };
export type ItemContentProps = DivProps;
export type ItemTitleProps = DivProps;
export type ItemDescriptionProps = ClosedProps<ComponentPropsWithRef<'p'>>;
export type ItemActionsProps = DivProps;
export type ItemHeaderProps = DivProps;
export type ItemFooterProps = DivProps;

export function Item({ variant = 'ghost', size = 'md', ...props }: ItemProps) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemClasses({ variant, size }))}
      {...props}
    />
  );
}

export function ItemLink({ variant = 'ghost', size = 'md', ...props }: ItemLinkProps) {
  const linkComponent = useLinkComponent();
  const linkProps: LinkComponentProps & Record<`data-${string}`, string> = {
    'data-slot': 'item',
    'data-variant': variant,
    'data-size': size,
    className: cn(itemClasses({ variant, size, link: true })),
    ...props,
  };
  return createElement(linkComponent, linkProps);
}

export function ItemGroup(props: ItemGroupProps) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className="group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2"
      {...props}
    />
  );
}

export function ItemSeparator(props: ItemSeparatorProps) {
  return (
    <div className="py-2">
      <Separator data-slot="item-separator" orientation="horizontal" {...props} />
    </div>
  );
}

export function ItemMedia({
  icon: IconComponent,
  image = false,
  children,
  ...props
}: ItemMediaProps) {
  const variant = IconComponent ? 'icon' : image ? 'image' : 'default';
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        'flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none',
        variant === 'icon' && '[&_svg]:size-4',
        variant === 'image' &&
          'size-10 overflow-hidden rounded-xl group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 group-data-[size=xs]/item:rounded-lg [&_img]:size-full [&_img]:object-cover',
      )}
      {...props}
    >
      {IconComponent ? <IconComponent aria-hidden /> : children}
    </div>
  );
}

export function ItemContent(props: ItemContentProps) {
  return (
    <div
      data-slot="item-content"
      className="flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0.5 [&+[data-slot=item-content]]:flex-none"
      {...props}
    />
  );
}

export function ItemTitle(props: ItemTitleProps) {
  return (
    <div
      data-slot="item-title"
      className="line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4"
      {...props}
    />
  );
}

export function ItemDescription(props: ItemDescriptionProps) {
  return (
    <p
      data-slot="item-description"
      className="line-clamp-2 text-left text-sm font-normal text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary"
      {...props}
    />
  );
}

export function ItemActions(props: ItemActionsProps) {
  return <div data-slot="item-actions" className="flex items-center gap-2" {...props} />;
}

export function ItemHeader(props: ItemHeaderProps) {
  return (
    <div
      data-slot="item-header"
      className="flex basis-full items-center justify-between gap-2"
      {...props}
    />
  );
}

export function ItemFooter(props: ItemFooterProps) {
  return (
    <div
      data-slot="item-footer"
      className="flex basis-full items-center justify-between gap-2"
      {...props}
    />
  );
}
