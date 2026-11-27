import { cn } from '@/lib/utils';

export type TableCellAlign = 'start' | 'center' | 'end';
export type TableCellTone = 'default' | 'muted';
export type TableCellFont = 'sans' | 'mono';
export type TableHeadWidth = 'auto' | 'min';

const alignClass: Record<TableCellAlign, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
};

export const tableContainerClass = 'relative w-full overflow-x-auto';
export const tableClass = 'w-full caption-bottom text-sm';
export const tableHeaderClass = '[&_tr]:border-b [&_tr]:border-border-strong';
export const tableBodyClass = '[&_tr:last-child]:border-0';
export const tableEmptyCellClass =
  'h-24 p-3 text-center align-middle whitespace-normal text-muted-foreground';

export function tableRowStyles({ interactive = false }: { interactive?: boolean } = {}) {
  return cn(
    'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
    interactive && 'cursor-pointer',
  );
}

export function tableHeadStyles({
  align = 'start',
  width = 'auto',
}: { align?: TableCellAlign; width?: TableHeadWidth } = {}) {
  return cn(
    'h-12 px-3 align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0',
    alignClass[align],
    width === 'min' && 'w-px',
  );
}

export function tableCellStyles({
  align,
  numeric = false,
  tone = 'default',
  font = 'sans',
}: { align?: TableCellAlign; numeric?: boolean; tone?: TableCellTone; font?: TableCellFont } = {}) {
  return cn(
    'p-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0',
    alignClass[align ?? (numeric ? 'end' : 'start')],
    numeric && 'tabular-nums',
    tone === 'muted' && 'text-muted-foreground',
    font === 'mono' && 'font-mono text-xs',
  );
}
