import { InspectorExample } from './inspector-example.js';
import { useState, type ReactNode } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Code as CodeGlyph,
  Cube,
  Play,
  Plus,
} from '@phosphor-icons/react';
import * as UI from '../src/index.js';

const sections = [
  'Foundations',
  'Controls',
  'Collections',
  'Workspace',
  'Graph',
  'History',
] as const;
type CatalogSection = (typeof sections)[number];

function Example({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <UI.Section>
      <UI.SectionHeader>
        <UI.Stack gap="xs">
          <UI.SectionTitle>{title}</UI.SectionTitle>
          <UI.SectionDescription>{description}</UI.SectionDescription>
        </UI.Stack>
      </UI.SectionHeader>
      <UI.SectionBody>{children}</UI.SectionBody>
    </UI.Section>
  );
}

function Foundations() {
  return (
    <UI.Stack gap="xl">
      <UI.Grid columns={3}>
        <UI.Metric
          label="Compose"
          value="Named parts"
          hint="Arrange existing blocks around your product's data."
        />
        <UI.Metric
          label="Vary"
          value="Finite options"
          hint="Choose supported tone, size, density and layout."
        />
        <UI.Metric
          label="Evolve"
          value="One source"
          hint="Add a shared variant when the vocabulary needs to grow."
        />
      </UI.Grid>
      <Example
        title="A shared visual vocabulary"
        description="Brand, color scheme and density change the complete composition together."
      >
        <UI.Grid columns={2} gap="lg">
          <UI.Surface padding="lg">
            <UI.Stack gap="lg">
              <UI.Heading level={3}>Clear hierarchy</UI.Heading>
              <UI.Text>Body copy explains the next useful action.</UI.Text>
              <UI.Text tone="muted" size="sm">
                Supporting information stays legible in either color scheme.
              </UI.Text>
              <UI.Cluster>
                <UI.Code>record_01</UI.Code>
                <UI.KeyboardKey>⌘ K</UI.KeyboardKey>
                <UI.Icon glyph={CheckCircle} tone="success" />
                <UI.Text display="inline" size="sm">
                  Ready to compose
                </UI.Text>
              </UI.Cluster>
              <UI.Divider />
              <UI.Cluster>
                <UI.Badge>Neutral</UI.Badge>
                <UI.Badge tone="info">Info</UI.Badge>
                <UI.Badge tone="success">Success</UI.Badge>
                <UI.Badge tone="warning">Warning</UI.Badge>
                <UI.Badge tone="danger">Danger</UI.Badge>
              </UI.Cluster>
            </UI.Stack>
          </UI.Surface>
          <UI.Card tone="subtle">
            <UI.CardHeader>
              <UI.CardTitle>Common parts, product-owned meaning</UI.CardTitle>
              <UI.CardDescription>
                This card is an assembly. It adds no markup or CSS to the library's parts.
              </UI.CardDescription>
            </UI.CardHeader>
            <UI.CardContent>
              <UI.DefinitionList>
                <UI.DefinitionItem label="Library">
                  Anatomy, focus, geometry and tokens
                </UI.DefinitionItem>
                <UI.DefinitionItem label="Application">
                  Data, permissions, navigation and copy
                </UI.DefinitionItem>
              </UI.DefinitionList>
            </UI.CardContent>
            <UI.CardFooter>
              <UI.Link href="https://github.com/nanostack-dev/nanostack-design-system">
                Read the source <UI.Icon glyph={ArrowRight} size="sm" />
              </UI.Link>
            </UI.CardFooter>
          </UI.Card>
        </UI.Grid>
      </Example>
      <Example
        title="States belong to every composition"
        description="Loading, empty and warning states use the same parts as the ready state."
      >
        <UI.Grid columns={3}>
          <UI.Surface>
            <UI.Stack role="status" aria-label="Loading preview">
              <UI.Skeleton size="sm" />
              <UI.Skeleton />
              <UI.Skeleton size="lg" />
            </UI.Stack>
          </UI.Surface>
          <UI.Surface>
            <UI.EmptyState
              title="Nothing here yet"
              description="A useful empty state explains what will appear."
            />
          </UI.Surface>
          <UI.Callout tone="warning">
            <UI.Stack gap="xs">
              <UI.Text weight="semibold">A variation is missing</UI.Text>
              <UI.Text size="sm">
                Bring the use case into the shared library and test it in both themes.
              </UI.Text>
            </UI.Stack>
          </UI.Callout>
        </UI.Grid>
      </Example>
    </UI.Stack>
  );
}

