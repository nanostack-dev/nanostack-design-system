# Nanostack design system

Composable React building blocks for Echopoint and Anchor. Built on Base UI, with shadcn's component anatomy and semantic token conventions. **The public API never accepts custom CSS.** Choose a typed variant or compose smaller parts; change the shared library when a new visual variation is needed.

Status: **0.2.0-beta.1**. React 19.2+ consumers; development and browser verification use React 19.3. TypeScript strict mode, native refs, ESM subpath exports, and explicit client boundaries. The library ships CSS and needs neither Tailwind nor a CSS build plugin in the consuming app.

## Try it

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The workspace preview opens at `http://127.0.0.1:4317`. Open the [interactive block catalog](http://127.0.0.1:4317/?catalog) for foundations, controls, resource lists, typed tables, a resizable editor, a graph, measured history and conversation parts. Switch brand, color scheme and density to inspect the same assemblies. The examples use local sample data and make no service requests. The complete API and composition rules are documented in the [catalog](docs/components.md).

## Install the beta

The first release is an intentionally private, versioned package artifact. There is no public npm release or assumed cross-repository CI credential.

```sh
pnpm build
pnpm pack --pack-destination artifacts
# Copy the resulting archive into the consumer's vendor/ directory, then:
pnpm add ./vendor/nanostack-design-system-0.2.0-beta.1.tgz
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

export function Overview({ createFlow, flowCount, runnerCount }: {
  createFlow: () => void;
  flowCount: number;
  runnerCount: number;
}) {
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

The [component catalog](docs/components.md) covers the full set of named parts, finite variations, composition rules, and Anchor adoption path.

| Surface | Compose from |
| --- | --- |
| Application structure | AppShell, Page, Section, Card, screen and responsive-panel parts |
| Forms and actions | Field, Input, Select, Checkbox, Autocomplete, tags, Menu, Dialog, Popover |
| Collections and detail | ResourceList, DataTable, Table, VirtualList, Inspector, DefinitionList |
| Dense tools | Workspace, Pane, WorkspaceSplit, DocumentTabs, Tree, Dock |
| Editors and graphs | CodeEditor, VariableAwareInput, SourcePane, KeyValueRow, GraphCanvas and GraphNode parts |
| Activity and feedback | TimelineItem, Report, ConversationLog, StatusMarker, Sparkline, Progress, WorkerAvatar |

Applications own data, routes, permissions, copy, and assemblies of library parts. This rule also covers cell callbacks, graph content, child slots, and stories. A missing visual element becomes a common primitive or block here. Native markup, SVG, visual-engine adapters, and styles belong in this package.

A router adapter can wrap a library link while preserving its native anchor and ref. Keep independent controls in ResourceRowActions rather than inside ResourceRowLink. DialogPopup contains DialogTitle; Field composes its label, control, description and error. Native semantics and keyboard behavior are part of the public contract.

Rejected props include `className`, `style`, `css`, `classNames`, `unstyled`, `render`, and `asChild`. Compile-time checks and runtime sanitization enforce this component contract. Consumer CI enforces the assembly boundary, including nested content and visual-engine imports. This is not browser CSS isolation: host styles and imperative DOM access remain technically possible, so product teams evolve variants here instead of overriding selectors or CSS variables.

## shadcn source distribution

`pnpm registry:build` generates schema-validated `registry.json` and `public/r/system.json` from the same source as the package. The `system` block targets `src/components/nanostack/` and preserves relative imports. Optional identity-provider adapters are package subpaths and are excluded from this source bundle, so installing the registry does not require Clerk. Import its `styles.css` and use its `index.ts` exports. The package remains the preferred transport for synchronized upgrades; source installation is for deliberate ownership, with the same closed API policy.

```sh
# From a configured React 19.2+ shadcn consumer; point to your cloned payload:
pnpm dlx shadcn@latest add /path/to/nanostack-design-system/public/r/system.json
```

The source registry assumes a `src/` application. Check the CLI preview before installing into another layout. Private remote registry hosting is not required for the package beta and has not been deployed.

## Verify and evolve

```sh
pnpm check
pnpm test:browser
pnpm test:package
```

The checks cover rejected API props, native/ref behavior, keyboard interaction, modal focus, theme portals, contrast pairs, mobile/landscape overflow, browser axe scans, generated registry freshness and an installed package consumer. Automated checks are not a WCAG certification.

Read the [component catalog](docs/components.md) to assemble a surface; [research](docs/research.md) for official Airbnb, Stripe, Linear, React, Base UI and shadcn evidence; [contribution rules](docs/contributing.md) for changes; [design decisions](DESIGN.md) for the visual language; and [AGENTS.md](AGENTS.md) for agent invariants.
