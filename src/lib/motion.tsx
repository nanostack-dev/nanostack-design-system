import { createContext, useContext, useLayoutEffect } from 'react';

/** auto follows the device; reduced also removes travel; none is for frequent work. */
export type MotionPreference = 'auto' | 'reduced' | 'none';
export const MotionPreferenceContext = createContext<MotionPreference>('auto');

// One observer per document, shared by providers and standalone components. Capture
// runs before React handlers, including shortcuts that open content in a portal.
const observers = new WeakMap<Document, { users: number; dispose: () => void }>();

export function useMotionInput() {
  useLayoutEffect(() => {
    const doc = document;
    let observer = observers.get(doc);
    if (!observer) {
      const root = doc.documentElement;
      const previous = root.getAttribute('data-ns-input');
      const setInput = (input: 'keyboard' | 'pointer') => {
        if (root.getAttribute('data-ns-input') !== input) root.setAttribute('data-ns-input', input);
      };
      const keyboard = () => setInput('keyboard');
      const pointer = () => setInput('pointer');
      doc.addEventListener('keydown', keyboard, true);
      doc.addEventListener('pointerdown', pointer, true);
      observer = {
        users: 0,
        dispose: () => {
          doc.removeEventListener('keydown', keyboard, true);
          doc.removeEventListener('pointerdown', pointer, true);
          if (previous === null) root.removeAttribute('data-ns-input');
          else root.setAttribute('data-ns-input', previous);
        },
      };
      observers.set(doc, observer);
    }
    observer.users++;
    return () => {
      if (--observer.users === 0) {
        observer.dispose();
        observers.delete(doc);
      }
    };
  }, []);
}

export function useMotionAttributes() {
  const preference = useContext(MotionPreferenceContext);
  useMotionInput();
  return { 'data-ns-motion': preference } as const;
}
