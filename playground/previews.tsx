import { useEffect, type ComponentType } from 'react';
import { ChartBar, CheckCircle, Gear, House, Warning } from '@phosphor-icons/react';
import * as UI from '../src/index.js';

export const previewNames = ['workspace', 'centered', 'split'] as const;
export type PreviewName = (typeof previewNames)[number];

const previewTitles: Record<PreviewName, string> = {
  workspace: 'Workspace shell example',
  centered: 'Centered screen example',
  split: 'Split screen example',
};

export function previewHref(name: PreviewName, theme: UI.ThemeSettings) {
  return `?preview=${name}&brand=${theme.brand}&scheme=${theme.colorScheme}&density=${theme.density}`;
}

export function previewTitle(name: PreviewName) {
  return previewTitles[name];
}

function pick<T extends string>(value: string | null, options: readonly T[], fallback: T): T {
  return options.find((option) => option === value) ?? fallback;
}

export function readPreview(parameters: URLSearchParams) {
  const name = previewNames.find((option) => option === parameters.get('preview'));
  if (!name) return null;
  const theme: UI.ThemeSettings = {
    brand: pick(parameters.get('brand'), ['nanostack', 'echopoint', 'anchor'], 'nanostack'),
    colorScheme: pick(parameters.get('scheme'), ['light', 'dark'], 'light'),
    density: pick(parameters.get('density'), ['comfortable', 'compact'], 'comfortable'),
  };
  return { name, theme };
}

function WorkspacePreview() {
  const { brand } = UI.useThemeSettings();
  return (
    <UI.AppShell collapsibleSidebar layout="workspace" mainId="preview-main" navigationLabel="Example navigation">
      <UI.AppShellSidebar>
        <UI.AppShellBrand>
          <UI.BrandMark brand={brand} />
          Example workspace
        </UI.AppShellBrand>
        <UI.AppShellNav label="Workspace">
          <UI.AppShellNavLink href="#home" active icon={<UI.Icon glyph={House} />}>
            Home
          </UI.AppShellNavLink>
          <UI.AppShellNavLink href="#reports" icon={<UI.Icon glyph={ChartBar} />}>
            Reports
          </UI.AppShellNavLink>
          <UI.AppShellNavLink href="#settings" icon={<UI.Icon glyph={Gear} />}>
            Settings
          </UI.AppShellNavLink>
        </UI.AppShellNav>
        <UI.AppShellFooter>
          <UI.Text size="sm" tone="muted">
            Example data only
          </UI.Text>
        </UI.AppShellFooter>
      </UI.AppShellSidebar>
      <UI.AppShellBody>
        <UI.AppShellHeader>
          <UI.AppShellSidebarToggle />
          <UI.AppShellHeaderTitle>Home</UI.AppShellHeaderTitle>
          <UI.AppShellHeaderActions>
            <UI.Button variant="secondary" size="sm">
              Search<UI.KeyboardKey>⌘ K</UI.KeyboardKey>
            </UI.Button>
          </UI.AppShellHeaderActions>
        </UI.AppShellHeader>
        <UI.AppShellMain>
          <UI.Page>
            <UI.PageHeader>
              <UI.PageHeaderContent>
                <UI.PageHeaderTitle>Home</UI.PageHeaderTitle>
                <UI.PageHeaderDescription>
                  Recent activity and the next useful action.
                </UI.PageHeaderDescription>
              </UI.PageHeaderContent>
              <UI.PageHeaderActions>
                <UI.Button>Create record</UI.Button>
              </UI.PageHeaderActions>
            </UI.PageHeader>
            <UI.Grid columns={3}>
              <UI.Metric label="Records" value="128" />
              <UI.Metric label="Passing checks" value="97%" tone="success" />
              <UI.Metric label="Needs review" value="3" tone="warning" />
            </UI.Grid>
            <UI.ActivityList aria-label="Example workspace activity">
              <UI.ActivityItem
                title="Release verification"
                description="12 checks completed"
                icon={<UI.Icon glyph={CheckCircle} />}
                status={<UI.Badge tone="success">Passed</UI.Badge>}
                meta="2 min ago"
              />
              <UI.ActivityItem
                title="Account sync"
                description="A setting changed outside the application"
                icon={<UI.Icon glyph={Warning} />}
                status={<UI.Badge tone="warning">Review</UI.Badge>}
                meta="24 min ago"
              />
            </UI.ActivityList>
          </UI.Page>
        </UI.AppShellMain>
        <UI.AppShellDock>
          <UI.Page>
            <UI.Cluster justify="between">
              <UI.Text size="sm" weight="medium">
                Dock: background tasks
              </UI.Text>
              <UI.StatusMarker variant="dot" tone="info" activity="active">
                Syncing 2 records
              </UI.StatusMarker>
            </UI.Cluster>
          </UI.Page>
        </UI.AppShellDock>
      </UI.AppShellBody>
    </UI.AppShell>
  );
}

