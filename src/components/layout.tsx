import { Separator } from '@base-ui/react/separator';
import { ScrollArea } from '@base-ui/react/scroll-area';
import type { Ref } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

export type StackProps = ElementProps<'div'> & {
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'stretch';
  height?: 'content' | 'fill';
};
export function Stack({ gap = 'md', align = 'stretch', height = 'content', ...props }: StackProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-stack"
      data-gap={gap}
      data-align={align}
      data-ns-height={height}
    />
  );
}

export type ClusterProps = ElementProps<'div'> & {
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  justify?: 'start' | 'between' | 'center' | 'end';
  align?: 'start' | 'center' | 'baseline';
};
/** Horizontal composition wraps when the available space becomes constrained. */
export function Cluster({
  gap = 'sm',
  justify = 'start',
  align = 'center',
  ...props
}: ClusterProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-cluster"
      data-gap={gap}
      data-justify={justify}
      data-align={align}
    />
  );
}

export type GridProps = ElementProps<'div'> & {
  height?: 'content' | 'fill';
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
} & (
    | { layout?: 'equal'; columns?: 1 | 2 | 3 }
    | { layout: 'sidebar' | 'navigation'; columns?: never }
  );
/** Sidebar composition reserves the second track for supporting information. */
export function Grid({
  height = 'content',
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
      data-ns-height={height}
      data-layout={layout}
      data-columns={layout === 'equal' ? columns : undefined}
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

export type FormProps = ElementProps<'form'> & {
  gap?: 'sm' | 'md' | 'lg';
  height?: 'content' | 'fill';
};
export function Form({ gap = 'md', height = 'content', ...props }: FormProps) {
  return <form {...safeProps(props)} className="ns-form" data-gap={gap} data-ns-height={height} />;
}

export type LabelProps = ElementProps<'label'>;
/** Native label for controls that are not inside a Field. */
export function Label({ htmlFor, children, ...props }: LabelProps) {
  return (
    <label {...safeProps(props)} htmlFor={htmlFor} className="ns-label">
      {children}
    </label>
  );
}

export type ListProps = ElementProps<'ul'> & {
  marker?: 'none' | 'bullet';
  gap?: 'xs' | 'sm' | 'md';
};
export function List({ marker = 'bullet', gap = 'sm', ...props }: ListProps) {
  return <ul {...safeProps(props)} className="ns-list" data-ns-marker={marker} data-gap={gap} />;
}

export type OrderedListProps = ElementProps<'ol'> & { gap?: 'xs' | 'sm' | 'md' };
export function OrderedList({ gap = 'sm', ...props }: OrderedListProps) {
  return <ol {...safeProps(props)} className="ns-list" data-gap={gap} />;
}

export type ListItemProps = ElementProps<'li'>;
export function ListItem(props: ListItemProps) {
  return <li {...safeProps(props)} className="ns-list-item" />;
}

export type VisuallyHiddenProps = ElementProps<'span'>;
export function VisuallyHidden(props: VisuallyHiddenProps) {
  return <span {...safeProps(props)} className="ns-visually-hidden" />;
}

export type ScrollRegionProps = Omit<ElementProps<'div'>, 'aria-label' | 'tabIndex'> & {
  label: string;
  height?: 'content' | 'panel' | 'fill';
  viewportRef?: Ref<HTMLDivElement>;
};
/** Native scroll events and viewportRef address the actual scrollable element. */
export function ScrollRegion({
  label,
  height = 'panel',
  viewportRef,
  children,
  onScroll,
  onScrollCapture,
  ...props
}: ScrollRegionProps) {
  return (
    <ScrollArea.Root {...safeProps(props)} className="ns-scroll-region" data-ns-height={height}>
      <ScrollArea.Viewport
        ref={viewportRef}
        className="ns-scroll-viewport"
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={onScroll}
        onScrollCapture={onScrollCapture}
      >
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="ns-scrollbar" orientation="vertical">
        <ScrollArea.Thumb className="ns-scroll-thumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className="ns-scrollbar" orientation="horizontal">
        <ScrollArea.Thumb className="ns-scroll-thumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="ns-scroll-corner" />
    </ScrollArea.Root>
  );
}

export type FieldGroupProps = ElementProps<'fieldset'>;
export function FieldGroup(props: FieldGroupProps) {
  return <fieldset {...safeProps(props)} className="ns-field-group" />;
}
export type FieldGroupLegendProps = ElementProps<'legend'>;
export function FieldGroupLegend(props: FieldGroupLegendProps) {
  return <legend {...safeProps(props)} className="ns-field-group-legend" />;
}

export type ResponsiveVisibilityProps = ElementProps<'div'> & { when: 'mobile' | 'desktop' };
export function ResponsiveVisibility({ when, ...props }: ResponsiveVisibilityProps) {
  return (
    <div {...safeProps(props)} className="ns-responsive-visibility" data-ns-visibility={when} />
  );
}
