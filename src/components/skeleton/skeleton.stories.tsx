import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Card, CardContent, CardHeader } from '@/components/card';
import { Skeleton, type SkeletonHeight, type SkeletonWidth } from '@/components/skeleton';
import { Columns, Column } from '@/layout/columns';
import { Stack } from '@/layout/stack';

const heights: SkeletonHeight[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const widths: SkeletonWidth[] = ['fill', '3/4', '1/2', '1/4'];

const usage = `
A placeholder in the shape of the content that loads next. Use it when you know the layout of the result. When you do not, use \`Spinner\`.

The props are the whole API. \`Skeleton\` does not accept \`className\` or \`style\`: its \`height\` says what it stands in for, and the system picks the radius. Put skeletons in a \`Stack\`, \`Inline\` or \`Columns\` to place them.

## height: what the skeleton stands in for

| Value | Height | Use it for |
| --- | --- | --- |
| \`xs\` | 12 px | A line of small text, such as a date or a caption. |
| \`sm\` | 16 px | The default. A line of body text, or a table cell. |
| \`md\` | 24 px | A heading, a badge, or an extra-small control. |
| \`lg\` | 40 px | A control, a field, or a row in a side list. |
| \`xl\` | 96 px | A list item with two lines, or a small tile. |
| \`xxl\` | 256 px | A card, a chart, or a panel. |
| \`fill\` | Its container | A column, a panel, a fixed-height box or a 28 px row: any place whose layout already sets the height. It has no minimum, so its container must have a height. |

## width

| Value | Use it for |
| --- | --- |
| \`fill\` | The default. A block, a row, or the first line of a paragraph. |
| \`3/4\` | A line that ends before the edge, such as the last line of a paragraph. |
| \`1/2\` | A title, or a short line. |
| \`1/4\` | A value, a date, or a badge. |

## Do not

- Do not size a skeleton with classes. Choose \`height\` and \`width\`.
- Do not use \`height="fill"\` in a container with no height. It then has no height either.
- Do not give each skeleton its own label. Put the group in an element with \`role="status"\` and an \`aria-label\`, such as "Loading runs". The skeletons are hidden from assistive technology.
- Do not animate a skeleton for more than a few seconds. Show an error or an empty state instead.
`;

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: { docs: { description: { component: usage } } },
  args: { height: 'sm', width: 'fill' },
  argTypes: {
    height: { control: 'select', options: [...heights, 'fill'] },
    width: { control: 'select', options: widths },
  },
  render: (args) => (
    <div className="w-72">
      <Skeleton {...args} />
    </div>
  ),
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector<HTMLElement>('[data-slot="skeleton"]')!;
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    await expect(getComputedStyle(skeleton).animationName).not.toBe('none');
    await expect(skeleton.getBoundingClientRect().height).toBe(16);
  },
};

export const Heights: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="w-72">
      <Stack space="md">
        {heights.map((height) => (
          <Skeleton key={height} height={height} data-testid={height} />
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const measured = heights.map(
      (height) => canvas.getByTestId(height).getBoundingClientRect().height,
    );
    await expect(measured).toEqual([12, 16, 24, 40, 96, 256]);
  },
};

export const Widths: Story = {
  render: () => (
    <div className="w-80">
      <Stack space="sm">
        {widths.map((width) => (
          <Skeleton key={width} width={width} data-testid={width} />
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const full = canvas.getByTestId('fill').getBoundingClientRect().width;
    await expect(canvas.getByTestId('1/2').getBoundingClientRect().width).toBe(full / 2);
    await expect(canvas.getByTestId('1/4').getBoundingClientRect().width).toBe(full / 4);
  },
};

export const LoadingCard: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A card while it loads: a title, two lines of text and a chart.',
      },
    },
  },
  render: () => (
    <div className="w-80" role="status" aria-label="Loading usage">
      <Card>
        <CardHeader>
          <Stack space="sm">
            <Skeleton height="md" width="1/2" />
            <Skeleton height="xs" width="3/4" />
          </Stack>
        </CardHeader>
        <CardContent>
          <Skeleton height="xl" />
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status', { name: 'Loading usage' });
    await expect(status.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(3);
  },
};

export const FillsItsColumn: Story = {
  parameters: {
    docs: {
      description: {
        story: '`height="fill"` takes the height that the layout gives, here a 200 px row.',
      },
    },
  },
  render: () => (
    <div className="grid h-50 w-96" role="status" aria-label="Loading workspace">
      <Columns space="md" alignY="stretch">
        <Column width="1/3">
          <Skeleton height="fill" data-testid="rail" />
        </Column>
        <Column>
          <Skeleton height="fill" />
        </Column>
      </Columns>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('rail').getBoundingClientRect().height).toBe(200);
  },
};

export const FillsARow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`height="fill"` has no minimum height, so it fits a 28 px table row or a fixed-height box as well as a column.',
      },
    },
  },
  render: () => (
    <div className="w-80" role="status" aria-label="Loading runs">
      <Stack space="sm">
        <div className="h-7">
          <Skeleton height="fill" data-testid="row" />
        </div>
        <div className="h-7">
          <Skeleton height="fill" width="3/4" />
        </div>
        <div className="h-16">
          <Skeleton height="fill" data-testid="box" />
        </div>
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('row').getBoundingClientRect().height).toBe(28);
    await expect(canvas.getByTestId('box').getBoundingClientRect().height).toBe(64);
  },
};
