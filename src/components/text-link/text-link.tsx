import { createElement, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { useLinkComponent, type LinkComponentProps } from '@/provider/design-system-provider';

import { textLinkStyles, type TextLinkTone } from '@/recipes/text-link';

export type { TextLinkTone };

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
    className: textLinkStyles({ tone }),
    ...(external ? { target: '_blank', rel: 'noreferrer' } : {}),
    ...props,
  };
  return createElement(linkComponent, linkProps);
}
