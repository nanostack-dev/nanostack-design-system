import { GraphIcon, ListBulletsIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsListProps,
  type TabsProps,
} from '@/components/tabs';

const usage = `
Tabs show one panel at a time for views of the same object, such as Overview and Settings. A \`TabsList\` without panels also works as a filter bar, for example the result types of a search palette. To switch between two or three values of a form field, use \`ToggleGroup\`. To move between pages, use links.

## size (on \`TabsList\`)

| Value | Use it for |
| --- | --- |
| \`md\` | The default. Tabs at the top of a page, a panel, or a sheet. |
| \`sm\` | A dense place: a filter bar in a command or search palette, a popover. |

## width (on \`TabsList\`)

| Value | Use it for |
| --- | --- |
| \`auto\` | The default. The list is as wide as its tabs. |
| \`fill\` | The list fills its container and the tabs share the width. Use it in a palette, a sheet, or a narrow screen. |

## Other props

- \`orientation="vertical"\` on \`Tabs\`: the tabs stack in a column beside the panel. Use it for a settings page with many sections.
- \`activateOnFocus\` on \`TabsList\`: an arrow key selects the tab, not only focuses it. Use it when a panel is cheap to show.
- \`disabled\` on \`TabsTrigger\`: the tab stays visible but cannot be selected.
- A \`TabsTrigger\` can hold a Phosphor icon with \`aria-hidden\` before its label, and a count after it.

## Do not

- Do not use tabs for steps that the user must do in order. Use a stepper or a form.
- Do not put more than about six tabs in a row. Use a \`Select\` or a vertical list.
- Do not restyle the list height, radius, or text size. Pick \`size\`.
`;

type AccountTabsProps = TabsProps & Pick<TabsListProps, 'size' | 'width' | 'activateOnFocus'>;

function AccountTabs({ size, width, activateOnFocus, ...props }: AccountTabsProps) {
  return (
    <Tabs {...props}>
      <TabsList size={size} width={width} activateOnFocus={activateOnFocus}>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Update your name and email address.</TabsContent>
      <TabsContent value="password">Change your password.</TabsContent>
      <TabsContent value="billing">Manage your plan.</TabsContent>
    </Tabs>
  );
}

async function expectPanel(canvasElement: HTMLElement, text: string) {
  await waitFor(() => {
    const panels = [...canvasElement.querySelectorAll('[role="tabpanel"]:not([inert])')];
    expect(panels).toHaveLength(1);
    expect(panels[0]).toHaveTextContent(text);
  });
}

const meta = {
  title: 'Components/Tabs',
  parameters: { docs: { description: { component: usage } } },
  component: Tabs,
  args: { defaultValue: 'account', onValueChange: fn() },
  render: (args) => (
    <div className="w-80">
      <AccountTabs {...args} />
    </div>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    await expect(canvas.getByRole('tab', { name: 'Account' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expectPanel(canvasElement, 'Update your name');

    await userEvent.click(canvas.getByRole('tab', { name: 'Password' }));
    await expect(canvas.getByRole('tab', { name: 'Password' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expectPanel(canvasElement, 'Change your password.');
    await expect(args.onValueChange).toHaveBeenCalledWith('password', expect.anything());
  },
};

export const Keyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tab moves focus to the selected tab, the arrow keys move between tabs, and Enter or Space selects. Tab again moves focus into the panel.',
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const account = canvas.getByRole('tab', { name: 'Account' });
    const password = canvas.getByRole('tab', { name: 'Password' });
    await userEvent.tab();
    await waitFor(() => expect(account).toHaveFocus());

    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(password).toHaveFocus());
    await expect(password).toHaveAttribute('aria-selected', 'false');

    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(password).toHaveAttribute('aria-selected', 'true'));
    await expectPanel(canvasElement, 'Change your password.');

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(account).toHaveFocus());
    await userEvent.keyboard(' ');
    await waitFor(() => expect(account).toHaveAttribute('aria-selected', 'true'));
    await expectPanel(canvasElement, 'Update your name');

    await userEvent.tab();
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveFocus());
  },
};

export const ActivateOnFocus: Story = {
  render: (args) => (
    <div className="w-80">
      <AccountTabs {...args} activateOnFocus />
    </div>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    const password = canvas.getByRole('tab', { name: 'Password' });
    await waitFor(() => expect(password).toHaveFocus());
    await expect(password).toHaveAttribute('aria-selected', 'true');
    await expectPanel(canvasElement, 'Change your password.');
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: '`md` is the default. `sm` is for a filter bar in a palette or a popover.',
      },
    },
  },
  render: (args) => (
    <div className="flex w-80 flex-col gap-6">
      <AccountTabs {...args} size="md" />
      <AccountTabs {...args} size="sm" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const lists = [...canvasElement.querySelectorAll<HTMLElement>('[data-slot="tabs-list"]')];
    await expect(lists.map((list) => list.getBoundingClientRect().height)).toEqual([36, 32]);
  },
};

export const FillWidth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With `width="fill"`, the list fills its container and the tabs share the width. The tabs here filter a palette and have no panels.',
      },
    },
  },
  args: { defaultValue: 'steps' },
  render: (args) => (
    <div className="w-96">
      <Tabs {...args}>
        <TabsList aria-label="Canvas view" width="fill" size="sm">
          <TabsTrigger value="steps">
            <ListBulletsIcon aria-hidden />
            Steps
          </TabsTrigger>
          <TabsTrigger value="graph">
            <GraphIcon aria-hidden />
            Graph
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const list = canvasElement.querySelector<HTMLElement>('[data-slot="tabs-list"]')!;
    await expect(list.getBoundingClientRect().width).toBe(384);
    const steps = canvas.getByRole('tab', { name: 'Steps' }).getBoundingClientRect().width;
    const graph = canvas.getByRole('tab', { name: 'Graph' }).getBoundingClientRect().width;
    await expect(Math.abs(steps - graph)).toBeLessThan(1);
  },
};

export const Disabled: Story = {
  play: async ({ canvas }) => {
    const billing = canvas.getByRole('tab', { name: 'Billing' });
    await expect(billing).toHaveAttribute('aria-disabled', 'true');
    await expect(getComputedStyle(billing).pointerEvents).toBe('none');
    billing.click();
    await expect(billing).toHaveAttribute('aria-selected', 'false');
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    const account = canvas.getByRole('tab', { name: 'Account' }).getBoundingClientRect();
    const password = canvas.getByRole('tab', { name: 'Password' }).getBoundingClientRect();
    await expect(password.top).toBeGreaterThanOrEqual(account.bottom);
  },
};
