import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Button } from '@/components/button';
import { Spinner, type SpinnerSize } from '@/components/spinner';
import { Text } from '@/components/text';
import { Inline } from '@/layout/inline';

const sizes: SpinnerSize[] = ['sm', 'md', 'lg'];

const usage = `
An animated icon for work in progress when you do not know how long it takes. When you know the total, use \`Progress\`. For content that loads into a known shape, use \`Skeleton\`. For a button that waits, use \`Button loading\`: it has its own spinner.

The props are the whole API. \`Spinner\` does not accept \`className\` or \`style\`. It takes the colour of the text around it.

## size

| Value | Size | Use it for |
| --- | --- | --- |
| \`sm\` | 12 px | Next to extra-small text, or inside a \`Badge\` or an extra-small control. |
| \`md\` | 16 px | The default. Next to body text, inside a menu item, a field or a button. |
| \`lg\` | 24 px | Alone in an empty panel or a card that loads. |

## Other props

- \`aria-label\`: the name that assistive technology reads. The default is "Loading". Say what loads, such as "Loading results".
- \`aria-hidden\`: set it when text next to the spinner already says that something loads, such as "Saving".

## Do not

- Do not resize the spinner. Choose \`size\`.
- Do not show two spinners for the same wait.
`;

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: { docs: { description: { component: usage } } },
  args: { size: 'md' },
  argTypes: { size: { control: 'select', options: sizes } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const spinner = canvas.getByRole('status', { name: 'Loading' });
    await expect(getComputedStyle(spinner).animationName).not.toBe('none');
    await expect(spinner.getBoundingClientRect().width).toBe(16);
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Inline space="md" alignY="center">
      {sizes.map((size) => (
        <Spinner key={size} {...args} size={size} aria-label={`Loading ${size}`} />
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const widths = sizes.map(
      (size) =>
        canvas.getByRole('status', { name: `Loading ${size}` }).getBoundingClientRect().width,
    );
    await expect(widths).toEqual([12, 16, 24]);
  },
};

export const CustomLabel: Story = {
  args: { 'aria-label': 'Loading results', size: 'lg' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Loading results' })).toBeVisible();
  },
};

export const NextToText: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The text says what happens, so the spinner is hidden from assistive technology.',
      },
    },
  },
  render: (args) => (
    <Inline space="xs" alignY="center">
      <Spinner {...args} aria-hidden />
      <Text tone="muted">Syncing the collection</Text>
    </Inline>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('status')).toBeNull();
    await expect(canvas.getByText('Syncing the collection')).toBeVisible();
  },
};

export const InButton: Story = {
  render: (args) => (
    <Button variant="solid" tone="brand" disabled>
      <Spinner {...args} data-icon="inline-start" />
      Saving
    </Button>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /Saving/ });
    await expect(button).toBeDisabled();
    await expect(canvas.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  },
};
