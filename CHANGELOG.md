# Changelog

## 0.2.3

- New `CopyButton` and `CopyIconButton` blocks share clipboard outcome feedback across Anchor and Echopoint. They expose the existing Button appearance props, preserve keyboard focus, announce copied/failed outcomes, block duplicate writes while pending, and clean up feedback when unmounted.

- Light theme muted text and success/warning text on tints retain contrast on selected table rows and muted editor surfaces, with a light/dark regression story.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.2.3`. Replace local copy controls with `CopyButton` or `CopyIconButton` from `@nanostackorg/design-system/blocks/copy-button`, passing `value`, `label` and optional outcome callbacks. Clipboard denial or an unavailable clipboard reports failure; it never reports a successful copy.

## 0.2.2

- SearchButton: `size="lg"` (40 px), so the search lines up with 40 px top bar controls such as `IconButton size="lg"`.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.2.2`. Nothing else changes.

## 0.2.1

- Sheet: `size="lg"` (512 px) for a version history and `size="xl"` (65% of the screen, from 832 px to 1344 px) for a run report, on left and right sheets.
- Label and FieldLabel: `size` (`sm`, `md`) and `tone` (`default`, `muted`). `size="sm"` is 12 px text for dense tool forms. An invalid field still colours a muted `FieldLabel`.
- CardTitle: `size` (`sm`, `md`, `lg`). `lg` is 20 px text with a 20 px icon.
- IconButton: a `ghost neutral` icon button now shows a muted icon that turns to the text colour on hover, focus and while its menu is open. New `pressed` prop sets `aria-pressed` and the selected look (`bg-accent`). Upgrade: replace a `Toggle` used as a rail icon button with `IconButton pressed`.
- Skeleton: `height="fill"` has no minimum height any more, so it fits a 28 px row or a fixed-height box. Upgrade: a `fill` skeleton needs a container with a height.
- ScrollArea: the usage docs show how to put a floating header over the area with one measured CSS variable, with a story that tests it.
- New `SearchButton` (`@nanostackorg/design-system/components/search-button`): a button that looks like a search field, with a `label`, an optional `shortcut` shown with `Kbd` and set in `aria-keyshortcuts`, `size` (`sm`, `md`) and `width` (`auto`, `fill`).
- New `Autocomplete` (`@nanostackorg/design-system/components/autocomplete`): a text field that suggests values while the typed text stays free, built on the Base UI Autocomplete. Parts: `Autocomplete`, `AutocompleteInput` (`size` `sm` | `md`, `font` `sans` | `mono`, `width` `auto` | `fill`, `icon`), `AutocompleteContent`, `AutocompleteList`, `AutocompleteItem`, `AutocompleteEmpty`, `AutocompleteGroup`, `AutocompleteGroupLabel`, `AutocompleteCollection`. It shares the Combobox field, list and item look. Upgrade: replace a `Combobox` that copies the typed text into its value, or a `Command` with a positioned `CommandList`, with `Autocomplete value={text} onValueChange={setText}`.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.2.1`. Nothing is removed. A `Skeleton height="fill"` now needs a parent with a height, and a `ghost neutral` `IconButton` now shows a muted icon.

## 0.2.0

Breaking: the design system owns its shadcn code, and every component has a closed, typed API. See `docs/adr/0001-own-shadcn-with-a-closed-api.md` and the "Guides/Using the system" page.

- No component accepts `className` or `style`. `Box` is the only open part, for product component files. `pnpm test:package` checks every export.
- One vocabulary for the look: `variant` (`solid`, `soft`, `outline`, `ghost`), `tone` (`neutral`, `brand`, `critical`, `success`, `warning`, `info`), `size` (`xs`, `sm`, `md`, `lg`, and `xl` on Dialog), `width` (`auto`, `fill`). Each component story explains when to use each value.
- New layout blocks own spacing: `Box`, `Stack`, `Inline`, `Columns` with `Column`, `Spread` (`@nanostackorg/design-system/layout/<name>`).
- New `Text`, `Heading`, `TextLink`, `IconButton`, `ButtonLink`, `DropdownMenuLinkItem`, `ItemLink`, `TableEmpty`, and `DesignSystemProvider` (router link and tooltip context, `@nanostackorg/design-system/provider`).
- Components now carry what products used to add with classes: Input and Textarea `font="mono"`, Select and Input sizes aligned with Button heights, Dialog and Sheet sizes with a scrolling body, DropdownMenuContent `width`, ScrollArea `maxHeight` and `overscroll`, Table cell `align` and `numeric`, a Collapsible height animation, a frosted Sidebar `material`, AppShell sidebar widths and a skip link, DataTable server pagination and a controlled search.
- Removed from the public API: every `*Variants` cva function, the Overlay and Portal parts, `ScrollBar`, `ChartStyle`, the Toast parts other than `Toaster` and `toast`, and `render` on parts that are not triggers.
- Accessibility: critical text on a tint uses `--destructive-on-tint`; a disabled field label stays readable; Accordion, Breadcrumb and MenubarTrigger show keyboard focus; a scrolling dialog body is keyboard reachable.
- New `--destructive-foreground` token.
- The shadcn CLI output is kept in `upstream/` as a merge base. `pnpm shadcn:update` merges an upstream change three ways into the owned file, and `pnpm shadcn:update --add <name>` starts a new component.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.2.0`, wrap the app in `<DesignSystemProvider linkComponent={RouterLink}>`, then follow `docs/migration/0.2.0.md`, which lists every 0.1.0 prop and class with its 0.2.0 replacement.

