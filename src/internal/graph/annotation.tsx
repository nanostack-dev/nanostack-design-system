'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Undefined means standalone; null means a frame's host has not mounted yet. */
export const GraphAnnotationContext = createContext<HTMLDivElement | null | undefined>(undefined);

/** An attached annotation stays outside the card's clipped visual surface. */
export function GraphAnnotationPortal({ children }: { children: ReactNode }) {
  const host = useContext(GraphAnnotationContext);
  if (host === undefined) return children;
  return host ? createPortal(children, host) : null;
}
