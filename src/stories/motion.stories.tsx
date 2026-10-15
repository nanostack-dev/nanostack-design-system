import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, waitFor, within } from 'storybook/test';

import { Button } from '@/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/collapsible';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/drawer';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { Progress, ProgressLabel, ProgressValue } from '@/components/progress';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/sidebar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';
import { Switch } from '@/components/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/tabs';
import { Toaster, toast } from '@/components/toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/command';
import { DesignSystemProvider, type MotionPreference } from '@/provider';
import { useState } from 'react';

const usage = `
Motion explains an occasional state change. It never holds up a keyboard action or repeated work.

| Element | Duration | Use |
| --- | --- | --- |
| Micro interaction | 120 ms | Controls and hover feedback (100–150 ms) |
| Standard UI | 180 ms | Popups and disclosures (150–250 ms) |
| Modal or drawer | 240 ms | Occasional focused tasks (200–300 ms) |
| Page transition token | 350 ms | Product-owned navigation (300–400 ms) |

Routine UI stays below 300 ms. At 100+ encounters per day, use no animation. Tabs, command palettes, sidebar layout and live progress already change immediately.

### DesignSystemProvider motion

| Value | Use |
| --- | --- |
| auto | Default. Follow the device's reduced-motion preference. |
| reduced | Remove animated travel and scale; keep a 120 ms opacity cue. |
| none | Frequent surfaces, such as an editor's controls or a repeated picker. |

Nested providers inherit the nearest preference when omitted. Preferences travel through React portals. Keyboard input wins over all modes; pointerdown restores the chosen mode. Device reduced motion cannot be disabled with auto.

## Do not

- Do not animate keyboard shortcuts, response tabs or live values.
- Do not add a fade before removing credentials or other interactive content that must disappear immediately.
- Do not override component CSS, add stagger to routine work, or replay entrances during typing.
- Do not use the page token for routine controls. Routes and navigation remain product-owned.
`;

function Example({
  motion = 'auto',
  worstCase = false,
}: {
  motion?: MotionPreference;
  worstCase?: boolean;
}) {
  const [palette, setPalette] = useState(false);
  return (
    <DesignSystemProvider motion={motion}>
      <div
        className="flex w-full max-w-2xl flex-col gap-6 p-4"
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            setPalette(true);
          }
        }}
      >
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl">Motion that respects the work</h1>
          <p className="text-sm text-muted-foreground">
            120 ms controls · 180 ms popups · 240 ms dialogs
          </p>
          <p className="text-sm text-muted-foreground">
            Keyboard actions are immediate. Reduced motion uses a short fade.
          </p>
        </header>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Review settings</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Workspace settings</DialogTitle>
                <DialogDescription>
                  Occasional tasks use 240 ms. Escape closes immediately.
                </DialogDescription>
              </DialogHeader>
              {worstCase ? (
                Array.from({ length: 20 }, (_, index) => (
                  <p key={index} className="text-sm wrap-anywhere">
                    Section {index + 1}. International workspace: São Paulo, 東京, العربية.{' '}
                    {'workspace-with-an-unbreakable-name-'.repeat(5)}
                  </p>
                ))
              ) : (
                <p className="text-sm">Your controls stay available throughout the transition.</p>
              )}
              <DialogClose render={<Button variant="outline" />}>Done</DialogClose>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Project actions
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Duplicate project</DropdownMenuItem>
                <DropdownMenuItem disabled>Archive unavailable</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Project details</SheetTitle>
                <SheetDescription>The drawer budget is 240 ms.</SheetDescription>
              </SheetHeader>
              <SheetClose render={<Button variant="outline" />}>Close details</SheetClose>
            </SheetContent>
          </Sheet>
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Daily summary</DrawerTitle>
                <DrawerDescription>Swipe remains tied to the pointer.</DrawerDescription>
              </DrawerHeader>
              <DrawerClose render={<Button variant="outline" />}>Close summary</DrawerClose>
            </DrawerContent>
          </Drawer>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Show preview</PopoverTrigger>
            <PopoverContent>
              <p className="text-sm">A small, origin-aware preview.</p>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            onClick={() =>
              toast.add({
                title: 'Settings saved',
                description: 'Your changes are available.',
                type: 'success',
                timeout: 0,
              })
            }
          >
            Save settings
          </Button>
          <Button variant="outline" onClick={() => setPalette(true)}>
            Search commands
          </Button>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>First tool</TooltipTrigger>
            <TooltipContent>First tool information</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>Next tool</TooltipTrigger>
            <TooltipContent>Next tool information</TooltipContent>
          </Tooltip>
          <Button disabled>Unavailable action</Button>
        </div>
        <Collapsible>
          <CollapsibleTrigger render={<Button variant="outline" />}>
            Advanced settings
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="py-4 text-sm">
              Optional configuration is ready as soon as the section opens.
            </p>
          </CollapsibleContent>
        </Collapsible>
        <label className="flex items-center gap-3 text-sm">
          <Switch />
          Email notifications
        </label>
        <Tabs defaultValue="response">
          <TabsList aria-label="Request result">
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="response">Response body is available immediately.</TabsContent>
          <TabsContent value="headers">Response headers are available immediately.</TabsContent>
        </Tabs>
        <Progress value={72}>
          <ProgressLabel>Live progress</ProgressLabel>
          <ProgressValue />
        </Progress>
        <CommandDialog
          open={palette}
          onOpenChange={setPalette}
          title="Search workspace"
          description="Frequent command palettes appear immediately."
        >
          <Command>
            <CommandInput placeholder="Search workspace" />
            <CommandList>
              <CommandEmpty>No commands found.</CommandEmpty>
              <CommandGroup heading="Workspace">
                <CommandItem>Open settings</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
      <Toaster />
    </DesignSystemProvider>
  );
}

