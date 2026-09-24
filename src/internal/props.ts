import type { ComponentPropsWithRef, ElementType } from 'react';

/** The public contract deliberately forbids consumer-owned styling. */
export type NoCustomStyle = {
  className?: never;
  style?: never;
  css?: never;
  classNames?: never;
  unstyled?: never;
  render?: never;
  asChild?: never;
};
export type ElementProps<T extends ElementType> = Omit<
  ComponentPropsWithRef<T>,
  keyof NoCustomStyle | 'color' | 'dangerouslySetInnerHTML'
> &
  NoCustomStyle;

/** Strip bypasses from untyped JS/spread props as well as checking TypeScript. */
export function safeProps<T extends object>(props: T) {
  const {
    className,
    style,
    css,
    classNames,
    unstyled,
    render,
    asChild,
    dangerouslySetInnerHTML,
    ...rest
  } = props as T & NoCustomStyle & { dangerouslySetInnerHTML?: unknown };
  void className;
  void style;
  void css;
  void classNames;
  void unstyled;
  void render;
  void asChild;
  void dangerouslySetInnerHTML;
  return rest;
}
