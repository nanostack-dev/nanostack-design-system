import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowSquareOut,
  BookOpen,
  ClockCounterClockwise,
  House,
  SquaresFour,
} from '@phosphor-icons/react';
import { version } from '../package.json';
import * as UI from '../src/index.js';
import { catalogSections } from './catalog/index.js';
import {
  changelogDocument,
  guidelineDocuments,
  packageUrl,
  repositoryUrl,
  scopeRule,
} from './docs.js';
import {
  MarkdownArticle,
  MarkdownOutline,
  prepareMarkdown,
  type PreparedMarkdown,
} from './markdown.js';
import { followSiteLink, navigate, pageHref, useRoute, type Route } from './router.js';

const siteName = 'Nanostack design system';
const pageTitles: Record<Route['page'], string> = {
  overview: 'Overview',
  components: 'Components',
  guidelines: 'Guidelines',
  changelog: 'Changelog',
  missing: 'Page not found',
};
const navigation = [
  { page: 'overview', label: 'Overview', glyph: House },
  { page: 'components', label: 'Components', glyph: SquaresFour },
  { page: 'guidelines', label: 'Guidelines', glyph: BookOpen },
  { page: 'changelog', label: 'Changelog', glyph: ClockCounterClockwise },
] as const;

const installCommands = `pnpm add --save-exact @nanostackorg/design-system@${version}\npnpm add @phosphor-icons/react@^2.1.10`;
const usageExample = `import '@nanostackorg/design-system/styles.css';
import { Theme } from '@nanostackorg/design-system/theme';
import { Button } from '@nanostackorg/design-system/components/button';

export function SaveAction({ save }: { save: () => void }) {
  return (
    <Theme brand="nanostack" colorScheme="light">
      <Button onClick={save}>Save</Button>
    </Theme>
  );
}`;

function ViewHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <UI.PageHeader>
      <UI.PageHeaderContent>
        {eyebrow ? <UI.PageEyebrow>{eyebrow}</UI.PageEyebrow> : null}
        <UI.PageHeaderTitle>{title}</UI.PageHeaderTitle>
        <UI.PageHeaderDescription>{description}</UI.PageHeaderDescription>
      </UI.PageHeaderContent>
      {actions ? <UI.PageHeaderActions>{actions}</UI.PageHeaderActions> : null}
    </UI.PageHeader>
  );
}

