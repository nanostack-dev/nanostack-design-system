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
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { Text } from '@/components/text';
import { Box } from '@/layout/box';
import { Inline } from '@/layout/inline';
import { Spread } from '@/layout/spread';
import { Stack } from '@/layout/stack';

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

export type DataTablePagination = {
  pageIndex: number;
  pageSize: number;
};

type DataTableClientPaging = {
  pageSize?: number;
  pagination?: never;
  onPaginationChange?: never;
  rowCount?: never;
};

type DataTableControlledPaging = {
  pageSize?: never;
  pagination: DataTablePagination;
  onPaginationChange: (pagination: DataTablePagination) => void;
  rowCount?: number;
};

type DataTableUncontrolledSearch = {
  searchValue?: never;
  onSearchChange?: never;
};

type DataTableControlledSearch = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export type DataTableProps<TData extends RowData, TValue = unknown> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId?: TableOptions<DataTableFeatures, TData>['getRowId'];
  searchLabel?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyState?: ReactNode;
  toolbar?: ReactNode;
} & (DataTableClientPaging | DataTableControlledPaging) &
  (DataTableUncontrolledSearch | DataTableControlledSearch);

const ariaSortByDirection = { asc: 'ascending', desc: 'descending' } as const;

function ariaSortOf<TData extends RowData>(column: DataTableColumn<TData>) {
  if (!column.getCanSort()) return undefined;
  const direction = column.getIsSorted();
  return direction ? ariaSortByDirection[direction] : 'none';
}

function resolveUpdater<T>(updater: T | ((previous: T) => T), previous: T): T {
  return typeof updater === 'function' ? (updater as (previous: T) => T)(previous) : updater;
}

export function DataTable<TData extends RowData, TValue = unknown>({
  columns,
  data,
  getRowId,
  searchLabel,
  searchPlaceholder,
  pageSize = 10,
  pagination,
  onPaginationChange,
  rowCount,
  searchValue,
  onSearchChange,
  loading = false,
  emptyState = 'No results.',
  toolbar,
}: DataTableProps<TData, TValue>) {
  const serverSide = rowCount !== undefined;
  const table = useTable({
    features: dataTableFeatures,
    columns: columns as ColumnDef<TData>[],
    data,
    getRowId,
    globalFilterFn: 'includesString',
    initialState: { pagination: { pageIndex: 0, pageSize } },
    manualPagination: serverSide,
    manualFiltering: serverSide,
    rowCount,
    state: {
      ...(pagination ? { pagination } : {}),
      ...(searchValue !== undefined ? { globalFilter: searchValue } : {}),
    },
    ...(pagination && onPaginationChange
      ? {
          onPaginationChange: (updater) => onPaginationChange(resolveUpdater(updater, pagination)),
        }
      : {}),
    ...(searchValue !== undefined && onSearchChange
      ? {
          onGlobalFilterChange: (updater: string | ((previous: string) => string)) =>
            onSearchChange(String(resolveUpdater(updater, searchValue))),
        }
      : {}),
  });

  const globalFilter = String(table.state.globalFilter ?? '');
  const currentPagination = table.state.pagination;
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;
  const hasToolbarRow = Boolean(searchLabel) || Boolean(toolbar);
  const showPager = pageCount > 1 && (serverSide || !loading);

  function changeSearch(value: string) {
    table.setGlobalFilter(value);
    if (serverSide && currentPagination.pageIndex !== 0) {
      table.setPageIndex(0);
    }
  }

  const search = searchLabel ? (
    <Box data-slot="data-table-search" className="w-full max-w-sm">
      <InputGroup>
        <InputGroupInput
          type="search"
          aria-label={searchLabel}
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(event) => changeSearch(event.target.value)}
        />
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
    </Box>
  ) : null;

  return (
    <Stack data-slot="data-table" space="lg">
      {hasToolbarRow ? (
        <Inline data-slot="data-table-toolbar" space="sm" align={search ? 'start' : 'end'}>
          {search}
          {toolbar ? (
            <Box data-slot="data-table-actions" className="ml-auto flex items-center gap-2">
              {toolbar}
            </Box>
          ) : null}
        </Inline>
      ) : null}
      <Box data-slot="data-table-frame" className="overflow-hidden rounded-2xl border">
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
              Array.from({ length: currentPagination.pageSize }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columnCount }, (_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton />
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
              <TableEmpty colSpan={columnCount}>{emptyState}</TableEmpty>
            )}
          </TableBody>
        </Table>
      </Box>
      {showPager ? (
        <Spread data-slot="data-table-pager">
          <Text tone="muted" aria-live="polite">
            Page {currentPagination.pageIndex + 1} of {pageCount}
          </Text>
          <Inline space="sm" wrap={false}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={loading || !table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={loading || !table.getCanNextPage()}
            >
              Next
            </Button>
          </Inline>
        </Spread>
      ) : null}
    </Stack>
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
      bleed
      icon={SortIcon}
      iconPosition="end"
      onClick={() => column.toggleSorting(direction === 'asc')}
    >
      {title}
    </Button>
  );
}
