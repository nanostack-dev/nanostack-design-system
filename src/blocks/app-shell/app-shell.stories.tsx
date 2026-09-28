import {
  BellIcon,
  ChartBarIcon,
  CubeIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  LifebuoyIcon,
  UsersIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { StatCard, StatCardDescription, StatCardLabel, StatCardValue } from '@/blocks/stat-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb';

import {
  AppShell,
  AppShellHeader,
  AppShellInset,
  AppShellMain,
  AppShellNav,
  AppShellNavItem,
  type AppShellProps,
  AppShellSidebar,
  AppShellSidebarContent,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
  useAppShell,
} from './app-shell';

const summaries = [
  { title: 'Members', value: '24', description: 'Three joined this week.' },
  { title: 'Open tasks', value: '18', description: 'Five are due today.' },
  { title: 'Storage', value: '62%', description: 'Of the current plan.' },
];

function ShellState() {
  const { state, isMobile } = useAppShell();
  return (
    <p className="text-sm text-muted-foreground">
      Sidebar <span data-testid="shell-state">{state}</span>
      {isMobile ? ' on a small screen' : null}
    </p>
  );
}

function Workspace(props: Omit<AppShellProps, 'children'>) {
  return (
    <AppShell {...props}>
      <AppShellSidebar>
        <AppShellSidebarHeader>
          <div className="flex h-10 items-center gap-2 overflow-hidden">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CubeIcon aria-hidden />
            </span>
            <span className="min-w-0 truncate font-heading text-sm font-semibold">
              Acme workspace
            </span>
          </div>
        </AppShellSidebarHeader>
        <AppShellSidebarContent>
          <AppShellNav label="Workspace">
            <AppShellNavItem icon={HouseIcon} label="Overview" href="#overview" active />
            <AppShellNavItem
              icon={ChartBarIcon}
              label="Reports"
              render={<a href="#reports" data-testid="custom-link" />}
            />
            <AppShellNavItem icon={BellIcon} label="Inbox" href="#inbox" badge="4" />
          </AppShellNav>
          <AppShellNav label="Library">
            <AppShellNavItem icon={FolderIcon} label="Documents" href="#documents" />
            <AppShellNavItem icon={UsersIcon} label="Members" href="#members" />
          </AppShellNav>
        </AppShellSidebarContent>
        <AppShellSidebarFooter>
          <AppShellNav>
            <AppShellNavItem icon={LifebuoyIcon} label="Help" href="#help" />
            <AppShellNavItem icon={GearIcon} label="Settings" href="#settings" />
          </AppShellNav>
        </AppShellSidebarFooter>
      </AppShellSidebar>
      <AppShellInset>
        <AppShellHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#workspace">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AppShellHeader>
        <AppShellMain>
          <h1 className="font-heading text-2xl font-semibold">Overview</h1>
          <ShellState />
          <div className="grid gap-4 md:grid-cols-3">
            {summaries.map((summary) => (
              <StatCard key={summary.title}>
                <StatCardLabel>{summary.title}</StatCardLabel>
                <StatCardValue>{summary.value}</StatCardValue>
                <StatCardDescription>{summary.description}</StatCardDescription>
              </StatCard>
            ))}
          </div>
        </AppShellMain>
      </AppShellInset>
    </AppShell>
  );
}

function sidebarElement(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>('[data-slot="sidebar"]')!;
}

function navLink(canvasElement: HTMLElement, name: string) {
  return within(sidebarElement(canvasElement)).getByRole('link', { name });
}

function headerTrigger(canvasElement: HTMLElement) {
  const header = canvasElement.querySelector<HTMLElement>('[data-slot="app-shell-header"]')!;
  return within(header).getByRole('button', { name: 'Toggle Sidebar' });
}

const meta = {
  title: 'Blocks/App Shell',
  component: AppShell,
  args: { defaultOpen: true, children: null },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The frame of an application: a collapsible sidebar with navigation, a top bar and the main content area. Use it once at the root of every signed-in screen.',
      },
    },
  },
  render: ({ defaultOpen, open, onOpenChange }) => (
    <Workspace defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange} />
  ),
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('main')).toBeInTheDocument();
    await expect(canvas.getByRole('group', { name: 'Workspace' })).toBeInTheDocument();
    await expect(canvas.getByRole('group', { name: 'Library' })).toBeInTheDocument();
    await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();

    const overview = navLink(canvasElement, 'Overview');
    await expect(overview).toHaveAttribute('aria-current', 'page');
    await expect(overview).toHaveAttribute('data-active');
    await expect(navLink(canvasElement, 'Reports')).not.toHaveAttribute('aria-current');
    await expect(canvas.getByTestId('custom-link')).toHaveAttribute('href', '#reports');
    await expect(navLink(canvasElement, 'Settings')).toHaveAttribute('href', '#settings');
    await expect(canvas.getByText('4')).toBeVisible();

    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'expanded');
    await expect(canvas.getByTestId('shell-state')).toHaveTextContent('expanded');
  },
};

export const Collapsed: Story = {
  args: { defaultOpen: false },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sidebar = sidebarElement(canvasElement);
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    await expect(sidebar).toHaveAttribute('data-collapsible', 'icon');

    const reports = navLink(canvasElement, 'Reports');
    await waitFor(() => expect(reports.getBoundingClientRect().width).toBeLessThanOrEqual(32));
    await expect(reports.querySelector('svg')).toBeVisible();
    const groupLabel = canvas.getByText('Workspace', { selector: 'div' });
    await waitFor(() => expect(groupLabel).not.toBeVisible());
    await expect(canvas.queryByText('4')).not.toBeVisible();

    await userEvent.hover(reports);
    await waitFor(() => {
      const tooltip = document.querySelector('[data-slot="tooltip-content"]');
      expect(tooltip).toHaveTextContent('Reports');
      expect(tooltip).toBeVisible();
    });
    await userEvent.unhover(reports);

    const settings = navLink(canvasElement, 'Settings');
    settings.focus();
    await waitFor(() => {
      const tooltips = [...document.querySelectorAll('[data-slot="tooltip-content"]')];
      expect(tooltips.some((tooltip) => tooltip.textContent === 'Settings')).toBe(true);
    });
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const sidebar = sidebarElement(canvasElement);
    await userEvent.click(canvas.getByRole('heading', { level: 1, name: 'Overview' }));

    await userEvent.keyboard('{Control>}b{/Control}');
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    await expect(canvas.getByTestId('shell-state')).toHaveTextContent('collapsed');
    await userEvent.keyboard('{Meta>}b{/Meta}');
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    const trigger = headerTrigger(canvasElement);
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    await expect(navLink(canvasElement, 'Overview')).toHaveAttribute('aria-current', 'page');
  },
};

export const Controlled: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    const [onOpenChange] = useState(() => fn(setOpen));
    return (
      <div data-testid="controlled" data-calls={onOpenChange.mock.calls.length}>
        <Workspace open={open} onOpenChange={onOpenChange} />
      </div>
    );
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(headerTrigger(canvasElement));
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'collapsed');
    await expect(canvas.getByTestId('controlled')).toHaveAttribute('data-calls', '1');
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvasElement, userEvent }) => {
    await waitFor(() => expect(document.documentElement).toHaveClass('dark'));
    await expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark');
    await expect(navLink(canvasElement, 'Overview')).toHaveAttribute('aria-current', 'page');
    await userEvent.click(headerTrigger(canvasElement));
    await expect(sidebarElement(canvasElement)).toHaveAttribute('data-state', 'collapsed');
  },
};
