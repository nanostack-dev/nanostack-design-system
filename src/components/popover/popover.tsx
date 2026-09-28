import type { ComponentProps } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';

export type PopoverProps = ComponentProps<typeof Popover>;
export type PopoverContentProps = ComponentProps<typeof PopoverContent>;
export type PopoverDescriptionProps = ComponentProps<typeof PopoverDescription>;
export type PopoverHeaderProps = ComponentProps<typeof PopoverHeader>;
export type PopoverTitleProps = ComponentProps<typeof PopoverTitle>;
export type PopoverTriggerProps = ComponentProps<typeof PopoverTrigger>;

export { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
