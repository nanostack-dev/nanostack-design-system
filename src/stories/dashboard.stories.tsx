import {
  ArchiveIcon,
  BellIcon,
  ChartLineUpIcon,
  CubeIcon,
  DownloadSimpleIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  PlusIcon,
  UsersIcon,
} from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, waitFor, within } from 'storybook/test';

import {
  AppShell,
  AppShellHeader,
  AppShellInset,
  AppShellMain,
  AppShellNav,
  AppShellNavItem,
  AppShellSidebar,
  AppShellSidebarContent,
  AppShellSidebarFooter,
  AppShellSidebarHeader,
} from '@/blocks/app-shell';
import { ConfirmDialog } from '@/blocks/confirm-dialog';
import { type ColumnDef, DataTable, DataTableColumnHeader } from '@/blocks/data-table';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/blocks/page-header';
import {
  StatCard,
  StatCardDescription,
  StatCardLabel,
  StatCardTrend,
  StatCardValue,
} from '@/blocks/stat-card';
import { type Theme, ThemeProvider, ThemeToggle } from '@/blocks/theme';
import { Badge, type BadgeVariant } from '@/components/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb';
import { Button } from '@/components/button';

type ProjectStatus = 'Healthy' | 'Degraded' | 'Paused';

type Project = {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  updated: string;
};

const initialProjects: Project[] = [
  { id: 'atlas', name: 'Atlas', owner: 'Ada Lovelace', status: 'Healthy', updated: '2026-09-26' },
  {
    id: 'beacon',
    name: 'Beacon',
    owner: 'Grace Hopper',
    status: 'Degraded',
    updated: '2026-09-25',
  },
  { id: 'cobalt', name: 'Cobalt', owner: 'Alan Turing', status: 'Healthy', updated: '2026-09-24' },
  { id: 'delta', name: 'Delta', owner: 'Barbara Liskov', status: 'Paused', updated: '2026-09-20' },
  { id: 'ember', name: 'Ember', owner: 'Radia Perlman', status: 'Healthy', updated: '2026-09-19' },
  { id: 'fjord', name: 'Fjord', owner: 'Donald Knuth', status: 'Degraded', updated: '2026-09-17' },
  {
    id: 'granite',
    name: 'Granite',
    owner: 'Frances Allen',
    status: 'Healthy',
    updated: '2026-09-12',
  },
];

const statusVariant: Record<ProjectStatus, BadgeVariant> = {
  Healthy: 'success',
  Degraded: 'warning',
  Paused: 'secondary',
};

const storageKey = 'nanostack-theme-showcase';
const onCreateProject = fn();
const onExport = fn();
const onArchive = fn();

function clearStoredTheme() {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    return;
  }
}

function projectColumns(archive: (project: Project) => void): ColumnDef<Project>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'owner',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: 'updated',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
      cell: ({ row }) => <span className="tabular-nums">{row.original.updated}</span>,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label={`Archive ${row.original.name}`}>
                <ArchiveIcon aria-hidden />
              </Button>
            }
            title={`Archive ${row.original.name}?`}
            description="The project stops and leaves this list. An owner can restore it for 30 days."
            confirmLabel="Archive project"
            tone="destructive"
            onConfirm={() => archive(row.original)}
          />
        </div>
      ),
    },
  ];
}