function OverviewView() {
  const scope = useMemo(() => prepareMarkdown(scopeRule), []);
  return (
    <UI.Stack gap="xl">
      <ViewHeader
        eyebrow={`Version ${version} · MIT license`}
        title={siteName}
        description="Composable React building blocks that any Nanostack product can use unchanged. The public API never accepts custom CSS: choose a typed variant or compose smaller parts."
        actions={
          <>
            <UI.Link href={pageHref('components')} variant="primary">
              Browse components
            </UI.Link>
            <UI.Link href={pageHref('guidelines')} variant="secondary">
              Read the guidelines
            </UI.Link>
          </>
        }
      />
      <UI.Grid columns={2} gap="lg">
        <UI.Section aria-labelledby="overview-install">
          <UI.SectionHeader>
            <UI.Stack gap="xs">
              <UI.SectionTitle id="overview-install">Install</UI.SectionTitle>
              <UI.SectionDescription>
                Pin the exact version. React 19.2+ and Phosphor 2.1.10+ are peer dependencies.
              </UI.SectionDescription>
            </UI.Stack>
            <UI.SectionActions>
              <UI.CopyButton value={installCommands} label="Copy" size="sm" variant="secondary" />
            </UI.SectionActions>
          </UI.SectionHeader>
          <UI.SectionBody>
            <UI.Stack gap="md">
              <UI.Surface tone="subtle" padding="sm">
                <UI.CodeViewer label="Install commands" value={installCommands} height="content" />
              </UI.Surface>
              <UI.Text size="sm" tone="muted">
                Import the stylesheet once at the application entry, then compose parts inside a
                Theme.
              </UI.Text>
              <UI.Surface tone="subtle" padding="sm">
                <UI.CodeViewer label="Usage example" value={usageExample} height="content" />
              </UI.Surface>
            </UI.Stack>
          </UI.SectionBody>
        </UI.Section>
        <UI.Section aria-labelledby="overview-scope">
          <UI.SectionHeader>
            <UI.Stack gap="xs">
              <UI.SectionTitle id="overview-scope">The scope rule</UI.SectionTitle>
              <UI.SectionDescription>
                The library holds UI that a second Nanostack product would use unchanged.
              </UI.SectionDescription>
            </UI.Stack>
          </UI.SectionHeader>
          <UI.SectionBody>
            <UI.Stack gap="md">
              <MarkdownArticle markdown={scope} />
              <UI.Link href={pageHref('guidelines', 'contract')}>
                Read the scope and the public contract
              </UI.Link>
            </UI.Stack>
          </UI.SectionBody>
        </UI.Section>
      </UI.Grid>
      <UI.Section aria-labelledby="overview-inside">
        <UI.SectionHeader>
          <UI.Stack gap="xs">
            <UI.SectionTitle id="overview-inside">What is inside</UI.SectionTitle>
            <UI.SectionDescription>
              Every exported component has a working example with local sample data.
            </UI.SectionDescription>
          </UI.Stack>
        </UI.SectionHeader>
        <UI.SectionBody>
          <UI.Grid columns={3}>
            {catalogSections.map((section) => (
              <UI.Card key={section.id}>
                <UI.CardHeader>
                  <UI.Heading level={3} size="lg">
                    {section.label}
                  </UI.Heading>
                  <UI.CardDescription>{section.summary}</UI.CardDescription>
                </UI.CardHeader>
                <UI.CardFooter>
                  <UI.Link href={pageHref('components', section.id)}>
                    Open {section.label.toLowerCase()}
                  </UI.Link>
                </UI.CardFooter>
              </UI.Card>
            ))}
          </UI.Grid>
        </UI.SectionBody>
      </UI.Section>
      <UI.Section aria-labelledby="overview-resources">
        <UI.SectionHeader>
          <UI.SectionTitle id="overview-resources">Resources</UI.SectionTitle>
        </UI.SectionHeader>
        <UI.SectionBody>
          <UI.ResourceList aria-label="Resources" density="compact">
            {[
              { label: 'Source code', meta: 'GitHub', href: repositoryUrl },
              { label: 'Package', meta: 'npm', href: packageUrl },
              {
                label: 'Releases and checksums',
                meta: 'GitHub',
                href: `${repositoryUrl}/releases`,
              },
              { label: 'Changelog', meta: 'This site', href: pageHref('changelog') },
            ].map((resource) => (
              <UI.ResourceRow key={resource.label}>
                <UI.ResourceRowLabel>
                  <UI.ResourceRowLink href={resource.href}>{resource.label}</UI.ResourceRowLink>
                </UI.ResourceRowLabel>
                <UI.ResourceRowMeta>{resource.meta}</UI.ResourceRowMeta>
              </UI.ResourceRow>
            ))}
          </UI.ResourceList>
        </UI.SectionBody>
      </UI.Section>
    </UI.Stack>
  );
}

function ComponentsView({ tab }: { tab: string | null }) {
  const active = catalogSections.find((section) => section.id === tab) ?? catalogSections[0]!;
  return (
    <UI.Stack gap="lg">
      <ViewHeader
        title="Components"
        description="Every exported part, working with local sample data. Change the brand, color scheme and density in the navigation to inspect the same assemblies."
      />
      <UI.Tabs
        value={active.id}
        onValueChange={(value) => navigate(pageHref('components', value), 'replace')}
      >
        <UI.TabsList aria-label="Component groups">
          {catalogSections.map((section) => (
            <UI.TabsTab key={section.id} value={section.id}>
              {section.label}
            </UI.TabsTab>
          ))}
        </UI.TabsList>
        {catalogSections.map((section) => (
          <UI.TabsPanel key={section.id} value={section.id}>
            <UI.Stack gap="xl">
              <UI.Text tone="muted">{section.summary}</UI.Text>
              <section.Content />
            </UI.Stack>
          </UI.TabsPanel>
        ))}
      </UI.Tabs>
    </UI.Stack>
  );
}