function Controls() {
  const [name, setName] = useState('Release verification');
  const [environment, setEnvironment] = useState('staging');
  const [tags, setTags] = useState(['release']);
  const [checked, setChecked] = useState(true);
  const [priority, setPriority] = useState('normal');
  const [notice, setNotice] = useState('Try the controls. All changes stay in this preview.');
  return (
    <UI.Stack gap="xl">
      <Example
        title="Actions and overlays"
        description="Native actions and explicit trigger/content parts preserve keyboard behavior and focus return."
      >
        <UI.Stack>
          <UI.Cluster>
            <UI.Button onClick={() => setNotice('Primary action selected.')}>Primary</UI.Button>
            <UI.Button
              variant="secondary"
              onClick={() => setNotice('Secondary action selected.')}
            >
              Secondary
            </UI.Button>
            <UI.Button variant="ghost" onClick={() => setNotice('Quiet action selected.')}>
              Ghost
            </UI.Button>
            <UI.Button
              variant="danger"
              onClick={() => setNotice('Destructive actions should explain their consequence.')}
            >
              Danger
            </UI.Button>
            <UI.Button disabled>Unavailable</UI.Button>
            <UI.Dialog>
              <UI.DialogTrigger variant="secondary">Open example dialog</UI.DialogTrigger>
              <UI.DialogPopup>
                <UI.DialogHeader>
                  <UI.DialogTitle>A composed dialog</UI.DialogTitle>
                  <UI.DialogDescription>
                    The library owns focus, dismissal, theme and spacing. The application
                    supplies content.
                  </UI.DialogDescription>
                </UI.DialogHeader>
                <UI.Field name="catalog-dialog-name">
                  <UI.FieldLabel>Example name</UI.FieldLabel>
                  <UI.Input defaultValue="Release verification" />
                </UI.Field>
                <UI.DialogFooter>
                  <UI.DialogClose>Close dialog</UI.DialogClose>
                </UI.DialogFooter>
              </UI.DialogPopup>
            </UI.Dialog>
            <UI.Menu>
              <UI.MenuTrigger variant="secondary">Example menu</UI.MenuTrigger>
              <UI.MenuContent>
                <UI.MenuGroup>
                  <UI.MenuLabel>Priority</UI.MenuLabel>
                  <UI.MenuRadioGroup value={priority} onValueChange={setPriority}>
                    <UI.MenuRadioItem value="normal">Normal priority</UI.MenuRadioItem>
                    <UI.MenuRadioItem value="high">High priority</UI.MenuRadioItem>
                  </UI.MenuRadioGroup>
                </UI.MenuGroup>
                <UI.MenuSeparator />
                <UI.MenuItem onClick={() => setNotice('The preview record was duplicated.')}>
                  Duplicate record
                </UI.MenuItem>
              </UI.MenuContent>
            </UI.Menu>
            <UI.Popover>
              <UI.PopoverTrigger variant="secondary">Inspect contract</UI.PopoverTrigger>
              <UI.PopoverContent>
                <UI.PopoverTitle>Closed appearance API</UI.PopoverTitle>
                <UI.PopoverDescription>
                  Choose a named variant. CSS, replacement elements and styling bags are
                  rejected.
                </UI.PopoverDescription>
              </UI.PopoverContent>
            </UI.Popover>
          </UI.Cluster>
          <UI.Text size="sm" tone="muted" role="status">
            {notice}
          </UI.Text>
        </UI.Stack>
      </Example>
      <Example
        title="Composed forms"
        description="Labels, descriptions and validation remain attached to the real control. Values and submission belong to the application."
      >
        <UI.Form
          onSubmit={(event) => {
            event.preventDefault();
            setNotice(`Saved preview: ${name} (${environment}, ${priority} priority).`);
          }}
        >
          <UI.Grid columns={2} gap="lg">
            <UI.Stack gap="lg">
              <UI.Field name="catalog-record-name">
                <UI.FieldLabel>Record name</UI.FieldLabel>
                <UI.Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <UI.FieldDescription>
                  A short name that describes the outcome.
                </UI.FieldDescription>
              </UI.Field>
              <UI.Field name="catalog-environment">
                <UI.FieldLabel htmlFor="catalog-environment">Environment</UI.FieldLabel>
                <UI.Autocomplete
                  id="catalog-environment"
                  label="Environment"
                  value={environment}
                  onValueChange={setEnvironment}
                  suggestions={['development', 'staging', 'production']}
                />
                <UI.FieldDescription>
                  Choose a suggestion or enter a new environment.
                </UI.FieldDescription>
              </UI.Field>
              <UI.Field name="catalog-tags">
                <UI.FieldLabel htmlFor="catalog-tags">Tags</UI.FieldLabel>
                <UI.TagInput
                  inputId="catalog-tags"
                  value={tags}
                  onChange={setTags}
                  aria-label="Tags"
                  placeholder="Add a tag…"
                />
              </UI.Field>
            </UI.Stack>
            <UI.Stack gap="lg">
              <UI.Field name="catalog-description">
                <UI.FieldLabel>Description</UI.FieldLabel>
                <UI.Textarea
                  placeholder="What does this verify?"
                  defaultValue="Verify the request and inspect the response before release."
                />
              </UI.Field>
              <UI.Label>
                <UI.Cluster>
                  <UI.Checkbox checked={checked} onCheckedChange={setChecked} />
                  Enable notifications
                </UI.Cluster>
              </UI.Label>
              <UI.Field name="catalog-owned" disabled>
                <UI.FieldLabel>Workspace</UI.FieldLabel>
                <UI.Input value="Example workspace" disabled />
                <UI.FieldDescription>Managed by an administrator.</UI.FieldDescription>
              </UI.Field>
            </UI.Stack>
          </UI.Grid>
          <UI.FormActions>
            <UI.Button type="submit">Save preview</UI.Button>
            <UI.Text size="sm" tone="muted">
              No network request is made.
            </UI.Text>
          </UI.FormActions>
        </UI.Form>
      </Example>
      <UI.Disclosure>
        <UI.DisclosureTrigger>How to add a new variation</UI.DisclosureTrigger>
        <UI.DisclosurePanel>
          <UI.Surface tone="subtle">
            <UI.Text>
              Document a concrete use case, add a finite semantic option, and test the shared
              implementation. Consumers continue assembling the same named parts.
            </UI.Text>
          </UI.Surface>
        </UI.DisclosurePanel>
      </UI.Disclosure>
    </UI.Stack>
  );
}

