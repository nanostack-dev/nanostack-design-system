import { safeProps, type ElementProps } from '../internal/props.js';
export type DialogHeaderProps = ElementProps<'div'>;
export function DialogHeader(props: DialogHeaderProps) {
  return <div {...safeProps(props)} className="ns-dialog-header" />;
}
export type DialogFooterProps = ElementProps<'div'>;
export function DialogFooter(props: DialogFooterProps) {
  return <div {...safeProps(props)} className="ns-dialog-footer" />;
}
