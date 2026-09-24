/** Compile-only public API contract. Checked by `pnpm typecheck`, never executed. */
import { createRef, type ComponentProps, type ElementType } from 'react';
import * as DS from '../src/index.js';

type Assert<T extends true> = T;
type IsNever<T> = [T] extends [never] ? true : false;
type StylingKey = 'className' | 'style' | 'css' | 'classNames' | 'unstyled' | 'render' | 'asChild';
type ComponentName = {
  [Name in keyof typeof DS]: Name extends Capitalize<Name> ? Name : never;
}[keyof typeof DS];
type PublicProps<Name extends ComponentName> = ComponentProps<
  Extract<(typeof DS)[Name], ElementType>
>;
type OpenStylingKeys<Props> = {
  [Key in StylingKey]: Key extends keyof Props
    ? IsNever<Exclude<Props[Key], undefined>> extends true
      ? never
      : Key
    : Key;
}[StylingKey];
type ComponentsAcceptingCSS = {
  [Name in ComponentName]: IsNever<OpenStylingKeys<PublicProps<Name>>> extends true ? never : Name;
}[ComponentName];

// This automatically includes every new component exported by the public entry point.
export type EveryPublicComponentForbidsCSS = Assert<IsNever<ComponentsAcceptingCSS>>;

const buttonRef = createRef<HTMLButtonElement>();
const inputRef = createRef<HTMLInputElement>();
const selectRef = createRef<HTMLSelectElement>();
const linkRef = createRef<HTMLAnchorElement>();
const paragraphRef = createRef<HTMLParagraphElement>();

export const supportedComposition = (
  <DS.Theme brand="echopoint" colorScheme="dark" density="compact">
    <DS.AppShell>
      <DS.AppShellSidebar>
        <DS.AppShellBrand>Echopoint</DS.AppShellBrand>
        <DS.AppShellNav label="Workspace">
          <DS.AppShellNavLink ref={linkRef} href="/home" active aria-describedby="nav-help">
            Overview
          </DS.AppShellNavLink>
        </DS.AppShellNav>
        <DS.AppShellFooter>Workspace settings</DS.AppShellFooter>
      </DS.AppShellSidebar>
      <DS.AppShellHeader>Workspace</DS.AppShellHeader>
      <DS.AppShellMain>
        <DS.PageHeader>
          <DS.PageHeaderTitle>Overview</DS.PageHeaderTitle>
          <DS.PageHeaderDescription>Recent work</DS.PageHeaderDescription>
          <DS.PageHeaderActions>
            <DS.Button
              ref={buttonRef}
              variant="secondary"
              size="sm"
              type="submit"
              form="create"
              name="intent"
              value="save"
              aria-label="Save"
              onClick={(event) => event.currentTarget.focus()}
            >
              Save
            </DS.Button>
          </DS.PageHeaderActions>
        </DS.PageHeader>
        <DS.Stack gap="lg" align="stretch">
          <DS.Heading level={2} size="lg">
            Activity
          </DS.Heading>
          <DS.Text ref={paragraphRef} size="sm" weight="medium" tone="muted">
            Today
          </DS.Text>
          <DS.Text as="span">Inline text</DS.Text>
          <DS.Cluster justify="between" gap="sm">
            <DS.Badge tone="success">Ready</DS.Badge>
          </DS.Cluster>
          <DS.Grid columns={3} gap="lg" responsive>
            <DS.Metric label="Requests" value={42} tone="info" />
          </DS.Grid>
          <DS.Grid layout="sidebar">
            <DS.Text>Main</DS.Text>
            <DS.Text>Supporting</DS.Text>
          </DS.Grid>
          <DS.Surface padding="md" tone="subtle">
            <DS.Skeleton shape="block" size="lg" />
          </DS.Surface>
          <DS.Divider aria-label="Section boundary" />
          <DS.Section aria-labelledby="activity-title">
            <DS.SectionHeader>
              <DS.SectionTitle id="activity-title">Recent activity</DS.SectionTitle>
              <DS.SectionDescription>Latest runs</DS.SectionDescription>
              <DS.SectionActions>
                <DS.Button>Refresh</DS.Button>
              </DS.SectionActions>
            </DS.SectionHeader>
            <DS.SectionBody>
              <DS.ActivityList>
                <DS.ActivityItem
                  title="Run passed"
                  href="/runs/1"
                  ref={linkRef}
                  target="_blank"
                  rel="noreferrer"
                />
                <DS.ActivityItem title="Ready" />
              </DS.ActivityList>
            </DS.SectionBody>
          </DS.Section>
          <DS.EmptyState
            title="Nothing here"
            description="Create an endpoint."
            action={<DS.Button>Create</DS.Button>}
          />
          <DS.Field name="endpoint" validationMode="onBlur">
            <DS.FieldLabel>Endpoint</DS.FieldLabel>
            <DS.FieldDescription>Use HTTPS</DS.FieldDescription>
            <DS.Input
              ref={inputRef}
              type="url"
              autoComplete="url"
              required
              minLength={3}
              size="sm"
              onChange={(event) => event.currentTarget.checkValidity()}
              onValueChange={(value) => value.toUpperCase()}
            />
            <DS.FieldError match="valueMissing">Required</DS.FieldError>
          </DS.Field>
          <DS.Select
            ref={selectRef}
            name="environment"
            aria-label="Environment"
            defaultValue="production"
            options={[{ value: 'production', label: 'Production' }] as const}
            size="sm"
            onChange={(event) => event.currentTarget.value.toUpperCase()}
          />
          <DS.Tabs defaultValue="overview" onValueChange={(value) => value.toUpperCase()}>
            <DS.TabsList aria-label="Sections">
              <DS.TabsTab value="overview">Overview</DS.TabsTab>
            </DS.TabsList>
            <DS.TabsPanel value="overview">Content</DS.TabsPanel>
          </DS.Tabs>
          <DS.Dialog
            onOpenChange={(open, details) => {
              if (!open) details.cancel();
            }}
          >
            <DS.DialogTrigger variant="ghost">Details</DS.DialogTrigger>
            <DS.DialogPopup size="sm" initialFocus={inputRef}>
              <DS.DialogTitle>Details</DS.DialogTitle>
              <DS.DialogDescription>More information</DS.DialogDescription>
              <DS.DialogClose>Cancel</DS.DialogClose>
            </DS.DialogPopup>
          </DS.Dialog>
        </DS.Stack>
      </DS.AppShellMain>
    </DS.AppShell>
  </DS.Theme>
);

