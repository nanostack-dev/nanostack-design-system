import { safeProps, type ElementProps } from '../internal/props.js';

type TextVariants = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted' | 'info' | 'success' | 'warning' | 'danger';
  weight?: 'regular' | 'medium' | 'semibold';
  truncate?: boolean;
};
export type TextProps = TextVariants &
  ((ElementProps<'p'> & { display?: 'block' }) | (ElementProps<'span'> & { display: 'inline' }));

export function Text({
  size = 'md',
  tone = 'default',
  weight = 'regular',
  truncate = false,
  ...props
}: TextProps) {
  if (props.display === 'inline') {
    const { display, ...nativeProps } = props;
    void display;
    return (
      <span
        {...safeProps(nativeProps)}
        className="ns-text"
        data-size={size}
        data-tone={tone}
        data-weight={weight}
        data-ns-truncate={truncate}
      />
    );
  }
  const { display, ...nativeProps } = props;
  void display;
  return (
    <p
      {...safeProps(nativeProps)}
      className="ns-text"
      data-size={size}
      data-tone={tone}
      data-weight={weight}
      data-ns-truncate={truncate}
    />
  );
}

export type HeadingProps = ElementProps<'h2'> & {
  level?: 1 | 2 | 3 | 4;
  size?: 'lg' | 'xl' | '2xl';
};

/** Heading hierarchy and visual size are independent decisions. */
export function Heading({ level = 2, size = 'xl', ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag {...safeProps(props)} className="ns-heading" data-size={size} />;
}

export type CodeProps = ElementProps<'code'> & { tone?: 'default' | 'muted'; truncate?: boolean };
export function Code({ tone = 'default', truncate = false, ...props }: CodeProps) {
  return (
    <code {...safeProps(props)} className="ns-code" data-tone={tone} data-ns-truncate={truncate} />
  );
}

export type KeyboardKeyProps = ElementProps<'kbd'>;
export function KeyboardKey(props: KeyboardKeyProps) {
  return <kbd {...safeProps(props)} className="ns-keyboard-key" />;
}