function SidebarExample() {
  return (
    <DesignSystemProvider motion="none">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>Nanostack</SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton aria-label="Home">Home</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>Unavailable workspace</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col items-start gap-4 p-4">
            <SidebarTrigger />
            <h1 className="text-xl">Navigation stays immediate</h1>
            <p className="text-sm text-muted-foreground">
              Repeated navigation and keyboard shortcuts use no animation.
            </p>
            <Select defaultValue="eu">
              <SelectTrigger aria-label="Default region">
                <SelectValue />
              </SelectTrigger>
              <SelectContent aria-label="Regions">
                <SelectGroup>
                  <SelectItem value="eu">EU West</SelectItem>
                  <SelectItem value="us">US East</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DesignSystemProvider>
  );
}

function duration(element: Element) {
  return getComputedStyle(element).transitionDuration;
}
function standardDuration(normal: string) {
  return matchMedia('(prefers-reduced-motion: reduce)').matches ? '0.12s' : normal;
}

const meta = {
  title: 'Foundations/Motion',
  parameters: { layout: 'padded', docs: { description: { component: usage } } },
  component: Example,
  args: { motion: 'auto' as MotionPreference, worstCase: false },
  argTypes: {
    motion: { control: 'radio', options: ['auto', 'reduced', 'none'] },
    worstCase: { control: 'boolean' },
  },
  render: (args) => <Example {...args} />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {};

export const PointerSurfaces: Story = {
  play: async ({ canvas, userEvent }) => {
    for (const [triggerName, role, name] of [
      ['Review settings', 'dialog', 'Workspace settings'],
      ['Open sheet', 'dialog', 'Project details'],
      ['Open drawer', 'dialog', 'Daily summary'],
    ] as const) {
      const trigger = canvas.getByRole('button', { name: triggerName });
      await userEvent.click(trigger);
      const surface = await screen.findByRole(role, { name });
      await expect(duration(surface)).toBe(standardDuration('0.24s'));
      await expect(getComputedStyle(surface).animationName).toBe('none');
      await waitFor(() => expect(surface).toBeVisible());
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole(role, { name })).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Project actions' }));
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(duration(menu)).toBe(standardDuration('0.18s')));
    await expect(
      within(menu).getByRole('menuitem', { name: 'Archive unavailable' }),
    ).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const KeyboardAndPointer: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Review settings' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Workspace settings' });
    await expect(duration(dialog)).toBe('0s');
    await expect(dialog.getAnimations()).toHaveLength(0);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.click(trigger);
    const reopened = await screen.findByRole('dialog', { name: 'Workspace settings' });
    await expect(duration(reopened)).toBe(standardDuration('0.24s'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.keyboard('{Control>}k{/Control}');
    const palette = await screen.findByRole('dialog', { name: 'Search workspace' });
    await expect(duration(palette)).toBe('0s');
    await expect(palette.getAnimations()).toHaveLength(0);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const ReducedMotion: Story = {
  render: () => <Example motion="reduced" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Review settings' }));
    const dialog = await screen.findByRole('dialog', { name: 'Workspace settings' });
    await waitFor(() => expect(duration(dialog)).toBe('0.12s'));
    await expect(getComputedStyle(dialog).transitionProperty).toBe('opacity');
    await expect(getComputedStyle(dialog).scale).toBe('1');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Advanced settings' }));
    const panel = canvas.getByText(
      'Optional configuration is ready as soon as the section opens.',
    ).parentElement!;
    await expect(getComputedStyle(panel).transitionProperty).toBe('opacity');
    await expect(duration(panel)).toBe('0.12s');
    await waitFor(() => expect(panel.getBoundingClientRect().height).toBeGreaterThan(30));
  },
};

export const FrequentUsage: Story = {
  render: () => <Example motion="none" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Project actions' }));
    const menu = await screen.findByRole('menu');
    await expect(duration(menu)).toBe('0s');
    await expect(menu.getAnimations()).toHaveLength(0);
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('button', { name: 'Review settings' }));
    const dialog = await screen.findByRole('dialog', { name: 'Workspace settings' });
    await expect(duration(dialog)).toBe('0s');
    await expect(dialog.getAnimations()).toHaveLength(0);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const RapidReversal: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Advanced settings' });
    for (let count = 0; count < 4; count++) {
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
    await waitFor(() =>
      expect(canvas.queryByText(/Optional configuration/)).not.toBeInTheDocument(),
    );
    await userEvent.click(trigger);
    await waitFor(() => expect(canvas.getByText(/Optional configuration/)).toBeVisible());
    await expect(trigger).toHaveFocus();
  },
};

