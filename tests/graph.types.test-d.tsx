import { GraphCanvas, GraphNodeFrame, type GraphNode, type GraphEdge } from '../src/index.js';
const node: GraphNode = { id: 'a', position: { x: 0, y: 0 }, data: {}, content: 'Node' };
const edge: GraphEdge = {
  id: 'a-b',
  source: 'a',
  target: 'b',
  tone: 'danger',
  sourceAnchor: 'right',
};
export const supported = (
  <GraphCanvas
    nodes={[node]}
    edges={[edge]}
    label="Process"
    controls={<GraphNodeFrame width="compact">Content</GraphNodeFrame>}
  />
);
// @ts-expect-error engine styling is not available, even through spread props
export const customNode: GraphNode = { ...node, style: { width: 1000 } };
// @ts-expect-error consumer dimensions must use closed width variants
export const numericNode: GraphNode = { ...node, width: 500 };
// @ts-expect-error marker geometry is library-owned
export const customEdge: GraphEdge = { ...edge, markerEnd: 'url(#custom)' };
export const customRenderer = (
  // @ts-expect-error no arbitrary engine replacement components
  <GraphCanvas label="Process" nodes={[node]} edges={[]} nodeTypes={{ custom: () => null }} />
);
export const engineProps = (
  <GraphCanvas
    label="Process"
    nodes={[node]}
    edges={[]}
    // @ts-expect-error no raw engine props bag
    reactFlowProps={{ style: { background: 'red' } }}
  />
);
// @ts-expect-error internal state is not a second variant API
export const internalStyle = <GraphNodeFrame {...{ 'data-ns-emphasis': 'critical' }} />;
