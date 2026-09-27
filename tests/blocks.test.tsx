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
import { ConfirmationDialog } from '../src/blocks/confirmation-dialog.js';
import { Dialog, DialogPopup, DialogTitle, DialogTrigger } from '../src/components/dialog.js';
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

  it('rejects a stray dialog trigger instead of binding it to the navigation drawer', () => {
    mobile = true;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <AppShell>
          <AppShellMain>
            <DialogTrigger>Stray trigger</DialogTrigger>
          </AppShellMain>
        </AppShell>,
      ),
    ).toThrow(/Dialog\.Trigger/);
    consoleError.mockRestore();
  });

  it('announces supplied names for the navigation and dialog dismiss controls', async () => {
    mobile = true;
    const user = userEvent.setup();
    render(
      <AppShell
        navigationLabel="Espace de travail"
        openNavigationLabel="Ouvrir la navigation"
        closeNavigationLabel="Fermer la navigation"
      >
        <AppShellSidebar>
          <AppShellNav label="Sections">
            <AppShellNavLink href="/home">Home</AppShellNavLink>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellHeader>Workspace</AppShellHeader>
        <AppShellMain>
          <Dialog>
            <DialogTrigger>Open dialog</DialogTrigger>
            <DialogPopup closeLabel="Fermer la fenêtre">
              <DialogTitle>Plain dialog</DialogTitle>
            </DialogPopup>
          </Dialog>
        </AppShellMain>
      </AppShell>,
    );
    expect(screen.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument();
    const open = screen.getByRole('button', { name: 'Ouvrir la navigation' });
    await user.click(open);
    const drawer = await screen.findByRole('dialog', { name: 'Espace de travail' });
    await user.click(within(drawer).getByRole('button', { name: 'Fermer la navigation' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(open).toHaveFocus());
    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = await screen.findByRole('dialog', { name: 'Plain dialog' });
    await user.click(within(dialog).getByRole('button', { name: 'Fermer la fenêtre' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('names the confirmation dismiss control with the supplied label', () => {
    render(
      <ConfirmationDialog
        open
        onOpenChange={() => undefined}
        title="Delete record?"
        description="This removes the record."
        actionLabel="Delete"
        closeLabel="Fermer la confirmation"
        onAction={() => undefined}
      />,
    );
    const dialog = screen.getByRole('alertdialog', { name: 'Delete record?' });
    expect(within(dialog).getByRole('button', { name: 'Fermer la confirmation' })).toBeVisible();
    expect(within(dialog).queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
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
