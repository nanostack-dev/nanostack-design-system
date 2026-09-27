import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Button,
  Cluster,
  EditableText,
  KeyValueRow,
  Pane,
  PaneBody,
  PreviewFrame,
  Stack,
  Surface,
  Text,
  Theme,
  Tree,
  TreeBranch,
  TreeGroup,
  TreeItem,
  TreeItemButton,
  WorkspaceSplit,
  type WorkspaceSplitHandle,
} from '../../../src/index.js';
import '../../../src/styles.css';

interface Node {
  name: string;
  children?: Node[];
}

const nodes: Node[] = [
  {
    name: 'Billing',
    children: [{ name: 'Invoices', children: [{ name: 'List invoices' }] }, { name: 'Refunds' }],
  },
  { name: 'Customers', children: [{ name: 'Create customer' }] },
  { name: 'Health check' },
];

function Branch({ node, level }: { node: Node; level: number }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const parent = Boolean(node.children);
  return (
    <TreeBranch>
      <TreeItem aria-level={level} aria-expanded={parent ? open : undefined} selected={selected}>
        <TreeItemButton
          onClick={() => {
            setSelected(true);
            if (parent) setOpen((current) => !current);
          }}
        >
          {node.name}
        </TreeItemButton>
      </TreeItem>
      {parent && open ? (
        <TreeGroup>
          {node.children!.map((child) => (
            <Branch key={child.name} node={child} level={level + 1} />
          ))}
        </TreeGroup>
      ) : null}
    </TreeBranch>
  );
}

function Split({ name }: { name: string }) {
  const split = useRef<WorkspaceSplitHandle>(null);
  const [layout, setLayout] = useState('55/45');
  return (
    <Stack gap="sm">
      <Cluster>
        <Button size="sm" variant="secondary" onClick={() => split.current?.setMode('primary')}>
          Show only {name} primary
        </Button>
        <Button size="sm" variant="secondary" onClick={() => split.current?.setMode('secondary')}>
          Show only {name} secondary
        </Button>
        <Button size="sm" variant="secondary" onClick={() => split.current?.setMode('split')}>
          Split {name}
        </Button>
      </Cluster>
      <PreviewFrame height="content" width="wide">
        <Surface padding="none">
          <Stack height="fill">
            <WorkspaceSplit
              ref={split}
              label={`Resize ${name}`}
              onLayoutChanged={(next) =>
                setLayout(`${Math.round(next.primary)}/${Math.round(next.secondary)}`)
              }
              orientation="horizontal"
              primary={
                <Pane>
                  <PaneBody>
                    <Button size="sm">{name} primary action</Button>
                  </PaneBody>
                </Pane>
              }
              secondary={
                <Pane>
                  <PaneBody>
                    <Button size="sm">{name} secondary action</Button>
                  </PaneBody>
                </Pane>
              }
            />
          </Stack>
        </Surface>
      </PreviewFrame>
      <Text size="sm" tone="muted">
        {name} layout: <output aria-label={`${name} layout`}>{layout}</output>
      </Text>
    </Stack>
  );
}

function Fixture() {
  const [dark, setDark] = useState(false);
  const [key, setKey] = useState('Accept');
  const [value, setValue] = useState('{{host}}/json');
  const [name, setName] = useState('List invoices');
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'} brand="echopoint">
      <Surface padding="md">
        <Stack gap="lg">
          <h1>Workspace editing</h1>
          <Cluster>
            <Button size="sm" variant="secondary" onClick={() => setDark((current) => !current)}>
              Toggle theme
            </Button>
          </Cluster>
          <section aria-label="Headers" data-testid="headers">
            <KeyValueRow
              keyValue={key}
              value={value}
              keyPlaceholder="header"
              variables={[{ name: 'host', value: 'https://example.com' }]}
              reservedKeys={['Authorization']}
              onKeyChange={setKey}
              onValueChange={setValue}
              onRemove={() => undefined}
            />
          </section>
          <Text size="sm" tone="muted">
            Saved header: <output aria-label="Saved header">{`${key}=${value}`}</output>
          </Text>
          <section aria-label="Request identity" data-testid="identity">
            <EditableText value={name} label="Request name" onCommit={setName} />
          </section>
          <Text size="sm" tone="muted">
            Saved name: <output aria-label="Saved name">{name}</output>
          </Text>
          <section aria-label="Collections region" data-testid="tree">
            <Tree aria-label="Collections">
              {nodes.map((node) => (
                <Branch key={node.name} node={node} level={1} />
              ))}
            </Tree>
          </section>
          <Button size="sm">After tree</Button>
          <Split name="Alpha" />
          <Split name="Beta" />
          <Button size="sm">After splits</Button>
        </Stack>
      </Surface>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(<Fixture />);