function DocumentLayout({ markdown, summary }: { markdown: PreparedMarkdown; summary: string }) {
  return (
    <UI.Grid layout="navigation" gap="lg">
      <UI.Stack gap="lg">
        <MarkdownOutline markdown={markdown} label="On this page" />
        <UI.Link href={`${repositoryUrl}/blob/main/${markdown.path}`} variant="muted" size="sm">
          {markdown.path} on GitHub <UI.Icon glyph={ArrowSquareOut} size="xs" />
        </UI.Link>
      </UI.Stack>
      <UI.Stack gap="xl">
        <UI.Text tone="muted">{summary}</UI.Text>
        <MarkdownArticle markdown={markdown} />
      </UI.Stack>
    </UI.Grid>
  );
}

function GuidelinesView({ tab }: { tab: string | null }) {
  const active = guidelineDocuments.find((guide) => guide.id === tab) ?? guidelineDocuments[0];
  const markdown = useMemo(() => prepareMarkdown(active.document), [active]);
  return (
    <UI.Stack gap="lg">
      <ViewHeader
        title="Guidelines"
        description="Rendered from the repository's own documents at build time, so this site and the source never disagree."
      />
      <UI.Tabs
        value={active.id}
        onValueChange={(value) => navigate(pageHref('guidelines', value), 'replace')}
      >
        <UI.TabsList aria-label="Guideline documents">
          {guidelineDocuments.map((guide) => (
            <UI.TabsTab key={guide.id} value={guide.id}>
              {guide.label}
            </UI.TabsTab>
          ))}
        </UI.TabsList>
        {guidelineDocuments.map((guide) => (
          <UI.TabsPanel key={guide.id} value={guide.id}>
            {guide.id === active.id ? (
              <DocumentLayout markdown={markdown} summary={guide.description} />
            ) : null}
          </UI.TabsPanel>
        ))}
      </UI.Tabs>
    </UI.Stack>
  );
}

function ChangelogView() {
  const markdown = useMemo(() => prepareMarkdown(changelogDocument), []);
  return (
    <UI.Stack gap="lg">
      <ViewHeader
        title="Changelog"
        description="Every release, its changes and the upgrade steps for consuming applications."
      />
      <DocumentLayout
        markdown={markdown}
        summary={`The latest release is ${version}. Applications pin an exact version.`}
      />
    </UI.Stack>
  );
}

function MissingView() {
  return (
    <UI.Stack gap="lg">
      <ViewHeader title="Page not found" description="This address has no page on this site." />
      <UI.Surface>
        <UI.EmptyState
          title="Nothing lives here"
          description="The link may be out of date. Start again from the overview."
          action={
            <UI.Link href={pageHref('overview')} variant="secondary">
              Go to the overview
            </UI.Link>
          }
        />
      </UI.Surface>
    </UI.Stack>
  );
}

function View({ route }: { route: Route }) {
  switch (route.page) {
    case 'overview':
      return <OverviewView />;
    case 'components':
      return <ComponentsView tab={route.tab} />;
    case 'guidelines':
      return <GuidelinesView tab={route.tab} />;
    case 'changelog':
      return <ChangelogView />;
    default:
      return <MissingView />;
  }
}

function preferredColorScheme(): UI.ColorScheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useDocumentBehavior(route: Route) {
  const title = pageTitles[route.page];
  const previousPage = useRef(route.page);
  useEffect(() => {
    document.addEventListener('click', followSiteLink);
    if (new URL(window.location.href).searchParams.has('catalog'))
      navigate(pageHref('components'), 'replace');
    return () => document.removeEventListener('click', followSiteLink);
  }, []);
  useEffect(() => {
    document.title = route.page === 'overview' ? siteName : `${title} · ${siteName}`;
  }, [route.page, title]);
  useEffect(() => {
    const target = route.hash
      ? document.getElementById(decodeURIComponent(route.hash.slice(1)))
      : null;
    if (target) target.scrollIntoView();
    else if (previousPage.current !== route.page) window.scrollTo(0, 0);
    previousPage.current = route.page;
  }, [route.page, route.tab, route.hash]);
}

