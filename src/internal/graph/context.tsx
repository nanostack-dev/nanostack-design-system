import { createContext, useContext, useState, type ReactNode } from 'react';
import { createGraphGestureStore } from './gesture.js';

const GestureContext = createContext<ReturnType<typeof createGraphGestureStore> | null>(null);

export function GraphGestureProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createGraphGestureStore);
  return <GestureContext.Provider value={store}>{children}</GestureContext.Provider>;
}

export function useGraphGestureStore() {
  const store = useContext(GestureContext);
  if (!store) throw new Error('Graph gesture components must be inside GraphCanvas.');
  return store;
}
