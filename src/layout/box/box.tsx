import type { ComponentPropsWithRef, ElementType } from 'react';

export type BoxElement =
  | 'div'
  | 'span'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'main'
  | 'nav'
  | 'ul'
  | 'ol'
  | 'li'
  | 'p'
  | 'figure'
  | 'form'
  | 'fieldset';

export type BoxProps<Element extends BoxElement = 'div'> = {
  as?: Element;
} & ComponentPropsWithRef<Element>;

export function Box<Element extends BoxElement = 'div'>({ as, ...props }: BoxProps<Element>) {
  const Rendered = (as ?? 'div') as ElementType;
  return <Rendered data-slot="box" {...props} />;
}
