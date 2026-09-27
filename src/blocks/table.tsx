import type { ElementType } from 'react';
import { safeProps, type ElementProps } from '../internal/props.js';

type TableElementProps<T extends ElementType> = Omit<
  ElementProps<T>,
  'width' | 'height' | 'align' | 'valign'
> & {
  width?: never;
  height?: never;
  align?: never;
  valign?: never;
};

function tableProps<T extends object>(props: T) {
  const safe = safeProps(props);
  for (const key of Object.keys(safe)) {
    if (['width', 'height', 'align', 'valign'].includes(key.toLowerCase())) {
      delete (safe as Record<string, unknown>)[key];
    }
  }
  return safe;
}

export type TableProps = Omit<TableElementProps<'table'>, 'aria-label'> & { label: string };
export function Table({ label, ...props }: TableProps) {
  return (
    <div className="ns-simple-table-scroll">
      <table {...tableProps(props)} aria-label={label} className="ns-simple-table" />
    </div>
  );
}
export type TableHeaderProps = TableElementProps<'thead'>;
export function TableHeader(props: TableHeaderProps) {
  return <thead {...tableProps(props)} />;
}
export type TableBodyProps = TableElementProps<'tbody'>;
export function TableBody(props: TableBodyProps) {
  return <tbody {...tableProps(props)} />;
}
export type TableRowProps = TableElementProps<'tr'> & { selected?: boolean };
export function TableRow({ selected = false, ...props }: TableRowProps) {
  return <tr {...tableProps(props)} data-ns-selected={selected} />;
}
export type TableHeadProps = Omit<TableElementProps<'th'>, 'align'> & {
  align?: 'start' | 'center' | 'end';
};
export function TableHead({ align = 'start', scope = 'col', ...props }: TableHeadProps) {
  return <th {...tableProps(props)} scope={scope} className="ns-table-head" data-align={align} />;
}
export type TableCellProps = Omit<TableElementProps<'td'>, 'align'> & {
  align?: 'start' | 'center' | 'end';
};
export function TableCell({ align = 'start', ...props }: TableCellProps) {
  return <td {...tableProps(props)} className="ns-table-cell" data-align={align} />;
}
