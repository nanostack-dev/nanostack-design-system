'use client';

import { Collapsible } from '@base-ui/react/collapsible';
import { safeProps, type ElementProps } from '../internal/props.js';

export type DisclosureProps = ElementProps<'div'> &
  Pick<Collapsible.Root.Props, 'open' | 'defaultOpen' | 'onOpenChange' | 'disabled'>;

export function Disclosure(props: DisclosureProps) {
  return <Collapsible.Root {...safeProps(props)} className="ns-disclosure" />;
}

export type DisclosureTriggerProps = ElementProps<'button'>;

export function DisclosureTrigger({ children, type = 'button', ...props }: DisclosureTriggerProps) {
  return (
    <Collapsible.Trigger {...safeProps(props)} type={type} className="ns-disclosure-trigger">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="m6 3 5 5-5 5" />
      </svg>
      {children}
    </Collapsible.Trigger>
  );
}

export type DisclosurePanelProps = ElementProps<'div'> & {
  keepMounted?: boolean;
};

export function DisclosurePanel(props: DisclosurePanelProps) {
  return <Collapsible.Panel {...safeProps(props)} className="ns-disclosure-panel" />;
}