function DashboardScreen({ defaultTheme }: { defaultTheme: Theme }) {
  const [projects, setProjects] = useState(initialProjects);
  const activeCount = projects.filter((project) => project.status !== 'Paused').length;

  function archive(project: Project) {
    onArchive(project.id);
    setProjects((current) => current.filter((item) => item.id !== project.id));
  }

  return (
    <ThemeProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      <AppShell defaultOpen>
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
              <AppShellNavItem icon={FolderIcon} label="Projects" href="#projects" />
              <AppShellNavItem icon={ChartLineUpIcon} label="Usage" href="#usage" />
              <AppShellNavItem icon={BellIcon} label="Alerts" href="#alerts" badge="2" />
            </AppShellNav>
          </AppShellSidebarContent>
          <AppShellSidebarFooter>
            <AppShellNav>
              <AppShellNavItem icon={UsersIcon} label="Members" href="#members" />
              <AppShellNavItem icon={GearIcon} label="Settings" href="#settings" />
            </AppShellNav>
          </AppShellSidebarFooter>
        </AppShellSidebar>
        <AppShellInset>
          <AppShellHeader>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#workspace">Acme</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </AppShellHeader>
          <AppShellMain className="gap-6">
            <PageHeader>
              <PageHeaderContent>
                <PageHeaderTitle>Overview</PageHeaderTitle>
                <PageHeaderDescription>
                  The health of each project in the Acme workspace, updated every five minutes.
                </PageHeaderDescription>
              </PageHeaderContent>
              <PageHeaderActions>
                <Button variant="outline" onClick={onExport}>
                  <DownloadSimpleIcon data-icon="inline-start" aria-hidden />
                  Export
                </Button>
                <Button onClick={onCreateProject}>
                  <PlusIcon data-icon="inline-start" aria-hidden />
                  New project
                </Button>
              </PageHeaderActions>
            </PageHeader>
            <section
              aria-label="Key figures"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <StatCard role="group" aria-label="Active projects">
                <StatCardLabel>Active projects</StatCardLabel>
                <StatCardValue data-testid="active-projects">{activeCount}</StatCardValue>
                <StatCardTrend direction="up">+2</StatCardTrend>
                <StatCardDescription>Two more than last month</StatCardDescription>
              </StatCard>
              <StatCard role="group" aria-label="Members">
                <StatCardLabel>Members</StatCardLabel>
                <StatCardValue>48</StatCardValue>
                <StatCardTrend direction="up">+12%</StatCardTrend>
                <StatCardDescription>Compared with last month</StatCardDescription>
              </StatCard>
              <StatCard role="group" aria-label="Monthly spend">
                <StatCardLabel>Monthly spend</StatCardLabel>
                <StatCardValue>$3,412</StatCardValue>
                <StatCardTrend direction="flat">0%</StatCardTrend>
                <StatCardDescription>Inside the plan budget</StatCardDescription>
              </StatCard>
              <StatCard role="group" aria-label="Error rate">
                <StatCardLabel>Error rate</StatCardLabel>
                <StatCardValue>0.8%</StatCardValue>
                <StatCardTrend direction="down" tone="positive">
                  -0.3%
                </StatCardTrend>
                <StatCardDescription>Lower is better</StatCardDescription>
              </StatCard>
            </section>
            <section aria-labelledby="projects-heading" className="flex flex-col gap-3">
              <PageHeaderTitle level={2} id="projects-heading">
                Projects
              </PageHeaderTitle>
              <DataTable
                columns={projectColumns(archive)}
                data={projects}
                getRowId={(project) => project.id}
                searchLabel="Search projects"
                searchPlaceholder="Search projects"
                pageSize={5}
              />
            </section>
          </AppShellMain>
        </AppShellInset>
      </AppShell>
    </ThemeProvider>
  );
}

const root = () => document.documentElement;

function tableRows(canvasElement: HTMLElement) {
  const table = within(canvasElement).getByRole('table');
  return within(table).getAllByRole('row').slice(1);
}

