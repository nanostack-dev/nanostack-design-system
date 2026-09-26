import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';
import type { GraphPresentationStore } from '../../blocks/graph-types.js';

export const GraphPresentationContext = createContext<GraphPresentationStore | undefined>(
  undefined,
);
const subscribeIdle = () => () => {};

export function useGraphNodePresentation(id: string) {
  const store = useContext(GraphPresentationContext);
  return useSyncExternalStore(
    store?.subscribe ?? subscribeIdle,
    useCallback(() => store?.getNodeSnapshot(id), [store, id]),
    useCallback(() => store?.getServerNodeSnapshot?.(id), [store, id]),
  );
}
export function useGraphEdgePresentation(id: string) {
  const store = useContext(GraphPresentationContext);
  return useSyncExternalStore(
    store?.subscribe ?? subscribeIdle,
    useCallback(() => store?.getEdgeSnapshot(id), [store, id]),
    useCallback(() => store?.getServerEdgeSnapshot?.(id), [store, id]),
  );
}
