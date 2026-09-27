# Changelog

## 0.2.0-beta.5

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
- Let a consumer `id` and label name `CommandInput` and `TagAutocomplete`. Tag inputs ignore Enter during IME composition, keep a rejected draft, return focus to the input after a removal, and close their list on the first Escape without closing a parent dialog.
- Keep external editor `value` updates out of undo history and keep the cursor in place. Add `documentKey` to give each document its own history.
- Strip line breaks from every change to a single-line input, and let the wheel over it scroll the page or pane.
- Match variables in linear time within the visible range, and keep the JSON brace after `{{name}}`. Tab accepts a narrowed completion at once, and editor configuration stays stable across parent re-renders.
- Require `label` or `aria-labelledby` on every editor. A `<label for>` that targets the editor `id` focuses it.
- Make a collapsed `WorkspaceSplit` pane inert and give each split unique pane ids behind the library-owned `WorkspaceSplitLayout` and `useWorkspaceLayout`.
- Focus tree items themselves and support arrow keys, Enter and Space activation, typeahead, and `TreeItem expanded` with `onExpandedChange`.
- Keep focus and a rejected rename in `KeyValueRow` and `EditableText`. `VariableText interactive={false}` renders chips without tab stops.

Upgrade: add Phosphor to the application when it is not already a direct dependency with `pnpm add @phosphor-icons/react@^2.1.10`. Glyph imports do not change: `<Icon glyph={GearIcon} label="Settings" />`. The Clerk adapter needs React 19.2.3 or later because of Clerk's own peer range.

Upgrade: a `DialogTrigger` or `DialogClose` inside `AppShell` must belong to its own `Dialog`, for example `<Dialog><DialogTrigger>Edit</DialogTrigger><DialogPopup>…</DialogPopup></Dialog>`. Inside a `Field`, the Field's `name` wins over the `Select`'s `name`, and manual `id`, `htmlFor` and `aria-describedby` wiring can be removed: `<Field name="environment"><FieldLabel>Environment</FieldLabel><Select options={options} /></Field>`.

Upgrade: `DataTable` row selection requires `getRowId`, and `isRowSelected` cannot be combined with `enableRowSelection`: replace `<DataTable enableRowSelection isRowSelected={(row) => row.id === openId} … />` with `<DataTable enableRowSelection getRowId={(row) => row.id} selectedRowIds={ids} onSelectedRowIdsChange={setIds} … />`. Row checkboxes are named "Select <row label>" instead of "Select row", so tests that query "Select row" must change.

Upgrade: name every editor: replace `<VariableAwareInput id="request-url" aria-label="Request URL" />` with `<VariableAwareInput id="request-url" label="Request URL" />`, or point `aria-labelledby` at a visible label. Pass `documentKey={activeRequest.id}` when one editor shows several documents. Replace engine layout mapping with `const persistence = useWorkspaceLayout({ id: SPLIT_STORAGE_KEY })` and `<WorkspaceSplit defaultLayout={persistence.defaultLayout} onLayoutChanged={persistence.onLayoutChanged} />`. Layouts stored in the old shape are ignored once, so the split starts again at its default ratio.

## 0.2.0-beta.4

- Add a nonmodal inspector: `DockSidebar` accepts `size="inspector"` and `side="end"`, and the new `DockSheet` covers the lower part of `DockMain` while the canvas stays interactive.
- Add `GraphCanvasHandle.revealNode(nodeId, { occlusion, entering })`. It moves the viewport only enough to keep a node clear of the sidebar or sheet. An item larger than the free area keeps its start visible. Reduced motion shortens the move.
- `BarStrip` accepts `selection="single"` for keyboard radio selection and `onPreview` for hover and focus previews. Points accept the `info` tone.

Upgrade: install `@nanostackorg/design-system@0.2.0-beta.4`. Existing props keep their behavior. To inspect a node, render the detail inside `DockSidebar size="inspector" side="end"` or `DockSheet`, then call `canvas.current?.revealNode(id, { occlusion: 'sidebar', entering: true })` when the panel opens.

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
