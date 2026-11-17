import {
  BellIcon,
  ChartBarIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  KeyIcon,
  UsersIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, screen, waitFor } from 'storybook/test';

import {
  AppShell,
  AppShellBrand,
  AppShellContent,
  AppShellHeader,
  AppShellInset,
  AppShellNav,
  AppShellNavItem,
  AppShellSidebar,
  AppShellSidebarContent,
  AppShellSidebarHeader,
} from '@/blocks/app-shell';
import { DataTable, type ColumnDef } from '@/blocks/data-table';
import { StatCard, StatCardDescription, StatCardLabel, StatCardValue } from '@/blocks/stat-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/alert-dialog';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { Field, FieldLabel } from '@/components/field';
import { Heading } from '@/components/heading';
import { Input } from '@/components/input';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { Text } from '@/components/text';
import { Textarea } from '@/components/textarea';
import { Toaster, toast } from '@/components/toast';
import { Box } from '@/layout/box';
import { Stack } from '@/layout/stack';

const usage = `
Glass is an opt-in material for the whole product. Set it once, on the root provider: \`<DesignSystemProvider material="glass">\`. Every component then draws its glass surface; the product passes no class and no style. ADR 0002 records the decision.

## DesignSystemProvider material

| Value | Use it for |
| --- | --- |
| \`solid\` | The default. Opaque surfaces. Choose it for a product that has not adopted glass. |
| \`glass\` | A product whose frame should feel light: the chrome becomes translucent over a soft brand-hued backdrop. |

A nested provider without \`material\` inherits the material of its parent.

## What becomes glass

- **Chrome** is translucent and blurred: \`Sidebar\` (it floats with a gap), the \`AppShellHeader\` top bar (it floats, and \`AppShellContent\` scrolls under it), the \`Popover\`, \`DropdownMenu\`, \`ContextMenu\`, \`Select\`, \`Combobox\`, \`HoverCard\` and \`Command\` popups, \`Dialog\`, \`AlertDialog\`, \`Sheet\`, \`Drawer\` and the toasts.
- **Data surfaces** are near-opaque (84%): \`Card\`, \`StatCard\`, \`DataTable\`, a \`Table\` outside a card, and the form fields. Dense text stays as legible as on a solid card.
- \`AppShell\` paints the backdrop: the background colour with primary blue, teal and violet radial tints. Without it, glass has nothing to show.

## Fallbacks

- A browser without \`backdrop-filter\` gets solid surfaces.
- A person who asks for reduced transparency (\`prefers-reduced-transparency: reduce\`) gets solid surfaces.

## Tokens

\`--glass-surface\`, \`--glass-surface-strong\`, \`--glass-surface-overlay\`, \`--glass-blur\`, \`--glass-saturate\`, \`--glass-edge\`, \`--glass-highlight\`, \`--glass-shadow\`, \`--glass-sheen\` and \`--glass-backdrop\`, in light and dark. They add to the token set; nothing is renamed.

## Do not

- Do not mix materials on one screen. Set the material on the root provider only.
- Do not build a glass look on \`Box\` in a product. Ask for the component here.
- Do not put a \`Sidebar material="frosted"\` under a glass provider. Omit \`material\` and the sidebar follows the provider.
- Do not place dense text directly on a chrome surface when a \`Card\` can hold it.
`;

type Key = {
  id: string;
  name: string;
  prefix: string;
  created: string;
  status: 'Active' | 'Revoked';
};

const keys: Key[] = [
  {
    id: '1',
    name: 'Production backend',
    prefix: 'ak_live_7Hq2',
    created: '12 Nov 2026',
    status: 'Active',
  },
  { id: '2', name: 'CI pipeline', prefix: 'ak_live_P0x9', created: '3 Nov 2026', status: 'Active' },
  {
    id: '3',
    name: 'Staging worker',
    prefix: 'ak_test_m41K',
    created: '28 Oct 2026',
    status: 'Revoked',
  },
];

const columns: ColumnDef<Key>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'prefix',
    header: 'Prefix',
    cell: ({ row }) => (
      <Text as="span" font="mono" tone="muted">
        {row.original.prefix}
      </Text>
    ),
  },
  { accessorKey: 'created', header: 'Created' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge tone={row.original.status === 'Active' ? 'success' : 'critical'} variant="soft">
        {row.original.status}
      </Badge>
    ),
  },
];

function Frame({
  name = 'Anchor',
  description = 'Organization-as-a-Service',
  title = 'API keys',
  children,
}: {
  name?: string;
  description?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <AppShell sidebarWidth="lg" skipLinkLabel="Skip to main content">
      <AppShellSidebar>
        <AppShellSidebarHeader>
          <AppShellBrand name={name} description={description} href="#home" />
        </AppShellSidebarHeader>
        <AppShellSidebarContent>
          <AppShellNav label="Product">
            <AppShellNavItem icon={HouseIcon} label="Overview" href="#overview" />
            <AppShellNavItem icon={KeyIcon} label="API keys" href="#keys" active />
            <AppShellNavItem icon={UsersIcon} label="Members" href="#members" />
            <AppShellNavItem icon={BellIcon} label="Webhooks" href="#webhooks" badge="2" />
          </AppShellNav>
          <AppShellNav label="Settings">
            <AppShellNavItem icon={ChartBarIcon} label="Usage" href="#usage" />
            <AppShellNavItem icon={FolderIcon} label="Audit log" href="#audit" />
            <AppShellNavItem icon={GearIcon} label="Settings" href="#settings" />
          </AppShellNav>
        </AppShellSidebarContent>
      </AppShellSidebar>
      <AppShellInset>
        <AppShellHeader
          actions={
            <Button variant="solid" tone="brand" size="sm">
              New key
            </Button>
          }
        >
          <Text as="p" weight="semibold" truncate>
            {title}
          </Text>
          <Text as="span" tone="muted" truncate>
            Muted label on the top bar
          </Text>
        </AppShellHeader>
        <AppShellContent>
          <Box className="flex flex-col gap-6 p-4 md:p-6">{children}</Box>
        </AppShellContent>
      </AppShellInset>
    </AppShell>
  );
}

function Page({ data = keys }: { data?: Key[] }) {
  return (
    <>
      <Stack space="xs">
        <Heading level={1}>API keys</Heading>
        <Text tone="muted">Keys let your backend call Anchor for this product.</Text>
      </Stack>
      <Box className="grid gap-4 sm:grid-cols-3">
        <StatCard aria-label="Active keys" role="group">
          <StatCardLabel>Active keys</StatCardLabel>
          <StatCardValue>2</StatCardValue>
          <StatCardDescription>One created this week.</StatCardDescription>
        </StatCard>
        <StatCard aria-label="Requests today" role="group">
          <StatCardLabel>Requests today</StatCardLabel>
          <StatCardValue>48,210</StatCardValue>
          <StatCardDescription>Across every key.</StatCardDescription>
        </StatCard>
        <StatCard aria-label="Revoked keys" role="group">
          <StatCardLabel>Revoked keys</StatCardLabel>
          <StatCardValue>1</StatCardValue>
          <StatCardDescription>Kept for the audit log.</StatCardDescription>
        </StatCard>
      </Box>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        searchLabel="Search keys"
      />
    </>
  );
}

const meta = {
  title: 'Foundations/Glass material',
  parameters: { layout: 'fullscreen', docs: { description: { component: usage } } },
  globals: { material: 'glass' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppFrame: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The sidebar and the top bar are glass. The stat cards and the table are near-opaque data surfaces. The content scrolls under the top bar.',
      },
    },
  },
  render: () => (
    <Frame>
      <Page />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot=app-shell-header]');
    await expect(header).toHaveAttribute('data-ns-material', 'glass');
    await expect(getComputedStyle(header!).backdropFilter).toContain('blur');
    await waitFor(() =>
      expect(header!.parentElement!.style.getPropertyValue('--app-shell-header-offset')).not.toBe(
        '',
      ),
    );
    const card = canvasElement.querySelector<HTMLElement>('[data-slot=stat-card]');
    await expect(card).toHaveAttribute('data-ns-material', 'glass');
    const wrapper = canvasElement.querySelector<HTMLElement>('[data-slot=sidebar-wrapper]');
    await expect(getComputedStyle(wrapper!).backgroundImage).toContain('radial-gradient');
  },
};

export const Solid: Story = {
  globals: { material: 'solid' },
  parameters: {
    docs: { description: { story: 'The same frame with the default `solid` material.' } },
  },
  render: () => (
    <Frame>
      <Page />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot=app-shell-header]');
    await expect(header).toHaveAttribute('data-ns-material', 'solid');
    await expect(getComputedStyle(header!).backdropFilter).toBe('none');
  },
};

function Backdrop({ children }: { children: ReactNode }) {
  return <Box className="flex min-h-[32rem] items-start justify-center p-10">{children}</Box>;
}

export const PopoverSurface: Story = {
  name: 'Popover',
  render: () => (
    <Backdrop>
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline">Key details</Button>} />
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Production backend</PopoverTitle>
            <PopoverDescription>
              Created on 12 Nov 2026. Last used two minutes ago.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </Backdrop>
  ),
  play: async () => {
    const popup = await screen.findByRole('dialog');
    await expect(popup).toHaveAttribute('data-ns-material', 'glass');
  },
};

export const DropdownMenuSurface: Story = {
  name: 'Dropdown menu',
  render: () => (
    <Backdrop>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger render={<Button variant="outline">Actions</Button>} />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Production backend</DropdownMenuLabel>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Copy prefix</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem tone="critical">Revoke</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Backdrop>
  ),
  play: async () => {
    const menu = await screen.findByRole('menu');
    await expect(menu).toHaveAttribute('data-ns-material', 'glass');
  },
};

export const SelectSurface: Story = {
  name: 'Select',
  render: () => (
    <Backdrop>
      <Box className="w-64">
        <Field>
          <FieldLabel htmlFor="glass-region">Region</FieldLabel>
          <Select
            defaultOpen
            items={[
              { value: 'eu', label: 'EU West' },
              { value: 'us', label: 'US East' },
            ]}
          >
            <SelectTrigger id="glass-region" width="fill">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eu">EU West</SelectItem>
              <SelectItem value="us">US East</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </Box>
    </Backdrop>
  ),
  play: async () => {
    const listbox = await screen.findByRole('listbox');
    await expect(listbox.closest('[data-slot=select-content]')).toHaveAttribute(
      'data-ns-material',
      'glass',
    );
  },
};

export const CommandSurface: Story = {
  name: 'Command',
  render: () => (
    <Backdrop>
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline">Jump to</Button>} />
        <PopoverContent aria-label="Jump to">
          <Command>
            <CommandInput placeholder="Search pages" aria-label="Search pages" />
            <CommandList>
              <CommandEmpty>No page found.</CommandEmpty>
              <CommandGroup heading="Pages">
                <CommandItem>API keys</CommandItem>
                <CommandItem>Members</CommandItem>
                <CommandItem>Webhooks</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Backdrop>
  ),
  play: async () => {
    const popup = await screen.findByRole('dialog');
    const command = popup.querySelector<HTMLElement>('[data-slot=command]');
    await expect(getComputedStyle(command!).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
};

export const DialogSurface: Story = {
  name: 'Dialog',
  render: () => (
    <Frame>
      <Page />
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename key</DialogTitle>
            <DialogDescription>The name shows in the audit log and in this list.</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="glass-key-name">Name</FieldLabel>
            <Input id="glass-key-name" defaultValue="Production backend" />
          </Field>
          <DialogFooter>
            <Button variant="solid" tone="brand">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Frame>
  ),
  play: async () => {
    const dialog = await screen.findByRole('dialog');
    await expect(dialog).toHaveAttribute('data-ns-material', 'glass');
  },
};

export const AlertDialogSurface: Story = {
  name: 'Alert dialog',
  render: () => (
    <Frame>
      <Page />
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this key?</AlertDialogTitle>
            <AlertDialogDescription>
              Requests that use it fail at once. You cannot undo this.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction tone="critical">Revoke</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Frame>
  ),
  play: async () => {
    const dialog = await screen.findByRole('alertdialog');
    await expect(dialog).toHaveAttribute('data-ns-material', 'glass');
  },
};

export const SheetSurface: Story = {
  name: 'Sheet',
  render: () => (
    <Frame>
      <Page />
      <Sheet defaultOpen>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Production backend</SheetTitle>
            <SheetDescription>Every request this key made in the last hour.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Frame>
  ),
  play: async () => {
    const sheet = await screen.findByRole('dialog');
    await expect(sheet).toHaveAttribute('data-ns-material', 'glass');
  },
};

export const ToastSurface: Story = {
  name: 'Toast',
  beforeEach: () => () => toast.close(),
  render: () => (
    <Toaster>
      <Frame>
        <Page />
      </Frame>
    </Toaster>
  ),
  play: async () => {
    toast.add({
      type: 'success',
      title: 'Key created',
      description: 'Copy it now; it shows once.',
    });
    const title = await screen.findByText('Key created');
    await expect(title.closest('[data-slot=toast]')).toHaveAttribute('data-ns-material', 'glass');
  },
};

export const DataSurfaces: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cards, a bare table and fields are near-opaque. A table inside a card does not draw a second surface.',
      },
    },
  },
  render: () => (
    <Box className="mx-auto flex max-w-3xl flex-col gap-6 p-10">
      <Card>
        <CardHeader>
          <CardTitle>Rotation policy</CardTitle>
          <CardDescription>Keys older than 90 days are flagged in the list.</CardDescription>
        </CardHeader>
        <CardContent>
          <Stack space="md">
            <Field>
              <FieldLabel htmlFor="glass-days">Maximum age in days</FieldLabel>
              <Input id="glass-days" defaultValue="90" />
            </Field>
            <Field>
              <FieldLabel htmlFor="glass-note">Note for the team</FieldLabel>
              <Textarea id="glass-note" defaultValue="Rotate the CI key first." />
            </Field>
          </Stack>
        </CardContent>
      </Card>
      <Table aria-label="Recent requests">
        <TableHeader>
          <TableRow>
            <TableHead>Path</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>/v1/organizations</TableCell>
            <TableCell>200</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>/v1/members</TableCell>
            <TableCell>403</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector<HTMLElement>('[data-slot=table-container]');
    await expect(getComputedStyle(table!).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    const input = canvasElement.querySelector<HTMLElement>('[data-slot=input]');
    await expect(input).toHaveAttribute('data-variant', 'soft');
  },
};

/**
 * The hardest case for glass: solid primary and foreground blocks scroll under
 * the top bar, a long unbreakable product name fills the brand, and a popover
 * opens over a dark block. Muted text and primary text must stay legible.
 */
export const WorstCase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Dark, saturated content under the floating top bar and a popover, with a long unbreakable brand name. The PR that introduced glass measured text contrast on this story.',
      },
    },
  },
  render: () => (
    <Frame
      name="Organization-as-a-Service-with-an-unbreakable-product-name"
      description="A description that is much longer than the sidebar is wide"
      title="A page title that is far too long for the top bar on any reasonable screen"
    >
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline">Open over dark content</Button>} />
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Contrast probe</PopoverTitle>
            <PopoverDescription>Muted text on a popover over dark content.</PopoverDescription>
          </PopoverHeader>
          <Text tone="brand">Primary text on the popover.</Text>
        </PopoverContent>
      </Popover>
      {/* bg-foreground is the darkest colour in light and the lightest in dark:
          the worst backdrop for text on glass in both themes. */}
      <Box data-testid="worst-case-dark" className="h-40 rounded-2xl bg-foreground" />
      <Box className="h-40 rounded-2xl bg-primary" />
      <Page />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot=app-shell-header]');
    await expect(header).toHaveAttribute('data-ns-material', 'glass');
    // Scroll the dark block under the floating top bar: in the content area when
    // the frame bounds it, else in the document.
    const block = canvasElement.querySelector<HTMLElement>('[data-testid=worst-case-dark]')!;
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot=app-shell-content] [data-slot=scroll-area-viewport]',
    );
    const delta = block.getBoundingClientRect().top - header!.getBoundingClientRect().top - 8;
    if (viewport && viewport.scrollHeight > viewport.clientHeight) viewport.scrollTop += delta;
    else window.scrollBy(0, delta);
    await screen.findByText('Contrast probe');
  },
};
