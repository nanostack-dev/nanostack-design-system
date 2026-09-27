import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GraphCanvas } from '../../../src/blocks/graph-canvas.js';
import { GraphNodeBody } from '../../../src/blocks/graph-node.js';
import type {
  GraphNode,
  GraphEdge,
  GraphPresentationStore,
  GraphNodePresentation,
  GraphEdgePresentation,
} from '../../../src/blocks/graph-types.js';
import { TimelineRange } from '../../../src/components/timeline-range.js';
import { Button } from '../../../src/components/button.js';
import { Cluster, Stack, Surface } from '../../../src/components/layout.js';
import { Heading, Text } from '../../../src/components/typography.js';
import { Theme } from '../../../src/theme.js';
import '../../../src/styles.css';

const nodes: GraphNode[] = [
  {
    id: 'a',
    position: { x: 20, y: 20 },
    data: {},
    ariaLabel: 'First step',
    content: (
      <GraphNodeBody>
        <Text>First step</Text>
      </GraphNodeBody>
    ),
  },
  {
    id: 'b',
    position: { x: 420, y: 20 },
    data: {},
    ariaLabel: 'Second step',
    content: (
      <GraphNodeBody>
        <Text>Second step</Text>
      </GraphNodeBody>
    ),
  },
];
const edges: GraphEdge[] = [{ id: 'a-b', source: 'a', target: 'b' }];
function createPresentation() {
  const listeners = new Set<() => void>();
  let node: GraphNodePresentation | undefined;
  let edge: GraphEdgePresentation | undefined;
  const store: GraphPresentationStore = {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getNodeSnapshot: (id) => (id === 'a' ? node : undefined),
    getEdgeSnapshot: () => edge,
  };
  return {
    store,
    update(phase: 'running' | 'success', instant = false) {
      node = { phase, tone: phase === 'running' ? 'info' : 'success', instant };
      edge = {
        phase: phase === 'running' ? 'idle' : 'traversed',
        tone: 'success',
        instant,
        travelMs: 240,
      };
      for (const listener of listeners) listener();
    },
  };
}
function Fixture() {
  const [presentation] = useState(createPresentation);
  return (
    <Theme>
      <Surface>
        <Stack>
          <Heading level={1}>Live graph</Heading>
          <Cluster>
            <Button onClick={() => presentation.update('running')}>Start</Button>
            <Button onClick={() => presentation.update('success')}>Finish</Button>
            <Button onClick={() => presentation.update('success', true)}>Join finished run</Button>
          </Cluster>
          <GraphCanvas
            label="Presentation graph"
            nodes={nodes}
            edges={edges}
            presentation={presentation.store}
          />
          <TimelineRange label="Elapsed: 10–60 ms" start={10} end={60} total={100} tone="success" />
        </Stack>
      </Surface>
    </Theme>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
