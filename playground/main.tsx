import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Theme,
  type Brand,
  type ColorScheme,
  type Density,
  AppShell,
  AppShellSidebar,
  AppShellBrand,
  AppShellNav,
  AppShellNavLink,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  PageHeader,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionBody,
  Button,
  Badge,
  Text,
  Heading,
  Stack,
  Cluster,
  Grid,
  Surface,
  Divider,
  Skeleton,
  Field,
  FieldLabel,
  FieldDescription,
  Input,
  Select,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Metric,
  ActivityList,
  ActivityItem,
  EmptyState,
} from '../src/index.js';
import '../src/styles.css';
import { Catalog } from './catalog.js';

function Mark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m12 2 10 5-10 5L2 7l10-5Zm-10 10 10 5 10-5M2 17l10 5 10-5" />
    </svg>
  );
}
function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function Overview() {
  return (
    <Stack gap="xl">
      <Grid columns={3}>
        <Metric
          label="One visual vocabulary"
          value="3 layers"
          hint="Foundations, controls, composed blocks"
        />
        <Metric label="Built for your products" value="2 consumers" hint="Echopoint and Anchor" />
        <Metric label="Styling contract" value="Typed variants" hint="No consumer CSS overrides" />
      </Grid>
      <Section id="composition">
        <SectionHeader>
          <Stack gap="xs">
            <SectionTitle>Compose a workspace</SectionTitle>
            <SectionDescription>
              A live example assembled from the same blocks your applications import.
            </SectionDescription>
          </Stack>
          <Badge tone="info">Example data</Badge>
        </SectionHeader>
        <SectionBody>
          <Surface padding="lg">
            <Stack gap="lg">
              <Cluster justify="between">
                <Stack gap="xs">
                  <Heading level={3} size="xl">
                    Your workspace, at a glance
                  </Heading>
                  <Text tone="muted" size="sm">
                    Recent activity and the next useful action.
                  </Text>
                </Stack>
                <Dialog>
                  <DialogTrigger size="sm">Create a flow</DialogTrigger>
                  <DialogPopup>
                    <DialogTitle>Start with a clear name</DialogTitle>
                    <DialogDescription>
                      This is an interaction example. It does not create a production flow.
                    </DialogDescription>
                    <Stack gap="lg">
                      <Field name="flow-name">
                        <FieldLabel>Flow name</FieldLabel>
                        <Input autoComplete="off" placeholder="Payment confirmation…" />
                        <FieldDescription>Use the outcome this flow verifies.</FieldDescription>
                      </Field>
                      <Cluster justify="end">
                        <DialogClose>Close example</DialogClose>
                      </Cluster>
                    </Stack>
                  </DialogPopup>
                </Dialog>
              </Cluster>
              <ActivityList aria-label="Example workspace activity">
                <ActivityItem
                  title="Checkout → confirmation"
                  description="Flow completed · 12 steps"
                  icon={<Mark />}
                  status={<Badge tone="success">Passed</Badge>}
                  meta="2 min ago"
                />
                <ActivityItem
                  title="Stripe payment webhook"
                  description="Event received · POST /payment-events"
                  icon={<Arrow />}
                  status={<Badge tone="info">Received</Badge>}
                  meta="8 min ago"
                />
                <ActivityItem
                  title="Customer account sync"
                  description="A request needs your attention"
                  icon={<Mark />}
                  status={<Badge tone="warning">Review</Badge>}
                  meta="24 min ago"
                />
              </ActivityList>
            </Stack>
          </Surface>
        </SectionBody>
      </Section>
      <Grid columns={2} gap="lg">
        <Section>
          <SectionHeader>
            <SectionTitle>Start small. Keep the contract.</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <Stack gap="md">
              <Text tone="muted">
                A block owns one useful piece of interface. Combine its parts, choose a supported
                variation, and keep application logic in your product.
              </Text>
              <Divider />
              <Text size="sm">Theme → AppShell → PageHeader → Section → ActivityList</Text>
              <Text tone="muted" size="sm">
                The same composition can use a different brand, density, or color scheme without
                changing its markup.
              </Text>
            </Stack>
          </SectionBody>
        </Section>
        <Section>
          <SectionHeader>
            <SectionTitle>Designed for what happens next</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <Stack gap="md">
              <Text tone="muted">
                Every new variation becomes part of the shared vocabulary, with a typed API and a
                behavior test. Fix the source once, then upgrade each product deliberately.
              </Text>
              <Cluster>
                <Badge>React 19</Badge>
                <Badge>Base UI</Badge>
                <Badge>shadcn patterns</Badge>
              </Cluster>
              <Text size="sm" tone="muted">
                Version 0.1.0-beta.1 · Changes are reviewed before adoption.
              </Text>
            </Stack>
          </SectionBody>
        </Section>
      </Grid>
    </Stack>
  );
}

