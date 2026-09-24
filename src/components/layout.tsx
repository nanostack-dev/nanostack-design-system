import { Separator } from '@base-ui/react/separator';
import { safeProps, type ElementProps } from '../internal/props.js';

export type StackProps = ElementProps<'div'> & {
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'stretch';
};
export function Stack({ gap = 'md', align = 'stretch', ...props }: StackProps) {
  return <div {...safeProps(props)} className="ns-stack" data-gap={gap} data-align={align} />;
}

export type ClusterProps = ElementProps<'div'> & {
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  justify?: 'start' | 'between' | 'end';
};
/** Horizontal composition wraps when the available space becomes constrained. */
export function Cluster({ gap = 'sm', justify = 'start', ...props }: ClusterProps) {
  return <div {...safeProps(props)} className="ns-cluster" data-gap={gap} data-justify={justify} />;
}

export type GridProps = ElementProps<'div'> & {
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
} & ({ layout?: 'equal'; columns?: 1 | 2 | 3 } | { layout: 'sidebar'; columns?: never });
/** Sidebar composition reserves the second track for supporting information. */
export function Grid({
  layout = 'equal',
  columns = 2,
  gap = 'md',
  responsive = true,
  ...props
}: GridProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-grid"
      data-layout={layout}
      data-columns={columns}
      data-gap={gap}
      data-responsive={responsive}
    />
  );
}

export type DividerProps = ElementProps<'div'>;
export function Divider(props: DividerProps) {
  return <Separator {...safeProps(props)} orientation="horizontal" className="ns-divider" />;
}

export type SurfaceProps = ElementProps<'div'> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  tone?: 'default' | 'subtle';
};
export function Surface({ padding = 'md', tone = 'default', ...props }: SurfaceProps) {
  return (
    <div {...safeProps(props)} className="ns-surface" data-padding={padding} data-tone={tone} />
  );
}