## 0.1.0

Breaking: a new library built on shadcn/ui. Nothing from 0.0.x keeps its API.

- Every shadcn/ui component (style `base-luma`, Base UI primitives, Phosphor icons) comes from the shadcn CLI into a private `src/components/ui/` folder. The package exports only typed wrappers, one per component, under `@nanostackorg/design-system/components/<name>` and the root barrel. `components/ui/*` is not exported.
- Wrappers keep the shadcn API and the `className` prop for layout. `Badge` and `Alert` add the `success`, `warning` and `info` variants. `SelectContent` and `DropdownMenuContent` fit long labels instead of the trigger width.
- Destructive text on a tint uses `--destructive-on-tint`: the `destructive` variant of `Button`, `Badge` and `AlertDialogAction`, and destructive `DropdownMenuItem`, `ContextMenuItem` and `MenubarItem`. The shadcn `text-destructive` measured 4.38:1 on a muted surface, under the 4.5:1 WCAG AA minimum.
- Blocks built only from the wrappers: `AppShell`, `PageHeader`, `EmptyState`, `DataTable`, `StatCard`, `ConfirmDialog`, `ThemeProvider` and `ThemeToggle`, under `@nanostackorg/design-system/blocks/<name>`.
- Theme: the shadcn token names (`--background`, `--primary`, `--sidebar-*`, `--chart-1..5`, `--radius`) with Echopoint's light blue and dark lime-on-navy values, plus `--success`, `--warning`, `--info`, their `-foreground` and `-on-tint` text, `--border-strong`, `--surface-subtle` and `--surface-elevated`. Dark `--destructive` is lighter (`hsl(0 84% 70%)`) so error text passes WCAG AA. Dark mode is the `.dark` class. Fonts are the `--font-sans`, `--font-heading` and `--font-mono` tokens.
- `DataTable` uses TanStack Table v9 and exports its own `ColumnDef` type.
- Tailwind CSS v4 is a peer dependency. The consumer generates the utilities from the package output.
- Removed: `Theme`, `brand`, density, the `ns-` classes and `--ns-*` tokens, the closed `safeProps` contract, the Clerk adapter, the code editor, and the shadcn registry output.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.1.0 tailwindcss @tailwindcss/vite @fontsource-variable/plus-jakarta-sans @fontsource-variable/outfit @fontsource-variable/geist-mono`. In the main CSS file, write `@import "tailwindcss"; @import "@nanostackorg/design-system/styles.css"; @source "../node_modules/@nanostackorg/design-system/dist";` and import the three fonts in the entry point. Replace `<Theme>` with `<ThemeProvider>`, and replace each 0.0.x component with the wrapper of the same shadcn name, for example `<Button variant="secondary">` from `@nanostackorg/design-system/components/button`.

## 0.0.6

- Let the desktop sidebar collapse to an icon rail. `AppShell collapsibleSidebar` adds a rail on the sidebar edge and the Ctrl/⌘ B shortcut, `AppShellSidebarToggle` gives the top bar a button, and `useAppShellSidebar()` reports the state. The application can keep the choice with `defaultSidebarCollapsed`, or with `sidebarCollapsed` and `onSidebarCollapsedChange`. A collapsed nav link shows only its icon and keeps its accessible name.
- Give `brand="echopoint"` its original neutral palette: the blue-grey light theme and the navy dark theme it had before the migration, with the same text contrast checks.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.0.6`. Opt in with `<AppShell collapsibleSidebar defaultSidebarCollapsed={saved} onSidebarCollapsedChange={save}>` and place `<AppShellSidebarToggle />` in `AppShellHeader`. Give each `AppShellNavLink` an `icon`, which is all a collapsed rail shows.

