import { useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle, Envelope, Warning } from '@phosphor-icons/react';
import * as UI from '../../src/index.js';
import { Example } from './example.js';

type RecordRow = { id: string; name: string; environment: string; active: boolean };
const records: RecordRow[] = [
  { id: 'record_01', name: 'Release verification', environment: 'Staging', active: true },
  { id: 'record_02', name: 'Account synchronization', environment: 'Production', active: true },
  { id: 'record_03', name: 'Payment confirmation', environment: 'Development', active: false },
  { id: 'record_04', name: 'Shipment notification', environment: 'Staging', active: true },
  { id: 'record_05', name: 'Subscription renewal', environment: 'Production', active: false },
];

function ResourcesAndInspector() {
  const [selected, setSelected] = useState('record_01');
  const [notice, setNotice] = useState('Choose a record or inspect a row action.');
  const selectedRecord = records.find((record) => record.id === selected)!;
  return (
    <UI.Stack>
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
          <UI.InspectorFooter>
            <UI.Button
              size="sm"
              variant="secondary"
              onClick={() => setNotice(`Opened ${selectedRecord.name}.`)}
            >
              Open record
            </UI.Button>
          </UI.InspectorFooter>
        </UI.Inspector>
      </UI.Grid>
      <UI.Text size="sm" role="status">
        {notice}
      </UI.Text>
    </UI.Stack>
  );
}

function TypedTable() {
  const [search, setSearch] = useState('');
  return (
    <UI.DataTable
      label="Example records"
      data={records.filter((record) => record.name.toLowerCase().includes(search.toLowerCase()))}
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
  );
}

const limits = [
  { plan: 'Starter', members: '5', retention: '7 days' },
  { plan: 'Team', members: '25', retention: '30 days' },
  { plan: 'Business', members: 'Unlimited', retention: '1 year' },
];

function SemanticTable() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <UI.Table label="Example plan limits">
      <UI.TableHeader>
        <UI.TableRow>
          <UI.TableHead>Plan</UI.TableHead>
          <UI.TableHead align="end">Members</UI.TableHead>
          <UI.TableHead align="end">History</UI.TableHead>
          <UI.TableHead align="center">Details</UI.TableHead>
        </UI.TableRow>
      </UI.TableHeader>
      <UI.TableBody>
        {limits.map((limit) => (
          <UI.TableRow key={limit.plan} selected={expanded === limit.plan}>
            <UI.TableCell>{limit.plan}</UI.TableCell>
            <UI.TableCell align="end">{limit.members}</UI.TableCell>
            <UI.TableCell align="end">{limit.retention}</UI.TableCell>
            <UI.TableCell align="center">
              <UI.Button
                size="sm"
                variant="ghost"
                aria-pressed={expanded === limit.plan}
                onClick={() => setExpanded(expanded === limit.plan ? null : limit.plan)}
              >
                {expanded === limit.plan ? 'Selected' : 'Select'}
                <UI.VisuallyHidden> {limit.plan}</UI.VisuallyHidden>
              </UI.Button>
            </UI.TableCell>
          </UI.TableRow>
        ))}
      </UI.TableBody>
    </UI.Table>
  );
}

const pinnedPages = [
  { id: 'overview', name: 'Overview', href: './' },
  { id: 'components', name: 'Components', href: '?page=components' },
  { id: 'guidelines', name: 'Guidelines', href: '?page=guidelines' },
  { id: 'changelog', name: 'Changelog', href: '?page=changelog' },
];

