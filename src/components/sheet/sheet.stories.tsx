import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
  type SheetSize,
} from '@/components/sheet';
import { Text } from '@/components/text';
import { Inline } from '@/layout/inline';

const sides: SheetSide[] = ['top', 'right', 'bottom', 'left'];
const sizes: { size: SheetSize; width: string }[] = [
  { size: 'sm', width: 'sm:max-w-xs' },
  { size: 'md', width: 'sm:max-w-sm' },
  { size: 'lg', width: 'sm:max-w-lg' },
  {
    size: 'xl',
    width:
      'sm:max-w-none sm:data-[side=left]:w-[min(100vw,clamp(52rem,65vw,84rem))] sm:data-[side=right]:w-[min(100vw,clamp(52rem,65vw,84rem))]',
  },
];
const onApply = fn();

const usage = `
A panel that slides over the page from one edge. Use it for a secondary task that keeps the page in view: filters, details, a list of folders on a phone. For a task that needs full attention, use \`Dialog\`. For a panel that closes with a swipe on a phone, use \`Drawer\`.

The parts are closed. \`SheetContent\` does not accept \`className\` or \`style\`: the edge comes from \`side\`, the width from \`size\`.

## side: where the sheet comes from

| Value | Use it for |
| --- | --- |
| \`right\` | The default. Details and edit forms for the item the user selected. |
| \`left\` | Navigation, such as a folder tree that the page hides on a small screen. |
| \`bottom\` | A detail view on a phone, under the list it belongs to. |
| \`top\` | A notice or a search that belongs to the whole page. Rare. |

## size: how wide a left or right sheet is

| Value | Width | Use it for |
| --- | --- | --- |
| \`sm\` | 320 px | A list or a tree: folders, chats. |
| \`md\` | 384 px | The default. Filters, details, a short form. |
| \`lg\` | 512 px | A history or a list whose rows carry detail, such as the versions of a flow. |
| \`xl\` | 65% of the screen, from 832 px to 1344 px | A report that needs room beside the page, such as a run report with a timeline. Under 832 px it takes the full width. |

On a phone, a left or right sheet takes three quarters of the screen. A top or bottom sheet takes the full width and at most 90% of the height. \`size\` has no effect on them.

## Height and scroll

The sheet body scrolls when the content is taller than the sheet. The close button stays in the corner.

## Other props

- \`SheetTrigger\` and \`SheetClose\` take \`render\`: \`<SheetTrigger render={<Button>Filters</Button>} />\`.
- \`SheetContent showCloseButton={false}\`: removes the close button, when the content has its own.
- \`SheetHeader visuallyHidden\`: hides the title and description on screen and keeps them for screen readers, when the content already shows what the sheet is.

## Do not

- Do not set a width, a height or a padding on the content. Choose \`side\` and \`size\`.
- Do not remove \`SheetTitle\`. Every sheet needs a name. Use \`SheetHeader visuallyHidden\` to hide it.
- Do not ask for a confirm in a sheet. Use \`AlertDialog\`.
`;

