# Nanostack design system

Composable React building blocks for Echopoint and Anchor. Built on Base UI, with shadcn's component anatomy and semantic token conventions. **The public API never accepts custom CSS.** Choose a typed variant or compose smaller parts; change the shared library when a new visual variation is needed.

Status: **0.1.0-beta.1**. React 19.2+ consumers; development and browser verification use React 19.3. TypeScript strict mode, native refs, ESM subpath exports, and explicit client boundaries. The library ships CSS and needs neither Tailwind nor a CSS build plugin in the consuming app.

## Try it

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The playground opens at `http://127.0.0.1:4317`. Switch color scheme, density and brand. Its workspace records are labeled examples. The Controls tab demonstrates forms, status, disabled actions and focus-managed dialogs.

## Install the beta

The first release is an intentionally private, versioned package artifact. There is no public npm release or assumed cross-repository CI credential.

```sh
pnpm build
pnpm pack --pack-destination artifacts
# Copy the resulting archive into the consumer's vendor/ directory, then:
pnpm add ./vendor/nanostack-design-system-0.1.0-beta.1.tgz
```

Commit the artifact and consumer lockfile together, with its source commit and SHA-256 recorded alongside it. Echopoint's beta follows this model. Keep archives immutable once reviewed; later changes receive a new beta version. Package registry publishing can replace the dependency transport when configured without changing imports.

```tsx
import '@nanostack/design-system/styles.css';
import { Theme } from '@nanostack/design-system/theme';
import { Stack, Grid } from '@nanostack/design-system/components/layout';
import { Button } from '@nanostack/design-system/components/button';
import {
  PageHeader, PageHeaderTitle, PageHeaderDescription, PageHeaderActions,
} from '@nanostack/design-system/blocks/page-header';
import { Metric } from '@nanostack/design-system/blocks/metric';

export function Overview() {
  return (
    <Theme brand="echopoint" colorScheme="light" density="compact">
      <PageHeader>
        <Stack gap="xs">
          <PageHeaderTitle>Home</PageHeaderTitle>
          <PageHeaderDescription>Your workspace activity.</PageHeaderDescription>
        </Stack>
        <PageHeaderActions><Button onClick={createFlow}>Create flow</Button></PageHeaderActions>
      </PageHeader>
      <Grid columns={2}>
        <Metric label="Flows" value={flowCount} />
        <Metric label="Online runners" value={runnerCount} tone="success" />
      </Grid>
    </Theme>
  );
}
```

The application supplies `createFlow`, `flowCount`, `runnerCount`, permissions and data loading. Anchor uses `brand="anchor" colorScheme="light"`; this library does not add a dark-mode requirement to Anchor.

## Building vocabulary

| Layer | Public parts |
| --- | --- |
| Scope | Theme: brand, colorScheme, density |
| Layout | Stack, Cluster, Grid, Surface, Divider |
| Controls | Button, Input, Field parts, Tabs parts, Dialog parts |
| Content | Text, Heading, Badge, Skeleton |
| Navigation | AppShell, Sidebar, Brand, Nav, NavLink, Header, Main, Footer |
| Page | PageHeader and Section with title, description, actions, body |
| Feedback and data | EmptyState, Metric, ActivityList, ActivityItem |

Import compound parts by their full exported names, such as `AppShellSidebar` and `SectionTitle`. NavLink and linked ActivityItem use native anchors: router adapters can pass ref/native events without replacing the underlying element. Keep interactive controls out of a linked row's children. DialogPopup must contain DialogTitle. Field uses FieldLabel/Input/FieldDescription/FieldError for accessible association.

Rejected props include `className`, `style`, `css`, `classNames`, `unstyled`, `render`, and `asChild`. Compile-time checks and runtime sanitization enforce this component contract. This is not browser CSS isolation: a host stylesheet can still target DOM elements. Product teams agree to evolve variants here instead of overriding selectors or CSS variables.

## Verify and evolve

```sh
pnpm check
pnpm test:browser
```

The checks cover rejected API props, native/ref behavior, keyboard interaction, modal focus, theme portals, contrast pairs, mobile/landscape overflow, browser axe scans, native ESM exports. Automated checks are not a WCAG certification.

Read [research](docs/research.md) for official Airbnb, Stripe, Linear, React, Base UI and shadcn evidence; [contribution rules](docs/contributing.md) for changes; [design decisions](DESIGN.md) for the visual language; and [AGENTS.md](AGENTS.md) for agent invariants.

Source registry generation, artifact-installation checks and CI follow in the next stacked pull request.
