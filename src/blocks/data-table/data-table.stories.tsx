import { DotsThreeIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Badge, type BadgeVariant } from '@/components/badge';
import { Button, IconButton } from '@/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

import { DataTable, DataTableColumnHeader, type ColumnDef } from './data-table';

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

const statusVariant: Record<Person['status'], BadgeVariant> = {
  Active: 'success',
  Invited: 'info',
  Suspended: 'secondary',
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
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
  },
];

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
    docs: {
      description: {
        component:
          'A table with sort, search, pages, a loading state and an empty state, built on TanStack Table. Use it for lists of records that the user searches and sorts.',
      },
    },
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
      <div className="flex flex-col items-center gap-2">
        <span>No people yet.</span>
        <Button variant="solid" tone="brand" size="sm">
          <PlusIcon data-icon="inline-start" aria-hidden="true" />
          Invite people
        </Button>
      </div>
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
