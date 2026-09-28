import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Badge } from '@/components/badge';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

const invoices = [
  { id: 'INV-001', status: 'Paid', method: 'Card', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', method: 'Transfer', amount: '$150.00' },
  { id: 'INV-003', status: 'Unpaid', method: 'Card', amount: '$350.00' },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge variant="secondary">{invoice.status}</Badge>
            </TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Recent invoices.' });
    await expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    await expect(within(table).getAllByRole('row')).toHaveLength(5);
    await expect(within(table).getByRole('cell', { name: 'INV-002' })).toBeVisible();
  },
};

export const Empty: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
            No invoices yet.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('cell', { name: 'No invoices yet.' })).toBeVisible();
  },
};

export const LongContent: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Table {...args}>
        <TableCaption>Wide table in a narrow container.</TableCaption>
        <TableHeader>
          <TableRow>
            {['Identifier', 'Description', 'Owner', 'Region', 'Updated'].map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <a className="underline underline-offset-4" href="#inv-001">
                INV-001
              </a>
            </TableCell>
            <TableCell>Annual subscription for the analytics workspace</TableCell>
            <TableCell>Operations team</TableCell>
            <TableCell>Europe West</TableCell>
            <TableCell>12 September 2026</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector<HTMLElement>('[data-slot="table-container"]');
    await expect(container).not.toBeNull();
    await expect(container!.scrollWidth).toBeGreaterThan(container!.clientWidth);
    await expect(getComputedStyle(container!).overflowX).toBe('auto');
  },
};
