import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';

import type { ClosedProps } from '@/lib/closed-props';

export type CollapsibleProps = ClosedProps<Omit<CollapsiblePrimitive.Root.Props, 'render'>>;
export type CollapsibleTriggerProps = ClosedProps<CollapsiblePrimitive.Trigger.Props>;
export type CollapsibleContentProps = ClosedProps<Omit<CollapsiblePrimitive.Panel.Props, 'render'>>;

export function Collapsible(props: CollapsibleProps) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

export function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
}

export function CollapsibleContent(props: CollapsibleContentProps) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className="h-(--collapsible-panel-height) overflow-hidden [transition:height_200ms_var(--ease-in-out),opacity_160ms_var(--ease-out)] data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 motion-reduce:duration-120"
      {...props}
    />
  );
}
