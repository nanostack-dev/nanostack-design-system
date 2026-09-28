import type { ComponentProps } from 'react';

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from '@/components/ui/message-scroller';

export type MessageScrollerProviderProps = ComponentProps<typeof MessageScrollerProvider>;
export type MessageScrollerProps = ComponentProps<typeof MessageScroller>;
export type MessageScrollerViewportProps = ComponentProps<typeof MessageScrollerViewport>;
export type MessageScrollerContentProps = ComponentProps<typeof MessageScrollerContent>;
export type MessageScrollerItemProps = ComponentProps<typeof MessageScrollerItem>;
export type MessageScrollerButtonProps = ComponentProps<typeof MessageScrollerButton>;

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
};
