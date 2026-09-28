import type { ComponentProps } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type TableProps = ComponentProps<typeof Table>;
export type TableHeaderProps = ComponentProps<typeof TableHeader>;
export type TableBodyProps = ComponentProps<typeof TableBody>;
export type TableFooterProps = ComponentProps<typeof TableFooter>;
export type TableRowProps = ComponentProps<typeof TableRow>;
export type TableHeadProps = ComponentProps<typeof TableHead>;
export type TableCellProps = ComponentProps<typeof TableCell>;
export type TableCaptionProps = ComponentProps<typeof TableCaption>;

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