function CenteredPreview() {
  const { brand } = UI.useThemeSettings();
  return (
    <UI.CenteredScreen>
      <UI.ScreenContent>
        <UI.BrandMark brand={brand} size="lg" />
        <UI.Stack gap="sm" align="center">
          <UI.Heading level={1} size="2xl">
            Check your inbox
          </UI.Heading>
          <UI.Text tone="muted">
            We sent a sign-in link to name@example.com. The link expires in 15 minutes.
          </UI.Text>
        </UI.Stack>
        <UI.Cluster justify="center">
          <UI.Button>Send the link again</UI.Button>
          <UI.Link href="#password" variant="ghost">
            Use a password
          </UI.Link>
        </UI.Cluster>
      </UI.ScreenContent>
    </UI.CenteredScreen>
  );
}

function SplitPreview() {
  const { brand } = UI.useThemeSettings();
  return (
    <UI.SplitScreen>
      <UI.SplitScreenAside>
        <UI.BrandMark brand={brand} size="lg" />
        <UI.Text size="lg" weight="semibold">
          One account for every Nanostack product.
        </UI.Text>
        <UI.List>
          <UI.ListItem>Your organization and roles follow you.</UI.ListItem>
          <UI.ListItem>Each product keeps its own data.</UI.ListItem>
        </UI.List>
      </UI.SplitScreenAside>
      <UI.SplitScreenMain>
        <UI.Card>
          <UI.CardHeader>
            <UI.Heading level={1} size="xl">
              Sign in
            </UI.Heading>
            <UI.CardDescription>Use the email address of your workspace.</UI.CardDescription>
          </UI.CardHeader>
          <UI.CardContent>
            <UI.Form onSubmit={(event) => event.preventDefault()}>
              <UI.Field name="preview-email">
                <UI.FieldLabel>Email</UI.FieldLabel>
                <UI.Input type="email" autoComplete="email" placeholder="name@example.com" />
              </UI.Field>
              <UI.FormActions>
                <UI.Button type="submit">Continue</UI.Button>
              </UI.FormActions>
            </UI.Form>
          </UI.CardContent>
        </UI.Card>
      </UI.SplitScreenMain>
    </UI.SplitScreen>
  );
}

const previews: Record<PreviewName, ComponentType> = {
  workspace: WorkspacePreview,
  centered: CenteredPreview,
  split: SplitPreview,
};

export function PreviewPage({ name, theme }: { name: PreviewName; theme: UI.ThemeSettings }) {
  const Preview = previews[name];
  useEffect(() => {
    document.title = `${previewTitles[name]} · Nanostack design system`;
  }, [name]);
  return (
    <UI.Theme {...theme}>
      <UI.DocumentTheme />
      <UI.ApplicationViewport>
        <Preview />
      </UI.ApplicationViewport>
    </UI.Theme>
  );
}
