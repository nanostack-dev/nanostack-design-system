import { CaretDownIcon, CaretRightIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment, useState } from 'react';
import { expect, within } from 'storybook/test';

import { Badge } from '@/components/badge';
import { IconButton } from '@/components/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { TextLink } from '@/components/text-link';

const invoices = [
  { id: 'INV-001', status: 'Paid', method: 'Card', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', method: 'Transfer', amount: '$1,150.00' },
  { id: 'INV-003', status: 'Unpaid', method: 'Card', amount: '$35.00' },
];

const usage = `
The parts of an HTML table with the system style. Use it for static data that the user reads in columns. For sort, search and pages, use the \`DataTable\` block. For a list with one main line per row, use \`Item\`.

The props are the whole API. The parts do not accept \`className\` or \`style\`. Cells do not wrap: a wide table scrolls sideways in its container.

## align (TableHead and TableCell)

| Value | Use it for |
| --- | --- |
| \`start\` | The default. Text, names, identifiers, dates. |
| \`center\` | A column of icons or checkboxes. |
| \`end\` | Amounts, counts, and the actions column. Give the header the same \`align\` as its cells. |

## numeric (TableCell)

Set \`numeric\` on a cell with a number that people compare down the column: an amount, a count, a duration. The digits get the same width, and the cell aligns to the end.

## tone (TableCell)

| Value | Use it for |
| --- | --- |
| \`default\` | The default. The data the row is about. |
| \`muted\` | Secondary data such as a timestamp, a trigger, or a duration. |

## font (TableCell)

| Value | Use it for |
| --- | --- |
| \`sans\` | The default. |
| \`mono\` | An identifier, a hash, or a path. The text is extra small, so it lines up with the sans text. |

## width (TableHead)

| Value | Use it for |
| --- | --- |
| \`auto\` | The default. The browser shares the width by content. |
| \`min\` | A column that is only as wide as its content: an expand caret, a checkbox, a row menu. |

## Other parts

- \`TableEmpty\` is a row with one cell across \`colSpan\` columns, for "No results". It centres and wraps its text.
- \`TableCaption\` names the table. \`side="top"\` puts it above the table, where it also serves as a title.
- A \`TableRow\` with \`onClick\` shows a pointer. Also put a real button in the row, so that a keyboard user can reach the action.

## Do not

- Do not set column widths with classes. Let the content set them, or use \`width="min"\`.
- Do not colour a cell to show a status. Put a \`Badge\` in it.
- Do not put a paragraph in a cell. Show a summary and open the detail in a sheet.
`;

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'padded', docs: { description: { component: usage } } },
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
          <TableHead align="end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell font="mono">{invoice.id}</TableCell>
            <TableCell>
              <Badge>{invoice.status}</Badge>
            </TableCell>
            <TableCell tone="muted">{invoice.method}</TableCell>
            <TableCell numeric>{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell numeric>$1,435.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Recent invoices.' });
    await expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    await expect(within(table).getAllByRole('row')).toHaveLength(5);
    const amount = within(table).getByRole('cell', { name: '$1,150.00' });
    await expect(getComputedStyle(amount).textAlign).toBe('end');
    await expect(getComputedStyle(amount).fontVariantNumeric).toBe('tabular-nums');
    await expect(
      getComputedStyle(within(table).getByRole('columnheader', { name: 'Amount' })).textAlign,
    ).toBe('end');
  },
};

export const Empty: Story = {
  parameters: {
    docs: { description: { story: '`TableEmpty` replaces a hand-made full-width cell.' } },
  },
  render: (args) => (
    <Table {...args}>
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead align="end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={2}>No invoices yet.</TableEmpty>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const cell = canvas.getByRole('cell', { name: 'No invoices yet.' });
    await expect(cell).toHaveAttribute('colspan', '2');
    await expect(getComputedStyle(cell).textAlign).toBe('center');
  },
};

function ExpandableRuns() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <Table>
      <TableCaption side="top">Schedule runs</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead width="min">
            <span className="sr-only">Details</span>
          </TableHead>
          <TableHead>Run</TableHead>
          <TableHead>Started</TableHead>
          <TableHead align="end">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { id: 'run_01', started: '09:00', duration: '12 s' },
          { id: 'run_02', started: '10:00', duration: '1 min 4 s' },
        ].map((run) => {
          const isExpanded = expanded === run.id;
          return (
            <Fragment key={run.id}>
              <TableRow onClick={() => setExpanded(isExpanded ? null : run.id)}>
                <TableCell>
                  <IconButton
                    size="xs"
                    icon={isExpanded ? CaretDownIcon : CaretRightIcon}
                    label={isExpanded ? `Hide ${run.id}` : `Show ${run.id}`}
                    aria-expanded={isExpanded}
                    tooltip={false}
                  />
                </TableCell>
                <TableCell font="mono">{run.id}</TableCell>
                <TableCell tone="muted">{run.started}</TableCell>
                <TableCell numeric tone="muted">
                  {run.duration}
                </TableCell>
              </TableRow>
              {isExpanded ? (
                <TableRow>
                  <TableCell />
                  <TableCell colSpan={3} tone="muted">{`${run.id} passed every step.`}</TableCell>
                </TableRow>
              ) : null}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

export const ClickableRows: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A row with `onClick` shows a pointer. The caret button gives keyboard users the same action. `width="min"` keeps the caret column narrow, and the caption sits on top.',
      },
    },
  },
  render: () => <ExpandableRuns />,
  play: async ({ canvas, userEvent }) => {
    const table = canvas.getByRole('table', { name: 'Schedule runs' });
    const row = within(table).getAllByRole('row')[1];
    await expect(getComputedStyle(row).cursor).toBe('pointer');
    const caretHeader = within(table).getAllByRole('columnheader')[0];
    await expect(caretHeader.getBoundingClientRect().width).toBeLessThan(60);
    await userEvent.click(canvas.getByRole('button', { name: 'Show run_01' }));
    await expect(canvas.getByText('run_01 passed every step.')).toBeVisible();
    await userEvent.click(canvas.getByRole('cell', { name: 'run_01' }));
    await expect(canvas.queryByText('run_01 passed every step.')).toBeNull();
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
              <TextLink href="#inv-001">INV-001</TextLink>
            </TableCell>
            <TableCell>Annual subscription for the analytics workspace</TableCell>
            <TableCell>Operations team</TableCell>
            <TableCell>Europe West</TableCell>
            <TableCell tone="muted">12 September 2026</TableCell>
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
