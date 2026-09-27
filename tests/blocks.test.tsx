import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRef } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Theme } from '../src/theme.js';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNav,
  AppShellNavLink,
  AppShellSidebar,
} from '../src/blocks/app-shell.js';
import { ActivityItem, ActivityList } from '../src/blocks/activity-list.js';
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderTitle,
} from '../src/blocks/page-header.js';
import { Section, SectionBody, SectionHeader, SectionTitle } from '../src/blocks/section.js';
import { EmptyState } from '../src/blocks/empty-state.js';
import { Metric } from '../src/blocks/metric.js';

let mobile = false;

beforeEach(() => {
  mobile = false;
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query === '(max-width: 767px)' && mobile,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});

function ShellExample() {
  return (
    <Theme colorScheme="dark" brand="echopoint">
      <AppShell mainId="workspace-content">
        <AppShellSidebar>
          <AppShellNav label="Workspace">
            <AppShellNavLink href="/home" active>
              Home
            </AppShellNavLink>
            <AppShellNavLink href="/flows" onClick={(event) => event.preventDefault()}>
              Flows
            </AppShellNavLink>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellHeader>Current workspace</AppShellHeader>
        <AppShellMain>
          <h1>Workspace overview</h1>
        </AppShellMain>
      </AppShell>
    </Theme>
  );
}

describe('application shell', () => {
  it('provides one navigation landmark, real links, active state and a focusable skip target', async () => {
    render(<ShellExample />);
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Flows' })).toHaveAttribute('href', '/flows');
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#workspace-content',
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'workspace-content');
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(screen.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument();
  });

  it('opens a named mobile dialog, keeps focus inside and restores focus on Escape', async () => {
    mobile = true;
    const user = userEvent.setup();
    render(<ShellExample />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Open navigation' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Workspace navigation' });
    expect(within(dialog).getAllByRole('navigation')).toHaveLength(1);
    expect(dialog.closest('[data-ns-theme]')).toHaveAttribute('data-ns-theme', 'dark');
    expect(dialog.closest('[data-ns-brand]')).toHaveAttribute('data-ns-brand', 'echopoint');
    await user.tab();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes mobile navigation after an app router handles a link', async () => {
    mobile = true;
    const user = userEvent.setup();
    render(<ShellExample />);
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    await user.click(await screen.findByRole('link', { name: 'Flows' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

describe('content blocks', () => {
  it('composes a heading hierarchy, actions and meaningful empty state', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <>
        <PageHeader>
          <PageHeaderTitle>Workspace</PageHeaderTitle>
          <PageHeaderDescription>Recent activity</PageHeaderDescription>
          <PageHeaderActions>
            <button onClick={onCreate}>Create flow</button>
          </PageHeaderActions>
        </PageHeader>
        <Section aria-labelledby="runs-title">
          <SectionHeader>
            <SectionTitle id="runs-title">Runs</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <EmptyState
              title="No executions yet"
              description="Run a flow to see its result here."
              action={<button onClick={onCreate}>Run your first flow</button>}
            />
          </SectionBody>
        </Section>
      </>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Workspace' })).toBeVisible();
    const region = screen.getByRole('region', { name: 'Runs' });
    expect(within(region).getByRole('group', { name: 'No executions yet' })).toBeVisible();
    await user.click(within(region).getByRole('button', { name: 'Run your first flow' }));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('keeps activity links native and metrics labelled', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <>
        <Metric label="Success rate" value="99.8%" hint="Last 24 hours" tone="success" />
        <ActivityList aria-label="Recent executions">
          <ActivityItem
            ref={ref}
            href="/executions/1"
            title="Checkout smoke test"
            description="Production"
            status="Succeeded"
            meta="2 minutes ago"
          />
          <ActivityItem title="Waiting for first webhook" />
        </ActivityList>
      </>,
    );
    expect(screen.getByRole('group', { name: 'Success rate' })).toHaveTextContent('99.8%');
    expect(screen.getByRole('list', { name: 'Recent executions' })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    const link = screen.getByRole('link', { name: /Checkout smoke test/ });
    expect(link).toHaveAttribute('href', '/executions/1');
    expect(ref.current).toBe(link);
  });
});