function Controls() {
  return (
    <Stack gap="xl">
      <Section>
        <SectionHeader>
          <SectionTitle>Actions</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <Cluster>
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="ghost">Quiet action</Button>
            <Button variant="danger">Delete item</Button>
            <Button disabled>Unavailable</Button>
          </Cluster>
        </SectionBody>
      </Section>
      <Section>
        <SectionHeader>
          <SectionTitle>Semantic status</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <Cluster>
            <Badge>Draft</Badge>
            <Badge tone="info">Running</Badge>
            <Badge tone="success">Passed</Badge>
            <Badge tone="warning">Needs review</Badge>
            <Badge tone="danger">Failed</Badge>
          </Cluster>
        </SectionBody>
      </Section>
      <Grid columns={2} gap="lg">
        <Section>
          <SectionHeader>
            <SectionTitle>Form fields</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <Stack gap="lg">
              <Field name="endpoint">
                <FieldLabel>Endpoint URL</FieldLabel>
                <Input
                  type="url"
                  size="sm"
                  autoComplete="url"
                  placeholder="https://api.example.com/events…"
                />
                <FieldDescription>The address that receives your test request.</FieldDescription>
              </Field>
              <Field name="environment">
                <FieldLabel>Environment</FieldLabel>
                <Select
                  options={[
                    { value: 'all', label: 'All environments' },
                    { value: 'dev', label: 'Development' },
                    { value: 'prod', label: 'Production' },
                  ]}
                  defaultValue="all"
                  size="sm"
                />
                <FieldDescription>Filter the currently shown records.</FieldDescription>
              </Field>
              <Field name="locked" disabled>
                <FieldLabel>Organization</FieldLabel>
                <Input defaultValue="Example workspace" disabled />
                <FieldDescription>Managed by your organization administrator.</FieldDescription>
              </Field>
            </Stack>
          </SectionBody>
        </Section>
        <Section>
          <SectionHeader>
            <SectionTitle>Feedback and recovery</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <Surface>
              <EmptyState
                title="No activity yet"
                description="Your first event will appear here. Create a flow to try the interaction."
                action={
                  <Dialog>
                    <DialogTrigger variant="secondary">Try a dialog</DialogTrigger>
                    <DialogPopup>
                      <DialogTitle>Keep the next step clear</DialogTitle>
                      <DialogDescription>
                        Escape dismisses this dialog and returns focus to the trigger. Theme tokens
                        follow the portal.
                      </DialogDescription>
                      <DialogClose>Done</DialogClose>
                    </DialogPopup>
                  </Dialog>
                }
              />
            </Surface>
          </SectionBody>
        </Section>
      </Grid>
      <Section>
        <SectionHeader>
          <SectionTitle>Loading</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <Stack gap="sm" role="status" aria-label="Loading example">
            <Skeleton size="sm" />
            <Skeleton />
            <Skeleton size="lg" />
          </Stack>
        </SectionBody>
      </Section>
    </Stack>
  );
}

function Principles() {
  return (
    <Stack gap="xl">
      <Section>
        <SectionHeader>
          <SectionTitle>Variation is a shared decision</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <Stack gap="md">
            <Text>
              Use semantic variants such as tone="success", size="sm", density="compact", and
              columns={2}. Components reject className, style, css, classNames, unstyled, render,
              and asChild.
            </Text>
            <Text tone="muted">
              Need a different appearance? Add a documented variation to the library. Raw design
              tokens remain internal, so a change can reach every block together.
            </Text>
          </Stack>
        </SectionBody>
      </Section>
      <Section>
        <SectionHeader>
          <SectionTitle>Behavior belongs to the right layer</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <Stack gap="md">
            <Text>
              Base UI handles complex interaction. Nanostack owns appearance and composition.
              Applications own data, routing, authentication, and permissions.
            </Text>
            <Text tone="muted">
              A linked activity row is a real anchor. A button is a real button. Dialogs retain
              names, keyboard behavior, focus trapping, and focus return.
            </Text>
          </Stack>
        </SectionBody>
      </Section>
      <Section>
        <SectionHeader>
          <SectionTitle>Change with evidence</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <Text tone="muted">
            The repository includes source research, contributor guidance, API type checks,
            interaction tests, contrast checks, browser accessibility scans, and package
            installation tests. Start with the README, then docs/research.md.
          </Text>
        </SectionBody>
      </Section>
    </Stack>
  );
}