## 0.0.5

- Add `Input icon`: a glyph at the start of the field, for search fields. The `DataTable` search shows a magnifier.
- Draw `Select` with the library's own chevron instead of the operating system control. The new default width `auto` fills a `Field` and fits its options elsewhere, such as in a toolbar.
- Add `ReportHeader sticky`. `sticky={false}` lets the heading scroll with the report on short screens.
- Apply button hover colors only on devices that hover, so a tapped button does not keep its hover color.
- Show a disclosure trigger at label size (13 px, medium) instead of the surrounding text size.
- Give an `EmptyState` action a width of up to 24rem, so a `DefinitionList` in it no longer collapses to one letter per line.
- Keep values at their own width in the phone `DataTable` cards instead of stretching them.
- Show focus rings on `Select` like on the other controls.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.0.5`. A `Select` outside a `Field` that must fill its row now needs `width="fill"`: `<Select width="fill" options={options} />`. Replace a search icon stacked over an `Input` with `<Input icon={MagnifyingGlassIcon} aria-label="Search" />`.

## 0.0.4

- Add the font tokens `--ns-font-sans`, `--ns-font-heading` and `--ns-font-mono`. Headings, page, section, card, empty-state and dialog titles use the heading font, and code, keyboard keys and the editors use the mono font.
- `brand="echopoint"` uses Plus Jakarta Sans for text, Outfit for headings and Geist Mono for code, as Echopoint did before its migration. The default and `anchor` brands keep the system fonts.
- The Clerk adapter uses the theme's text font.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.0.4`. An application with `brand="echopoint"` loads the font files itself, for example `pnpm add @fontsource-variable/plus-jakarta-sans @fontsource-variable/outfit @fontsource-variable/geist-mono` and `import '@fontsource-variable/plus-jakarta-sans'` (and the other two) in its entry point. Without them, the text falls back to the system fonts.

## 0.0.3

