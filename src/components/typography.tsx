import { safeProps, type ElementProps } from '../internal/props.js';

type TextVariants = {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'muted';
  weight?: 'regular' | 'medium';
};
export type TextProps = TextVariants &
  ((ElementProps<'p'> & { as?: 'p' }) | (ElementProps<'span'> & { as: 'span' }));

export function Text({ size = 'md', tone = 'default', weight = 'regular', ...props }: TextProps) {
  if (props.as === 'span') {
    const { as, ...nativeProps } = props;
    void as;
    return (
      <span
        {...safeProps(nativeProps)}
        className="ns-text"
        data-size={size}
        data-tone={tone}
        data-weight={weight}
      />
    );
  }
  const { as, ...nativeProps } = props;
  void as;
  return (
    <p
      {...safeProps(nativeProps)}
      className="ns-text"
      data-size={size}
      data-tone={tone}
      data-weight={weight}
    />
  );
}

export type HeadingProps = ElementProps<'h2'> & { level?: 1 | 2 | 3; size?: 'lg' | 'xl' | '2xl' };

/** Heading hierarchy and visual size are independent decisions. */
export function Heading({ level = 2, size = 'xl', ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag {...safeProps(props)} className="ns-heading" data-size={size} />;
}
