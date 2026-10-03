import { CheckIcon, CopyIcon, WarningCircleIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

import { Button, IconButton, type ButtonProps, type IconButtonProps } from '@/components/button';

type CopyOptions = {
  value: string;
  label: string;
  copiedLabel?: string;
  errorLabel?: string;
  onCopied?: () => void;
  onCopyFailed?: () => void;
};

export type CopyButtonProps = Omit<ButtonProps, 'onClick' | 'children' | 'icon' | 'loading'> &
  CopyOptions;
export type CopyIconButtonProps = Omit<IconButtonProps, 'onClick' | 'icon' | 'loading' | 'label'> &
  CopyOptions;

type CopyStatus = 'idle' | 'pending' | 'copied' | 'error';

function useCopy({
  value,
  label,
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  onCopied,
  onCopyFailed,
}: CopyOptions) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const pending = useRef(false);

  useEffect(
    () => () => {
      generation.current += 1;
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    if (pending.current) return;
    pending.current = true;
    const currentGeneration = generation.current;
    if (timer.current !== null) clearTimeout(timer.current);
    setStatus('pending');
    let copied: boolean;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch {
      copied = false;
    }
    pending.current = false;
    if (generation.current !== currentGeneration) return;
    setStatus(copied ? 'copied' : 'error');
    timer.current = setTimeout(() => setStatus('idle'), 2000);
    if (copied) onCopied?.();
    else onCopyFailed?.();
  };

  return {
    copy,
    loading: status === 'pending',
    currentLabel: status === 'copied' ? copiedLabel : status === 'error' ? errorLabel : label,
    announcement: status === 'copied' ? copiedLabel : status === 'error' ? errorLabel : '',
    icon: status === 'copied' ? CheckIcon : status === 'error' ? WarningCircleIcon : CopyIcon,
  };
}

export function CopyButton({
  value,
  label,
  copiedLabel,
  errorLabel,
  onCopied,
  onCopyFailed,
  ...props
}: CopyButtonProps) {
  const copy = useCopy({ value, label, copiedLabel, errorLabel, onCopied, onCopyFailed });
  return (
    <>
      <Button {...props} icon={copy.icon} loading={copy.loading} onClick={() => void copy.copy()}>
        {copy.currentLabel}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copy.announcement}
      </span>
    </>
  );
}

export function CopyIconButton({
  value,
  label,
  copiedLabel,
  errorLabel,
  onCopied,
  onCopyFailed,
  ...props
}: CopyIconButtonProps) {
  const copy = useCopy({ value, label, copiedLabel, errorLabel, onCopied, onCopyFailed });
  return (
    <>
      <IconButton
        {...props}
        icon={copy.icon}
        label={copy.currentLabel}
        loading={copy.loading}
        onClick={() => void copy.copy()}
      />
      <span role="status" aria-live="polite" className="sr-only">
        {copy.announcement}
      </span>
    </>
  );
}
