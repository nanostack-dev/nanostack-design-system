import { DotsThreeIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Badge, type BadgeTone } from '@/components/badge';
import { Button, IconButton } from '@/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

import { Text } from '@/components/text';
import { Stack } from '@/layout/stack';

import {
  DataTable,
  DataTableColumnHeader,
  type ColumnDef,
  type DataTablePagination,
} from './data-table';

type Person = {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member' | 'Viewer';
  status: 'Active' | 'Invited' | 'Suspended';
};

function person(name: string, role: Person['role'], status: Person['status']): Person {
  const handle = name.split(' ')[0].toLowerCase();
  return { id: handle, name, email: `${handle}@example.com`, role, status };
}

const people: Person[] = [
  person('Ada Lovelace', 'Owner', 'Active'),
  person('Grace Hopper', 'Admin', 'Active'),
  person('Alan Turing', 'Member', 'Invited'),
  person('Katherine Johnson', 'Member', 'Active'),
  person('Linus Pauling', 'Viewer', 'Suspended'),
  person('Margaret Hamilton', 'Admin', 'Active'),
  person('Edsger Dijkstra', 'Member', 'Invited'),
  person('Barbara Liskov', 'Member', 'Active'),
  person('Claude Shannon', 'Viewer', 'Active'),
  person('Radia Perlman', 'Member', 'Suspended'),
  person('Donald Knuth', 'Viewer', 'Invited'),
  person('Frances Allen', 'Member', 'Active'),
];

const statusTone: Record<Person['status'], BadgeTone> = {
  Active: 'success',
  Invited: 'info',
  Suspended: 'neutral',
};

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  { accessorKey: 'role', header: 'Role', enableSorting: false },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => <Badge tone={statusTone[row.original.status]}>{row.original.status}</Badge>,
  },
];

const usage = `
A table with sort, search, pages, a loading state and an empty state, built on TanStack Table v9. Use it for a list of records that the person searches and sorts. For a table of a few fixed rows, use \`Table\`.

The block is closed. It does not accept \`className\` or \`style\`. Columns are TanStack \`ColumnDef\` values, and a cell renders design-system components.

## Where the rows live

| Props | Use it for |
| --- | --- |
| \`data\`, \`pageSize\` | The default. Every row is in the browser. The table sorts, searches and pages them. |
| \`pagination\`, \`onPaginationChange\`, \`rowCount\` | The server holds the rows. \`data\` is the current page, \`rowCount\` is the total. The table asks for a page through \`onPaginationChange\` and does not filter or page the rows itself. |
| \`pagination\`, \`onPaginationChange\` without \`rowCount\` | Every row is in the browser, and the page keeps the page index, for example in the URL. |

## Search

| Props | Use it for |
| --- | --- |
| \`searchLabel\` | The table owns the search text and filters the rows in the browser. |
| \`searchLabel\`, \`searchValue\`, \`onSearchChange\` | The page owns the search text, for example to send it to the server or keep it in the URL. With \`rowCount\`, a new search also asks for the first page. |

## Other props

- \`loading\`: shows skeleton rows. With \`rowCount\`, the pager stays in place and its buttons are disabled.
- \`emptyState\`: the content of the empty table. Pass an \`EmptyState\` for a first-use message.
- \`toolbar\`: controls at the end of the search row, for example filters and export.
- \`DataTableColumnHeader\`: a sortable header. A column with \`enableSorting: false\` shows plain text.

## Do not

- Do not pass every row and \`rowCount\` together. \`rowCount\` means the server pages the rows.
- Do not sort a server page in the browser and call it sorted. Sorting applies to the current page only.
- Do not put a second search box in \`toolbar\`.
`;

type ServerPage = { rows: Person[]; total: number };

function fetchPage(search: string, pagination: DataTablePagination): ServerPage {
  const query = search.trim().toLowerCase();
  const matches = people.filter((entry) =>
    [entry.name, entry.email, entry.role, entry.status].some((value) =>
      value.toLowerCase().includes(query),
    ),
  );
  const start = pagination.pageIndex * pagination.pageSize;
  return { rows: matches.slice(start, start + pagination.pageSize), total: matches.length };
}

const onServerPagination = fn();
const onServerSearch = fn();

