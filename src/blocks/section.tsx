import { safeProps, type ElementProps } from '../internal/props.js';

export function Section(props: ElementProps<'section'>) {
  return <section {...safeProps(props)} className="ns-section" />;
}

export function SectionHeader(props: ElementProps<'header'>) {
  return <header {...safeProps(props)} className="ns-section-header" />;
}

export function SectionTitle({ children, ...props }: ElementProps<'h2'>) {
  return (
    <h2 {...safeProps(props)} className="ns-section-title">
      {children}
    </h2>
  );
}

export function SectionDescription(props: ElementProps<'p'>) {
  return <p {...safeProps(props)} className="ns-section-description" />;
}

export function SectionActions(props: ElementProps<'div'>) {
  return <div {...safeProps(props)} className="ns-section-actions" />;
}

export function SectionBody(props: ElementProps<'div'>) {
  return <div {...safeProps(props)} className="ns-section-body" />;
}