const meta = {
  title: 'Components/Sheet',
  parameters: { docs: { description: { component: usage } } },
  component: Sheet,
  args: { onOpenChange: fn() },
  beforeEach: () => {
    onApply.mockClear();
  },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>Filters</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list to the items that matter now.</SheetDescription>
        </SheetHeader>
        <fieldset className="flex flex-col gap-2 px-6 text-sm">
          <legend className="mb-2 font-medium">Status</legend>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked /> Active
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Archived
          </label>
        </fieldset>
        <SheetFooter>
          <SheetClose render={<Button variant="solid" tone="brand" onClick={onApply} />}>
            Apply filters
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await waitFor(() => expect(sheet).toBeVisible());
    await expect(sheet).toHaveAttribute('data-side', 'right');
    await expect(sheet).toHaveAttribute('data-size', 'md');
    await userEvent.click(within(sheet).getByRole('button', { name: 'Apply filters' }));
    await expect(onApply).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard(' ');
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await waitFor(() => expect(sheet).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const CloseButton: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    const sheet = await screen.findByRole('dialog', { name: 'Filters' });
    await userEvent.click(within(sheet).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(onApply).not.toHaveBeenCalled();
  },
};

export const Sides: Story = {
  render: (args) => (
    <Inline space="sm">
      {sides.map((side) => (
        <Sheet key={side} {...args}>
          <SheetTrigger render={<Button variant="outline" />}>Open {side}</SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Panel on the {side}</SheetTitle>
              <SheetDescription>The panel slides in from the {side} edge.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open left' }));
    const sheet = await screen.findByRole('dialog', { name: 'Panel on the left' });
    await waitFor(() => expect(sheet.getBoundingClientRect().left).toBe(0));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Open bottom' }));
    const bottom = await screen.findByRole('dialog', { name: 'Panel on the bottom' });
    await waitFor(() =>
      expect(Math.round(bottom.getBoundingClientRect().bottom)).toBe(window.innerHeight),
    );
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`sm` fits a list or a tree, such as folders. `md` is the default, for filters and details. `lg` fits a version history. `xl` fits a run report.',
      },
    },
  },
  render: (args) => (
    <Inline space="sm">
      {sizes.map(({ size }) => (
        <Sheet key={size} {...args}>
          <SheetTrigger render={<Button variant="outline" />}>Open {size}</SheetTrigger>
          <SheetContent side="left" size={size}>
            <SheetHeader>
              <SheetTitle>Folders {size}</SheetTitle>
              <SheetDescription>The width comes from the size prop.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </Inline>
  ),
  play: async ({ canvas, userEvent }) => {
    for (const { size, width } of sizes) {
      await userEvent.click(canvas.getByRole('button', { name: `Open ${size}` }));
      const sheet = await screen.findByRole('dialog', { name: `Folders ${size}` });
      await expect(sheet).toHaveAttribute('data-size', size);
      await expect(sheet).toHaveClass(width);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    }
  },
};

export const LongContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A bottom sheet with more content than fits. It stops at 90% of the screen height, and the body scrolls. The body joins the tab order only while it scrolls, so a keyboard user can scroll text that has no focusable element.',
      },
    },
  },
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>Run detail</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Run detail</SheetTitle>
          <SheetDescription>Every step of the run, in order.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-6 pb-6">
          {Array.from({ length: 30 }, (_, index) => (
            <Text key={index} tone="muted">
              Step {index + 1} finished in {40 + index} ms.
            </Text>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: 'Run detail' });
    await waitFor(() =>
      expect(sheet.getBoundingClientRect().height).toBeLessThanOrEqual(window.innerHeight * 0.9),
    );
    const body = sheet.querySelector<HTMLElement>('[data-slot="sheet-body"]')!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    await waitFor(() => expect(body).toHaveAttribute('tabindex', '0'));
  },
};

export const HiddenHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`SheetHeader visuallyHidden` names the sheet for screen readers when the content shows what it is, such as a list of chats.',
      },
    },
  },
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>Chats</SheetTrigger>
      <SheetContent side="left" size="sm">
        <SheetHeader visuallyHidden>
          <SheetTitle>Chats</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-6">
          <Text weight="medium">Chats</Text>
          <Text tone="muted">Flow review</Text>
          <Text tone="muted">Webhook retry</Text>
        </div>
      </SheetContent>
    </Sheet>
  ),
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: 'Chats' });
    const header = sheet.querySelector<HTMLElement>('[data-slot="sheet-header"]')!;
    await expect(header.getBoundingClientRect().width).toBeLessThanOrEqual(1);
  },
};

export const WideReport: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`size="xl"` gives a run report 65% of the screen, between 832 px and 1344 px, so the timeline and the step detail fit side by side. Under 832 px it takes the full width.',
      },
    },
  },
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>Run report</SheetTrigger>
      <SheetContent side="right" size="xl">
        <SheetHeader>
          <SheetTitle>Run report</SheetTitle>
          <SheetDescription>Run 482 failed at step 3 of 7.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-6 pb-6">
          {Array.from({ length: 7 }, (_, index) => (
            <Text key={index} tone="muted">
              Step {index + 1} finished in {120 + index * 15} ms.
            </Text>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
  play: async () => {
    const sheet = await screen.findByRole('dialog', { name: 'Run report' });
    await expect(sheet).toHaveAttribute('data-size', 'xl');
    const viewport = window.innerWidth;
    const expected =
      viewport >= 640
        ? Math.min(viewport, Math.min(Math.max(832, viewport * 0.65), 1344))
        : viewport * 0.75;
    await waitFor(() =>
      expect(Math.abs(sheet.getBoundingClientRect().width - expected)).toBeLessThan(1),
    );
  },
};