type RecordRow = { id: string; name: string; environment: string; active: boolean };
const records: RecordRow[] = [
  { id: 'record_01', name: 'Release verification', environment: 'Staging', active: true },
  { id: 'record_02', name: 'Account synchronization', environment: 'Production', active: true },
  { id: 'record_03', name: 'Payment confirmation', environment: 'Development', active: false },
  { id: 'record_04', name: 'Shipment notification', environment: 'Staging', active: true },
  { id: 'record_05', name: 'Subscription renewal', environment: 'Production', active: false },
];

function Collections() {
  const [selected, setSelected] = useState('record_01');
  const [search, setSearch] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('worker_a');
  const [notice, setNotice] = useState('Choose a record or inspect a row action.');
  const selectedRecord = records.find((record) => record.id === selected)!;
  return (
    <UI.Stack gap="xl">
      <Example
        title="Resource list and inspector"
        description="The main row action and independent controls remain separate, accessible hit targets."
      >
        <UI.Grid layout="sidebar" gap="lg">
          <UI.ResourceList aria-label="Example resources" density="compact">
            {records.slice(0, 3).map((record) => (
              <UI.ResourceRow key={record.id} selected={selected === record.id}>
                <UI.ResourceRowLabel>
                  <UI.ResourceRowButton
                    selected={selected === record.id}
                    onClick={() => setSelected(record.id)}
                  >
                    {record.name}
                  </UI.ResourceRowButton>
                </UI.ResourceRowLabel>
                <UI.ResourceRowMeta>{record.environment}</UI.ResourceRowMeta>
                <UI.ResourceRowActions>
                  <UI.Badge tone={record.active ? 'success' : 'neutral'}>
                    {record.active ? 'Active' : 'Paused'}
                  </UI.Badge>
                  <UI.Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Inspect ${record.name}`}
                    onClick={() => setNotice(`Inspected ${record.name}.`)}
                  >
                    Inspect
                  </UI.Button>
                </UI.ResourceRowActions>
              </UI.ResourceRow>
            ))}
          </UI.ResourceList>
          <UI.Inspector>
            <UI.InspectorHeader>
              <UI.Heading level={3}>{selectedRecord.name}</UI.Heading>
            </UI.InspectorHeader>
            <UI.InspectorBody>
              <UI.DefinitionList>
                <UI.DefinitionItem label="Identifier">
                  <UI.Code>{selectedRecord.id}</UI.Code>
                </UI.DefinitionItem>
                <UI.DefinitionItem label="Environment">
                  {selectedRecord.environment}
                </UI.DefinitionItem>
                <UI.DefinitionItem label="State">
                  {selectedRecord.active ? 'Active' : 'Paused'}
                </UI.DefinitionItem>
              </UI.DefinitionList>
            </UI.InspectorBody>
          </UI.Inspector>
        </UI.Grid>
        <UI.Text size="sm" role="status">
          {notice}
        </UI.Text>
      </Example>
      <Example
        title="Capacity tiles"
        description="Select a resource using named tile parts. Capacity and observed health are data; drawing, responsive geometry and motion belong to the library."
      >
        <UI.ResourceTileGrid>
          {[
            { id: 'worker_a', name: 'Build worker', load: 0.5, staling: false, alarmed: false },
            {
              id: 'worker_b',
              name: 'Verification worker',
              load: 1,
              staling: true,
              alarmed: false,
            },
            {
              id: 'worker_c',
              name: 'Delivery worker',
              load: 0.25,
              staling: false,
              alarmed: true,
            },
          ].map((worker) => (
            <UI.ResourceTile
              key={worker.id}
              selected={selectedWorker === worker.id}
              aria-pressed={selectedWorker === worker.id}
              aria-label={`${worker.name}, ${worker.load * 100}% capacity in use`}
              tone={worker.alarmed ? 'danger' : worker.staling ? 'warning' : 'default'}
              onClick={() => setSelectedWorker(worker.id)}
            >
              <UI.WorkerAvatar
                variant="pebble"
                size="md"
                seed={worker.id}
                load={worker.load}
                staling={worker.staling}
                alarmed={worker.alarmed}
              />
              <UI.ResourceTileBody>
                <UI.ResourceTileHeader>
                  <UI.ResourceTileLabel>{worker.name}</UI.ResourceTileLabel>
                  <UI.ResourceTileStatus
                    tone={worker.alarmed ? 'danger' : worker.staling ? 'warning' : 'default'}
                  >
                    {worker.alarmed
                      ? 'Needs attention'
                      : worker.staling
                        ? 'Heartbeat delayed'
                        : 'Working'}
                  </UI.ResourceTileStatus>
                </UI.ResourceTileHeader>
                <UI.ResourceTileMeta>{worker.load * 100}% in use</UI.ResourceTileMeta>
                <UI.CapacityMeter
                  segments={Array.from({ length: 4 }, (_, index) => ({
                    id: String(index),
                    state: index < worker.load * 4 ? 'busy' : 'free',
                  }))}
                />
              </UI.ResourceTileBody>
            </UI.ResourceTile>
          ))}
        </UI.ResourceTileGrid>
      </Example>
      <Example
        title="Typed table"
        description="Sorting, pagination, selection and column visibility are shared behavior; the application provides typed records and cell assemblies."
      >
        <UI.DataTable
          label="Example records"
          data={records.filter((record) =>
            record.name.toLowerCase().includes(search.toLowerCase()),
          )}
          getRowId={(record) => record.id}
          enableRowSelection
          initialPageSize={3}
          pageSizeOptions={[3, 5, 10]}
          columns={[
            {
              accessorKey: 'name',
              header: 'Name',
              cell: ({ row }) => (
                <UI.Text weight="medium" size="sm">
                  {row.original.name}
                </UI.Text>
              ),
            },
            { accessorKey: 'environment', header: 'Environment' },
            {
              accessorKey: 'active',
              header: 'State',
              cell: ({ row }) => (
                <UI.Badge tone={row.original.active ? 'success' : 'neutral'}>
                  {row.original.active ? 'Active' : 'Paused'}
                </UI.Badge>
              ),
            },
          ]}
          toolbar={
            <UI.DataTableToolbar
              searchLabel="Search example records"
              searchValue={search}
              onSearchValueChange={setSearch}
            />
          }
        />
      </Example>
    </UI.Stack>
  );
}

const initialDocument =
  '{\n  "event": "release.ready",\n  "environment": "{{environment}}",\n  "verified": true\n}';
function Workspace() {
  const [document, setDocument] = useState(initialDocument);
  const [response, setResponse] = useState('{\n  "status": "waiting"\n}');
  const [showDocument, setShowDocument] = useState(true);
  const [saved, setSaved] = useState(true);
  return (
    <UI.Stack gap="xl">
      <Example
        title="Editor workspace"
        description="Document tabs, panes, editor geometry and resize interaction belong to the library. This example owns only document state."
      >
        <UI.PreviewFrame width="wide" height="workspace">
          <UI.Workspace>
            <UI.WorkspaceMain>
              <UI.PaneToolbar>
                <UI.Cluster justify="between">
                  <UI.Cluster>
                    <UI.HttpMethodBadge method="POST" />
                    <UI.Text size="sm" weight="medium">
                      /example/events
                    </UI.Text>
                  </UI.Cluster>
                  <UI.Button
                    size="sm"
                    onClick={() =>
                      setResponse('{\n  "status": "accepted",\n  "requestId": "example_01"\n}')
                    }
                  >
                    <UI.Icon glyph={Play} size="sm" />
                    Run example
                  </UI.Button>
                </UI.Cluster>
              </UI.PaneToolbar>
              <UI.DocumentTabs aria-label="Example documents">
                {showDocument ? (
                  <UI.DocumentTab
                    label="payload.json"
                    leading={<UI.Icon glyph={CodeGlyph} size="sm" />}
                    active
                    dirty={!saved}
                    onSelect={() => setSaved(false)}
                    onClose={() => setShowDocument(false)}
                  />
                ) : (
                  <UI.Button size="sm" variant="ghost" onClick={() => setShowDocument(true)}>
                    <UI.Icon glyph={Plus} size="sm" />
                    Open payload
                  </UI.Button>
                )}
              </UI.DocumentTabs>
              <UI.WorkspaceSplit
                label="Resize request and response"
                primary={
                  <UI.Pane>
                    <UI.PaneToolbar>
                      <UI.Text size="sm" weight="semibold">
                        Request body
                      </UI.Text>
                    </UI.PaneToolbar>
                    <UI.PaneBody scroll="none" padding="none">
                      {showDocument ? (
                        <UI.CodeEditor
                          aria-label="Example request body"
                          value={document}
                          onChange={(value) => {
                            setDocument(value);
                            setSaved(false);
                          }}
                          language="json"
                          lineNumbers
                          height="fill"
                          variables={[{ name: 'environment', value: 'staging' }]}
                        />
                      ) : (
                        <UI.EmptyState
                          title="Document closed"
                          description="Open payload to continue editing."
                        />
                      )}
                    </UI.PaneBody>
                    <UI.PaneFooter>
                      <UI.Cluster justify="between">
                        <UI.Text size="xs" tone="muted">
                          {saved ? 'Saved in this preview' : 'Unsaved preview changes'}
                        </UI.Text>
                        <UI.Button
                          variant="ghost"
                          size="sm"
                          disabled={saved}
                          onClick={() => setSaved(true)}
                        >
                          Save document
                        </UI.Button>
                      </UI.Cluster>
                    </UI.PaneFooter>
                  </UI.Pane>
                }
                secondary={
                  <UI.Pane tone="subtle">
                    <UI.PaneToolbar>
                      <UI.Cluster>
                        <UI.Badge tone={response.includes('accepted') ? 'success' : 'neutral'}>
                          {response.includes('accepted') ? '202 Accepted' : 'Awaiting request'}
                        </UI.Badge>
                        <UI.Text size="sm">Response</UI.Text>
                      </UI.Cluster>
                    </UI.PaneToolbar>
                    <UI.PaneBody scroll="none" padding="none">
                      <UI.CodeViewer
                        aria-label="Example response body"
                        value={response}
                        language="json"
                        lineNumbers
                        height="fill"
                      />
                    </UI.PaneBody>
                  </UI.Pane>
                }
              />
            </UI.WorkspaceMain>
          </UI.Workspace>
        </UI.PreviewFrame>
      </Example>
      <UI.Callout>
        <UI.Text size="sm">
          Try editing the request, dragging the separator, closing the document and running the
          example. Everything is local sample data.
        </UI.Text>
      </UI.Callout>
    </UI.Stack>
  );
}

function Graph() {
  const [readOnly, setReadOnly] = useState(false);
  const [selection, setSelection] = useState('Select a node to inspect its meaning.');
  const [nodes, setNodes] = useState<UI.GraphNode[]>([
    {
      id: 'receive',
      position: { x: 40, y: 80 },
      data: {},
      width: 'compact',
      ariaLabel: 'Receive event',
      content: (
        <>
          <UI.GraphNodeHeader>
            <UI.Icon glyph={Cube} />
            <UI.Text weight="semibold">Receive event</UI.Text>
          </UI.GraphNodeHeader>
          <UI.GraphNodeBody>
            <UI.Text size="sm" tone="muted">
              A neutral node with common anatomy.
            </UI.Text>
          </UI.GraphNodeBody>
          <UI.GraphNodeFooter>
            <UI.Badge tone="info">Input</UI.Badge>
          </UI.GraphNodeFooter>
        </>
      ),
    },
    {
      id: 'verify',
      position: { x: 380, y: 160 },
      data: {},
      width: 'compact',
      ariaLabel: 'Verify response',
      content: (
        <>
          <UI.GraphNodeHeader>
            <UI.Icon glyph={CheckCircle} tone="success" />
            <UI.Text weight="semibold">Verify response</UI.Text>
          </UI.GraphNodeHeader>
          <UI.GraphNodeBody>
            <UI.Text size="sm" tone="muted">
              Application meaning, library geometry.
            </UI.Text>
          </UI.GraphNodeBody>
          <UI.GraphNodeFooter>
            <UI.Badge tone="success">Ready</UI.Badge>
          </UI.GraphNodeFooter>
        </>
      ),
    },
  ]);
  return (
    <UI.Stack gap="xl">
      <Example
        title="Graph anatomy and interaction"
        description="The package owns canvas controls, node chrome, anchors and engine styling. Positions and connection meaning are data."
      >
        <UI.Stack>
          <UI.Cluster justify="between">
            <UI.Text size="sm" role="status">
              {selection}
            </UI.Text>
            <UI.Button variant="secondary" size="sm" onClick={() => setReadOnly(!readOnly)}>
              {readOnly ? 'Enable editing' : 'Make read-only'}
            </UI.Button>
          </UI.Cluster>
          <UI.GraphCanvas
            label="Example workflow"
            nodes={nodes}
            edges={[
              {
                id: 'receive-verify',
                source: 'receive',
                target: 'verify',
                sourceAnchor: 'right',
                targetAnchor: 'left',
                label: 'Continue',
                motion: 'flow',
              },
            ]}
            mode={readOnly ? 'readonly' : 'interactive'}
            onNodesChange={(changes) =>
              setNodes((current) => UI.applyGraphNodeChanges(changes, current))
            }
            onNodeActivate={(node) =>
              setSelection(`Selected node: ${node.ariaLabel ?? node.id}`)
            }
            controls={<UI.GraphViewportControls />}
          />
        </UI.Stack>
      </Example>
      <Example title="Nonmodal inspection" description="A finite sidebar or bottom sheet keeps the canvas interactive; reveal moves only enough to keep an item visible. Run selection uses keyboard radio behavior.">
        <InspectorExample />
      </Example>
      <Example
        title="Node presentation parts"
        description="Compact checks, values, progress and outcomes share named anatomy without importing an application node type."
      >
        <UI.Grid columns={2}>
          <UI.GraphNodeFrame family="logic" phase="success">
            <UI.GraphNodeHeader>
              <UI.NodeHeading
                icon={<UI.NodeIcon glyph={CheckCircle} />}
                title="Verify conditions"
                subtitle="Two checks"
              />
            </UI.GraphNodeHeader>
            <UI.GraphNodeBody>
              <UI.NodeSection label="Checks">
                <UI.NodeChecks
                  items={[
                    { label: 'Status is accepted', state: 'passed' },
                    { label: 'Identifier is present', state: 'passed' },
                  ]}
                />
              </UI.NodeSection>
            </UI.GraphNodeBody>
            <UI.GraphNodeFooter>
              <UI.NodeRunGlyph phase="success" />
              <UI.NodeCaption tone="success">Passed</UI.NodeCaption>
            </UI.GraphNodeFooter>
          </UI.GraphNodeFrame>
          <UI.GraphNodeFrame family="data">
            <UI.GraphNodeHeader>
              <UI.NodeHeading
                icon={<UI.NodeIcon glyph={Cube} />}
                title="Prepare values"
                subtitle="Named inputs"
              />
            </UI.GraphNodeHeader>
            <UI.GraphNodeBody>
              <UI.NodeSection label="Values">
                <UI.NodeValueList
                  items={[
                    { name: 'environment', value: 'staging' },
                    { name: 'verified', value: 'true' },
                  ]}
                />
              </UI.NodeSection>
              <UI.NodeSection label="Progress">
                <UI.NodeMeter label="Preparation" value={0.75} />
              </UI.NodeSection>
            </UI.GraphNodeBody>
          </UI.GraphNodeFrame>
        </UI.Grid>
      </Example>
      <Example
        title="Shared time axis"
        description="Numeric start, end and total values place each interval; consumers choose only a semantic tone and size."
      >
        <UI.Stack gap="sm">
          <UI.Text size="sm">Receive event · 0–200 ms</UI.Text>
          <UI.TimelineRange
            start={0}
            end={200}
            total={1000}
            label="Receive event, 0 to 200 milliseconds"
            tone="info"
          />
          <UI.Text size="sm">Verify response · 200–900 ms</UI.Text>
          <UI.TimelineRange
            start={200}
            end={900}
            total={1000}
            label="Verify response, 200 to 900 milliseconds"
            tone="success"
          />
        </UI.Stack>
      </Example>
      <UI.Grid columns={2}>
        <UI.ChoiceCard
          title="Common node anatomy"
          description="Add common visual capabilities in the library and compose meaning in the product."
          icon={<UI.Icon glyph={Cube} />}
          onClick={() => setSelection('Common node anatomy selected.')}
        />
        <UI.ChoiceCard
          title="Keep engine details private"
          description="Consumers provide neutral models and behavior without CSS or renderer overrides."
          icon={<UI.Icon glyph={CheckCircle} />}
          onClick={() => setSelection('The visual engine remains inside the library.')}
        />
      </UI.Grid>
    </UI.Stack>
  );
}

const historyRows = Array.from({ length: 30 }, (_, index) => ({
  id: `run_${index + 1}`,
  name: `Example run ${index + 1}`,
  duration: 120 + ((index * 37) % 500),
  failed: index % 7 === 0,
}));
function History() {
  const [selected, setSelected] = useState('run_1');
  const [messages, setMessages] = useState([
    'The shared library owns this conversation layout.',
    'Applications supply the messages and actions.',
  ]);
  return (
    <UI.Stack gap="xl">
      <Example
        title="Measured history and data"
        description="Virtual rows and charts accept records and numeric observations. Their dimensions and visual treatment remain private."
      >
        <UI.Grid columns={2} gap="lg">
          <UI.VirtualList
            label="Example run history"
            items={historyRows}
            getItemKey={(row) => row.id}
            renderItem={(row) => (
              <UI.ResourceRowButton
                selected={selected === row.id}
                onClick={() => setSelected(row.id)}
              >
                <UI.Cluster justify="between">
                  <UI.Text weight="medium" size="sm">
                    {row.name}
                  </UI.Text>
                  <UI.StatusMarker variant="dot" tone={row.failed ? 'danger' : 'success'}>
                    {row.failed ? 'Failed' : 'Passed'}
                  </UI.StatusMarker>
                </UI.Cluster>
                <UI.Text size="xs" tone="muted">
                  {row.duration} ms · {row.id}
                </UI.Text>
              </UI.ResourceRowButton>
            )}
          />
          <UI.Surface>
            <UI.Stack gap="lg">
              <UI.Heading level={3}>Duration by run</UI.Heading>
              <UI.BarStrip
                label="Example run durations"
                points={historyRows.slice(0, 8).map((row) => ({
                  id: row.id,
                  value: row.duration,
                  label: `${row.name}, ${row.duration} milliseconds`,
                  tone: row.failed ? 'danger' : 'success',
                }))}
                reference={300}
                selectedId={selected}
                onSelect={setSelected}
              />
              <UI.Text size="sm" role="status">
                Selected: {selected}
              </UI.Text>
              <UI.Divider />
              <UI.TimelineItem
                label="Receive"
                detail="120 ms"
                tone="success"
                interval={{ start: 0, end: 28 }}
                selected={selected === 'receive'}
                onClick={() => setSelected('receive')}
              />
              <UI.TimelineItem
                label="Verify"
                detail="280 ms"
                tone="info"
                interval={{ start: 28, end: 94 }}
                selected={selected === 'verify'}
                onClick={() => setSelected('verify')}
              />
            </UI.Stack>
          </UI.Surface>
        </UI.Grid>
      </Example>
      <Example
        title="Conversation composition"
        description="Log scrolling, message alignment and bubble tones are reusable parts. No assistant service is connected."
      >
        <UI.PreviewFrame width="wide" height="panel">
          <UI.Stack height="fill">
            <UI.ConversationLog label="Example conversation" entryCount={messages.length}>
              {messages.map((message, index) => (
                <UI.MessageRow
                  key={index}
                  side={index % 2 ? 'end' : 'start'}
                  avatar={index % 2 ? undefined : <UI.BrandMark brand="nanostack" size="sm" />}
                >
                  <UI.MessageBubble tone={index % 2 ? 'accent' : 'neutral'}>
                    <UI.Text size="sm">{message}</UI.Text>
                  </UI.MessageBubble>
                </UI.MessageRow>
              ))}
            </UI.ConversationLog>
            <UI.Cluster justify="end">
              <UI.Button
                variant="secondary"
                onClick={() =>
                  setMessages((current) => [
                    ...current,
                    `Example message ${current.length + 1}: a new entry anchors without moving the reader during streaming.`,
                  ])
                }
              >
                Add example message
              </UI.Button>
            </UI.Cluster>
          </UI.Stack>
        </UI.PreviewFrame>
      </Example>
    </UI.Stack>
  );
}

export function Catalog() {
  const [brand, setBrand] = useState<UI.Brand>('nanostack');
  const [scheme, setScheme] = useState<UI.ColorScheme>('light');
  const [density, setDensity] = useState<UI.Density>('comfortable');
  const [section, setSection] = useState<CatalogSection>('Foundations');
  return (
    <UI.Theme brand={brand} colorScheme={scheme} density={density}>
      <UI.DocumentTheme />
      <UI.TooltipProvider>
        <UI.Page role="main" width="wide">
          <UI.Stack gap="xl">
            <UI.PageHeader>
              <UI.PageHeaderContent>
                <UI.PageEyebrow>Nanostack / 0.2 beta</UI.PageEyebrow>
                <UI.PageHeaderTitle>The block catalog</UI.PageHeaderTitle>
                <UI.PageHeaderDescription>
                  Inspect the parts, exercise their behavior, and compose them without custom
                  CSS.
                </UI.PageHeaderDescription>
              </UI.PageHeaderContent>
              <UI.PageHeaderActions>
                <UI.Link href="/" variant="secondary">
                  Workspace preview
                </UI.Link>
              </UI.PageHeaderActions>
            </UI.PageHeader>
            <UI.Surface tone="subtle">
              <UI.Grid columns={3}>
                <UI.Field>
                  <UI.FieldLabel>Brand</UI.FieldLabel>
                  <UI.Select
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
                    value={scheme}
                    onChange={(event) => setScheme(event.target.value as UI.ColorScheme)}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                    ]}
                  />
                </UI.Field>
                <UI.Field>
                  <UI.FieldLabel>Density</UI.FieldLabel>
                  <UI.Select
                    value={density}
                    onChange={(event) => setDensity(event.target.value as UI.Density)}
                    options={[
                      { value: 'comfortable', label: 'Comfortable' },
                      { value: 'compact', label: 'Compact' },
                    ]}
                  />
                </UI.Field>
              </UI.Grid>
            </UI.Surface>
            <UI.Tabs
              value={section}
              onValueChange={(value) => setSection(value as CatalogSection)}
            >
              <UI.TabsList aria-label="Catalog sections">
                {sections.map((name) => (
                  <UI.TabsTab key={name} value={name}>
                    {name}
                  </UI.TabsTab>
                ))}
              </UI.TabsList>
              <UI.TabsPanel value="Foundations">
                <Foundations />
              </UI.TabsPanel>
              <UI.TabsPanel value="Controls">
                <Controls />
              </UI.TabsPanel>
              <UI.TabsPanel value="Collections">
                <Collections />
              </UI.TabsPanel>
              <UI.TabsPanel value="Workspace">
                <Workspace />
              </UI.TabsPanel>
              <UI.TabsPanel value="Graph">
                <Graph />
              </UI.TabsPanel>
              <UI.TabsPanel value="History">
                <History />
              </UI.TabsPanel>
            </UI.Tabs>
            <UI.Divider />
            <UI.Text size="sm" tone="muted">
              This catalog uses exported library parts and local sample data. The API reference
              in docs/components.md documents the full vocabulary and its composition rules.
            </UI.Text>
          </UI.Stack>
        </UI.Page>
      </UI.TooltipProvider>
    </UI.Theme>
  );
}
