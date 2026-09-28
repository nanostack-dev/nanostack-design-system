import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { Icon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithRef } from 'react';

import { IconButton, type IconButtonProps } from '@/components/button/button';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done';
export type AttachmentSize = 'xs' | 'sm' | 'md';
export type AttachmentOrientation = 'horizontal' | 'vertical';

const attachmentClasses = cva(
  'group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-3xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/30 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed',
  {
    variants: {
      size: {
        md: 'gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2',
        sm: 'gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5',
        xs: 'gap-1.5 rounded-2xl text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1',
      },
      orientation: {
        horizontal: 'min-w-40 items-center',
        vertical: 'w-24 flex-col has-data-[slot=attachment-content]:w-30',
      },
    },
  },
);

type DivProps = ClosedProps<ComponentPropsWithRef<'div'>>;
type SpanProps = ClosedProps<ComponentPropsWithRef<'span'>>;

export type AttachmentProps = DivProps & {
  state?: AttachmentState;
  size?: AttachmentSize;
  orientation?: AttachmentOrientation;
};
export type AttachmentGroupProps = DivProps;
export type AttachmentMediaProps = ClosedProps<ComponentPropsWithRef<'div'>> & {
  icon?: Icon;
  image?: boolean;
};
export type AttachmentContentProps = DivProps;
export type AttachmentTitleProps = SpanProps;
export type AttachmentDescriptionProps = SpanProps;
export type AttachmentActionsProps = DivProps;
export type AttachmentActionProps = Omit<IconButtonProps, 'variant' | 'tone' | 'size' | 'pressed'>;
export type AttachmentTriggerProps = ClosedProps<useRender.ComponentProps<'button'>>;

export function Attachment({
  state = 'done',
  size = 'md',
  orientation = 'horizontal',
  ...props
}: AttachmentProps) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={attachmentClasses({ size, orientation })}
      {...props}
    />
  );
}

export function AttachmentMedia({
  icon: IconComponent,
  image = false,
  children,
  ...props
}: AttachmentMediaProps) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={image ? 'image' : 'icon'}
      className={cn(
        "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-xl group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
        image &&
          'opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover',
      )}
      {...props}
    >
      {IconComponent ? <IconComponent aria-hidden /> : null}
      {children}
    </div>
  );
}

export function AttachmentContent(props: AttachmentContentProps) {
  return (
    <div
      data-slot="attachment-content"
      className="max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1"
      {...props}
    />
  );
}

export function AttachmentTitle(props: AttachmentTitleProps) {
  return (
    <span
      data-slot="attachment-title"
      className="block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer"
      {...props}
    />
  );
}

export function AttachmentDescription(props: AttachmentDescriptionProps) {
  return (
    <span
      data-slot="attachment-description"
      className="mt-0.5 block max-w-full min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive-on-tint"
      {...props}
    />
  );
}

export function AttachmentActions(props: AttachmentActionsProps) {
  return (
    <div
      data-slot="attachment-actions"
      className="relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1"
      {...props}
    />
  );
}

export function AttachmentAction(props: AttachmentActionProps) {
  return <IconButton data-slot="attachment-action" variant="ghost" size="xs" {...props} />;
}

export function AttachmentTrigger({ render, type, ...props }: AttachmentTriggerProps) {
  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(
      {
        type: render ? type : (type ?? 'button'),
        className: 'absolute inset-0 z-10 outline-none',
      },
      props,
    ),
    render,
    state: { slot: 'attachment-trigger' },
  });
}

export function AttachmentGroup(props: AttachmentGroupProps) {
  return (
    <div
      data-slot="attachment-group"
      className="flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start"
      {...props}
    />
  );
}
