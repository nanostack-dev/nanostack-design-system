import { createContext, useContext } from 'react';

/**
 * The surface material of the app. `solid` is the default. `glass` makes the
 * chrome (sidebar, top bar, popups, dialogs, sheets, toasts) translucent over a
 * brand-hued backdrop, and gives data surfaces (cards, tables, fields) a
 * near-opaque fill. ADR 0002 records the decision.
 */
export type Material = 'solid' | 'glass';

export const MaterialContext = createContext<Material>('solid');

export function useMaterial(): Material {
  return useContext(MaterialContext);
}

/**
 * Spread on the element that draws a surface. The attribute rides on the element
 * itself, so popups rendered in a portal keep the material of their provider.
 * The glass rules live in styles.css and key on `[data-ns-material='glass']`.
 */
export function useMaterialAttributes() {
  return { 'data-ns-material': useContext(MaterialContext) } as const;
}