- Add `AppShellHeaderTitle` and `AppShellHeaderActions`. The title shortens with an ellipsis and the actions stay on one line, so a phone top bar no longer wraps its account control onto a second line. Keyboard hints inside the actions hide on a phone.
- Show each `DataTable` row as a card of label and value lines when the table is narrower than 560 px. Long values wrap inside their line instead of widening the table. Sortable headers stay available as a sort bar, and the paging controls stay on one line.
- Keep a `Checkbox` box at 20 px on touch screens. Only its tap area grows to 44 px.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.0.3`. Compose the top bar with the new parts instead of one wrapping `Cluster`: `<AppShellHeader><AppShellHeaderTitle>Home</AppShellHeaderTitle><AppShellHeaderActions>…</AppShellHeaderActions></AppShellHeader>`. In a `DataTable`, a column whose `header` is not a string shows its `id` as the phone label: give action columns `header: ''`.

## 0.0.2

- Make `SignInPanel` and `AccountControl` readable in dark mode: text on the accent button uses `--ns-on-accent`, control borders use `--ns-control-border`, and the GitHub, Apple, X and Vercel icons invert on a dark theme.
- Document that `SignInPanel routing="path"` needs every address under its `path` routed to the panel.

Upgrade: `pnpm add --save-exact @nanostackorg/design-system@0.0.2`. With `routing="path"`, also route every address under the panel's path to the screen that renders it. With TanStack Router, add `createRoute({ path: "/sign-in/$", component: AuthScreen })` beside the `/sign-in` route. Without it, the password step at `/sign-in/factor-one` shows the application's not-found page.

## 0.0.1

Numbering restarts at 0.0.1 for the first release with the common-only scope. It supersedes the 0.2.0 betas: 0.2.0-beta.4 and 0.2.0-beta.5 were never published, and the inspector sidebar, `DockSheet`, `GraphCanvasHandle.revealNode` and `BarStrip` selection that beta.4 added left the library with those parts.

- Publish the component catalog, the guidelines and this changelog at https://nanostack-dev.github.io/nanostack-design-system/.
- Publish stable versions under npm's `latest` tag and GitHub releases; betas keep the `beta` tag and GitHub prereleases.
- Require `@phosphor-icons/react` (^2.1.10) as a peer dependency. `Icon` glyphs and the library's own icons share the application's single copy.
- Resolve every export through a `default` condition and export `package.json`, so CommonJS-aware resolvers and test runners find the package.
- Ship JavaScript source maps with inline sources. Declaration maps are removed because their sources were never shipped.
- `pnpm check` verifies the committed shadcn registry instead of regenerating it.
- Show the backdrop of a `Dialog`, `ConfirmationDialog` or `ResponsivePanel` inside `AppShell`. The navigation drawer no longer wraps the shell, so a `DialogTrigger` outside a `Dialog` no longer opens navigation.
- Connect `Select` to its surrounding `Field` for its label, description, error, invalid and disabled state.
- Let the `hidden` attribute hide library elements, wrap static `ActivityItem` rows on narrow screens, and paint `--ns-canvas` behind a scoped `Theme`.
- Give `brand="echopoint"` its own accent tokens: Echopoint blue in light mode and Echopoint lime in dark mode.
- Add `openNavigationLabel` and `closeNavigationLabel` to `AppShell`, and `closeLabel` to `DialogPopup` and `ConfirmationDialog`.
- Paint menus, tooltips, popovers and autocomplete lists above dialogs, the navigation drawer and mobile panels through the `--ns-layer-*` scale.
- Add `ConfirmationDialog pending`: the action is busy, shows a spinner and ignores repeated activation.
- Key `DataTable` row selection by row id. Add controlled `selectedRowIds` and `onSelectedRowIdsChange`, and `getRowLabel` for per-row checkbox names.
- Stop `VirtualList` from re-requesting a failed page. Add `loadMoreFailed`, `loadMoreFailedMessage` and `retryLabel` for a retry affordance.
- Render `CommandSeparator` as a presentational divider. A listbox may own only options and groups, so the previous `separator` role failed accessibility checks. It still hides during a search unless `alwaysRender` is set.
- Let a consumer `id` and label name `CommandInput` and `TagAutocomplete`. Tag inputs ignore Enter during IME composition, keep a rejected draft, return focus to the input after a removal, and close their list on the first Escape without closing a parent dialog.
- Keep external editor `value` updates out of undo history and keep the cursor in place. Add `documentKey` to give each document its own history.
- Keep editor configuration stable across parent re-renders.
- Require `label` or `aria-labelledby` on every editor. A `<label for>` that targets the editor `id` focuses it.
- Return focus to the `EditableText` button after Enter commits or Escape cancels.
- **Breaking:** narrow the library to UI that any Nanostack product can use unchanged. Remove these Echopoint-specific parts, their styles and their subpaths:
  - graph canvas and flow nodes: `GraphCanvas`, `GraphCanvasHandle`, `GraphViewportControls`, `useGraphNodes`, `useGraphEdges`, `useGraphViewport`, `applyGraphNodeChanges`, `applyGraphEdgeChanges`, `addGraphEdge`, `graphAnchorSideFromHandle`, `isGraphAnchorSide`, the graph data, change and presentation types, `GraphNodeFrame`, `GraphNodeHeader`, `GraphNodeBody`, `GraphNodeFooter`, every `Node*` presentation part, and the `Dock` parts;
  - fleet: `WorkerAvatar`, `CapacityMeter` and the `ResourceTile` parts;
  - `HttpMethodBadge`;
  - variable editing: `VariableAwareInput`, `VariableText`, `getVariableMatches`, `getCompletionMatch`, the `Variable` and `VariableTemplate` types, `KeyValueRow`, `KeyValueDraftRow`, and the `CodeEditor` props `variables`, `variablesEnabled`, `variablePattern`, `variableTemplates` and `variableResolver` with the single-line `input` variant;
  - workbench panes: `Workspace`, `WorkspaceRail`, `WorkspaceMain`, the `Pane` parts, `WorkspaceSplit`, `useWorkspaceLayout`, `DocumentTabs`, `DocumentTab`, the `Tree` parts, `SourcePane` and `tokenizeSourceLine`;
  - run history visuals: `BarStrip`, `TimelineRange`, `ConversationLog`, `MessageRow` and `MessageBubble`.
- `CodeEditor` and `CodeViewer` stay as a plain multi-line JSON, XML, HTML and text editor and viewer. `PreviewFrame` moves to the `blocks/preview-frame` subpath. The package no longer depends on `@xyflow/react` or `react-resizable-panels`.

Upgrade: install the exact version and the Phosphor peer with `pnpm add --save-exact @nanostackorg/design-system@0.0.1` and `pnpm add @phosphor-icons/react@^2.1.10`. 0.0.1 sorts below the 0.2.0 betas, so a range such as `^0.2.0-beta.3` never resolves to it: pin it exactly. Glyph imports do not change: `<Icon glyph={GearIcon} label="Settings" />`. The Clerk adapter needs React 19.2.3 or later because of Clerk's own peer range.

Upgrade: a `DialogTrigger` or `DialogClose` inside `AppShell` must belong to its own `Dialog`, for example `<Dialog><DialogTrigger>Edit</DialogTrigger><DialogPopup>…</DialogPopup></Dialog>`. Inside a `Field`, the Field's `name` wins over the `Select`'s `name`, and manual `id`, `htmlFor` and `aria-describedby` wiring can be removed: `<Field name="environment"><FieldLabel>Environment</FieldLabel><Select options={options} /></Field>`.

Upgrade: `DataTable` row selection requires `getRowId`, and `isRowSelected` cannot be combined with `enableRowSelection`: replace `<DataTable enableRowSelection isRowSelected={(row) => row.id === openId} … />` with `<DataTable enableRowSelection getRowId={(row) => row.id} selectedRowIds={ids} onSelectedRowIdsChange={setIds} … />`. Row checkboxes are named "Select <row label>" instead of "Select row", so tests that query "Select row" must change.

Upgrade: name every editor: replace `<CodeEditor id="payload" aria-label="Payload" />` with `<CodeEditor id="payload" label="Payload" />`, or point `aria-labelledby` at a visible label. Pass `documentKey={activeDocument.id}` when one editor shows several documents.

Upgrade: Echopoint now owns the removed parts under its own source tree, built from `--ns-*` tokens and library primitives; other applications did not use them. The scope rule in AGENTS.md decides what the library holds. Import `PreviewFrame` from the root or its new subpath: replace `import { PreviewFrame } from '@nanostackorg/design-system/blocks/workspace'` with `import { PreviewFrame } from '@nanostackorg/design-system/blocks/preview-frame'`. A plain editor drops the variable props: replace `<CodeEditor label="Body" language="json" variables={variables} />` with `<CodeEditor label="Body" language="json" />`, and keep a single-line template input such as a URL bar in the application.

## 0.2.0-beta.3

- Release under the MIT license on public npm and GitHub with exact beta installs, public package metadata and a release workflow using npm trusted publishing.
- Keep all component implementations, stylesheet rules, exports and the closed variation contract unchanged from beta.2.

Upgrade: replace the vendored beta.2 dependency with `@nanostackorg/design-system@0.2.0-beta.3`, commit the regenerated lockfile and remove the unused archive. Existing applications can preserve their `@nanostack/design-system` imports using the npm alias documented in the README. Assemblies remain unchanged.

## 0.2.0-beta.2

- Add neutral graph presentation-store subscriptions and finite family/run-phase variants. Streamed changes update affected elements without rebuilding graph arrays; historical arrivals and reduced motion avoid replaying animations.
- Add compact node presentation parts and numeric timeline ranges for live activity and stored outcomes.
- Add capacity segments and selectable resource tiles. WorkerAvatar gains a liquid Pebble variant with observed heartbeat freshness and activity signals; its robot variant remains available.
- Preserve current Echopoint webhook-wait, choreographed execution and fleet behavior while keeping visual ownership in this library.

Upgrade: replace the beta package and keep existing imports. Use `WorkerAvatar variant="pebble"` for capacity-sensitive resources, compose `ResourceTile` parts around product data, and pass a neutral store through GraphCanvas's `presentation` prop when visual state updates independently of the document. Existing robot avatars and static graph models remain supported.

## 0.2.0-beta.1

- Extend the closed contract to native aliases, provider appearance bags, owned state attributes, typed spreads and untyped runtime callers. Text now uses the finite `display` option; element replacement is unsupported.
- Add named parts for forms, menus, collection rows, tables, inspectors, application shells, responsive panels, dialogs, navigation, notifications and identity widgets.
- Add library-owned code editors, source diffs, resizable workspaces, trees, graph geometry, connection controls, virtualized lists, duration charts and conversation logs. Applications retain domain data and callbacks.
- Publish an interactive catalog at `?catalog`, component recipes, contribution guidance and an Anchor adoption path. Preserve Anchor's light-only preset.
- Migrate Echopoint's full frontend and stories to library assemblies, with an enforced zero-override boundary. Remove local primitives, stylesheets and visual-engine dependencies.
- Expand keyboard, focus, async clipboard, controlled state, scroll anchoring, graph pointer, responsive, accessibility, type and packaged-consumer coverage.

Upgrade: replace `Text as="span"` with `display="inline"` and remove `as="p"`, which is the default. Replace `data-size`, `data-tone`, `data-disabled` and other state attributes, and `color` passed from JavaScript or spread objects, with the typed prop they imitated. Replace `sx`, `slots` and `component` with layout parts such as Cluster, or with named parts. Components now remove these keys at runtime, so an unconverted use has no visual effect.

```tsx
// 0.1.0-beta.1
<Text as="span" data-tone="muted">Draft</Text>
<Button data-size="sm" data-disabled="" {...{ sx: { ml: 2 } }}>Save</Button>

// 0.2.0-beta.1
<Cluster gap="sm">
  <Text display="inline" tone="muted">Draft</Text>
  <Button size="sm" disabled>Save</Button>
</Cluster>
```

## 0.1.0-beta.1

- Introduce a closed styling contract, scoped light/dark and brand presets, and comfortable/compact density.
- Add accessible Base UI controls, layout primitives and composable application blocks.
- Include a live playground, source research, automated behavior/type/browser/contrast/package checks, and a generated shadcn source registry.
- Prove the package in Echopoint's authenticated `/dashboard-beta` route; Anchor migration remains incremental and light-only.

Beta API changes require a new entry and a consumer upgrade example. No stable compatibility promise is made before 1.0.
