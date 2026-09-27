import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ActivityItem,
  ActivityList,
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNav,
  AppShellNavLink,
  AppShellSidebar,
  Badge,
  Button,
  ConfirmationDialog,
  Dialog,
  DialogClose,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  Input,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
  ResponsivePanel,
  Stack,
  Text,
  Theme,
} from '../../../src/index.js';
import '../../../src/styles.css';

const parameters = new URLSearchParams(window.location.search);
const colorScheme = parameters.has('dark') ? 'dark' : 'light';

function ScopedTheme() {
  return (
    <Theme colorScheme={colorScheme}>
      <PageHeader>
        <Stack gap="xs">
          <PageHeaderTitle>Scoped header</PageHeaderTitle>
          <PageHeaderDescription>A themed region on a white host page.</PageHeaderDescription>
        </Stack>
      </PageHeader>
    </Theme>
  );
}

function Shell() {
  const [confirming, setConfirming] = useState(false);
  const [details, setDetails] = useState(false);
  return (
    <Theme colorScheme={colorScheme}>
      <AppShell
        navigationLabel="Espace de travail"
        openNavigationLabel="Ouvrir la navigation"
        closeNavigationLabel="Fermer la navigation"
      >
        <AppShellSidebar>
          <AppShellNav label="Sections">
            <AppShellNavLink href="#overview" active>
              Overview
            </AppShellNavLink>
          </AppShellNav>
        </AppShellSidebar>
        <AppShellHeader>
          <Text weight="medium">Shell overlays</Text>
        </AppShellHeader>
        <AppShellMain>
          <Stack gap="lg">
            <Dialog>
              <DialogTrigger>Open dialog</DialogTrigger>
              <DialogPopup closeLabel="Fermer la fenêtre">
                <DialogTitle>Plain dialog</DialogTitle>
                <Button hidden>Hidden portal action</Button>
                <DialogClose>Done</DialogClose>
              </DialogPopup>
            </Dialog>
            <Button variant="danger" onClick={() => setConfirming(true)}>
              Delete record
            </Button>
            <ConfirmationDialog
              open={confirming}
              onOpenChange={setConfirming}
              severity="destructive"
              title="Delete record?"
              description="This removes the record."
              actionLabel="Delete"
              cancelLabel="Keep record"
              closeLabel="Fermer la confirmation"
              onAction={() => setConfirming(false)}
            />
            <Button variant="secondary" onClick={() => setDetails(true)}>
              Show details
            </Button>
            <ResponsivePanel open={details} onOpenChange={setDetails} label="Record details">
              <Text>Details content</Text>
            </ResponsivePanel>
            <ActivityList aria-label="Recent activity">
              <ActivityItem
                title="Checkout confirmation flow"
                description="Flow completed"
                status={<Badge tone="success">Passed</Badge>}
                meta="2 minutes ago"
              />
              <ActivityItem
                href="#run"
                title="Checkout confirmation flow"
                description="Flow completed"
                status={<Badge tone="success">Passed</Badge>}
                meta="2 minutes ago"
              />
            </ActivityList>
            <Stack hidden>
              <Text>Hidden stack content</Text>
            </Stack>
            <Button hidden>Hidden action</Button>
            <Input hidden aria-label="Hidden input" />
            <EmptyState hidden title="Hidden empty state" description="Nothing to show." />
          </Stack>
        </AppShellMain>
      </AppShell>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(
  parameters.has('scoped') ? <ScopedTheme /> : <Shell />,
);
