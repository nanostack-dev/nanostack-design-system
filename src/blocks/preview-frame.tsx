import { safeProps, type ElementProps } from '../internal/props.js';

/** Finite viewport presets for documentation and interaction fixtures. */
export type PreviewFrameProps = ElementProps<'div'> & {
  width?: 'narrow' | 'standard' | 'wide';
  height?: 'content' | 'panel' | 'workspace';
};
export function PreviewFrame({
  width = 'standard',
  height = 'content',
  ...props
}: PreviewFrameProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-preview-frame"
      data-ns-width={width}
      data-ns-height={height}
    />
  );
}
