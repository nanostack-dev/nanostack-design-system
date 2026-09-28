import type { ComponentProps } from 'react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

export type CommandProps = ComponentProps<typeof Command>;
export type CommandDialogProps = ComponentProps<typeof CommandDialog>;
export type CommandEmptyProps = ComponentProps<typeof CommandEmpty>;
export type CommandGroupProps = ComponentProps<typeof CommandGroup>;
export type CommandInputProps = ComponentProps<typeof CommandInput>;
export type CommandItemProps = ComponentProps<typeof CommandItem>;
export type CommandListProps = ComponentProps<typeof CommandList>;
export type CommandSeparatorProps = ComponentProps<typeof CommandSeparator>;
export type CommandShortcutProps = ComponentProps<typeof CommandShortcut>;

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
