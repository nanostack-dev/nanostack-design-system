import type { ComponentProps } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type TooltipProps = ComponentProps<typeof Tooltip>;
export type TooltipTriggerProps = ComponentProps<typeof TooltipTrigger>;
export type TooltipContentProps = ComponentProps<typeof TooltipContent>;
export type TooltipProviderProps = ComponentProps<typeof TooltipProvider>;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
