import type { ComponentProps } from 'react';

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export type HoverCardProps = ComponentProps<typeof HoverCard>;
export type HoverCardContentProps = ComponentProps<typeof HoverCardContent>;
export type HoverCardTriggerProps = ComponentProps<typeof HoverCardTrigger>;

export { HoverCard, HoverCardContent, HoverCardTrigger };
