import { safeProps, type ElementProps } from '../internal/props.js';
export type HighlightProps = ElementProps<'mark'>;
export function Highlight(props: HighlightProps) {
  return <mark {...safeProps(props)} className="ns-highlight" />;
}
