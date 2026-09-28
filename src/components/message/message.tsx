import type { ComponentProps } from 'react';

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from '@/components/ui/message';

export type MessageProps = ComponentProps<typeof Message>;
export type MessageAlign = NonNullable<MessageProps['align']>;
export type MessageGroupProps = ComponentProps<typeof MessageGroup>;
export type MessageAvatarProps = ComponentProps<typeof MessageAvatar>;
export type MessageContentProps = ComponentProps<typeof MessageContent>;
export type MessageHeaderProps = ComponentProps<typeof MessageHeader>;
export type MessageFooterProps = ComponentProps<typeof MessageFooter>;

export { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader };
