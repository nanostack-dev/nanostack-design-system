import {
  ChartBarIcon,
  DotsThreeIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import { Text } from '@/components/text';
import { Inline } from '@/layout/inline';
import { Stack } from '@/layout/stack';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  type SidebarProps,
  SidebarProvider,
  type SidebarProviderProps,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useIsMobile,
  useSidebar,
} from '@/components/sidebar';

const usage = `
The parts of a collapsible application sidebar. For the frame of a signed-in product, use the \`AppShell\` block: it composes these parts with the right defaults. Use the parts directly only for a sidebar that \`AppShell\` cannot express.

The parts are closed. They do not accept \`className\` or \`style\`. The width comes from \`SidebarProvider\`, the surface from \`material\`, and a link from \`href\` and the \`DesignSystemProvider\` link component.

## SidebarProvider width: the expanded width

| Value | Width | Use it for |
| --- | --- | --- |
| \`md\` | 16 rem | The default. A sidebar with one column of labels. |
| \`lg\` | 17 rem | A sidebar with an icon rail and a panel side by side. |

## SidebarProvider iconWidth: the collapsed width

| Value | Width | Use it for |
| --- | --- | --- |
| \`md\` | 3 rem | The default. \`SidebarMenuButton\` icons in the collapsed sidebar. |
| \`lg\` | 3.75 rem | A custom icon rail with 40 px targets. The collapsed width must equal the rail width. |

## Sidebar material: the surface

| Value | Use it for |
| --- | --- |
| \`solid\` | The default. An opaque sidebar surface. |
| \`frosted\` | A translucent surface that blurs what is behind it. It becomes \`solid\` when the person asks for reduced transparency. |

## Sidebar collapsible: how it closes

| Value | Use it for |
| --- | --- |
| \`offcanvas\` | The default. The sidebar slides out of view. Use it when the page needs the full width. |
| \`icon\` | The sidebar keeps a column of icons with tooltips. Use it for the main navigation of a product. |
| \`none\` | The sidebar never closes. Use it inside a page, for example a settings section. |

## SidebarMenuButton size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A dense secondary list. |
| \`md\` | 36 px | The default. Navigation items. |
| \`lg\` | 56 px | The workspace or account switcher at the top or bottom. |

## Other props

- \`SidebarMenuButton href\`: renders the link component of \`DesignSystemProvider\`. Use \`render\` only for a trigger, such as \`DropdownMenuTrigger\` or \`CollapsibleTrigger\`.
- \`SidebarMenuButton tooltip\`: the label shown when the sidebar is collapsed to icons. Give one to every item.
- \`SidebarMenuButton disabled\`: an unavailable button keeps its native disabled state and is skipped by the keyboard. Its tooltip stays closed.
- \`SidebarMenuAction showOnHover\`: shows the action only when the item has hover or focus.
- \`SidebarTrigger label\` and \`SidebarRail label\`: the accessible name. The default is "Toggle Sidebar".
- \`Ctrl+B\` or \`Cmd+B\` opens and closes the sidebar.

## Do not

- Do not put two sidebars in one \`SidebarProvider\`.
- Do not leave out \`tooltip\` on an item of a sidebar that collapses to icons. The icon alone has no name.
- Do not set \`iconWidth\` smaller than the content of a custom rail. The rail is cut.
- Do not use \`frosted\` for a sidebar with nothing behind it that moves. It only adds cost.
`;

const navigation = [
  { title: 'Home', href: '#home', icon: HouseIcon, active: true },
  { title: 'Reports', href: '#reports', icon: ChartBarIcon, badge: '12' },
  { title: 'Settings', href: '#settings', icon: GearIcon },
];

function SidebarState() {
  const { state, open, isMobile } = useSidebar();
  const isMobileViewport = useIsMobile();
  return (
    <Stack space="xs">
      <Text tone="muted">
        State <span data-testid="sidebar-state">{state}</span>
      </Text>
      <Text tone="muted">Open {String(open)}</Text>
      <Text tone="muted" data-testid="sidebar-layout">
        {isMobile || isMobileViewport ? 'Mobile layout' : 'Desktop layout'}
      </Text>
    </Stack>
  );
}

