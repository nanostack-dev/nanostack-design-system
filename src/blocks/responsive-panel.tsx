'use client';
import { Dialog } from '@base-ui/react/dialog';
import { useSyncExternalStore, type ReactNode } from 'react';
import { Theme, useThemeSettings } from '../theme.js';
import type { NoCustomStyle } from '../internal/props.js';

const query = '(max-width: 767px)';
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
const mobileSnapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;
export type ResponsivePanelProps = NoCustomStyle & {
  id?: string;
  open: boolean;
  desktopVisibility?: 'controlled' | 'always';
  onOpenChange: (open: boolean) => void;
  label: string;
  children: ReactNode;
};
/** A docked supporting panel becomes a focus-trapped sheet on small screens. */
export function ResponsivePanel({
  id,
  open,
  onOpenChange,
  label,
  children,
  desktopVisibility = 'controlled',
}: ResponsivePanelProps) {
  const mobile = useSyncExternalStore(subscribe, mobileSnapshot, serverSnapshot);
  const theme = useThemeSettings();
  if (!mobile)
    return open || desktopVisibility === 'always' ? (
      <aside id={id} aria-label={label} className="ns-responsive-panel">
        {children}
      </aside>
    ) : null;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Theme {...theme}>
          <Dialog.Backdrop className="ns-dialog-backdrop" />
          <Dialog.Popup id={id} className="ns-responsive-panel ns-responsive-panel-modal">
            <Dialog.Title className="ns-visually-hidden">{label}</Dialog.Title>
            {children}
          </Dialog.Popup>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
