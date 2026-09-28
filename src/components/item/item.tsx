import type { ComponentProps } from 'react';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';

export type ItemProps = ComponentProps<typeof Item>;
export type ItemVariant = NonNullable<ItemProps['variant']>;
export type ItemSize = NonNullable<ItemProps['size']>;
export type ItemGroupProps = ComponentProps<typeof ItemGroup>;
export type ItemSeparatorProps = ComponentProps<typeof ItemSeparator>;
export type ItemMediaProps = ComponentProps<typeof ItemMedia>;
export type ItemContentProps = ComponentProps<typeof ItemContent>;
export type ItemTitleProps = ComponentProps<typeof ItemTitle>;
export type ItemDescriptionProps = ComponentProps<typeof ItemDescription>;
export type ItemActionsProps = ComponentProps<typeof ItemActions>;
export type ItemHeaderProps = ComponentProps<typeof ItemHeader>;
export type ItemFooterProps = ComponentProps<typeof ItemFooter>;

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
