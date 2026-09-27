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
  'bgColor',
  'border',
  'cellPadding',
  'cellSpacing',
  'unstyled',
  'render',
  'as',
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
  'data-hovering',
  'data-orientation',
  'data-scrolling',
  'data-side',
  'data-sonner-toast',

  'data-align',
  'data-checked',
  'data-columns',
  'data-disabled',
  'data-gap',
  'data-height',
  'data-highlighted',
  'data-indeterminate',
  'data-justify',
  'data-layout',
  'data-ns-brand',
  'data-ns-density',
  'data-ns-dragging',
  'data-ns-editor-disabled',
  'data-ns-editor-height',
  'data-ns-editor-variant',
  'data-ns-height',
  'data-ns-label',
  'data-ns-marker',
  'data-ns-placement',
  'data-ns-readonly',
  'data-ns-selected',
  'data-ns-sticky',
  'data-ns-visibility',
  'data-ns-theme',
  'data-ns-truncate',
  'data-ns-width',
  'data-open',
  'data-padding',
  'data-panel-open',
  'data-responsive',
  'data-selected',
  'data-shape',
  'data-size',
  'data-tone',
  'data-unchecked',
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
