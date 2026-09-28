import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';

import type { ClosedProps } from '@/lib/closed-props';

export type AccordionProps = ClosedProps<Omit<AccordionPrimitive.Root.Props, 'render'>>;
export type AccordionItemProps = ClosedProps<Omit<AccordionPrimitive.Item.Props, 'render'>>;
export type AccordionTriggerProps = ClosedProps<
  Omit<AccordionPrimitive.Trigger.Props, 'render' | 'nativeButton'>
>;
export type AccordionContentProps = ClosedProps<Omit<AccordionPrimitive.Panel.Props, 'render'>>;

export function Accordion(props: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className="flex w-full flex-col overflow-hidden rounded-2xl border"
      {...props}
    />
  );
}

export function AccordionItem(props: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className="not-last:border-b data-open:bg-muted/50"
      {...props}
    />
  );
}

export function AccordionTrigger({ children, ...props }: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className="group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground"
        {...props}
      >
        {children}
        <CaretDownIcon
          aria-hidden
          data-slot="accordion-trigger-icon"
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
        />
        <CaretUpIcon
          aria-hidden
          data-slot="accordion-trigger-icon"
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ children, ...props }: AccordionContentProps) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden px-4 text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className="h-(--accordion-panel-height) pt-0 pb-4 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4">
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}
