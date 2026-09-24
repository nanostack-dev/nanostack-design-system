import type { ComponentPropsWithRef, ElementType } from 'react';

/** Styling and element ownership stay inside the library, including spread props. */
const presentationProps = [
  'class',
  'className',
  'classNames',
  'style',
  'styles',
  'css',
  'sx',
  'tw',
  'color',
  'unstyled',
  'render',
  'asChild',
  'component',
  'components',
  'componentsProps',
  'slots',
  'slotProps',
  'dangerouslySetInnerHTML',
] as const;

/** These attributes are CSS implementation details, never a second variant API. */
const ownedAttributes = [
  'data-active',
  'data-align',
  'data-columns',
  'data-disabled',
  'data-gap',
  'data-justify',
  'data-layout',
  'data-ns-brand',
  'data-ns-density',
  'data-ns-theme',
  'data-padding',
  'data-responsive',
  'data-shape',
  'data-size',
  'data-tone',
  'data-variant',
  'data-weight',
] as const;

export type NoCustomStyle = {
  [Key in (typeof presentationProps)[number] | (typeof ownedAttributes)[number]]?: never;
};

export type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithRef<T>,
  keyof NoCustomStyle
> &
  NoCustomStyle;

const forbiddenProps = new Set<string>(
  [...presentationProps, ...ownedAttributes].map((key) => key.toLowerCase()),
);

/** Strip bypasses from untyped JS/spread props as well as checking TypeScript. */
export function safeProps<T extends object>(props: T): Omit<T, keyof NoCustomStyle> {
  const result = { ...props };
  for (const key of Object.keys(result)) {
    const normalized = key.toLowerCase();
    if (forbiddenProps.has(normalized) || normalized.startsWith('data-ns-')) {
      delete (result as Record<string, unknown>)[key];
    }
  }
  return result;
}