export function Site() {
  const route = useRoute();
  const [brand, setBrand] = useState<UI.Brand>('nanostack');
  const [colorScheme, setColorScheme] = useState<UI.ColorScheme>(preferredColorScheme);
  const [density, setDensity] = useState<UI.Density>('comfortable');
  useDocumentBehavior(route);
  const title = pageTitles[route.page];
  return (
    <UI.Theme brand={brand} colorScheme={colorScheme} density={density}>
      <UI.DocumentTheme />
      <UI.TooltipProvider>
        <UI.AppShell mainId="content" navigationLabel="Site navigation">
          <UI.AppShellSidebar>
            <UI.AppShellBrand>
              <UI.BrandMark brand={brand} />
              Nanostack
            </UI.AppShellBrand>
            <UI.AppShellNav label="Documentation">
              {navigation.map((item) => (
                <UI.AppShellNavLink
                  key={item.page}
                  href={pageHref(item.page)}
                  active={route.page === item.page}
                  icon={<UI.Icon glyph={item.glyph} />}
                >
                  {item.label}
                </UI.AppShellNavLink>
              ))}
            </UI.AppShellNav>
            <UI.FieldGroup>
              <UI.FieldGroupLegend>Appearance</UI.FieldGroupLegend>
              <UI.Stack gap="sm">
                <UI.Field>
                  <UI.FieldLabel>Brand</UI.FieldLabel>
                  <UI.Select
                    size="sm"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value as UI.Brand)}
                    options={[
                      { value: 'nanostack', label: 'Nanostack' },
                      { value: 'echopoint', label: 'Echopoint' },
                      { value: 'anchor', label: 'Anchor' },
                    ]}
                  />
                </UI.Field>
                <UI.Field>
                  <UI.FieldLabel>Color scheme</UI.FieldLabel>
                  <UI.Select
                    size="sm"
                    value={colorScheme}
                    onChange={(event) => setColorScheme(event.target.value as UI.ColorScheme)}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                    ]}
                  />
                </UI.Field>
                <UI.Field>
                  <UI.FieldLabel>Density</UI.FieldLabel>
                  <UI.Select
                    size="sm"
                    value={density}
                    onChange={(event) => setDensity(event.target.value as UI.Density)}
                    options={[
                      { value: 'comfortable', label: 'Comfortable' },
                      { value: 'compact', label: 'Compact' },
                    ]}
                  />
                </UI.Field>
              </UI.Stack>
            </UI.FieldGroup>
            <UI.AppShellNav label="Resources">
              <UI.AppShellNavLink href={repositoryUrl}>Source on GitHub</UI.AppShellNavLink>
              <UI.AppShellNavLink href={packageUrl}>Package on npm</UI.AppShellNavLink>
              <UI.AppShellNavLink href="https://base-ui.com/react/overview/accessibility">
                Accessibility foundations
              </UI.AppShellNavLink>
            </UI.AppShellNav>
            <UI.AppShellFooter>
              <UI.Text size="xs" tone="muted">
                Version {version} · MIT license
              </UI.Text>
            </UI.AppShellFooter>
          </UI.AppShellSidebar>
          <UI.AppShellHeader>
            <UI.Cluster justify="between">
              <UI.Breadcrumb aria-label="Location">
                <UI.BreadcrumbList>
                  {route.page === 'overview' ? (
                    <UI.BreadcrumbItem>
                      <UI.BreadcrumbPage>Design system</UI.BreadcrumbPage>
                    </UI.BreadcrumbItem>
                  ) : (
                    <>
                      <UI.BreadcrumbItem>
                        <UI.BreadcrumbLink href={pageHref('overview')}>
                          Design system
                        </UI.BreadcrumbLink>
                      </UI.BreadcrumbItem>
                      <UI.BreadcrumbSeparator />
                      <UI.BreadcrumbItem>
                        <UI.BreadcrumbPage>{title}</UI.BreadcrumbPage>
                      </UI.BreadcrumbItem>
                    </>
                  )}
                </UI.BreadcrumbList>
              </UI.Breadcrumb>
              <UI.Badge tone="info">v{version}</UI.Badge>
            </UI.Cluster>
          </UI.AppShellHeader>
          <UI.AppShellMain>
            <View route={route} />
          </UI.AppShellMain>
        </UI.AppShell>
        <UI.Toaster />
      </UI.TooltipProvider>
    </UI.Theme>
  );
}