function ServerTable() {
  const [pagination, setPagination] = useState<DataTablePagination>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [search, setSearch] = useState('');
  const page = fetchPage(search, pagination);
  return (
    <Stack space="sm">
      <DataTable
        columns={columns}
        data={page.rows}
        getRowId={(entry) => entry.id}
        rowCount={page.total}
        pagination={pagination}
        onPaginationChange={(next) => {
          onServerPagination(next);
          setPagination(next);
        }}
        searchLabel="Search people"
        searchValue={search}
        onSearchChange={(value) => {
          onServerSearch(value);
          setSearch(value);
        }}
      />
      <Text tone="muted" data-testid="server-state">
        {`page=${pagination.pageIndex} search=${search}`}
      </Text>
    </Stack>
  );
}

const onCopyEmail = fn();
const onRemove = fn();

const columnsWithActions: ColumnDef<Person>[] = [
  ...columns,
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <IconButton
              icon={DotsThreeIcon}
              size="sm"
              label={`Actions for ${row.original.name}`}
              tooltip={false}
            />
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onCopyEmail(row.original.email)}>
            Copy email
          </DropdownMenuItem>
          <DropdownMenuItem tone="critical" onClick={() => onRemove(row.original.id)}>
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function bodyRows(canvasElement: HTMLElement) {
  const [, body] = within(canvasElement).getAllByRole('rowgroup');
  return within(body).getAllByRole('row');
}

function firstCellTexts(canvasElement: HTMLElement) {
  return bodyRows(canvasElement).map((row) => within(row).getAllByRole('cell')[0].textContent);
}

const meta = {
  title: 'Blocks/Data Table',
  component: DataTable<Person, unknown>,
  parameters: {
    layout: 'padded',
    docs: { description: { component: usage } },
  },
  args: {
    columns,
    data: people,
    getRowId: (person) => person.id,
    searchLabel: 'Search people',
    searchPlaceholder: 'Search people…',
  },
  beforeEach: () => {
    onCopyEmail.mockClear();
    onRemove.mockClear();
    onServerPagination.mockClear();
    onServerSearch.mockClear();
  },
} satisfies Meta<typeof DataTable<Person, unknown>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('table')).toHaveAttribute('aria-busy', 'false');
    await expect(bodyRows(canvasElement)).toHaveLength(10);
    await expect(canvas.getByText('Page 1 of 2')).toBeVisible();
    await expect(canvas.getByRole('searchbox', { name: 'Search people' })).toBeVisible();
    await expect(canvas.getAllByText('Active')[0]).toBeVisible();
  },
};

export const Sorting: Story = {
  args: { pageSize: 20 },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const nameHeader = canvas.getByRole('columnheader', { name: 'Name' });
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    await expect(canvas.getByRole('columnheader', { name: 'Role' })).not.toHaveAttribute(
      'aria-sort',
    );
    await expect(firstCellTexts(canvasElement)[0]).toBe('Ada Lovelace');

    await userEvent.click(within(nameHeader).getByRole('button', { name: 'Name' }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(firstCellTexts(canvasElement)[0]).toBe('Ada Lovelace');
    await expect(firstCellTexts(canvasElement)[1]).toBe('Alan Turing');

    await userEvent.click(within(nameHeader).getByRole('button', { name: 'Name' }));
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    await expect(firstCellTexts(canvasElement)[0]).toBe('Radia Perlman');
  },
};

export const Search: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const search = canvas.getByRole('searchbox', { name: 'Search people' });
    await userEvent.type(search, 'grace');
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(1));
    await expect(canvas.getByText('grace@example.com')).toBeVisible();
    await expect(canvas.queryByText(/Page \d+ of/)).not.toBeInTheDocument();

    await userEvent.clear(search);
    await userEvent.type(search, 'no such person');
    await expect(await canvas.findByText('No results.')).toBeVisible();
    await expect(bodyRows(canvasElement)).toHaveLength(1);
  },
};

export const Pagination: Story = {
  args: { pageSize: 5 },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const previous = canvas.getByRole('button', { name: 'Previous' });
    const next = canvas.getByRole('button', { name: 'Next' });
    await expect(canvas.getByText('Page 1 of 3')).toBeVisible();
    await expect(previous).toBeDisabled();
    await expect(next).toBeEnabled();

    await userEvent.click(next);
    await expect(canvas.getByText('Page 2 of 3')).toBeVisible();
    await expect(firstCellTexts(canvasElement)[0]).toBe('Margaret Hamilton');
    await expect(previous).toBeEnabled();

    await userEvent.click(next);
    await expect(canvas.getByText('Page 3 of 3')).toBeVisible();
    await expect(bodyRows(canvasElement)).toHaveLength(2);
    await expect(next).toBeDisabled();

    await userEvent.click(previous);
    await expect(canvas.getByText('Page 2 of 3')).toBeVisible();
  },
};

