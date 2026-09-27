import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  GraphPresentationContext,
  useGraphNodePresentation,
  useGraphEdgePresentation,
} from '../src/internal/graph/presentation.js';
import type {
  GraphPresentationStore,
  GraphNodePresentation,
  GraphEdgePresentation,
} from '../src/blocks/graph-types.js';
import { TimelineRange } from '../src/components/timeline-range.js';
import { GraphNodeFrame } from '../src/blocks/graph-node.js';
import { GraphAnnotationPortal } from '../src/internal/graph/annotation.js';

function createStore() {
  const listeners = new Set<() => void>();
  const nodes = new Map<string, GraphNodePresentation>();
  const edges = new Map<string, GraphEdgePresentation>();
  const store: GraphPresentationStore = {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getNodeSnapshot: (id) => nodes.get(id),
    getEdgeSnapshot: (id) => edges.get(id),
  };
  return {
    store,
    nodes,
    edges,
    listeners,
    notify: () => {
      for (const listener of listeners) listener();
    },
  };
}

describe('graph presentation subscriptions', () => {
  it('updates only changed cached snapshots and unsubscribes on unmount', () => {
    const { store, nodes, edges, notify, listeners } = createStore();
    const renders = { a: vi.fn(), b: vi.fn(), edge: vi.fn() };
    function Node({ id }: { id: 'a' | 'b' }) {
      const state = useGraphNodePresentation(id);
      renders[id]();
      return <output aria-label={id}>{state?.phase ?? 'idle'}</output>;
    }
    function Edge() {
      const state = useGraphEdgePresentation('a-b');
      renders.edge();
      return <output aria-label="edge">{state?.phase ?? 'idle'}</output>;
    }
    const view = render(
      <GraphPresentationContext.Provider value={store}>
        <Node id="a" />
        <Node id="b" />
        <Edge />
      </GraphPresentationContext.Provider>,
    );
    const before = {
      a: renders.a.mock.calls.length,
      b: renders.b.mock.calls.length,
      edge: renders.edge.mock.calls.length,
    };
    act(() => {
      nodes.set('a', { tone: 'info', phase: 'running' });
      notify();
    });
    expect(screen.getByLabelText('a')).toHaveTextContent('running');
    expect(renders.a).toHaveBeenCalledTimes(before.a + 1);
    expect(renders.b).toHaveBeenCalledTimes(before.b);
    expect(renders.edge).toHaveBeenCalledTimes(before.edge);
    act(() => {
      edges.set('a-b', { phase: 'traversed', tone: 'success', travelMs: 340 });
      notify();
    });
    expect(screen.getByLabelText('edge')).toHaveTextContent('traversed');
    expect(renders.a).toHaveBeenCalledTimes(before.a + 1);
    view.unmount();
    expect(listeners.size).toBe(0);
  });

  it('uses a stable empty SSR snapshot instead of reading a client store', () => {
    const store = createStore().store;
    store.getNodeSnapshot = () => {
      throw new Error('client state read during SSR');
    };
    function Node() {
      const value = useGraphNodePresentation('a');
      return <span>{value?.phase ?? 'historical'}</span>;
    }
    expect(
      renderToString(
        <GraphPresentationContext.Provider value={store}>
          <Node />
        </GraphPresentationContext.Provider>,
      ),
    ).toContain('historical');
  });

  it('accepts explicit server snapshots for hydration', () => {
    const store = createStore().store;
    store.getServerEdgeSnapshot = () => ({ phase: 'traversed', tone: 'success', instant: true });
    function Edge() {
      return <span>{useGraphEdgePresentation('a-b')?.phase}</span>;
    }
    expect(
      renderToString(
        <GraphPresentationContext.Provider value={store}>
          <Edge />
        </GraphPresentationContext.Provider>,
      ),
    ).toContain('traversed');
  });
});

it('bounds timeline data and does not spread a custom CSS escape hatch', () => {
  const injected: Record<string, unknown> = { className: 'override', style: { position: 'fixed' } };
  const { container } = render(
    <TimelineRange start={-20} end={300} total={100} label="Measured time" {...injected} />,
  );
  expect(screen.getByRole('img', { name: 'Measured time' })).toHaveClass('ns-timeline-range');
  expect(container.querySelector('.override')).toBeNull();
  expect(screen.getByRole('img')).not.toHaveAttribute('style');
  expect(container.querySelector('span')).toHaveStyle({ left: '0%', width: '100%' });
});

it('preserves the article ref while hosting annotations outside its clipped surface', () => {
  const ref = createRef<HTMLElement>();
  const view = render(
    <GraphNodeFrame ref={ref} aria-label="Verification step" family="wait" instant>
      <span>Node content</span>
      <GraphAnnotationPortal>
        <span>Attached execution detail</span>
      </GraphAnnotationPortal>
    </GraphNodeFrame>,
  );
  const article = screen.getByRole('article', { name: 'Verification step' });
  const annotation = screen.getByText('Attached execution detail');
  expect(ref.current).toBe(article);
  expect(article).toContainElement(screen.getByText('Node content'));
  expect(article).not.toContainElement(annotation);
  expect(article.parentElement).toContainElement(annotation);
  expect(article.parentElement).toHaveAttribute('data-ns-family', 'wait');
  expect(article.parentElement).toHaveAttribute('data-ns-run-instant', 'true');
  view.unmount();
  expect(ref.current).toBeNull();
  expect(annotation).not.toBeInTheDocument();
});