function AppSidebar(props: SidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Acme workspace">
              <FolderIcon />
              <span>Acme workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarInput aria-label="Search the navigation" placeholder="Search" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add a page">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton href={item.href} isActive={item.active} tooltip={item.title}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                  {item.title === 'Settings' ? (
                    <SidebarMenuAction showOnHover aria-label="More settings actions">
                      <DotsThreeIcon />
                    </SidebarMenuAction>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Design system">
                  <FolderIcon />
                  <span>Design system</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#tokens" isActive>
                      <span>Tokens</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#components">
                      <span>Components</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Account">
              <GearIcon />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Shell({
  providerProps,
  ...sidebarProps
}: SidebarProps & { providerProps?: Omit<SidebarProviderProps, 'children'> }) {
  return (
    <SidebarProvider {...providerProps}>
      <AppSidebar {...sidebarProps} />
      <SidebarInset>
        <div className="flex h-12 items-center gap-2 border-b px-4">
          <Inline space="sm" wrap={false}>
            <SidebarTrigger />
            <Text weight="medium" data-testid="page-title">
              Home
            </Text>
          </Inline>
        </div>
        <div className="p-4">
          <SidebarState />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function sidebarTrigger(canvasElement: HTMLElement) {
  return within(within(canvasElement).getByRole('main')).getByRole('button', {
    name: 'Toggle Sidebar',
  });
}

function sidebarElement(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>('[data-slot="sidebar"]')!;
}

function sidebarContainer(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;
}

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  args: { side: 'left', collapsible: 'icon', material: 'solid' },
  argTypes: {
    side: { control: 'select', options: ['left', 'right'] },
    collapsible: { control: 'select', options: ['offcanvas', 'icon', 'none'] },
    material: { control: 'select', options: ['solid', 'frosted'] },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: usage } },
  },
  render: (args) => <Shell {...args} />,
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sidebar = sidebarElement(canvasElement);
    const trigger = sidebarTrigger(canvasElement);
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('data-active');
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home');
    await expect(canvas.getByRole('link', { name: 'Tokens' })).toHaveAttribute('data-active');
    await expect(canvas.getByTestId('sidebar-layout')).toHaveTextContent('Desktop layout');
    await expect(sidebarContainer(canvasElement).getBoundingClientRect().width).toBe(256);

    await userEvent.click(trigger);
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    await expect(sidebar).toHaveAttribute('data-collapsible', 'icon');
    await expect(canvas.getByTestId('sidebar-state')).toHaveTextContent('collapsed');
    await waitFor(() =>
      expect(sidebarContainer(canvasElement).getBoundingClientRect().width).toBe(48),
    );

    await userEvent.click(trigger);
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
    await expect(sidebar).toHaveAttribute('data-collapsible', '');
  },
};

export const Widths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A sidebar with an icon rail and a panel uses `width="lg"` (17 rem) and `iconWidth="lg"` (3.75 rem), so the collapsed sidebar is exactly the rail.',
      },
    },
  },
  render: (args) => <Shell {...args} providerProps={{ width: 'lg', iconWidth: 'lg' }} />,
  play: async ({ canvasElement, userEvent }) => {
    const container = sidebarContainer(canvasElement);
    await expect(container.getBoundingClientRect().width).toBe(272);
    await userEvent.click(sidebarTrigger(canvasElement));
    await waitFor(() => expect(container.getBoundingClientRect().width).toBe(60));
  },
};

export const Frosted: Story = {
  args: { material: 'frosted' },
  parameters: {
    docs: {
      description: {
        story:
          'The `frosted` material is 82% of the sidebar colour with a blur. With reduced transparency it is the solid colour.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-material', 'frosted');
    const inner = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar-inner"]')!;
    await expect(getComputedStyle(inner).backdropFilter).toContain('blur');
  },
};

export const KeyboardShortcut: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sidebar = sidebarElement(canvasElement);
    await userEvent.click(canvas.getByTestId('page-title'));

    await userEvent.keyboard('{Control>}b{/Control}');
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    await userEvent.keyboard('{Meta>}b{/Meta}');
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    await userEvent.keyboard('b');
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
  },
};

