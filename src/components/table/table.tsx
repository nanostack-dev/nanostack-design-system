import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type TableCellAlign = 'start' | 'center' | 'end';
export type TableCellTone = 'default' | 'muted';
export type TableCellFont = 'sans' | 'mono';
export type TableHeadWidth = 'auto' | 'min';
export type TableCaptionSide = 'top' | 'bottom';

const alignClass: Record<TableCellAlign, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
};

export type TableProps = ClosedProps<ComponentPropsWithRef<'table'>>;
export type TableHeaderProps = ClosedProps<ComponentPropsWithRef<'thead'>>;
export type TableBodyProps = ClosedProps<ComponentPropsWithRef<'tbody'>>;
export type TableFooterProps = ClosedProps<ComponentPropsWithRef<'tfoot'>>;
export type TableRowProps = ClosedProps<ComponentPropsWithRef<'tr'>>;
export type TableHeadProps = ClosedProps<Omit<ComponentPropsWithRef<'th'>, 'align' | 'width'>> & {
  align?: TableCellAlign;
  width?: TableHeadWidth;
};
export type TableCellProps = ClosedProps<Omit<ComponentPropsWithRef<'td'>, 'align' | 'width'>> & {
  align?: TableCellAlign;
  numeric?: boolean;
  tone?: TableCellTone;
  font?: TableCellFont;
};
export type TableEmptyProps = ClosedProps<Omit<ComponentPropsWithRef<'tr'>, 'children'>> & {
  colSpan: number;
  children: ReactNode;
};
export type TableCaptionProps = ClosedProps<ComponentPropsWithRef<'caption'>> & {
  side?: TableCaptionSide;
};

export function Table(props: TableProps) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className="w-full caption-bottom text-sm" {...props} />
    </div>
  );
}

export function TableHeader(props: TableHeaderProps) {
  return <thead data-slot="table-header" className="[&_tr]:border-b" {...props} />;
}

export function TableBody(props: TableBodyProps) {
  return <tbody data-slot="table-body" className="[&_tr:last-child]:border-0" {...props} />;
}

export function TableFooter(props: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className="border-t bg-muted/50 font-medium [&>tr]:last:border-b-0"
      {...props}
    />
  );
}

export function TableRow(props: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
        props.onClick && 'cursor-pointer',
      )}
      {...props}
    />
  );
}

export function TableHead({ align = 'start', width = 'auto', ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'h-12 px-3 align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
        alignClass[align],
        width === 'min' && 'w-px',
      )}
      {...props}
    />
  );
}

export function TableCell({
  align,
  numeric = false,
  tone = 'default',
  font = 'sans',
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'p-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
        alignClass[align ?? (numeric ? 'end' : 'start')],
        numeric && 'tabular-nums',
        tone === 'muted' && 'text-muted-foreground',
        font === 'mono' && 'font-mono text-xs',
      )}
      {...props}
    />
  );
}

export function TableEmpty({ colSpan, children, ...props }: TableEmptyProps) {
  return (
    <tr data-slot="table-empty" {...props}>
      <td
        colSpan={colSpan}
        className="h-24 p-3 text-center align-middle whitespace-normal text-muted-foreground"
      >
        {children}
      </td>
    </tr>
  );
}

export function TableCaption({ side = 'bottom', ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      data-side={side}
      className={cn(
        'text-sm text-muted-foreground',
        side === 'top' ? 'mb-3 caption-top text-start' : 'mt-4',
      )}
      {...props}
    />
  );
}