export const SinglePage: Story = {
  args: { data: people.slice(0, 4) },
  play: async ({ canvas, canvasElement }) => {
    await expect(bodyRows(canvasElement)).toHaveLength(4);
    await expect(canvas.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    await expect(canvas.queryByText(/Page \d+ of/)).not.toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: { loading: true, pageSize: 5 },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    await expect(bodyRows(canvasElement)).toHaveLength(5);
    await expect(canvasElement.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(20);
    await expect(canvas.queryByText('Ada Lovelace')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: { data: [] },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('No results.')).toBeVisible();
    const [cell] = within(bodyRows(canvasElement)[0]).getAllByRole('cell');
    await expect(cell).toHaveAttribute('colspan', '4');
  },
};

export const CustomEmptyState: Story = {
  args: {
    data: [],
    emptyState: (
      <Stack space="sm" align="center">
        <Text tone="muted">No people yet.</Text>
        <Button variant="solid" tone="brand" size="sm" icon={PlusIcon}>
          Invite people
        </Button>
      </Stack>
    ),
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No people yet.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Invite people' })).toBeVisible();
    await expect(canvas.queryByText('No results.')).not.toBeInTheDocument();
  },
};

export const Toolbar: Story = {
  args: { toolbar: <Button variant="outline">Export</Button> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Export' })).toBeVisible();
    await expect(canvas.getByRole('searchbox', { name: 'Search people' })).toBeVisible();
  },
};

export const WithoutSearch: Story = {
  args: { searchLabel: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument();
    await expect(canvas.getByRole('table')).toBeVisible();
  },
};

export const RowActions: Story = {
  args: { columns: columnsWithActions },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    const trigger = canvas.getByRole('button', { name: 'Actions for Grace Hopper' });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(menu).toBeVisible());
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Copy email' }));
    await expect(onCopyEmail).toHaveBeenCalledOnce();
    await expect(onCopyEmail).toHaveBeenCalledWith('grace@example.com');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Dark: Story = {
  args: { columns: columnsWithActions },
  globals: { theme: 'dark' },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(document.documentElement).toHaveClass('dark');
    await expect(bodyRows(canvasElement)).toHaveLength(10);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search people' }), 'admin');
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(2));
  },
};

export const ServerPagination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The server holds the rows. The table shows `data` as the current page, counts pages from `rowCount`, and asks for another page with `onPaginationChange`. A new search asks for the first page.',
      },
    },
  },
  render: () => <ServerTable />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const next = canvas.getByRole('button', { name: 'Next' });
    await expect(canvas.getByText('Page 1 of 3')).toBeVisible();
    await expect(bodyRows(canvasElement)).toHaveLength(5);

    await userEvent.click(next);
    await expect(onServerPagination).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 5 });
    await expect(canvas.getByText('Page 2 of 3')).toBeVisible();
    await expect(firstCellTexts(canvasElement)[0]).toBe('Margaret Hamilton');

    await userEvent.click(next);
    await expect(canvas.getByText('Page 3 of 3')).toBeVisible();
    await expect(bodyRows(canvasElement)).toHaveLength(2);
    await expect(next).toBeDisabled();

    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search people' }), 'member');
    await expect(onServerSearch).toHaveBeenLastCalledWith('member');
    await waitFor(() =>
      expect(canvas.getByTestId('server-state')).toHaveTextContent('page=0 search=member'),
    );
    await expect(canvas.getByText('Page 1 of 2')).toBeVisible();
  },
};

export const ServerLoading: Story = {
  args: {
    data: people.slice(0, 5),
    rowCount: 12,
    pagination: { pageIndex: 1, pageSize: 5 },
    onPaginationChange: fn(),
    loading: true,
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    await expect(bodyRows(canvasElement)).toHaveLength(5);
    await expect(canvas.getByText('Page 2 of 3')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
  },
};

export const ControlledSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The page owns the search text with `searchValue` and `onSearchChange`. Without `rowCount`, the table still filters the rows in the browser.',
      },
    },
  },
  render: function Render(args) {
    const [search, setSearch] = useState('grace');
    return <DataTable {...args} searchValue={search} onSearchChange={setSearch} />;
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const search = canvas.getByRole('searchbox', { name: 'Search people' });
    await expect(search).toHaveValue('grace');
    await expect(bodyRows(canvasElement)).toHaveLength(1);
    await userEvent.clear(search);
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(10));
  },
};