export const KeyboardTrigger: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const trigger = sidebarTrigger(canvasElement);
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'collapsed');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'expanded');
  },
};

export const CollapsedTooltip: Story = {
  render: (args) => <Shell {...args} providerProps={{ defaultOpen: false }} />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'collapsed');
    await userEvent.hover(canvas.getByRole('link', { name: 'Reports' }));
    await waitFor(() => {
      const tooltip = document.querySelector('[data-slot="tooltip-content"]');
      expect(tooltip).toHaveTextContent('Reports');
      expect(tooltip).toBeVisible();
    });
  },
};

const onDisabledClick = fn();

function DisabledButtonSidebar({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <SidebarProvider defaultOpen={!collapsed}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Before action">
                  <HouseIcon />
                  <span>Before action</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled tooltip="Unavailable action" onClick={onDisabledClick}>
                  <FolderIcon />
                  <span>Unavailable action</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="After action">
                  <GearIcon />
                  <span>After action</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Text>Unavailable actions stay outside the keyboard sequence.</Text>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function checkDisabledButton(
  canvas: ReturnType<typeof within>,
  userEvent: Parameters<NonNullable<Story['play']>>[0]['userEvent'],
) {
  onDisabledClick.mockClear();
  const disabled = canvas.getByRole('button', { name: 'Unavailable action' });
  await expect(disabled).toBeDisabled();
  await expect(getComputedStyle(disabled).opacity).toBe('0.5');
  disabled.click();
  await expect(onDisabledClick).not.toHaveBeenCalled();
  canvas.getByRole('button', { name: 'Before action' }).focus();
  await userEvent.tab();
  await expect(canvas.getByRole('button', { name: 'After action' })).toHaveFocus();
  disabled.focus();
  await expect(disabled).not.toHaveFocus();
}

export const DisabledWithTooltip: Story = {
  render: () => <DisabledButtonSidebar />,
};

export const DisabledTooltipKeyboard: Story = {
  render: () => <DisabledButtonSidebar />,
  play: async ({ canvas, userEvent }) => {
    await checkDisabledButton(canvas, userEvent);
    await expect(screen.getAllByText('After action')).toHaveLength(1);
  },
};

export const CollapsedDisabledWithTooltip: Story = {
  render: () => <DisabledButtonSidebar collapsed />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await checkDisabledButton(canvas, userEvent);
    await userEvent.hover(canvas.getByRole('button', { name: 'After action' }));
    await waitFor(() => {
      const tooltip = screen
        .getAllByText('After action')
        .filter((element) => !canvasElement.contains(element));
      expect(tooltip).toHaveLength(1);
      expect(tooltip[0]).toBeVisible();
    });
    await expect(screen.getAllByText('Unavailable action')).toHaveLength(1);
  },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    const [onOpenChange] = useState(() => fn(setOpen));
    return (
      <div data-testid="controlled" data-calls={onOpenChange.mock.calls.length}>
        <Shell {...args} providerProps={{ open, onOpenChange }} />
      </div>
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(sidebarTrigger(canvasElement));
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'collapsed');
    await expect(canvas.getByTestId('controlled')).toHaveAttribute('data-calls', '1');
  },
};

export const Offcanvas: Story = {
  args: { collapsible: 'offcanvas' },
  play: async ({ canvasElement, userEvent }) => {
    const container = sidebarContainer(canvasElement);
    await userEvent.click(sidebarTrigger(canvasElement));
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-collapsible', 'offcanvas');
    await waitFor(() => expect(container.getBoundingClientRect().right).toBeLessThanOrEqual(0));
  },
};

export const RightSide: Story = {
  args: { side: 'right' },
  play: async ({ canvasElement, userEvent }) => {
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-side', 'right');
    await userEvent.click(sidebarTrigger(canvasElement));
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'collapsed');
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() => expect(document.documentElement).toHaveClass('dark'));
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'expanded');
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveAttribute('data-active');
  },
};
