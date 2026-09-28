import { CheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Command as CommandPrimitive } from 'cmdk';
import { cva } from 'class-variance-authority';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';

import { InputGroup, InputGroupAddon } from '@/components/input-group/input-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ClosedProps } from '@/lib/closed-props';
import { cn } from '@/lib/utils';

export type CommandVariant = 'outline' | 'ghost';

const CommandVariantContext = createContext<CommandVariant>('outline');

const commandClasses = cva('flex size-full flex-col overflow-hidden p-1 text-popover-foreground', {
  variants: {
    variant: {
      outline: 'rounded-4xl bg-popover ring-1 ring-foreground/10',
      ghost: 'bg-transparent',
    },
  },
  defaultVariants: { variant: 'outline' },
});

export type CommandProps = ClosedProps<ComponentProps<typeof CommandPrimitive>> & {
  variant?: CommandVariant;
};

export function Command({ variant, ...props }: CommandProps) {
  const contextVariant = useContext(CommandVariantContext);
  const resolvedVariant = variant ?? contextVariant;
  return (
    <CommandPrimitive
      data-slot="command"
      data-variant={resolvedVariant}
      className={cn(commandClasses({ variant: resolvedVariant }))}
      {...props}
    />
  );
}

export type CommandDialogProps = Omit<
  ComponentProps<typeof Dialog>,
  'children' | 'render' | 'className' | 'style'
> & {
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  children: ReactNode;
};

export function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  showCloseButton = false,
  children,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className="top-1/3 translate-y-0 overflow-hidden rounded-4xl! p-0"
        showCloseButton={showCloseButton}
      >
        <CommandVariantContext.Provider value="ghost">{children}</CommandVariantContext.Provider>
      </DialogContent>
    </Dialog>
  );
}

export type CommandInputProps = ClosedProps<ComponentProps<typeof CommandPrimitive.Input>>;

export function CommandInput(props: CommandInputProps) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup>
        <CommandPrimitive.Input
          data-slot="command-input"
          className="w-full text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden className="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export type CommandListProps = ClosedProps<ComponentProps<typeof CommandPrimitive.List>>;

export function CommandList(props: CommandListProps) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className="no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none"
      {...props}
    />
  );
}

export type CommandEmptyProps = ClosedProps<ComponentProps<typeof CommandPrimitive.Empty>>;

export function CommandEmpty(props: CommandEmptyProps) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

export type CommandGroupProps = ClosedProps<ComponentProps<typeof CommandPrimitive.Group>>;

export function CommandGroup(props: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className="overflow-hidden p-1.5 text-foreground **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground"
      {...props}
    />
  );
}

export type CommandSeparatorProps = ClosedProps<ComponentProps<typeof CommandPrimitive.Separator>>;

export function CommandSeparator(props: CommandSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      aria-hidden
      className="my-1.5 h-px bg-border/50"
      {...props}
    />
  );
}

export type CommandItemProps = ClosedProps<ComponentProps<typeof CommandPrimitive.Item>> & {
  checked?: boolean;
};

export function CommandItem({ checked, children, ...props }: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      data-checked={checked}
      className="group/command-item relative flex cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-hidden select-none in-data-[slot=dialog-content]:rounded-3xl data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground"
      {...props}
    >
      {children}
      <CheckIcon
        aria-hidden
        className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
      />
    </CommandPrimitive.Item>
  );
}

export type CommandShortcutProps = ClosedProps<ComponentProps<'span'>>;

export function CommandShortcut(props: CommandShortcutProps) {
  return (
    <span
      data-slot="command-shortcut"
      className="ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground"
      {...props}
    />
  );
}