function Playground() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [density, setDensity] = useState<Density>('comfortable');
  const [brand, setBrand] = useState<Brand>('nanostack');
  const [tab, setTab] = useState('blocks');
  return (
    <Theme colorScheme={colorScheme} density={density} brand={brand}>
      <AppShell>
        <AppShellSidebar>
          <AppShellBrand>
            <Mark />
            Nanostack
          </AppShellBrand>
          <AppShellNav label="Design system">
            <AppShellNavLink
              href="#blocks"
              active={tab === 'blocks'}
              icon={<Mark />}
              onClick={() => setTab('blocks')}
            >
              Building blocks
            </AppShellNavLink>
            <AppShellNavLink
              href="#controls"
              active={tab === 'controls'}
              icon={<Arrow />}
              onClick={() => setTab('controls')}
            >
              Controls & states
            </AppShellNavLink>
            <AppShellNavLink
              href="#principles"
              active={tab === 'principles'}
              onClick={() => setTab('principles')}
            >
              Principles
            </AppShellNavLink>
          </AppShellNav>
          <AppShellNav label="Resources">
            <AppShellNavLink href="https://github.com/nanostack-dev/nanostack-design-system">
              Source & documentation
            </AppShellNavLink>
            <AppShellNavLink href="https://base-ui.com/react/overview/accessibility">
              Accessibility foundations
            </AppShellNavLink>
          </AppShellNav>
          <AppShellFooter>
            <Stack gap="sm">
              <Badge tone="info">0.1.0 beta</Badge>
              <Text size="sm" tone="muted">
                A shared language for products that work together.
              </Text>
            </Stack>
          </AppShellFooter>
        </AppShellSidebar>
        <AppShellHeader>
          <Cluster justify="between">
            <Text size="sm" weight="medium">
              Design system /{' '}
              {tab === 'blocks'
                ? 'Building blocks'
                : tab === 'controls'
                  ? 'Controls & states'
                  : 'Principles'}
            </Text>
            <Cluster gap="sm">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Change brand"
                onClick={() => setBrand(brand === 'anchor' ? 'echopoint' : 'anchor')}
              >
                {brand === 'nanostack' ? 'Nanostack' : brand === 'anchor' ? 'Anchor' : 'Echopoint'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Toggle density"
                onClick={() => setDensity(density === 'comfortable' ? 'compact' : 'comfortable')}
              >
                {density === 'compact' ? 'Compact' : 'Comfortable'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Toggle color scheme"
                onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
              >
                {colorScheme === 'light' ? 'Dark mode' : 'Light mode'}
              </Button>
            </Cluster>
          </Cluster>
        </AppShellHeader>
        <AppShellMain>
          <PageHeader>
            <Stack gap="xs">
              <PageHeaderTitle>Good parts. Better together.</PageHeaderTitle>
              <PageHeaderDescription>
                Build a consistent product from a small, considered set of blocks.
              </PageHeaderDescription>
            </Stack>
            <PageHeaderActions>
              <Badge tone="info">Library preview</Badge>
            </PageHeaderActions>
          </PageHeader>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList aria-label="Library sections">
              <TabsTab value="blocks">Blocks</TabsTab>
              <TabsTab value="controls">Controls & states</TabsTab>
              <TabsTab value="principles">Principles</TabsTab>
            </TabsList>
            <TabsPanel value="blocks">
              <Overview />
            </TabsPanel>
            <TabsPanel value="controls">
              <Controls />
            </TabsPanel>
            <TabsPanel value="principles">
              <Principles />
            </TabsPanel>
          </Tabs>
        </AppShellMain>
      </AppShell>
    </Theme>
  );
}

const root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <StrictMode>
      {new URLSearchParams(window.location.search).has('catalog') ? <Catalog /> : <Playground />}
    </StrictMode>,
  );
