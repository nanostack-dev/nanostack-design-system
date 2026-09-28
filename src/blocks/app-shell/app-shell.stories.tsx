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
import { useState, type ReactNode } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { StatCard, StatCardDescription, StatCardLabel, StatCardValue } from '@/blocks/stat-card';
import { ThemeProvider, ThemeToggle } from '@/blocks/theme';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { Columns, Column } from '@/layout/columns';
import { Inline } from '@/layout/inline';

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
  AppShellBrand,
  AppShellSidebarHeader,
  useAppShell,
} from './app-shell';

const summaries = [
  { title: 'Members', value: '24', description: 'Three joined this week.' },
  { title: 'Open tasks', value: '18', description: 'Five are due today.' },
  { title: 'Storage', value: '62%', description: 'Of the current plan.' },
];

const usage = `
The frame of an application: a collapsible sidebar with navigation, a sticky top bar with the sidebar trigger, and the main content area. Use it once at the root of every signed-in screen.

The parts are closed. They do not accept \`className\` or \`style\`. The frame takes its widths, its skip link and its sidebar surface from props.

## sidebarWidth: the expanded sidebar

| Value | Width | Use it for |
| --- | --- | --- |
| \`md\` | 16 rem | The default. A sidebar of \`AppShellNav\` groups. |
| \`lg\` | 17 rem | A sidebar with an icon rail next to a panel. |

## sidebarIconWidth: the collapsed sidebar

| Value | Width | Use it for |
| --- | --- | --- |
| \`md\` | 3 rem | The default. \`AppShellNavItem\` icons. |
| \`lg\` | 3.75 rem | A custom icon rail. It must equal the rail width. |

## AppShellSidebar material

| Value | Use it for |
| --- | --- |
| \`solid\` | The default. An opaque sidebar. |
| \`frosted\` | A translucent sidebar with a blur, for a product whose surfaces use the same material. It is solid with reduced transparency. |

## Other props

- \`AppShellBrand\`: the product mark at the top of the sidebar. Give it a Phosphor \`icon\` or your own \`logo\`, a \`name\`, an optional \`description\` and the home \`href\`. In the collapsed sidebar only the mark shows, with the name as its tooltip.

- \`skipLinkLabel\`: shows a "skip to content" link first in the tab order. It moves focus to \`AppShellMain\`. Give it on every product with more than a few sidebar links.
- \`mainId\`: the id of \`AppShellMain\`, the skip link target. Change it only when the page already uses \`app-shell-main\`.
- \`AppShellHeader actions\`: the end of the top bar, for example the theme toggle, notifications and the account menu. \`children\` is the start: the breadcrumb or the page title.
- \`AppShellNavItem href\`: renders the link component of \`DesignSystemProvider\`, so the product router handles the click.
- \`useAppShell()\`: reads and changes the sidebar state from any part of the page.

## Do not

- Do not put an \`AppShell\` inside another one.
- Do not add a second sidebar trigger. \`AppShellHeader\` has one.
- Do not add padding around \`AppShellMain\`. It sets the page padding and the gap between sections.
- Do not use \`sidebarIconWidth="lg"\` with \`AppShellNavItem\` icons alone. The items do not fill the extra width.
`;

function ShellState() {
  const { state, isMobile } = useAppShell();
  return (
    <Text tone="muted">
      Sidebar <span data-testid="shell-state">{state}</span>
      {isMobile ? ' on a small screen' : null}
    </Text>
  );
}

