import { DownloadSimpleIcon, PlusIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb';
import { Button } from '@/components/button';

import {
  PageHeader,
  PageHeaderActions,
  PageHeaderBreadcrumb,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from './page-header';

const onCreate = fn();
const onExport = fn();

function Actions() {
  return (
    <PageHeaderActions>
      <Button variant="outline" onClick={onExport}>
        <DownloadSimpleIcon data-icon="inline-start" aria-hidden />
        Export
      </Button>
      <Button onClick={onCreate}>
        <PlusIcon data-icon="inline-start" aria-hidden />
        New project
      </Button>
    </PageHeaderActions>
  );
}

function hasNoHorizontalOverflow(element: HTMLElement) {
  return element.scrollWidth <= element.clientWidth;
}

const meta = {
  title: 'Blocks/Page Header',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The top of a page: breadcrumb, title, description and actions. Use it once at the top of each page, inside `AppShellMain`.',
      },
    },
  },
  beforeEach: () => {
    onCreate.mockClear();
    onExport.mockClear();
  },
  render: () => (
    <div className="w-full max-w-4xl">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Projects</PageHeaderTitle>
          <PageHeaderDescription>
            Every project that your team can open and edit.
          </PageHeaderDescription>
        </PageHeaderContent>
        <Actions />
      </PageHeader>
    </div>
  ),
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
    await expect(canvas.getByText('Every project that your team can open and edit.')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'New project' }));
    await expect(onCreate).toHaveBeenCalledOnce();
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('button', { name: 'Export' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onExport).toHaveBeenCalledOnce();

    const title = canvas.getByRole('heading', { name: 'Projects' });
    const actions = canvas.getByRole('button', { name: 'Export' });
    await expect(actions.getBoundingClientRect().left).toBeGreaterThan(
      title.getBoundingClientRect().right,
    );
  },
};

export const WithBreadcrumb: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <PageHeader>
        <PageHeaderBreadcrumb>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#workspace">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Projects</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </PageHeaderBreadcrumb>
        <PageHeaderContent>
          <PageHeaderTitle>Projects</PageHeaderTitle>
          <PageHeaderDescription>
            Every project that your team can open and edit.
          </PageHeaderDescription>
        </PageHeaderContent>
        <Actions />
      </PageHeader>
    </div>
  ),
  play: async ({ canvas }) => {
    const breadcrumb = canvas.getByRole('navigation', { name: 'breadcrumb' });
    const title = canvas.getByRole('heading', { level: 1, name: 'Projects' });
    await expect(canvas.getByRole('link', { name: 'Workspace' })).toHaveAttribute(
      'href',
      '#workspace',
    );
    await expect(breadcrumb.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      title.getBoundingClientRect().top,
    );
  },
};

export const SectionHeading: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle level={2}>Members</PageHeaderTitle>
          <PageHeaderDescription>People with access to this workspace.</PageHeaderDescription>
        </PageHeaderContent>
      </PageHeader>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Members' })).toBeVisible();
    await expect(canvas.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  },
};

export const LongTitle: Story = {
  render: () => (
    <div data-testid="narrow" className="w-72 rounded-lg border border-border p-4">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>
            Quarterly planning for the infrastructure reliability programme across every region
            Supercalifragilisticexpialidociously
          </PageHeaderTitle>
          <PageHeaderDescription>
            A long description that continues past the width of the container and wraps onto several
            lines without pushing the layout sideways.
          </PageHeaderDescription>
        </PageHeaderContent>
        <Actions />
      </PageHeader>
    </div>
  ),
  play: async ({ canvas }) => {
    const container = canvas.getByTestId('narrow');
    const header = canvas.getByRole('banner');
    const title = canvas.getByRole('heading', { level: 1 });
    await expect(hasNoHorizontalOverflow(container)).toBe(true);
    await expect(hasNoHorizontalOverflow(header)).toBe(true);
    await expect(hasNoHorizontalOverflow(title)).toBe(true);
    await expect(title.getBoundingClientRect().height).toBeGreaterThan(40);
    const exportButton = canvas.getByRole('button', { name: 'Export' });
    await expect(exportButton.getBoundingClientRect().top).toBeGreaterThan(
      title.getBoundingClientRect().bottom,
    );
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
  play: async ({ canvas, userEvent }) => {
    await expect(document.documentElement).toHaveClass('dark');
    await expect(getComputedStyle(document.documentElement).colorScheme).toBe('dark');
    await expect(canvas.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'New project' }));
    await expect(onCreate).toHaveBeenCalledOnce();
  },
};