export const FrequentControls: Story = {
  play: async ({ canvas, userEvent }) => {
    const headers = canvas.getByRole('tab', { name: 'Headers' });
    await userEvent.click(headers);
    await expect(headers).toHaveAttribute('aria-selected', 'true');
    await expect(getComputedStyle(headers).transitionProperty).toBe('none');
    await expect(canvas.getByText('Response headers are available immediately.')).toBeVisible();
    const progress = canvas
      .getByRole('progressbar')
      .querySelector('[data-slot="progress-indicator"]')!;
    await expect(getComputedStyle(progress).transitionProperty).toBe('none');
    const toggle = canvas.getByRole('switch', { name: 'Email notifications' });
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(toggle).not.toBeChecked();
    await expect(duration(toggle)).toBe('0s');
  },
};

export const ToastFeedback: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }));
    const title = await screen.findByText('Settings saved');
    const notification = title.closest('[data-slot="toast"]')!;
    await waitFor(() => expect(duration(notification)).toBe(standardDuration('0.18s')));
    await waitFor(() => expect(title).toBeVisible());
    await userEvent.hover(notification);
    await userEvent.click(
      await within(notification as HTMLElement).findByRole('button', { name: 'Close toast' }),
    );
    await waitFor(() => expect(screen.queryByText('Settings saved')).not.toBeInTheDocument());
  },
};

export const NestedPreferences: Story = {
  render: () => (
    <DesignSystemProvider motion="none">
      <Example />
      <DesignSystemProvider>
        <Dialog>
          <DialogTrigger render={<Button />}>Inherited dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inherited preference</DialogTitle>
              <DialogDescription>This portal inherits no motion.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DesignSystemProvider>
    </DesignSystemProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Inherited dialog' }));
    const dialog = await screen.findByRole('dialog', { name: 'Inherited preference' });
    await expect(duration(dialog)).toBe('0s');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Review settings' }));
    const overridden = await screen.findByRole('dialog', { name: 'Workspace settings' });
    await waitFor(() => expect(duration(overridden)).toBe(standardDuration('0.24s')));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const WorstCase: Story = {
  render: () => <Example worstCase />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Review settings' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Workspace settings' });
    await waitFor(() => expect(dialog).toBeVisible());
    await Promise.all(dialog.getAnimations().map((animation) => animation.finished));
    const body = dialog.querySelector<HTMLElement>('[data-slot="dialog-body"]')!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    await expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth + 1);
    await expect(dialog.getBoundingClientRect().right).toBeLessThanOrEqual(innerWidth);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const SidebarShowcase: Story = { render: () => <SidebarExample /> };
export const SidebarFrequency: Story = {
  render: () => <SidebarExample />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' });
    await userEvent.click(trigger);
    const mobile = innerWidth < 768;
    if (mobile) {
      const sidebar = await screen.findByRole('dialog', { name: 'Sidebar' });
      await expect(duration(sidebar)).toBe('0s');
      const overlay = sidebar.ownerDocument.querySelector('[data-slot="sidebar-overlay"]')!;
      await expect(duration(overlay)).toBe('0s');
      await expect(getComputedStyle(overlay).transitionProperty).toBe('none');
      await userEvent.keyboard('{Escape}');
      await waitFor(() =>
        expect(screen.queryByRole('dialog', { name: 'Sidebar' })).not.toBeInTheDocument(),
      );
      await waitFor(() => expect(trigger).toHaveFocus());
    } else {
      const menu = canvas.getByRole('button', { name: /^Home$/ });
      await expect(getComputedStyle(menu).transitionProperty).toBe('none');
    }
    const select = canvas.getByRole('combobox', { name: 'Default region' });
    await userEvent.click(select);
    await expect(duration(select)).toBe('0s');
    const options = await screen.findByRole('listbox', { name: 'Regions' });
    await waitFor(() => expect(options).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  },
};
