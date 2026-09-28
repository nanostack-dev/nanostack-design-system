import { CheckCircleIcon, CircleNotchIcon, XCircleIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';

import { Badge, type BadgeSize, type BadgeTone, type BadgeVariant } from '@/components/badge';
import { Inline } from '@/layout/inline';
import { Stack } from '@/layout/stack';

const variants: BadgeVariant[] = ['solid', 'soft', 'outline'];
const tones: BadgeTone[] = ['neutral', 'brand', 'critical', 'success', 'warning', 'info'];
const sizes: BadgeSize[] = ['md', 'lg'];

const usage = `
A short label for a status, a count or a category. Put it next to the thing it describes. For an action, use \`Button\`.

The props are the whole API. \`Badge\` does not accept \`className\` or \`style\`.

## variant: how loud the badge is

| Value | Use it for |
| --- | --- |
| \`soft\` | The default. A status or a category in a list, a table row or a header. |
| \`outline\` | A quiet label that must not compete with the content: a permission, a version, a tag in a dense list. |
| \`solid\` | A count or a label that must catch the eye, such as "New". Use one per surface. |

## tone: what the badge means

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. A category or a state with no special meaning: Draft, Paused, a tag. |
| \`brand\` | A state the product highlights: Live, Running, Current. |
| \`critical\` | A failure or a state that needs action: Failed, Revoked, Expired. |
| \`success\` | A healthy or finished state: Active, Passed, Delivered. |
| \`warning\` | A state that can become a problem: Degraded, Expiring soon. |
| \`info\` | Neutral news: Invited, Scheduled, Beta. |

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`md\` | 20 px | The default. Inside table rows, lists and next to a title. |
| \`lg\` | 24 px | A badge that stands alone: a page header, a card header, the summary of a detail page. |

## Other props

- \`icon\`: a Phosphor icon before the text, such as a status icon. The icon is decorative, so the text must carry the meaning.

## Do not

- Do not change the radius, padding or text size of a badge. Choose \`size\` instead.
- Do not make an uppercase "eyebrow" label with a badge. Use \`Text\` with \`size="xs"\` and \`tone="muted"\`.
- Do not use colour alone to show a status. Keep a word such as "Failed" in the badge.
- Do not use a badge as a button or a link.
`;

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { docs: { description: { component: usage } } },
  args: { children: 'Active' },
  argTypes: {
    variant: { control: 'select', options: variants },
    tone: { control: 'select', options: tones },
    size: { control: 'select', options: sizes },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Active');
    await expect(badge).toHaveAttribute('data-slot', 'badge');
    await expect(badge).toHaveAttribute('data-variant', 'soft');
    await expect(badge).toHaveAttribute('data-tone', 'neutral');
    await expect(badge.getBoundingClientRect().height).toBe(20);
  },
};

export const VariantsAndTones: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Every `variant` with every `tone`. Rows are tones, columns are variants. The brand colour is also the info colour in light mode and the success colour in dark mode, so a `brand` badge can match one of them. Use `brand` for a product highlight, not for a status.',
      },
    },
  },
  render: (args) => (
    <Stack space="sm">
      {tones.map((tone) => (
        <Inline key={tone} space="sm">
          {variants.map((variant) => (
            <Badge key={variant} {...args} variant={variant} tone={tone}>
              {`${variant} ${tone}`}
            </Badge>
          ))}
        </Inline>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    const lookOf = (name: string) => {
      const style = getComputedStyle(canvas.getByText(name));
      return `${style.color} ${style.backgroundColor} ${style.borderColor}`;
    };
    const statusTones = tones.filter((tone) => tone !== 'neutral' && tone !== 'brand');
    for (const variant of variants) {
      const statusLooks = statusTones.map((tone) => lookOf(`${variant} ${tone}`));
      await expect(new Set(statusLooks).size).toBe(statusTones.length);
      for (const tone of tones.filter((tone) => tone !== 'neutral')) {
        await expect(lookOf(`${variant} ${tone}`)).not.toBe(lookOf(`${variant} neutral`));
      }
    }
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`lg` replaces the pill padding (`rounded-full px-3 py-1`) that Echopoint set by hand on standalone badges.',
      },
    },
  },
  render: (args) => (
    <Inline space="sm" alignY="center">
      {sizes.map((size) => (
        <Badge key={size} {...args} size={size}>
          {size}
        </Badge>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map((size) => canvas.getByText(size).getBoundingClientRect().height);
    await expect(heights).toEqual([20, 24]);
  },
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A status badge. The icon is hidden from assistive technology, the word stays.',
      },
    },
  },
  render: (args) => (
    <Inline space="sm">
      <Badge {...args} tone="success" icon={CheckCircleIcon}>
        Passed
      </Badge>
      <Badge {...args} tone="brand" icon={CircleNotchIcon}>
        Running
      </Badge>
      <Badge {...args} tone="critical" icon={XCircleIcon}>
        Failed
      </Badge>
    </Inline>
  ),
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Passed');
    await expect(badge.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(badge.querySelector('[data-icon="inline-start"]')).not.toBeNull();
  },
};

export const LongContent: Story = {
  args: { children: 'Waiting for the approval of the workspace owner' },
  render: (args) => (
    <div className="w-40">
      <Badge {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const badge = canvas.getByText('Waiting for the approval of the workspace owner');
    await expect(badge.getBoundingClientRect().height).toBe(20);
  },
};
