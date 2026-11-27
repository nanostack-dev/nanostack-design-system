import type { ComponentPropsWithRef, ReactNode } from 'react';

import { useMaterialAttributes } from '@/lib/material';
import { useMotionAttributes } from '@/lib/motion';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

import {
  tableBodyClass,
  tableCellStyles,
  tableClass,
  tableContainerClass,
  tableEmptyCellClass,
  tableHeaderClass,
  tableHeadStyles,
  tableRowStyles,
  type TableCellAlign,
  type TableCellFont,
  type TableCellTone,
  type TableHeadWidth,
} from '@/recipes/table';

export type { TableCellAlign, TableCellFont, TableCellTone, TableHeadWidth };
export type TableCaptionSide = 'top' | 'bottom';

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
  const material = useMaterialAttributes();
  return (
    <div data-slot="table-container" className={tableContainerClass} {...material}>
      <table data-slot="table" className={tableClass} {...props} />
    </div>
  );
}

export function TableHeader(props: TableHeaderProps) {
  return <thead data-slot="table-header" className={tableHeaderClass} {...props} />;
}

export function TableBody(props: TableBodyProps) {
  return <tbody data-slot="table-body" className={tableBodyClass} {...props} />;
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
  const motion = useMotionAttributes();
  return (
    <tr
      data-slot="table-row"
      className={tableRowStyles({ interactive: Boolean(props.onClick) })}
      {...props}
      {...motion}
    />
  );
}

export function TableHead({ align = 'start', width = 'auto', ...props }: TableHeadProps) {
  return <th data-slot="table-head" className={tableHeadStyles({ align, width })} {...props} />;
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
      className={tableCellStyles({ align, numeric, tone, font })}
      {...props}
    />
  );
}

export function TableEmpty({ colSpan, children, ...props }: TableEmptyProps) {
  return (
    <tr data-slot="table-empty" {...props}>
      <td colSpan={colSpan} className={tableEmptyCellClass}>
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
