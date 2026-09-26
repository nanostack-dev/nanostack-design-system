'use client';

import { useRef, type ReactNode } from 'react';
import { AlertDialog } from '@base-ui/react/alert-dialog';
import { InfoIcon } from '@phosphor-icons/react/dist/ssr/Info';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';
import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import type { Icon as Glyph } from '@phosphor-icons/react';
import type { NoCustomStyle } from '../internal/props.js';
import { Theme, useThemeSettings } from '../theme.js';
import { Button } from '../components/button.js';
import { Icon } from '../components/icon.js';
import { DialogFooter } from '../components/dialog-parts.js';

export type ConfirmationSeverity = 'info' | 'success' | 'warning' | 'destructive';
export type ConfirmationDialogProps = NoCustomStyle & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  severity?: ConfirmationSeverity;
  title: string;
  description: ReactNode;
  actionLabel: string;
  cancelLabel?: string;
  onAction: () => void;
  actionDisabled?: boolean;
  cancelDisabled?: boolean;
  showCloseButton?: boolean;
  icon?: Glyph;
};

/** Applications keep the dialog open until their mutation has actually succeeded. */
export function ConfirmationDialog({
  open,
  onOpenChange,
  severity = 'info',
  title,
  description,
  actionLabel,
  cancelLabel = 'Cancel',
  onAction,
  actionDisabled = false,
  cancelDisabled = false,
  showCloseButton = true,
  icon,
}: ConfirmationDialogProps) {
  const theme = useThemeSettings();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const tone = severity === 'destructive' ? 'danger' : severity;
  const glyph =
    icon ??
    (severity === 'success' ? CheckCircleIcon : severity === 'info' ? InfoIcon : WarningIcon);
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next, details) => {
        if (!next && cancelDisabled) details.cancel();
        else onOpenChange(next);
      }}
    >
      <AlertDialog.Portal>
        <Theme {...theme}>
          <AlertDialog.Backdrop className="ns-dialog-backdrop" />
          <AlertDialog.Popup className="ns-dialog-popup" data-size="sm" initialFocus={cancelRef}>
            <div className="ns-confirmation-heading">
              <Icon glyph={glyph} tone={tone === 'info' ? 'accent' : tone} size="lg" />
              <AlertDialog.Title className="ns-dialog-title">{title}</AlertDialog.Title>
            </div>
            <AlertDialog.Description className="ns-dialog-description">
              {description}
            </AlertDialog.Description>
            <DialogFooter>
              <AlertDialog.Close
                ref={cancelRef}
                disabled={cancelDisabled}
                className="ns-button"
                data-variant="secondary"
              >
                {cancelLabel}
              </AlertDialog.Close>
              <Button
                variant={severity === 'destructive' ? 'danger' : 'primary'}
                disabled={actionDisabled}
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            </DialogFooter>
            {showCloseButton ? (
              <AlertDialog.Close
                disabled={cancelDisabled}
                className="ns-button ns-dialog-dismiss"
                data-variant="ghost"
                aria-label="Close dialog"
              >
                ×
              </AlertDialog.Close>
            ) : null}
          </AlertDialog.Popup>
        </Theme>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