function Workspace({
  headerActions,
  ...props
}: Omit<AppShellProps, 'children'> & { headerActions?: ReactNode }) {
  return (
    <AppShell {...props}>
      <AppShellSidebar>
        <AppShellSidebarHeader>
          <AppShellBrand
            icon={CubeIcon}
            name="Acme workspace"
            description="Team plan"
            href="#workspace"
          />
        </AppShellSidebarHeader>
        <AppShellSidebarContent>
          <AppShellNav label="Workspace">
            <AppShellNavItem icon={HouseIcon} label="Overview" href="#overview" active />
            <AppShellNavItem icon={ChartBarIcon} label="Reports" href="#reports" />
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
        <AppShellHeader actions={headerActions}>
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
          <Heading level={1}>Overview</Heading>
          <ShellState />
          <Columns space="lg" collapseBelow="md">
            {summaries.map((summary) => (
              <Column key={summary.title}>
                <StatCard>
                  <StatCardLabel>{summary.title}</StatCardLabel>
                  <StatCardValue>{summary.value}</StatCardValue>
                  <StatCardDescription>{summary.description}</StatCardDescription>
                </StatCard>
              </Column>
            ))}
          </Columns>
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
    docs: { description: { component: usage } },
  },
  render: ({ children: _children, ...args }) => <Workspace {...args} />,
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

    await expect(
      within(sidebarElement(canvasElement)).getByRole('link', { name: /Acme workspace/ }),
    ).toHaveAttribute('href', '#workspace');
    await expect(canvas.getByText('Team plan')).toBeVisible();

    const overview = navLink(canvasElement, 'Overview');
    await expect(overview).toHaveAttribute('aria-current', 'page');
    await expect(overview).toHaveAttribute('data-active');
    await expect(navLink(canvasElement, 'Reports')).not.toHaveAttribute('aria-current');
    await expect(navLink(canvasElement, 'Reports')).toHaveAttribute('href', '#reports');
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
    const groupLabel = canvas.getByText('Workspace', {
      selector: '[data-slot="sidebar-group-label"]',
    });
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

export const SkipLink: Story = {
  args: { skipLinkLabel: 'Skip to main content' },
  parameters: {
    docs: {
      description: {
        story:
          'The skip link is the first stop of the tab order. It is hidden until it has focus, and it moves focus to `AppShellMain`.',
      },
    },
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const skipLink = canvas.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toHaveAttribute('href', '#app-shell-main');
    await userEvent.tab();
    await expect(skipLink).toHaveFocus();
    await expect(skipLink).toBeVisible();
    await userEvent.keyboard('{Enter}');
    const main = canvasElement.querySelector<HTMLElement>('[data-slot="app-shell-main"]')!;
    await expect(main).toHaveAttribute('id', 'app-shell-main');
    await waitFor(() => expect(main).toHaveFocus());
  },
};

export const RailWidths: Story = {
  args: { sidebarWidth: 'lg', sidebarIconWidth: 'lg' },
  parameters: {
    docs: {
      description: {
        story:
          'A product with an icon rail and a panel sets `sidebarWidth="lg"` and `sidebarIconWidth="lg"`: 17 rem open, 3.75 rem collapsed.',
      },
    },
  },
  play: async ({ canvasElement, userEvent }) => {
    const container = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar-container"]')!;
    await expect(container.getBoundingClientRect().width).toBe(272);
    await userEvent.click(headerTrigger(canvasElement));
    await waitFor(() => expect(container.getBoundingClientRect().width).toBe(60));
  },
};

export const HeaderActions: Story = {
  parameters: {
    docs: {
      description: {
        story: '`actions` puts controls at the end of the top bar, after the breadcrumb.',
      },
    },
  },
  render: (args) => (
    <ThemeProvider defaultTheme="light" storageKey="nanostack-theme-app-shell">
      <Workspace
        defaultOpen={args.defaultOpen}
        headerActions={
          <Inline space="sm" wrap={false}>
            <ThemeToggle />
          </Inline>
        }
      />
    </ThemeProvider>
  ),
  globals: { theme: 'light' },
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('[data-slot="app-shell-header"]')!;
    const actions = header.querySelector<HTMLElement>('[data-slot="app-shell-header-actions"]')!;
    const toggle = within(actions).getByRole('button', { name: 'Change theme' });
    const breadcrumb = within(header).getByRole('navigation', { name: 'breadcrumb' });
    await expect(toggle.getBoundingClientRect().left).toBeGreaterThan(
      breadcrumb.getBoundingClientRect().right,
    );
  },
};
