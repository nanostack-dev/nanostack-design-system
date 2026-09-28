import type { ComponentProps } from 'react';

import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '@/components/ui/bubble';

export type BubbleProps = ComponentProps<typeof Bubble>;
export type BubbleVariant = NonNullable<BubbleProps['variant']>;
export type BubbleAlign = NonNullable<BubbleProps['align']>;
export type BubbleGroupProps = ComponentProps<typeof BubbleGroup>;
export type BubbleContentProps = ComponentProps<typeof BubbleContent>;
export type BubbleReactionsProps = ComponentProps<typeof BubbleReactions>;

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions };
