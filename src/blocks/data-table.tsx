'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  flexRender,
  type Column,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
  type Updater,
} from '@tanstack/react-table';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { safeProps, type NoCustomStyle } from '../internal/props.js';
import { Button } from '../components/button.js';
import { Input } from '../components/input.js';
import { Select } from '../components/select.js';
import { Skeleton } from '../components/skeleton.js';
import { Checkbox } from '../components/checkbox.js';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuGroup,
  MenuLabel,
  MenuCheckboxItem,
} from '../components/menu.js';

/** Selection is keyed by application IDs, so it survives sorting and server pages. */
export type DataTableSelectionProps<T> =
  | {
      enableRowSelection?: false;
      getRowId?: (row: T, index: number) => string;
      /** Highlights rows, for example the record open in a detail pane, when checkboxes are off. */
      isRowSelected?: (row: T) => boolean;
      selectedRowIds?: never;
      onSelectedRowIdsChange?: never;
      getRowLabel?: never;
    }
  | {
      enableRowSelection: boolean;
      getRowId: (row: T, index: number) => string;
      selectedRowIds?: readonly string[];
      onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
      /** Names the row in its checkbox label. Defaults to the first visible column's value. */
      getRowLabel?: (row: T) => string;
      isRowSelected?: never;
    };

export type DataTableProps<T, TValue = unknown> = NoCustomStyle & {
  label: string;
  columns: ColumnDef<T, TValue>[];
  data: T[];
  mode?: 'client' | 'manual';
  toolbar?: ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  pageSizeOptions?: readonly number[];
  initialPageSize?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  rowCount?: number;
  pageCount?: number;
  enableColumnVisibility?: boolean;
  rowTone?: (row: T) => 'neutral' | 'warning' | 'danger';
} & DataTableSelectionProps<T>;

export type DataTableToolbarProps = NoCustomStyle & {
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  searchDebounceMs?: number;
  children?: ReactNode;
};

function updated<T>(updater: Updater<T>, current: T): T {
  return typeof updater === 'function' ? (updater as (value: T) => T)(current) : updater;
}

const selectionColumnId = 'select';

function columnLabel<T>(column: Column<T, unknown>): string {
  const { header } = column.columnDef;
  return typeof header === 'string' ? header : column.id.replaceAll('_', ' ');
}

function firstVisibleValue<T>(row: Row<T>): string {
  const value = row
    .getVisibleCells()
    .find((cell) => cell.column.id !== selectionColumnId)
    ?.getValue();
  return typeof value === 'string' || typeof value === 'number' ? String(value) : row.id;
}

export function DataTableToolbar({
  searchValue = '',
  onSearchValueChange,
  searchPlaceholder = 'Search…',
  searchLabel = 'Search records',
  searchDebounceMs = 0,
  children,
}: DataTableToolbarProps) {
  const [draft, setDraft] = useState({ committed: searchValue, value: searchValue });
  const value = draft.committed === searchValue ? draft.value : searchValue;
  useEffect(() => {
    if (!onSearchValueChange || searchDebounceMs <= 0 || value === searchValue) return;
    const timeout = setTimeout(() => onSearchValueChange(value), searchDebounceMs);
    return () => clearTimeout(timeout);
  }, [onSearchValueChange, searchDebounceMs, searchValue, value]);
  return (
    <div className="ns-table-toolbar">
      {onSearchValueChange ? (
        <div className="ns-table-search">
          <Input
            aria-label={searchLabel}
            icon={MagnifyingGlassIcon}
            placeholder={searchPlaceholder}
            value={value}
            onChange={(event) => {
              setDraft({ committed: searchValue, value: event.target.value });
              if (searchDebounceMs <= 0) onSearchValueChange(event.target.value);
            }}
          />
        </div>
      ) : null}
      <div className="ns-table-toolbar-actions">{children}</div>
    </div>
  );
}

