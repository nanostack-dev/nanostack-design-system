import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Stack } from '@/layout/stack';

import { Text, type TextTone } from './text';

const tones: TextTone[] = ['default', 'muted', 'brand', 'critical', 'success', 'warning', 'info'];

const usage = `
All body text. It replaces \`text-*\`, \`font-*\` and colour classes on paragraphs and spans.

| Prop | Values | Use it for |
| --- | --- | --- |
| \`size\` | \`xs\` 12 px, \`sm\` 14 px (default), \`md\` 16 px, \`lg\` 18 px | \`xs\` for metadata and captions, \`sm\` for UI text, \`md\` for reading text, \`lg\` for a lead line. |
| \`tone\` | \`default\`, \`muted\`, \`brand\`, \`critical\`, \`success\`, \`warning\`, \`info\` | \`muted\` for secondary text. A status tone only when the text states that status. Status tones pass AA on a tint too. |
| \`weight\` | \`regular\` (default), \`medium\`, \`semibold\` | \`medium\` for a label or a name in a row. For a title use \`Heading\`. |
| \`font\` | \`sans\` (default), \`mono\` | \`mono\` for ids, URLs, keys, code and numbers you compare by column. |
| \`truncate\` | boolean | One line with an ellipsis, inside a width-limited parent. |
| \`tabular\` | boolean | Numbers that line up in a column. |
| \`as\` | \`p\` (default), \`span\`, \`div\`, \`label\`, \`dt\`, \`dd\`, \`figcaption\` | The element that carries the meaning. |
`;

const meta = {
  title: 'Components/Text',
  component: Text,
  parameters: { docs: { description: { component: usage } } },
  args: { children: 'Every execution. The issues that need you. One place.' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const text = canvas.getByText(/Every execution/);
    await expect(text.tagName).toBe('P');
    await expect(getComputedStyle(text).fontSize).toBe('14px');
  },
};

export const Tones: Story = {
  render: () => (
    <Stack space="xs">
      {tones.map((tone) => (
        <Text key={tone} tone={tone}>{`tone="${tone}"`}</Text>
      ))}
    </Stack>
  ),
};

export const Mono: Story = {
  args: { font: 'mono', size: 'xs', children: 'cus_9f2ka81m' },
};

export const Truncate: Story = {
  args: {
    truncate: true,
    children: 'https://hooks.echopoint.dev/webhooks/a-very-long-endpoint-id',
  },
  render: (args) => (
    <div className="w-48">
      <Text {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const text = canvas.getByText(/hooks.echopoint/);
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
  },
};
