import type { ComponentProps } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export type CollapsibleProps = ComponentProps<typeof Collapsible>;
export type CollapsibleTriggerProps = ComponentProps<typeof CollapsibleTrigger>;
export type CollapsibleContentProps = ComponentProps<typeof CollapsibleContent>;

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