const meta = {
  title: 'Showcase/Dashboard',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A full screen built only from library parts: `AppShell`, `PageHeader`, `StatCard`, `DataTable`, `ThemeToggle` and `ConfirmDialog`. Use it as a model for a product dashboard. The data and the copy belong to the product.',
      },
    },
  },
  beforeEach: () => {
    const hadDarkClass = root().classList.contains('dark');
    const colorScheme = root().style.colorScheme;
    clearStoredTheme();
    onArchive.mockClear();
    return () => {
      root().classList.toggle('dark', hadDarkClass);
      root().style.colorScheme = colorScheme;
      clearStoredTheme();
    };
  },
  render: (_args, { globals }) => (
    <DashboardScreen defaultTheme={globals.theme === 'dark' ? 'dark' : 'light'} />
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    await step('the page shows the frame, the header and the key figures', async () => {
      await expect(canvas.getByRole('main')).toBeInTheDocument();
      await expect(canvas.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
      const sidebar = canvasElement.querySelector<HTMLElement>('[data-slot="sidebar"]')!;
      await expect(within(sidebar).getByRole('link', { name: 'Overview' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      const figures = within(canvas.getByRole('region', { name: 'Key figures' }));
      for (const name of ['Active projects', 'Members', 'Monthly spend', 'Error rate']) {
        await expect(figures.getByRole('group', { name })).toBeVisible();
      }
      await expect(canvas.getByTestId('active-projects')).toHaveTextContent('6');
      await expect(canvas.getByText('Page 1 of 2')).toBeVisible();
    });
  },
};

export const Workflow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The play test uses the screen as a person does: header actions, search, sort, cancel and confirm in the dialog, and the theme toggle.',
      },
    },
  },
  play: async ({ canvas, canvasElement, globals, step, userEvent }) => {
    await expect(canvas.getByTestId('active-projects')).toHaveTextContent('6');

    await step('the header actions call their handlers', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'New project' }));
      await expect(onCreateProject).toHaveBeenCalledTimes(1);
      await userEvent.click(canvas.getByRole('button', { name: 'Export' }));
      await expect(onExport).toHaveBeenCalledTimes(1);
    });

    await step('search and sort filter the projects table', async () => {
      const search = canvas.getByRole('searchbox', { name: 'Search projects' });
      await userEvent.type(search, 'grace');
      await waitFor(() => expect(tableRows(canvasElement)).toHaveLength(1));
      await expect(tableRows(canvasElement)[0]).toHaveTextContent('Beacon');
      await userEvent.clear(search);
      await waitFor(() => expect(tableRows(canvasElement)).toHaveLength(5));

      await userEvent.click(canvas.getByRole('button', { name: 'Project' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Project' }));
      await waitFor(() => expect(tableRows(canvasElement)[0]).toHaveTextContent('Granite'));
      await userEvent.click(canvas.getByRole('button', { name: 'Project' }));
    });

    await step('cancel keeps the project and returns focus to the trigger', async () => {
      const trigger = canvas.getByRole('button', { name: 'Archive Atlas' });
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('alertdialog', { name: 'Archive Atlas?' });
      await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
      await expect(onArchive).not.toHaveBeenCalled();
    });

    await step('confirm archives the project and updates the key figure', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Archive Atlas' }));
      const dialog = await screen.findByRole('alertdialog', { name: 'Archive Atlas?' });
      await userEvent.click(within(dialog).getByRole('button', { name: 'Archive project' }));
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
      await expect(onArchive).toHaveBeenCalledWith('atlas');
      await expect(canvas.queryByRole('button', { name: 'Archive Atlas' })).toBeNull();
      await expect(canvas.getByTestId('active-projects')).toHaveTextContent('5');
    });

    await step('the theme toggle changes the theme and changes it back', async () => {
      const startTheme = globals.theme === 'dark' ? 'Dark' : 'Light';
      const otherTheme = startTheme === 'Dark' ? 'Light' : 'Dark';
      const trigger = canvas.getByRole('button', { name: 'Change theme' });

      await userEvent.click(trigger);
      let menu = await screen.findByRole('menu');
      await userEvent.click(within(menu).getByRole('menuitemradio', { name: otherTheme }));
      await waitFor(() => expect(root().classList.contains('dark')).toBe(otherTheme === 'Dark'));
      await waitFor(() => expect(trigger).toHaveFocus());

      await userEvent.click(trigger);
      menu = await screen.findByRole('menu');
      await userEvent.click(within(menu).getByRole('menuitemradio', { name: startTheme }));
      await waitFor(() => expect(root().classList.contains('dark')).toBe(startTheme === 'Dark'));
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    });
  },
};
