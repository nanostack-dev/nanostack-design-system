import { WarningCircleIcon } from '@phosphor-icons/react';
import { useState, type ReactElement, type ReactNode } from 'react';

import { Alert, AlertDescription } from '@/components/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/alert-dialog';

export type ConfirmDialogTone = 'default' | 'destructive';

export type ConfirmDialogProps = {
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  tone?: ConfirmDialogTone;
  onConfirm: () => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const fallbackErrorMessage = 'Something went wrong. Try again.';

function messageOf(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error) return error;
  return fallbackErrorMessage;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isOpen = open ?? uncontrolledOpen;

  function changeOpen(nextOpen: boolean) {
    if (pending && !nextOpen) return;
    setErrorMessage(null);
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  async function confirm() {
    setErrorMessage(null);
    setPending(true);
    try {
      await onConfirm();
    } catch (error) {
      setPending(false);
      setErrorMessage(messageOf(error));
      return;
    }
    setPending(false);
    if (open === undefined) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={changeOpen}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        {errorMessage ? (
          <Alert variant="destructive">
            <WarningCircleIcon aria-hidden="true" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            tone={tone === 'destructive' ? 'critical' : 'brand'}
            onClick={confirm}
            loading={pending}
            aria-busy={pending}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
