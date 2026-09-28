import { CaretUpDownIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { IconButton } from '@/components/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible';
import { Spread } from '@/layout/spread';
import { Stack } from '@/layout/stack';

const usage = `
A section that shows or hides its content. Use it for optional details that most users do not need, and for a group of links in a navigation sidebar. For a list of sections of the same kind, use \`Accordion\`.

\`Collapsible\` has no look props. Put a \`Button\` or an \`IconButton\` in \`CollapsibleTrigger\` with \`render\`, and put the content in \`CollapsibleContent\`.

## Motion

\`CollapsibleContent\` animates its height and opacity when it opens and closes: 200 ms on \`--ease-in-out\`. Under reduced motion it takes 120 ms. The panel does not snap. Products add no CSS for it.

## Behaviour props

- \`defaultOpen\`, or \`open\` with \`onOpenChange\`: the open state.
- \`disabled\` on \`Collapsible\`: the trigger stays visible but does not open the panel.
- \`CollapsibleTrigger render={…}\`: the element that toggles the panel. It gets \`aria-expanded\` and \`data-panel-open\`.

## Do not

- Do not hide an error or a required field in a closed section.
- Do not add your own height transition. The panel already has one.
- Do not use a collapsible for navigation between pages. Use links.
`;

const meta = {
  title: 'Components/Collapsible',
  parameters: { docs: { description: { component: usage } } },
  component: Collapsible,
  args: { onOpenChange: fn() },
  render: (args) => (
    <div className="w-72">
      <Collapsible {...args}>
        <Stack space="sm">
          <Spread>
            <span className="text-sm font-medium">Three starred repositories</span>
            <CollapsibleTrigger
              render={
                <IconButton
                  icon={CaretUpDownIcon}
                  label="Show repositories"
                  size="sm"
                  tooltip={false}
                />
              }
            />
          </Spread>
          <div className="rounded-md border px-4 py-2 text-sm">design-system</div>
          <CollapsibleContent>
            <Stack space="sm">
              <div className="rounded-md border px-4 py-2 text-sm">anchor</div>
              <div className="rounded-md border px-4 py-2 text-sm">echopoint</div>
            </Stack>
          </CollapsibleContent>
        </Stack>
      </Collapsible>
    </div>
  ),
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Show repositories' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('anchor')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(canvas.getByText('anchor')).toBeVisible());
    await expect(args.onOpenChange).toHaveBeenCalledWith(true, expect.anything());

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(canvas.queryByText('anchor')).not.toBeInTheDocument());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Show repositories' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const DefaultOpen: Story = {
  args: { defaultOpen: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Show repositories' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByText('echopoint')).toBeVisible();
  },
};

export const AnimatedHeight: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The panel grows from 0 to its measured height, then shrinks back when it closes. The product adds no CSS.',
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show repositories' }));
    const panel = await waitFor(() => {
      const element = canvasElement.querySelector<HTMLElement>('[data-slot="collapsible-content"]');
      expect(element).not.toBeNull();
      return element!;
    });
    const { transitionProperty, transitionDuration } = getComputedStyle(panel);
    await expect(transitionProperty).toBe('height, opacity');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    await expect(transitionDuration).toBe(reducedMotion ? '0.12s' : '0.2s, 0.16s');
    await waitFor(() => expect(panel.getBoundingClientRect().height).toBeGreaterThan(40));
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Show repositories' });
    await expect(trigger).toHaveAttribute('aria-disabled', 'true');
    trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
