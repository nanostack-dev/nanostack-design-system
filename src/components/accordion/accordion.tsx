import type { ComponentProps } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export type AccordionProps = ComponentProps<typeof Accordion>;
export type AccordionItemProps = ComponentProps<typeof AccordionItem>;
export type AccordionTriggerProps = ComponentProps<typeof AccordionTrigger>;
export type AccordionContentProps = ComponentProps<typeof AccordionContent>;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
