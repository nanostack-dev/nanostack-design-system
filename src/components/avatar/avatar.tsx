import type { ComponentProps } from 'react';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';

export type AvatarProps = ComponentProps<typeof Avatar>;
export type AvatarSize = NonNullable<AvatarProps['size']>;
export type AvatarImageProps = ComponentProps<typeof AvatarImage>;
export type AvatarFallbackProps = ComponentProps<typeof AvatarFallback>;
export type AvatarBadgeProps = ComponentProps<typeof AvatarBadge>;
export type AvatarGroupProps = ComponentProps<typeof AvatarGroup>;
export type AvatarGroupCountProps = ComponentProps<typeof AvatarGroupCount>;

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
