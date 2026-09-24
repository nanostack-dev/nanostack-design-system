import { safeProps, type ElementProps } from '../internal/props.js';

export function PageHeader(props: ElementProps<'header'>) {
  return <header {...safeProps(props)} className="ns-page-header" />;
}

export function PageHeaderTitle({ children, ...props }: ElementProps<'h1'>) {
  return (
    <h1 {...safeProps(props)} className="ns-page-header-title">
      {children}
    </h1>
  );
}

export function PageHeaderDescription(props: ElementProps<'p'>) {
  return <p {...safeProps(props)} className="ns-page-header-description" />;
}

export function PageHeaderActions(props: ElementProps<'div'>) {
  return <div {...safeProps(props)} className="ns-page-header-actions" />;
}
