import { safeProps, type ElementProps } from '../internal/props.js';

export type LinkProps = ElementProps<'a'> & {
  href: string;
  variant?: 'text' | 'muted' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
};

/** Native navigation semantics, also suitable for router createLink adapters. */
export function Link({ variant = 'text', size = 'md', children, ...props }: LinkProps) {
  const button = variant === 'primary' || variant === 'secondary' || variant === 'ghost';
  return (
    <a
      {...safeProps(props)}
      className={button ? 'ns-button' : 'ns-link'}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </a>
  );
}
