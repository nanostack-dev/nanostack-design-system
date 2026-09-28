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
import { expect, fn, waitFor, within } from 'storybook/test';

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
} from './sidebar';

const navigation = [
  { title: 'Home', href: '#home', icon: HouseIcon, active: true },
  { title: 'Reports', href: '#reports', icon: ChartBarIcon, badge: '12' },
  { title: 'Settings', href: '#settings', icon: GearIcon },
];

function SidebarState() {
  const { state, open, isMobile } = useSidebar();
  const isMobileViewport = useIsMobile();
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      <dt className="text-muted-foreground">State</dt>
      <dd data-testid="sidebar-state">{state}</dd>
      <dt className="text-muted-foreground">Open</dt>
      <dd>{String(open)}</dd>
      <dt className="text-muted-foreground">Layout</dt>
      <dd data-testid="sidebar-layout">
        {isMobile || isMobileViewport ? 'Mobile layout' : 'Desktop layout'}
      </dd>
    </dl>
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
                  <SidebarMenuButton
                    render={<a href={item.href} />}
                    isActive={item.active}
                    tooltip={item.title}
                  >
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
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-sm font-medium">Home</h1>
        </header>
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

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  args: { side: 'left', variant: 'sidebar', collapsible: 'icon' },
  argTypes: {
    side: { control: 'select', options: ['left', 'right'] },
    variant: { control: 'select', options: ['sidebar', 'floating', 'inset'] },
    collapsible: { control: 'select', options: ['offcanvas', 'icon', 'none'] },
  },
  parameters: { layout: 'fullscreen' },
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
    await expect(canvas.getByTestId('sidebar-layout')).toHaveTextContent('Desktop layout');

    await userEvent.click(trigger);
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    await expect(sidebar).toHaveAttribute('data-collapsible', 'icon');
    await expect(canvas.getByTestId('sidebar-state')).toHaveTextContent('collapsed');

    await userEvent.click(trigger);
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');
    await expect(sidebar).toHaveAttribute('data-collapsible', '');
  },
};

export const KeyboardShortcut: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sidebar = sidebarElement(canvasElement);
    await userEvent.click(canvas.getByRole('heading', { name: 'Home' }));

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
    const container = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;
    await userEvent.click(sidebarTrigger(canvasElement));
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-collapsible', 'offcanvas');
    await waitFor(() => expect(container.getBoundingClientRect().right).toBeLessThanOrEqual(0));
  },
};

export const Floating: Story = {
  args: { variant: 'floating' },
  play: async ({ canvasElement }) => {
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-variant', 'floating');
  },
};

export const Inset: Story = {
  args: { variant: 'inset' },
  play: async ({ canvasElement }) => {
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-variant', 'inset');
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
