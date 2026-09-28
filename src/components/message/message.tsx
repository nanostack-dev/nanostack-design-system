import type { ComponentPropsWithRef } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export type MessageAlign = 'start' | 'end';

type DivProps = ClosedProps<ComponentPropsWithRef<'div'>>;

export type MessageGroupProps = DivProps;
export type MessageProps = DivProps & { align?: MessageAlign };
export type MessageAvatarProps = DivProps;
export type MessageContentProps = DivProps;
export type MessageHeaderProps = DivProps;
export type MessageFooterProps = DivProps;

export function MessageGroup(props: MessageGroupProps) {
  return <div data-slot="message-group" className="flex min-w-0 flex-col gap-2" {...props} />;
}

export function Message({ align = 'start', ...props }: MessageProps) {
  return (
    <div
      data-slot="message"
      data-align={align}
      className="group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse"
      {...props}
    />
  );
}

export function MessageAvatar(props: MessageAvatarProps) {
  return (
    <div
      data-slot="message-avatar"
      className="flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted group-has-data-[slot=message-footer]/message:-translate-y-8"
      {...props}
    />
  );
}

export function MessageContent(props: MessageContentProps) {
  return (
    <div
      data-slot="message-content"
      className="flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end"
      {...props}
    />
  );
}

export function MessageHeader(props: MessageHeaderProps) {
  return (
    <div
      data-slot="message-header"
      className="flex max-w-full min-w-0 items-center px-3.5 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0"
      {...props}
    />
  );
}

export function MessageFooter(props: MessageFooterProps) {
  return (
    <div
      data-slot="message-footer"
      className="flex max-w-full min-w-0 items-center px-3.5 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end"
      {...props}
    />
  );
}
