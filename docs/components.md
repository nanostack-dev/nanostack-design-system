# Component catalog and composition

Use this catalog when assembling a product surface, choosing a variant, or deciding where a missing capability belongs. The exported TypeScript props are authoritative for exact options and required fields. Import from `@nanostackorg/design-system` or a documented module subpath; import `@nanostackorg/design-system/styles.css` once at the application boundary.

Run `pnpm dev` and open [the interactive catalog](http://127.0.0.1:4317/?catalog) to inspect representative compositions. The six sections exercise controls, overlays, tables, editors, graphs, virtual history and conversations with local example data. Brand, color scheme and density controls expose only the supported finite options. The default `/` workspace preview remains available separately.

All appearances use finite options. Children and content callbacks contain text, library parts, and application assemblies of those parts. Their presence does not permit native JSX, third-party visual components, replacement elements, or CSS in the consumer. The full contract and change process live in [contributing.md](contributing.md); the primary-source rationale lives in [research.md](research.md).

## Scope and foundations

| Parts                                                                | Options and composition rules                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Theme`, `useThemeSettings`                                          | `brand`: `nanostack`, `echopoint`, `anchor`; `colorScheme`: `light`, `dark`; `density`: `comfortable`, `compact`. Scope the shell once; overlays inherit the nearest scope.                                                                                                                                                             |
| `DocumentTheme`                                                      | Opt in at the application root when the document canvas and browser color scheme should follow `Theme`. Embedded library consumers can omit it.                                                                                                                                                                                         |
| `Stack`, `Cluster`, `Grid`                                           | Vertical, wrapping horizontal, and grid composition. Stack gaps: `none`, `xs`, `sm`, `md`, `lg`, `xl`; Cluster gaps: `xs`, `sm`, `md`, `lg`; Grid gaps: `sm`, `md`, `lg`. Grid uses `columns={1\|2\|3}` or `layout="sidebar"\|"navigation"`; the latter reserve the second or first track. Responsive collapse is owned by the library. |
| `Surface`, `Divider`, `ControlRow`                                   | Surface padding: `none`, `sm`, `md`, `lg`; tone: `default`, `subtle`. ControlRow keeps an editing control and its actions together, with `align="center"\|"start"`.                                                                                                                                                                     |
| `ScrollRegion`, `ResponsiveVisibility`                               | Named scroll area with `height="content"\|"panel"\|"fill"`; `viewportRef` refers to the actual scrolling element. ResponsiveVisibility selects `mobile` or `desktop` content without consumer media queries.                                                                                                                            |
| `Form`, `Label`, `List`, `OrderedList`, `ListItem`, `VisuallyHidden` | Native semantics owned by the package. Labels retain `htmlFor`; forms retain submission behavior. Lists use finite gap and marker options. There is no generic `as` or arbitrary tag replacement.                                                                                                                                       |
| `Text`, `Heading`, `Code`, `KeyboardKey`, `Highlight`                | Text display: `block`, `inline`; size: `xs`, `sm`, `md`, `lg`; weight: `regular`, `medium`, `semibold`; tone: `default`, `muted`, `info`, `success`, `warning`, `danger`; optional truncation. Heading levels: 1–4. Code provides identifier/source typography; KeyboardKey supplies keycap semantics.                                  |
| `Icon`, `Spinner`, `BrandMark`, `Skeleton`                           | Icon receives a glyph imported from the `@phosphor-icons/react` peer, a finite size (`xs`, `sm`, `md`, `lg`) and semantic tone. Give icon-only controls their own accessible name. Spinner announces loading. Brand and skeleton geometry stay inside the library.                                                                      |

`height="fill"` composes inside a height-constrained shell or workspace. Use content height for ordinary pages. Passing numeric data such as progress, graph coordinates, or a pane ratio is a behavioral/data contract; it is not a CSS length or token override.

## Controls and forms

| Parts                                                                                                    | Options and composition rules                                                                                                                                                                                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`, `Link`                                                                                         | Button variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `icon`. Links stay native anchors and support `text`, `muted`, `primary`, `secondary`, `ghost`. Use actions for mutation and links for navigation.                                                                                                         |
| `Input`, `Textarea`, `Select`, `Checkbox`                                                                | Native form attributes and accessible names remain available. Input/Select size: `sm`, `md`. Select width: `fill` for forms, `content` for compact toolbars. Select accepts typed option data instead of consumer `<option>` elements. Checkbox supports controlled/uncontrolled, disabled, required, read-only and indeterminate states. |
| `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldGroupLegend`, `FormActions` | Compose label, control, help and validation together; FieldGroup and its legend name related controls. Use FormActions for a form's submit/cancel region. Server validation and the meaning of an error belong to the application. `Input`, `Textarea` and `Select` connect to the field automatically.                                   |
| `Autocomplete`                                                                                           | A free-text input with a finite suggestion collection. The application supplies `value`, `onValueChange`, a required label, suggestions and loading/empty copy. Keyboard selection does not prevent values outside the suggestions.                                                                                                       |
| `TagInput`, `TagAutocomplete`                                                                            | Controlled tag collections. Supply normalization and validation as behavior callbacks; TagAutocomplete adds suggestions and creation behavior. Disabled inputs also disable removal.                                                                                                                                                      |
| `EditableText`                                                                                           | Inline editing with `variant="body"\|"title"\|"code"`. The application handles commits and persistence.                                                                                                                                                                                                                                   |
| `ChoiceCard`                                                                                             | A native button for a whole-card action or selection. Supply title, description, an optional library icon and selected state.                                                                                                                                                                                                             |
| `KeyValueRow`, `KeyValueDraftRow`                                                                        | Generic editing rows for named values, including locked/reserved keys and variable support. Rename commits preserve the editing session; domain storage and secret handling remain in the app.                                                                                                                                            |
| `CopyButton`                                                                                             | Owns clipboard success/failure feedback. Supply the value and an accessible label; an optional copy callback permits deterministic testing. Never show success before the copy resolves.                                                                                                                                                  |

Router integrations wrap native library links in the router's behavior adapter. For example, Echopoint defines `createLink(Link)`, `createLink(MenuLink)` and `createLink(ResourceRowLink)` once in its integration module. The adapter forwards navigation/ref behavior and contributes no markup or styling.

## Menus, dialogs, and navigation

| Parts                                                                                                                                           | Options and composition rules                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tabs`, `TabsList`, `TabsTab`, `TabsPanel`                                                                                                      | Each tab/panel shares its value. Give TabsList an accessible label. Tabs can use content or fill height.                                                                                                    |
| `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuLink`                                                                                    | The trigger owns its native button. Item tone: `neutral`, `danger`. Popup alignment: `start`, `center`, `end`; side: `top`, `right`, `bottom`, `left`.                                                      |
| `MenuGroup`, `MenuLabel`, `MenuSeparator`, `MenuCheckboxItem`, `MenuRadioGroup`, `MenuRadioItem`, `MenuSub`, `MenuSubTrigger`, `MenuSubContent` | Labels belong inside a group. Use typed selection state for persistent menu choices; submenu parts preserve keyboard navigation and focus.                                                                  |
| `Dialog`, `DialogTrigger`, `DialogPopup`, `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogFooter`, `DialogClose`                     | Every popup includes a title. Size: `sm`, `md`, `lg`; placement: `center`, `search`, `side`, `bottom`. Supply controlled state when application work determines dismissal.                                  |
| `ConfirmationDialog`                                                                                                                            | A complete confirmation block with `info`, `success`, `warning`, `destructive` severity. `onAction` does not imply mutation success or close the dialog; the application closes it after its work succeeds. |
| `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverTitle`, `PopoverDescription`                                                             | Short contextual interaction with themed portal, keyboard dismissal and focus return. Content alignment and side use finite values.                                                                         |
| `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent`                                                                                | Provider supplies timing context. The trigger owns its element; a tooltip supplements an accessible name and never replaces essential instructions.                                                         |
| `Disclosure`, `DisclosureTrigger`, `DisclosurePanel`                                                                                            | Expand/collapse content with native button semantics, controlled/default state, and library-owned motion.                                                                                                   |
| `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, `CommandFooter`                    | Searchable command collection. Set the Command root's `label`; the command engine associates that label with its input. Application filtering and commands remain application behavior.                     |
| `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`               | Ancestors are links; the current page is non-interactive text with `aria-current`. Separator: `chevron`, `slash`.                                                                                           |

Triggers, content, and named parts are explicit imports. Consumers do not provide `render`, `asChild`, `slotProps`, CSS selectors, or replacement implementations to alter their anatomy.

## Pages and workspaces

| Parts                                                                                                                                                                                | Options and composition rules                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`, `AppShellSidebar`, `AppShellBrand`, `AppShellNav`, `AppShellNavLink`, `AppShellHeader`, `AppShellBody`, `AppShellMain`, `AppShellDock`, `AppShellFooter`                 | Layout: `page`, `workspace`. Sidebar owns responsive navigation and mobile focus management; the application supplies destinations and permission-filtered entries. Name each navigation region.                                                     |
| `Page`, `PageHeader`, `PageHeaderContent`, `PageHeaderTitle`, `PageHeaderDescription`, `PageHeaderActions`, `PageEyebrow`                                                            | Page width: `standard`, `wide`; height: `content`, `fill`. Keep the primary page title and actions together.                                                                                                                                         |
| `Section`, `SectionHeader`, `SectionTitle`, `SectionDescription`, `SectionActions`, `SectionBody`; `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Compose work regions. Card tone: `default`, `subtle`. A section organizes content; a card supplies a surface.                                                                                                                                        |
| `CenteredScreen`, `ScreenContent`, `SplitScreen`, `SplitScreenAside`, `SplitScreenMain`                                                                                              | Authentication, onboarding, and other focused screen compositions. Auth providers and session behavior remain app-owned.                                                                                                                             |
| `Workspace`, `WorkspaceRail`, `WorkspaceMain`, `Pane`, `PaneToolbar`, `PaneBody`, `PaneFooter`, `PaneSection`                                                                        | Dense tools with explicit regions. Pane tone: `default`, `subtle`; body scroll: `vertical`, `none`; padding: `none`, `sm`, `md`. PaneSection receives controlled open state and a toggle callback.                                                   |
| `WorkspaceSplit`, `WorkspaceSplitHandle`, `useWorkspaceLayout`                                                                                                                       | Resizable primary/secondary content with horizontal/vertical orientation. The behavior ref selects `primary`, `secondary`, or `split`; layout persistence is an application choice. The library owns resize handles, measurement, minimums, and CSS. |
| `DocumentTab`, `DocumentTabs`                                                                                                                                                        | Editor workspace tabs with selection and close behavior. Document identity and close/save decisions belong to the application.                                                                                                                       |
| `ResponsivePanel`                                                                                                                                                                    | A controlled desktop pane that becomes a focus-managed mobile dialog. `desktopVisibility="controlled"\|"always"` selects the desktop policy; the application supplies open state and a label.                                                        |
| `Dock`, `DockToolbar`, `DockBody`, `DockRail`, `DockSidebar`, `DockMain`, `DockSheet`, `DockBanner`                                                                                               | Persistent supporting tools. Sidebar size: `standard`, `wide`, `inspector`; side: `start`, `end`. `DockSheet` is a nonmodal lower inspector inside `DockMain`. Open state is controlled.                                                                                                                                                             |
| `Tree`, `TreeBranch`, `TreeItem`, `TreeItemButton`, `TreeGroup`                                                                                                                      | Hierarchical navigation. Tree owns visible/enabled focus traversal and a primary roving tab stop; application callbacks expand or activate domain nodes. Supply labels, levels and expanded/selected state.                                          |
| `PreviewFrame`                                                                                                                                                                       | Documentation fixtures with `width="narrow"\|"standard"\|"wide"` and `height="content"\|"panel"\|"workspace"`. Use it instead of story-only CSS.                                                                                                     |

## Collections, inspection, and history

| Parts                                                                                                                                                   | Options and composition rules                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ResourceList`, `ResourceRow`, `ResourceRowLabel`, `ResourceRowMeta`, `ResourceRowActions`, `ResourceRowLink`, `ResourceRowButton`, `ResourceDragImage` | Density: `comfortable`, `compact`; rows expose selected, read-only and drag state. A link/button provides the primary row action; independent controls belong in ResourceRowActions. ResourceDragImage owns the off-screen native drag snapshot.                                                                 |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`                                                                               | Semantic table parts for hand-assembled data. Table requires a label; cell/head alignment is `start`, `center`, `end`. Use a real button for row expansion.                                                                                                                                                      |
| `DataTable`, `DataTableToolbar`                                                                                                                         | Typed column and record data, sorting, pagination, selection, visibility, loading and empty states. Client mode sorts/pages local records; manual mode receives the server page plus pagination and row/page counts. Row tone: `neutral`, `warning`, `danger`. Cell and toolbar callbacks compose library parts. |
| `VirtualList`                                                                                                                                           | A labeled, measured collection with item keys, `renderItem`, loading/empty content and an end-reached callback. Height: `panel`, `fill`; density: `compact`, `comfortable`. Fetching and cursor ownership stay in the app; renderItem produces an assembly of library parts.                                     |
| `Inspector`, `InspectorHeader`, `InspectorBody`, `InspectorFooter`, `DefinitionList`, `DefinitionItem`                                                  | Detail surfaces with content/fill height and semantic label/value pairs. DefinitionList layout: `stacked`, `columns`.                                                                                                                                                                                            |
| `ActivityList`, `ActivityItem`                                                                                                                          | Concise static or linked activity. Supply title, description, status and metadata. A linked item contains no independent interactive child; use ResourceRow for mixed actions.                                                                                                                                   |
| `StatusMarker`, `TimelineItem`, `Report`, `ReportHeader`, `ReportContent`                                                                               | History/report building blocks. StatusMarker variant: `pill`, `inline`, `dot`; activity: `steady`, `active`. TimelineItem is a selectable native button with bounded numeric interval data. Report owns its sticky heading behavior.                                                                             |
| `ConversationLog`, `MessageRow`, `MessageBubble`                                                                                                        | A labeled log with entry-count-based anchoring. MessageRow side: `start`, `end`; bubble tone: `neutral`, `accent`, with optional streaming feedback. Message content, network streams and tool execution stay in the app.                                                                                        |
| `Badge`, `Callout`, `EmptyState`, `Metric`, `Toaster`, `toast`                                                                                          | Semantic feedback and summaries. Badge tones: `neutral`, `info`, `success`, `warning`, `danger`; Callout omits neutral. Mount Toaster inside the theme scope; application operations determine notifications.                                                                                                    |

A resource row assembly can keep its link and destructive action independent without introducing any visual implementation:

```tsx
import {
  Badge,
  Button,
  ResourceList,
  ResourceRow,
  ResourceRowActions,
  ResourceRowLabel,
  ResourceRowLink,
  ResourceRowMeta,
} from '@nanostackorg/design-system';

type RecordSummary = { id: string; name: string; href: string; active: boolean };

export function RecordList({
  records,
  canArchive,
  onArchive,
}: {
  records: readonly RecordSummary[];
  canArchive: boolean;
  onArchive: (id: string) => void;
}) {
  return (
    <ResourceList density="compact">
      {records.map((record) => (
        <ResourceRow key={record.id}>
          <ResourceRowLabel>
            <ResourceRowLink href={record.href}>{record.name}</ResourceRowLink>
          </ResourceRowLabel>
          <ResourceRowMeta>{record.id}</ResourceRowMeta>
          <ResourceRowActions>
            <Badge tone={record.active ? 'success' : 'neutral'}>
              {record.active ? 'Active' : 'Paused'}
            </Badge>
            <Button
              variant="danger"
              size="sm"
              disabled={!canArchive}
              onClick={() => {
                if (canArchive) onArchive(record.id);
              }}
            >
              Archive
            </Button>
          </ResourceRowActions>
        </ResourceRow>
      ))}
    </ResourceList>
  );
}
```

The record shape, permission and action are application concerns. The row, hit target, wrapping, focus ring and state appearance are library concerns.

## Editors, visualizations, and graphs

| Parts                                                                                                     | Options and composition rules                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CodeEditor`, `CodeViewer`, `CodeEditorHandle`                                                            | Language: `text`, `json`, `xml`, `html`; height: `content`, `compact`, `standard`, `fill`; editor variant: `input`, `editor`, `viewer`. Supply text, variables, read-only/disabled state and callbacks. The ref exposes focus, selection and value access, not the visual engine. |
| `VariableAwareInput`, `VariableText`, variable matching/completion helpers                                | The application supplies available variables and resolvers. VariableText tone: `default`, `muted`; wrap: `wrap`, `nowrap`. Syntax highlighting, completion popups and editor CSS are shared.                                                                                      |
| `SourcePane`, source token helpers                                                                        | Labeled line-oriented source and diffs. Supply lines, starting line and changed-line data; change: `added`, `removed`. Compare revisions and load files in the application.                                                                                                       |
| `HttpMethodBadge`                                                                                         | Method normalization with `format="full"\|"short"`. Method-to-tone mapping belongs to the library.                                                                                                                                                                                |
| `Sparkline`, `Progress`, `BarStrip`                                                                       | Named data displays. Sparkline accepts numeric values and semantic tone; Progress clamps finite data against max and supports indeterminate state. BarStrip receives labeled, toned points and selection callbacks; `selection="single"` gives keyboard radio selection and `onPreview` reports hover and focus. Geometry, colors and SVG remain internal.                     |
| `WorkerAvatar`                                                                                            | Reusable activity illustration with `size="sm"\|"md"\|"lg"` and `variant="robot"\|"pebble"`. Load, alarm, stale heartbeat and activity inputs describe observed state; a seed keeps phase stable. Fleet health thresholds and lease calculations stay in the product.             |
| `GraphCanvas`, `GraphCanvasHandle`, graph data/change types                                               | Required label, node/edge data and callbacks; mode: `readonly`, `interactive`; height: `panel`, `fill`. The ref fits, centers, reveals a node beside an inspector, or animates a layout. Canvas engines and engine-specific DOM/marker/style configurations remain private.                                           |
| `GraphNodeFrame`, `GraphNodeHeader`, `GraphNodeBody`, `GraphNodeFooter`                                   | Reusable node anatomy. Width: `compact`, `standard`; emphasis: `normal`, `focused`, `critical`; tone: `neutral`, `info`, `success`, `warning`, `danger`. Node content contains library assemblies.                                                                                |
| `GraphViewportControls`, `useGraphNodes`, `useGraphEdges`, `useGraphViewport`, graph change/state helpers | Library-owned viewport controls and engine-neutral behavioral access. The application owns graph meaning, valid connections, layout algorithms, persistence and permission checks.                                                                                                |

Graph positions and measured dimensions are numeric model/engine data. Edge motion is `static` or `flow`; anchor side is `top`, `right`, `bottom`, or `left`. Arbitrary colors, CSS dimensions, custom markers, renderer maps, engine objects, and style bags are not public extension points. An unknown node shape becomes common library anatomy plus an application-owned content assembly.

## Adoption in Anchor

1. Pin the reviewed package artifact and import its stylesheet once. Record its source commit and checksum using the release procedure.
2. Wrap the application in `Theme brand="anchor" colorScheme="light"`; choose a supported density. Anchor remains light-only unless its product requirements change.
3. Add one router-link adapter and preserve Anchor's existing hierarchy, identity, tenancy and authorization models. Pass neutral records and callbacks into the library.
4. Migrate complete surfaces: shell and navigation, then forms/collections, detail inspectors and complex editors. Select finite library options and add genuinely missing common parts here.
5. Run the consumer assembly boundary on production code and stories, then verify native links, permission gates, loading/error states, keyboard navigation and responsive layouts against the packed dependency.

Echopoint assemblies are working integration examples for editor, graph, resource-list, fleet, monitor, webhook and history workflows. Copy their composition pattern, not their domain vocabulary or API dependencies. An Anchor-specific API hook remains in Anchor; a generally useful interaction discovered during adoption belongs in this library with behavior and contract tests.

## Resource capacity and live presentation

`ResourceTileGrid` lays out responsive tiles. Compose `ResourceTile` with `ResourceTileBody`, `ResourceTileHeader`, `ResourceTileLabel`, `ResourceTileMeta` and `ResourceTileStatus`. A tile is a button: give it an accessible name and selection behavior, and keep nested content noninteractive. `selected`, `highlighted` and the finite `tone` (`default`, `warning`, `danger`) describe state. `ResourceTilePlaceholder` holds loading or waiting content without creating a false action.

`CapacityMeter` accepts segments with stable identifiers and `free`, `busy`, `expiring` or `expired` state, plus an optional hidden count. Supply `label` when it is independently meaningful; omit it inside an already named resource control. Segment pointer callbacks select supporting detail, while keyboard users reach the same complete information through the resource control. The application computes capacity and freshness; the library draws them.

`TimelineRange` places a numeric `start` and `end` against `total`, with an accessible `label`, semantic `tone` and `sm` or `md` size. Invalid or out-of-bounds ranges are clamped. It does not accept CSS coordinates.

For independently streamed graph presentation, `GraphPresentationStore` provides a subscription and cached node/edge snapshots. Keep snapshot identity stable when the selected element did not change. Graph document state stays separate from run presentation; the library subscribes per element through React's external-store API. `useReducedMotionPreference` provides a shared browser preference with a conservative server snapshot.

`GraphNodeFrame` chooses a finite family (`call`, `wait`, `logic`, `data`) and optional phase (`idle`, `running`, `success`, `error`, `skipped`). `instant` suppresses arrival motion for historical state. `NodeHeading`, `NodeSection`, `NodeCaption`, `NodeCode`, `NodePlaceholder`, `NodeFacts`/`NodeFact`, `NodeStatistic`, `NodeValueList`, `NodeChecks`, `NodeRoutes`/`NodeRoute` and `NodeBindingList`/`NodeBinding` compose compact content. The application selects labels, values and domain meaning.

`NodeMeter` has discriminated value, indeterminate and known-duration modes. `NodeAttempts` bounds repeated visual marks; `NodeIcon` chooses steady, turn, tick or listen motion. `NodeStreamActivity`, `NodeRunGlyph`, `NodeTelemetry` and `NodeElapsedTime` share run feedback. These parts render their motion only inside the relevant frame phase; elapsed and interval numbers describe observed timing, never arbitrary CSS. See the Graph catalog for examples.