/** A controlled or client-managed collection; apps supply records and cell assemblies. */
export function DataTable<T, TValue = unknown>(input: DataTableProps<T, TValue>) {
  const {
    label,
    columns,
    data,
    mode = 'client',
    toolbar,
    emptyState = 'No records match this view.',
    loading = false,
    pageSizeOptions = [10, 20, 50],
    initialPageSize = 10,
    pagination: paginationProp,
    onPaginationChange,
    sorting: sortingProp,
    onSortingChange,
    rowCount,
    pageCount: pageCountProp,
    enableColumnVisibility = true,
    enableRowSelection = false,
    getRowId,
    getRowLabel,
    selectedRowIds: selectedRowIdsProp,
    onSelectedRowIdsChange,
    rowTone,
    isRowSelected,
  } = safeProps(input);
  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [localSorting, setLocalSorting] = useState<SortingState>([]);
  const [visibility, setVisibility] = useState<VisibilityState>({});
  const [localSelectedRowIds, setLocalSelectedRowIds] = useState<readonly string[]>([]);
  const selectedRowIds = selectedRowIdsProp ?? localSelectedRowIds;
  const rowSelection = useMemo<RowSelectionState>(
    () => Object.fromEntries(selectedRowIds.map((id) => [id, true])),
    [selectedRowIds],
  );
  const pagination = paginationProp ?? localPagination;
  const sorting = sortingProp ?? localSorting;
  const manual = mode === 'manual';
  const changePagination: OnChangeFn<PaginationState> = (value) =>
    onPaginationChange
      ? onPaginationChange(value)
      : setLocalPagination((current) => updated(value, current));
  const changeSorting: OnChangeFn<SortingState> = (value) =>
    onSortingChange
      ? onSortingChange(value)
      : setLocalSorting((current) => updated(value, current));
  const changeRowSelection: OnChangeFn<RowSelectionState> = (value) => {
    const next = updated(value, rowSelection);
    const ids = Object.keys(next).filter((id) => next[id]);
    if (selectedRowIdsProp === undefined) setLocalSelectedRowIds(ids);
    onSelectedRowIdsChange?.(ids);
  };
  const tableColumns = useMemo<ColumnDef<T, TValue>[]>(
    () =>
      enableRowSelection
        ? [
            {
              id: selectionColumnId,
              header: ({ table }) => (
                <Checkbox
                  aria-label="Select all visible rows"
                  checked={table.getIsAllPageRowsSelected()}
                  indeterminate={table.getIsSomePageRowsSelected()}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
                />
              ),
              cell: ({ row }) => (
                <Checkbox
                  aria-label={`Select ${getRowLabel ? getRowLabel(row.original) : firstVisibleValue(row)}`}
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(value)}
                />
              ),
              enableSorting: false,
              enableHiding: false,
            },
            ...columns,
          ]
        : columns,
    [columns, enableRowSelection, getRowLabel],
  );
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    ...(manual
      ? {}
      : { getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel() }),
    ...(getRowId ? { getRowId } : {}),
    ...(rowCount === undefined ? {} : { rowCount }),
    ...(pageCountProp === undefined ? {} : { pageCount: pageCountProp }),
    enableRowSelection,
    manualPagination: manual,
    manualSorting: manual,
    onPaginationChange: changePagination,
    onSortingChange: changeSorting,
    onColumnVisibilityChange: setVisibility,
    onRowSelectionChange: changeRowSelection,
    state: { pagination, sorting, columnVisibility: visibility, rowSelection },
  });
  const total = manual ? (rowCount ?? data.length) : data.length;
  const pageCount = manual
    ? (pageCountProp ?? Math.ceil(total / pagination.pageSize))
    : table.getPageCount();
  const visibleColumns = table.getVisibleLeafColumns().length;
  return (
    <div className="ns-data-table" aria-busy={loading}>
      {toolbar || enableColumnVisibility ? (
        <div className="ns-table-toolbar">
          {toolbar}
          {enableColumnVisibility ? (
            <Menu>
              <MenuTrigger variant="secondary" size="sm">
                Columns
              </MenuTrigger>
              <MenuContent align="end">
                <MenuGroup>
                  <MenuLabel>Visible columns</MenuLabel>
                  {table
                    .getAllLeafColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <MenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(visible) => column.toggleVisibility(visible)}
                      >
                        {columnLabel(column)}
                      </MenuCheckboxItem>
                    ))}
                </MenuGroup>
              </MenuContent>
            </Menu>
          ) : null}
        </div>
      ) : null}
      <div className="ns-data-table-scroll">
        <table className="ns-table" aria-label={label}>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      header.column.getIsSorted() === 'asc'
                        ? 'ascending'
                        : header.column.getIsSorted() === 'desc'
                          ? 'descending'
                          : undefined
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="ns-table-sort"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span aria-hidden="true">
                          {header.column.getIsSorted() === 'asc'
                            ? '↑'
                            : header.column.getIsSorted() === 'desc'
                              ? '↓'
                              : '↕'}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(pagination.pageSize, 5) }, (_, index) => (
                <tr key={index}>
                  {Array.from({ length: visibleColumns }, (_, cell) => (
                    <td key={cell}>
                      <Skeleton size="sm" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const selected = enableRowSelection
                  ? row.getIsSelected()
                  : (isRowSelected?.(row.original) ?? false);
                return (
                  <tr
                    key={row.id}
                    data-selected={selected}
                    aria-selected={selected}
                    data-tone={rowTone?.(row.original) ?? 'neutral'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        data-ns-label={
                          cell.column.id === selectionColumnId ? undefined : columnLabel(cell.column)
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={visibleColumns}>
                  <div className="ns-table-empty">{emptyState}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="ns-table-footer">
        <span>
          {enableRowSelection
            ? `${selectedRowIds.length} of ${total} selected`
            : `${total} records`}
        </span>
        <div className="ns-table-toolbar-actions">
          <span>
            Page {pageCount === 0 ? 0 : pagination.pageIndex + 1} of {pageCount}
          </span>
          <div className="ns-table-page-size">
            <Select
              aria-label="Rows per page"
              size="sm"
              value={String(pagination.pageSize)}
              options={pageSizeOptions.map((size) => ({
                value: String(size),
                label: `${size} per page`,
              }))}
              onChange={(event) =>
                changePagination({ pageIndex: 0, pageSize: Number(event.target.value) })
              }
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.pageIndex <= 0}
            onClick={() => changePagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.pageIndex + 1 >= pageCount}
            onClick={() => changePagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
