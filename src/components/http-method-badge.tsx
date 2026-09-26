import { safeProps, type ElementProps } from '../internal/props.js';
const tones: Record<string, string> = {
  GET: 'success',
  POST: 'info',
  PUT: 'warning',
  PATCH: 'warning',
  DELETE: 'danger',
  HEAD: 'neutral',
  OPTIONS: 'neutral',
  CONNECT: 'neutral',
  TRACE: 'neutral',
};
export type HttpMethodBadgeProps = Omit<ElementProps<'span'>, 'children'> & {
  method: string;
  format?: 'full' | 'short';
};
export function HttpMethodBadge({ method, format = 'full', ...props }: HttpMethodBadgeProps) {
  const normalized = method.toUpperCase();
  return (
    <span
      {...safeProps(props)}
      className="ns-http-method"
      data-tone={tones[normalized] ?? 'neutral'}
    >
      {format === 'short' && normalized === 'DELETE'
        ? 'DEL'
        : format === 'short' && normalized === 'OPTIONS'
          ? 'OPT'
          : normalized}
    </span>
  );
}
