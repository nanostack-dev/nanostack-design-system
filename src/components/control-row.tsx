import { safeProps, type ElementProps } from '../internal/props.js';
export type ControlRowProps = ElementProps<'div'> & { align?: 'center' | 'start' };
/** A responsive row of controls. Text fields share available space; actions keep their size. */
export function ControlRow({ align = 'center', ...props }: ControlRowProps) {
  return <div {...safeProps(props)} className="ns-control-row" data-align={align} />;
}
