import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { Box } from '@/layout/box';

import { DataTableFrame } from './index';

const usage = `
The bordered surface around a data table: its toolbar, the table and its footer. \`DataTable\` draws its table in it. A product that runs its own table engine (Anchor keeps TanStack Table v8 for server pagination, selection and bulk actions) wraps its own toolbar, \`Table\` and footer in \`DataTableFrame\`, so every table frame looks the same. Under the glass material the frame is the data surface and the \`Table\` inside it does not draw a second one.

## as

| Value | Use it for |
| --- | --- |
| div | The default frame. |
| section | A frame that is a landmark region; give it \`aria-label\` or \`aria-labelledby\`. |
| fieldset | A frame whose controls must all turn off together, with \`disabled\`, for example while a bulk action runs. |

## disabled

Turns off every control inside. It applies only with \`as="fieldset"\`.

## aria-label, aria-labelledby, aria-busy

Name the frame when it is a \`section\`, and mark it busy while its rows reload.

## Do not

- Do not put a \`Card\` or another bordered frame inside or around it: one surface per region.
- Do not draw your own bordered, rounded wrapper around a \`Table\`; use this frame.
- Do not add custom classes, CSS or styles to change the frame.
`;

const meta = {
  title: 'Blocks/DataTableFrame',
  component: DataTableFrame,
  parameters: { docs: { description: { component: usage } } },
  args: { children: null },
} satisfies Meta<typeof DataTableFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { name: 'Production backend', prefix: 'ak_live_7Hq2', status: 'Active' },
  { name: 'CI pipeline', prefix: 'ak_live_P0x9', status: 'Active' },
  { name: 'Legacy import', prefix: 'ak_live_Qa4X', status: 'Revoked' },
];

function KeysTable({ items }: { items: { name: string; prefix: string; status: string }[] }) {
  return (
    <Table aria-label="API keys">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Prefix</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableEmpty colSpan={3}>No API keys yet.</TableEmpty>
        ) : (
          items.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.prefix}</TableCell>
              <TableCell>
                <Badge tone={row.status === 'Active' ? 'success' : 'critical'}>{row.status}</Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

function Toolbar() {
  return (
    <Box className="flex flex-wrap items-center gap-2 border-b p-4">
      <Box className="min-w-0 max-w-sm flex-[1_1_12rem]">
        <Input aria-label="Search keys" placeholder="Search keys" />
      </Box>
      <Button variant="outline">Columns</Button>
    </Box>
  );
}

function Footer({ count }: { count: number }) {
  return (
    <Box className="flex items-center justify-between gap-2 border-t p-3 text-sm text-muted-foreground">
      <span>{count} total</span>
      <Button variant="ghost" size="sm" disabled>
        Next
      </Button>
    </Box>
  );
}

export const Default: Story = {
  render: () => (
    <Box className="max-w-3xl p-6">
      <DataTableFrame>
        <Toolbar />
        <KeysTable items={rows} />
        <Footer count={rows.length} />
      </DataTableFrame>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector<HTMLElement>('[data-slot=data-table-frame]');
    await expect(frame).not.toBeNull();
  },
};

export const One: Story = {
  render: () => (
    <Box className="max-w-3xl p-6">
      <DataTableFrame>
        <KeysTable items={rows.slice(0, 1)} />
      </DataTableFrame>
    </Box>
  ),
};

export const Empty: Story = {
  render: () => (
    <Box className="max-w-3xl p-6">
      <DataTableFrame>
        <Toolbar />
        <KeysTable items={[]} />
        <Footer count={0} />
      </DataTableFrame>
    </Box>
  ),
};

export const WorstCase: Story = {
  render: () => (
    <Box className="max-w-3xl p-6">
      <DataTableFrame as="section" aria-label="API keys with long names" aria-busy>
        <Toolbar />
        <KeysTable
          items={[
            {
              name: 'Northwind Enterprise customer identity production backend key',
              prefix: 'ak_live_7Hq2',
              status: 'Active',
            },
            { name: '日本市場の顧客認証基盤 🛡️', prefix: 'ak_test_m41K', status: 'Revoked' },
            { name: 'A', prefix: 'ak_live_P0x9', status: 'Active' },
          ]}
        />
        <Footer count={1048576} />
      </DataTableFrame>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'API keys with long names' });
    await expect(region).toHaveAttribute('aria-busy', 'true');
    // The frame keeps its width: nothing spills past its rounded corners.
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
  },
};

export const DisabledFieldset: Story = {
  render: () => (
    <Box className="max-w-3xl p-6">
      <DataTableFrame as="fieldset" disabled>
        <Toolbar />
        <KeysTable items={rows} />
        <Footer count={rows.length} />
      </DataTableFrame>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const search = within(canvasElement).getByRole('textbox', { name: 'Search keys' });
    await expect(search).toBeDisabled();
    await expect(within(canvasElement).getByRole('button', { name: 'Columns' })).toBeDisabled();
  },
};
