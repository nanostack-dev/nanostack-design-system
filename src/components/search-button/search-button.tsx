import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { cva } from 'class-variance-authority';

import { Kbd, KbdGroup } from '@/components/kbd/kbd';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type SearchButtonSize = 'sm' | 'md' | 'lg';
export type SearchButtonWidth = 'auto' | 'fill';

const searchButtonClasses = cva(
  'group/search-button inline-flex min-w-0 shrink-0 items-center gap-2 rounded-4xl border border-border bg-background bg-clip-padding text-sm font-normal whitespace-nowrap text-muted-foreground transition-colors outline-none select-none hover:bg-muted/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      size: {
        sm: 'h-8 px-3',
        md: 'h-9 px-3.5',
        lg: 'h-10 px-4',
      },
      width: {
        auto: 'w-auto',
        fill: 'w-full',
      },
    },
    defaultVariants: { size: 'md', width: 'auto' },
  },
);

export type SearchButtonProps = ClosedProps<
  Omit<
    ButtonPrimitive.Props,
    | 'render'
    | 'nativeButton'
    | 'children'
    | 'focusableWhenDisabled'
    | 'aria-label'
    | 'aria-keyshortcuts'
  >
> & {
  label: string;
  shortcut?: string[];
  size?: SearchButtonSize;
  width?: SearchButtonWidth;
};

const modifierKeyNames: Record<string, string> = {
  '⌘': 'Meta',
  cmd: 'Meta',
  command: 'Meta',
  meta: 'Meta',
  '⌃': 'Control',
  ctrl: 'Control',
  control: 'Control',
  '⌥': 'Alt',
  alt: 'Alt',
  option: 'Alt',
  '⇧': 'Shift',
  shift: 'Shift',
};

/**
 * Turns the keys shown on screen into the `aria-keyshortcuts` syntax.
 * ['⌘', 'K'] -> 'Meta+K'. ['Ctrl', 'Shift', 'f'] -> 'Control+Shift+F'.
 */
function toAriaKeyShortcuts(keys: string[]) {
  return keys
    .map(
      (key) => modifierKeyNames[key.toLowerCase()] ?? (key.length === 1 ? key.toUpperCase() : key),
    )
    .join('+');
}

export function SearchButton({
  label,
  shortcut,
  size = 'md',
  width = 'auto',
  type = 'button',
  ...props
}: SearchButtonProps) {
  const hasShortcut = shortcut !== undefined && shortcut.length > 0;
  return (
    <ButtonPrimitive
      data-slot="search-button"
      data-size={size}
      data-width={width}
      type={type}
      aria-keyshortcuts={hasShortcut ? toAriaKeyShortcuts(shortcut) : undefined}
      className={cn(searchButtonClasses({ size, width }))}
      {...props}
    >
      <MagnifyingGlassIcon aria-hidden />
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {hasShortcut ? (
        <KbdGroup aria-hidden>
          {shortcut.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </KbdGroup>
      ) : null}
    </ButtonPrimitive>
  );
}
