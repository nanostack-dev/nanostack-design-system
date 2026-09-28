import { createElement, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

export type TextLinkTone = 'brand' | 'neutral';

export type TextLinkProps = ClosedProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'color'>
> & {
  href: string;
  children: ReactNode;
  tone?: TextLinkTone;
  external?: boolean;
  ref?: Ref<HTMLAnchorElement>;
};

export function TextLink({ tone = 'brand', external = false, ...props }: TextLinkProps) {
  const linkComponent = useLinkComponent();
  const linkProps: LinkComponentProps & { 'data-slot': string } = {
    'data-slot': 'text-link',
    className: cn(
      'rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30',
      tone === 'brand' ? 'text-primary' : 'text-foreground underline',
    ),
    ...(external ? { target: '_blank', rel: 'noreferrer' } : {}),
    ...props,
  };
  return createElement(linkComponent, linkProps);
}
