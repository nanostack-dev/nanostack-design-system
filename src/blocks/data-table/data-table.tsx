import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsDownUpIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef as TableColumnDef,
  type RowData,
  type TableOptions,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { Button } from '@/components/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';
import { Skeleton } from '@/components/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  filterFns: { includesString: filterFn_includesString },
});

export type DataTableFeatures = typeof dataTableFeatures;

export type ColumnDef<TData extends RowData, TValue = unknown> = TableColumnDef<
  DataTableFeatures,
  TData,
  TValue
>;

export type DataTableColumn<TData extends RowData, TValue = unknown> = Column<
  DataTableFeatures,
  TData,
  TValue
>;

export type DataTableProps<TData extends RowData, TValue = unknown> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId?: TableOptions<DataTableFeatures, TData>['getRowId'];
  searchLabel?: string;
  searchPlaceholder?: string;
  pageSize?: number;
  loading?: boolean;
  emptyState?: ReactNode;
  toolbar?: ReactNode;
};

const ariaSortByDirection = { asc: 'ascending', desc: 'descending' } as const;

function ariaSortOf<TData extends RowData>(column: DataTableColumn<TData>) {
  if (!column.getCanSort()) return undefined;
  const direction = column.getIsSorted();
  return direction ? ariaSortByDirection[direction] : 'none';
}

export function DataTable<TData extends RowData, TValue = unknown>({
  columns,
  data,
  getRowId,
  searchLabel,
  searchPlaceholder,
  pageSize = 10,
  loading = false,
  emptyState = 'No results.',
  toolbar,
}: DataTableProps<TData, TValue>) {
  const table = useTable({
    features: dataTableFeatures,
    columns: columns as ColumnDef<TData>[],
    data,
    getRowId,
    globalFilterFn: 'includesString',
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const globalFilter = String(table.state.globalFilter ?? '');
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;
  const hasToolbarRow = Boolean(searchLabel) || Boolean(toolbar);

  return (
    <div data-slot="data-table" className="flex w-full min-w-0 flex-col gap-4">
      {hasToolbarRow ? (
        <div className="flex flex-wrap items-center gap-2">
          {searchLabel ? (
            <InputGroup className="max-w-sm">
              <InputGroupInput
                type="search"
                aria-label={searchLabel}
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
              />
              <InputGroupAddon>
                <MagnifyingGlassIcon aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
          ) : null}
          {toolbar ? <div className="ml-auto flex items-center gap-2">{toolbar}</div> : null}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border">
        <Table aria-busy={loading}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={header.isPlaceholder ? undefined : ariaSortOf(header.column)}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columnCount }, (_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center whitespace-normal">
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!loading && pageCount > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <p className="mr-auto text-sm text-muted-foreground" aria-live="polite">
            Page {table.state.pagination.pageIndex + 1} of {pageCount}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export type DataTableColumnHeaderProps<TData extends RowData, TValue = unknown> = {
  column: DataTableColumn<TData, TValue>;
  title: string;
};

export function DataTableColumnHeader<TData extends RowData, TValue = unknown>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) return title;
  const direction = column.getIsSorted();
  const SortIcon =
    direction === 'asc' ? ArrowUpIcon : direction === 'desc' ? ArrowDownIcon : ArrowsDownUpIcon;
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(direction === 'asc')}
    >
      {title}
      <SortIcon data-icon="inline-end" aria-hidden="true" />
    </Button>
  );
}