function move<T>(items: readonly T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

function PinnedPages() {
  const [order, setOrder] = useState(pinnedPages);
  const [dragging, setDragging] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('Drag a row, or use its move buttons.');
  const dragImage = useRef<HTMLDivElement>(null);
  const draggedName = order.find((page) => page.id === dragging)?.name ?? '';
  function movePage(id: string, to: number) {
    const from = order.findIndex((page) => page.id === id);
    if (from === to || to < 0 || to >= order.length) return;
    setOrder(move(order, from, to));
    setAnnouncement(`${order[from]!.name} moved to position ${to + 1}.`);
  }
  return (
    <UI.Stack>
      <UI.ResourceList aria-label="Pinned pages">
        {order.map((page, index) => (
          <UI.ResourceRow
            key={page.id}
            draggable
            dragging={dragging === page.id}
            onDragStart={(event) => {
              setDragging(page.id);
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', page.id);
              if (dragImage.current) event.dataTransfer.setDragImage(dragImage.current, 12, 12);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging) movePage(dragging, index);
              setDragging(null);
            }}
            onDragEnd={() => setDragging(null)}
          >
            <UI.ResourceRowLabel>
              <UI.ResourceRowLink href={page.href}>{page.name}</UI.ResourceRowLink>
            </UI.ResourceRowLabel>
            <UI.ResourceRowMeta>Position {index + 1}</UI.ResourceRowMeta>
            <UI.ResourceRowActions>
              <UI.Button
                size="icon"
                variant="ghost"
                aria-label={`Move ${page.name} up`}
                disabled={index === 0}
                onClick={() => movePage(page.id, index - 1)}
              >
                <UI.Icon glyph={ArrowUp} size="sm" />
              </UI.Button>
              <UI.Button
                size="icon"
                variant="ghost"
                aria-label={`Move ${page.name} down`}
                disabled={index === order.length - 1}
                onClick={() => movePage(page.id, index + 1)}
              >
                <UI.Icon glyph={ArrowDown} size="sm" />
              </UI.Button>
            </UI.ResourceRowActions>
          </UI.ResourceRow>
        ))}
      </UI.ResourceList>
      <UI.ResourceDragImage ref={dragImage}>
        <UI.Text size="sm" weight="medium">
          {draggedName}
        </UI.Text>
      </UI.ResourceDragImage>
      <UI.Text size="sm" tone="muted" role="status">
        {announcement}
      </UI.Text>
    </UI.Stack>
  );
}

export function Collections() {
  return (
    <UI.Stack gap="xl">
      <Example
        title="Resource list and inspector"
        description="The main row action and independent controls remain separate, accessible hit targets."
      >
        <ResourcesAndInspector />
      </Example>
      <Example
        title="Typed table"
        description="Sorting, pagination, selection and column visibility are shared behavior; the application provides typed records and cell assemblies."
      >
        <TypedTable />
      </Example>
      <Example
        title="Semantic table"
        description="Table parts for data you assemble by hand. The table has a label, cells align to finite positions, and a row action is a real button."
      >
        <SemanticTable />
      </Example>
      <Example
        title="Linked rows you can reorder"
        description="A row link covers its row while actions stay separate. Native drag uses ResourceDragImage for its snapshot; the move buttons give the same result from the keyboard."
      >
        <PinnedPages />
      </Example>
      <Example
        title="Activity"
        description="Concise static or linked activity with a title, a description, a status and metadata."
      >
        <UI.ActivityList aria-label="Example activity">
          <UI.ActivityItem
            title="Release verification passed"
            description="12 checks completed"
            icon={<UI.Icon glyph={CheckCircle} />}
            status={<UI.Badge tone="success">Passed</UI.Badge>}
            meta="2 min ago"
          />
          <UI.ActivityItem
            href="?page=changelog"
            title="Version 0.0.1 is ready"
            description="Read what changed in this release"
            icon={<UI.Icon glyph={Envelope} />}
            status={<UI.Badge tone="info">New</UI.Badge>}
            meta="Today"
          />
          <UI.ActivityItem
            title="Account sync needs attention"
            description="A setting changed outside the application"
            icon={<UI.Icon glyph={Warning} />}
            status={<UI.Badge tone="warning">Review</UI.Badge>}
            meta="24 min ago"
          />
        </UI.ActivityList>
      </Example>
    </UI.Stack>
  );
}