// @ts-expect-error Consumer classes are forbidden.
<DS.Button className="custom" />;
// @ts-expect-error Consumer inline styles are forbidden.
<DS.Input style={{ color: 'red' }} />;
// @ts-expect-error CSS-in-JS is forbidden.
<DS.Surface css={{ padding: 3 }} />;
// @ts-expect-error Slot class maps are forbidden.
<DS.DialogPopup classNames={{ root: 'custom' }} />;
// @ts-expect-error Unstyled mode is forbidden.
<DS.Badge unstyled />;
// @ts-expect-error Base UI render replacement is deliberately not exposed.
<DS.Button render={<a href="/">Home</a>} />;
// @ts-expect-error Slot replacement is deliberately not exposed.
<DS.Button asChild>
  <a href="/">Home</a>
</DS.Button>;

const classSpread = { className: 'custom' };
const styleSpread = { style: { color: 'red' } };
const cssSpread = { css: { padding: 5 } };
const classNamesSpread = { classNames: { root: 'custom' } };
const unstyledSpread = { unstyled: true };
const renderSpread = { render: <div /> };
const asChildSpread = { asChild: true };
// @ts-expect-error Explicit never properties also reject structural spread escapes.
<DS.Stack {...classSpread} />;
// @ts-expect-error Inline styles cannot enter through spread props.
<DS.Text {...styleSpread} />;
// @ts-expect-error CSS-in-JS cannot enter through spread props.
<DS.Grid {...cssSpread} />;
// @ts-expect-error Slot class maps cannot enter through spread props.
<DS.Field {...classNamesSpread} />;
// @ts-expect-error Unstyled mode cannot enter through spread props.
<DS.Tabs {...unstyledSpread} />;
// @ts-expect-error Render replacement cannot enter through spread props.
<DS.DialogTrigger {...renderSpread} />;
// @ts-expect-error Slot replacement cannot enter through spread props.
<DS.DialogClose {...asChildSpread} />;

