'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { CopyIcon } from '@phosphor-icons/react/dist/ssr/Copy';
import { WarningCircleIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';
import { Button, type ButtonProps } from './button.js';
import { Icon } from './icon.js';
import { VisuallyHidden } from './layout.js';

export type CopyButtonProps = Omit<ButtonProps, 'onClick' | 'children'> & {
  value: string;
  label: string;
  copiedLabel?: string;
  errorLabel?: string;
  copyText?: (value: string) => Promise<boolean>;
  onCopied?: () => void;
  onCopyFailed?: () => void;
};

async function writeClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

/** Report the completed clipboard write; never announce optimistic success. */
export function CopyButton({
  value,
  label,
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  copyText = writeClipboard,
  onCopied,
  onCopyFailed,
  ...props
}: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      generation.current += 1;
      clearTimeout(timer.current);
    },
    [],
  );
  const currentLabel = status === 'copied' ? copiedLabel : status === 'error' ? errorLabel : label;
  async function copy() {
    const attempt = ++generation.current;
    clearTimeout(timer.current);
    let copied = false;
    try {
      copied = await copyText(value);
    } catch {
      copied = false;
    }
    if (generation.current !== attempt) return;
    setStatus(copied ? 'copied' : 'error');
    if (copied) onCopied?.();
    else onCopyFailed?.();
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  }
  return (
    <>
      <Button {...props} onClick={() => void copy()}>
        <Icon
          glyph={
            status === 'copied' ? CheckIcon : status === 'error' ? WarningCircleIcon : CopyIcon
          }
          size="sm"
        />
        {currentLabel}
      </Button>
      <VisuallyHidden role="status" aria-live="polite">
        {status === 'idle' ? '' : currentLabel}
      </VisuallyHidden>
    </>
  );
}
