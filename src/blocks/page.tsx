import { safeProps, type ElementProps } from '../internal/props.js';

export type PageProps = ElementProps<'section'> & {
  width?: 'standard' | 'wide';
  height?: 'content' | 'fill';
};
export function Page({ width = 'standard', height = 'content', ...props }: PageProps) {
  return (
    <section {...safeProps(props)} className="ns-page" data-ns-width={width} data-height={height} />
  );
}
export type PageHeaderContentProps = ElementProps<'div'>;
export function PageHeaderContent(props: PageHeaderContentProps) {
  return <div {...safeProps(props)} className="ns-page-heading" />;
}
export type PageEyebrowProps = ElementProps<'p'>;
export function PageEyebrow(props: PageEyebrowProps) {
  return <p {...safeProps(props)} className="ns-page-eyebrow" />;
}

export type CardProps = ElementProps<'section'> & { tone?: 'default' | 'subtle' };
export function Card({ tone = 'default', ...props }: CardProps) {
  return <section {...safeProps(props)} className="ns-card" data-tone={tone} />;
}
export type CardHeaderProps = ElementProps<'header'>;
export function CardHeader(props: CardHeaderProps) {
  return <header {...safeProps(props)} className="ns-card-header" />;
}
export type CardTitleProps = ElementProps<'h2'>;
export function CardTitle({ children, ...props }: CardTitleProps) {
  return (
    <h2 {...safeProps(props)} className="ns-card-title">
      {children}
    </h2>
  );
}
export type CardDescriptionProps = ElementProps<'p'>;
export function CardDescription(props: CardDescriptionProps) {
  return <p {...safeProps(props)} className="ns-card-description" />;
}
export type CardContentProps = ElementProps<'div'>;
export function CardContent(props: CardContentProps) {
  return <div {...safeProps(props)} className="ns-card-content" />;
}
export type CardFooterProps = ElementProps<'footer'>;
export function CardFooter(props: CardFooterProps) {
  return <footer {...safeProps(props)} className="ns-card-footer" />;
}

export type FormActionsProps = ElementProps<'div'>;
export function FormActions(props: FormActionsProps) {
  return <div {...safeProps(props)} className="ns-form-actions" />;
}
export type CalloutProps = ElementProps<'div'> & {
  tone?: 'info' | 'success' | 'warning' | 'danger';
};
export function Callout({ tone = 'info', ...props }: CalloutProps) {
  return <div {...safeProps(props)} className="ns-callout" data-tone={tone} />;
}