// @ts-expect-error Visual decisions use a finite variant set.
<DS.Button variant="rainbow" />;
// @ts-expect-error Button sizes cannot be CSS values.
<DS.Button size="48px" />;
// @ts-expect-error Badge tones cannot be custom colors.
<DS.Badge tone="#123456" />;
// @ts-expect-error Text sizes cannot be arbitrary values.
<DS.Text size="xxl" />;
// @ts-expect-error Text tones are semantic.
<DS.Text tone="blue" />;
// @ts-expect-error Text weights are finite.
<DS.Text weight={700} />;
// @ts-expect-error Semantic text tags are limited.
<DS.Text as="article" />;
// @ts-expect-error Heading levels are explicit supported semantics.
<DS.Heading level={6} />;
// @ts-expect-error Heading visual sizes are finite.
<DS.Heading size="huge" />;
// @ts-expect-error Spacing uses shared tokens.
<DS.Stack gap={23} />;
// @ts-expect-error Stack alignment is finite.
<DS.Stack align="baseline" />;
// @ts-expect-error Cluster spacing uses shared tokens.
<DS.Cluster gap="xl" />;
// @ts-expect-error Cluster justification is finite.
<DS.Cluster justify="space-around" />;
// @ts-expect-error Grid columns are an approved finite set.
<DS.Grid columns={12} />;
// @ts-expect-error Grid compositions are finite.
<DS.Grid layout="custom" />;
// @ts-expect-error Sidebar composition owns its two unequal tracks.
<DS.Grid layout="sidebar" columns={3} />;
// @ts-expect-error Grid gaps cannot use CSS values.
<DS.Grid gap="2rem" />;
// @ts-expect-error Surface padding is finite.
<DS.Surface padding={12} />;
// @ts-expect-error Surface tones are semantic.
<DS.Surface tone="blue" />;
// @ts-expect-error Skeleton shapes are finite.
<DS.Skeleton shape="diamond" />;
// @ts-expect-error Skeleton sizes cannot be CSS values.
<DS.Skeleton size="80%" />;
// @ts-expect-error Native numeric size is intentionally replaced by a variant.
<DS.Input size={30} />;
// @ts-expect-error Select sizes are visual variants, not native row counts.
<DS.Select options={[]} size={5} />;
// @ts-expect-error Select option values are strings.
<DS.Select options={[{ value: 42, label: 'Unsupported' }]} />;
// @ts-expect-error Every option needs visible text.
<DS.Select options={[{ value: 'missing-label' }]} />;
// @ts-expect-error Options cannot inject their own CSS.
<DS.Select options={[{ value: 'custom', label: 'Custom', style: { color: 'red' } }]} />;
// @ts-expect-error Tabs require string identifiers.
<DS.TabsTab value={42}>Unsupported</DS.TabsTab>;
// @ts-expect-error A tab list must have an accessible name.
<DS.TabsList />;
// @ts-expect-error Popup sizes are centrally owned.
<DS.DialogPopup size="90vw" />;
// @ts-expect-error Brands cannot inject arbitrary token objects.
<DS.Theme brand={{ accent: 'red' }} />;
// @ts-expect-error Color schemes are explicit.
<DS.Theme colorScheme="sepia" />;
// @ts-expect-error Density uses finite presets.
<DS.Theme density="dense" />;
// @ts-expect-error Metric tone is semantic.
<DS.Metric label="Latency" value={10} tone="purple" />;
// @ts-expect-error Raw HTML cannot replace owned children.
<DS.Surface dangerouslySetInnerHTML={{ __html: '<style>body{display:none}</style>' }} />;
// @ts-expect-error Ref targets retain native element types.
<DS.Input ref={buttonRef} />;
// @ts-expect-error A navigation link requires a real link destination.
<DS.AppShellNavLink>Missing destination</DS.AppShellNavLink>;
