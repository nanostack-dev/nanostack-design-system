import { ArrowRightIcon, DotsThreeIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, screen } from 'storybook/test';

import { Inline } from '@/layout/inline';
import { Stack } from '@/layout/stack';
import { DesignSystemProvider, type LinkComponentProps } from '@/provider';

import { Button, ButtonLink, IconButton, type ButtonTone, type ButtonVariant } from './button';

const variants: ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost'];
const tones: ButtonTone[] = ['neutral', 'brand', 'critical'];
const sizes = ['xs', 'sm', 'md', 'lg'] as const;

const usage = `
Starts an action. For navigation use \`ButtonLink\`. For an action with only an icon use \`IconButton\`.

The props are the whole API. \`Button\` does not accept \`className\` or \`style\`: a look that no prop gives is a request to the design system.

## variant: how loud the button is

| Value | Use it for |
| --- | --- |
| \`solid\` | The main action of a surface. Use one per surface, with \`tone="brand"\`. |
| \`soft\` | A secondary action that must still stand out, such as a toolbar action or an action on a card. |
| \`outline\` | The default. Any other action, for example Cancel, Export, or Filters. |
| \`ghost\` | An action in a dense place: a table row, a menu trigger, a panel header. |

## tone: what the button means

| Value | Use it for |
| --- | --- |
| \`neutral\` | The default. An action with no special meaning. |
| \`brand\` | The action the surface exists for: Create, Save, Run. |
| \`critical\` | An action that deletes or cannot be undone. Use \`soft\` or \`ghost\` in a list, and \`solid\` only in the confirmation dialog. |

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`xs\` | 24 px | Inside a table row, a chip, or a dense toolbar. |
| \`sm\` | 32 px | Toolbars, card actions, and panel headers. |
| \`md\` | 36 px | The default. Forms and page actions. |
| \`lg\` | 40 px | A single main action on an empty state or a sign-in page. |

## Other props

- \`icon\` and \`iconPosition\`: a Phosphor icon, sized by \`size\`. Put an arrow at the \`end\`, anything else at the \`start\`.
- \`loading\`: shows a spinner, keeps focus, and blocks clicks. Keep the label, so the width does not jump.
- \`width="fill"\`: the button fills its container, for example in a narrow form or a mobile sheet.
- \`bleed\`: for a \`ghost\` button, the text lines up with the content edge instead of the padding edge. Use it for a table header or a row of text links.

## Do not

- Do not put two \`solid brand\` buttons on one surface.
- Do not use \`critical\` for Cancel or Close.
- Do not put a \`Button\` in a paragraph as a link. Use \`TextLink\`.
`;

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { docs: { description: { component: usage } } },
  args: { children: 'Save changes', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: variants },
    tone: { control: 'select', options: tones },
    size: { control: 'select', options: sizes },
    width: { control: 'select', options: ['auto', 'fill'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const VariantsAndTones: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Every `variant` with every `tone`. Rows are tones, columns are variants.',
      },
    },
  },
  render: (args) => (
    <Stack space="sm">
      {tones.map((tone) => (
        <Inline key={tone} space="sm">
          {variants.map((variant) => (
            <Button key={variant} {...args} variant={variant} tone={tone}>
              {`${variant} ${tone}`}
            </Button>
          ))}
        </Inline>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    for (const tone of tones) {
      for (const variant of variants) {
        await expect(canvas.getByRole('button', { name: `${variant} ${tone}` })).toBeVisible();
      }
    }
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Inline space="sm">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) => canvas.getByRole('button', { name: size }).getBoundingClientRect().height,
    );
    await expect(heights).toEqual([24, 32, 36, 40]);
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Inline space="sm">
      <Button {...args} variant="solid" tone="brand" icon={PlusIcon}>
        New project
      </Button>
      <Button {...args} icon={ArrowRightIcon} iconPosition="end">
        Continue
      </Button>
    </Inline>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'New project' });
    await expect(button.querySelector('[data-icon="inline-start"]')).not.toBeNull();
  },
};

export const Loading: Story = {
  args: { loading: true, variant: 'solid', tone: 'brand' },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save changes' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    button.click();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const FillWidth: Story = {
  args: { width: 'fill', variant: 'solid', tone: 'brand' },
  render: (args) => (
    <div className="w-72">
      <Button {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button').getBoundingClientRect().width).toBe(288);
  },
};

export const Bleed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'With `bleed`, the text of a ghost button lines up with the text above it.',
      },
    },
  },
  render: (args) => (
    <Stack space="xs" align="start">
      <span className="text-sm text-muted-foreground">Name</span>
      <Button {...args} variant="ghost" size="sm" bleed>
        Sort by name
      </Button>
    </Stack>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText('Name').getBoundingClientRect().left;
    const button = canvas.getByRole('button', { name: 'Sort by name' });
    const text =
      button.getBoundingClientRect().left + parseFloat(getComputedStyle(button).paddingLeft);
    await expect(Math.abs(text - label)).toBeLessThan(1);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Save changes' });
    await expect(button).toBeDisabled();
    button.click();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Keyboard: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Save changes' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const CriticalOnMutedSurface: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Critical text uses `--destructive-on-tint`, so a small button passes WCAG AA on a muted surface as well as on the page.',
      },
    },
  },
  args: { variant: 'soft', tone: 'critical', size: 'xs', children: 'Delete' },
  render: (args) => (
    <div className="rounded-xl bg-muted p-4">
      <Inline space="sm">
        <Button {...args} />
        <Button {...args} size="sm" variant="ghost" />
      </Inline>
    </div>
  ),
  play: async ({ canvas }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Delete' });
    await expect(button).toHaveClass('text-destructive-on-tint');
  },
};

export const IconButtons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`IconButton` needs a `label`. It becomes the accessible name and the tooltip. The default variant is `ghost`. Set `tooltip={false}` when the button is a menu trigger that already names itself.',
      },
    },
  },
  render: () => (
    <Inline space="sm">
      <IconButton icon={DotsThreeIcon} label="More actions" />
      <IconButton icon={PlusIcon} label="Add step" variant="outline" size="sm" />
      <IconButton icon={TrashIcon} label="Delete request" tone="critical" size="xs" />
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Add step' });
    await userEvent.hover(button);
    await waitFor(() =>
      expect(
        screen.getByText('Add step', { selector: '[data-slot=tooltip-content]' }),
      ).toBeVisible(),
    );
  },
};

function StoryLink({ href, ref, ...props }: LinkComponentProps) {
  return <a ref={ref} href={href} data-router-link="" {...props} />;
}

export const Links: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`ButtonLink` looks like a button and navigates. It renders the `linkComponent` of `DesignSystemProvider`, so the product router handles the click.',
      },
    },
  },
  render: () => (
    <DesignSystemProvider linkComponent={StoryLink}>
      <Inline space="sm">
        <ButtonLink href="#flows" variant="solid" tone="brand">
          Open flows
        </ButtonLink>
        <ButtonLink href="#docs" icon={ArrowRightIcon} iconPosition="end">
          Read the docs
        </ButtonLink>
      </Inline>
    </DesignSystemProvider>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Open flows' });
    await expect(link).toHaveAttribute('href', '#flows');
    await expect(link).toHaveAttribute('data-router-link');
  },
};
