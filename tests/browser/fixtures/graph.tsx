import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Badge,
  Button,
  Cluster,
  GraphCanvas,
  GraphNodeBody,
  GraphNodeHeader,
  GraphViewportControls,
  Heading,
  Stack,
  Surface,
  Text,
  Theme,
  graphAnchorSideFromHandle,
  type GraphEdge,
  type GraphNode,
} from '../../../src/index.js';
import '../../../src/styles.css';

function Fixture() {
  const uncontrolled = new URLSearchParams(window.location.search).has('uncontrolled');
  const [dark, setDark] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [event, setEvent] = useState('Ready');
  const [, setSelection] = useState<string[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const nodes: GraphNode[] = [
    {
      id: 'a',
      position: { x: 40, y: 80 },
      data: {},
      width: 'compact',
      ariaLabel: 'First node',
      content: (
        <>
          <GraphNodeHeader>
            <Text weight="semibold">First node</Text>
          </GraphNodeHeader>
          <GraphNodeBody>
            <Text>Source content</Text>
            <Button size="sm" onClick={() => setEvent('Action')}>
              Node action
            </Button>
          </GraphNodeBody>
        </>
      ),
    },
    {
      id: 'b',
      position: { x: 500, y: 200 },
      data: {},
      width: 'compact',
      ariaLabel: 'Second node',
      content: (
        <>
          <GraphNodeHeader>
            <Text weight="semibold">Second node</Text>
          </GraphNodeHeader>
          <GraphNodeBody>
            <Text>Target content</Text>
          </GraphNodeBody>
        </>
      ),
    },
  ];
  return (
    <Theme colorScheme={dark ? 'dark' : 'light'}>
      <Surface padding="lg">
        <Stack>
          <Heading level={1}>Graph contract</Heading>
          <Cluster>
            <Button onClick={() => setDark(!dark)}>Toggle theme</Button>
            <Button onClick={() => setReadonly(!readonly)}>Toggle readonly</Button>
            <Badge role="status">{event}</Badge>
          </Cluster>
          <GraphCanvas
            label="Workflow"
            nodes={nodes}
            edges={edges}
            mode={readonly ? 'readonly' : 'interactive'}
            controls={<GraphViewportControls />}
            {...(uncontrolled
              ? {}
              : {
                  onConnect: (connection: import('../../../src/index.js').GraphConnection) => {
                    setEdges((current) => [
                      ...current,
                      {
                        id: `${connection.source}->${connection.target}`,
                        source: connection.source,
                        target: connection.target,
                        sourceAnchor: graphAnchorSideFromHandle(connection.sourceHandle)!,
                        targetAnchor: graphAnchorSideFromHandle(connection.targetHandle)!,
                        label: 'Connected',
                        motion: 'flow',
                      },
                    ]);
                    setEvent('Connected');
                  },
                  onReconnect: (
                    edge: GraphEdge,
                    connection: import('../../../src/index.js').GraphConnection,
                  ) => {
                    setEdges((current) =>
                      current.map((item) =>
                        item.id === edge.id
                          ? {
                              ...edge,
                              source: connection.source,
                              target: connection.target,
                              sourceAnchor:
                                graphAnchorSideFromHandle(connection.sourceHandle) ??
                                edge.sourceAnchor!,
                              targetAnchor:
                                graphAnchorSideFromHandle(connection.targetHandle) ??
                                edge.targetAnchor!,
                            }
                          : item,
                      ),
                    );
                    setEvent('Reconnected');
                  },
                })}
            onNodeDragStop={() => setEvent('Moved')}
            onNodeActivate={(node) => setEvent(`Opened ${node.id}`)}
            onSelectionChange={(ids) =>
              setSelection((previous) => (previous.join(',') === ids.join(',') ? previous : ids))
            }
          />
        </Stack>
      </Surface>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
