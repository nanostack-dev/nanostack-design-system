import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar';
import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export type AvatarSize = 'sm' | 'md' | 'lg';

export type AvatarProps = ClosedProps<Omit<AvatarPrimitive.Root.Props, 'render'>> & {
  size?: AvatarSize;
};
export type AvatarImageProps = ClosedProps<Omit<AvatarPrimitive.Image.Props, 'render'>>;
export type AvatarFallbackProps = ClosedProps<Omit<AvatarPrimitive.Fallback.Props, 'render'>>;
export type AvatarBadgeProps = ClosedProps<ComponentPropsWithRef<'span'>>;
export type AvatarGroupProps = ClosedProps<ComponentPropsWithRef<'div'>>;
export type AvatarGroupCountProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export function Avatar({ size = 'md', ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className="group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten"
      {...props}
    />
  );
}

export function AvatarImage(props: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className="aspect-square size-full rounded-full object-cover"
      {...props}
    />
  );
}

export function AvatarFallback(props: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className="flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs"
      {...props}
    />
  );
}

export function AvatarBadge(props: AvatarBadgeProps) {
  return (
    <span
      data-slot="avatar-badge"
      className="absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2 group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2 group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden"
      {...props}
    />
  );
}

export function AvatarGroup(props: AvatarGroupProps) {
  return (
    <div
      data-slot="avatar-group"
      className="group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background"
      {...props}
    />
  );
}

export function AvatarGroupCount(props: AvatarGroupCountProps) {
  return (
    <div
      data-slot="avatar-group-count"
      className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3"
      {...props}
    />
  );
}
