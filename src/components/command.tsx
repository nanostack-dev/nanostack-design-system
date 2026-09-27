'use client';

import { Command as BaseCommand, useCommandState } from 'cmdk';
import type { ComponentProps } from 'react';
import { safeProps, type ElementProps, type NoCustomStyle } from '../internal/props.js';

type Closed<T> = Omit<T, keyof NoCustomStyle | 'asChild'> & NoCustomStyle;
export type CommandProps = Closed<ComponentProps<typeof BaseCommand>>;
export function Command(props: CommandProps) {
  return <BaseCommand {...safeProps(props)} className="ns-command" />;
}
export type CommandInputProps = Closed<ComponentProps<typeof BaseCommand.Input>> & {
  /** Match the visibility of a persistently mounted CommandList. */
  expanded?: boolean;
};
/**
 * A consumer `id` or name overrides cmdk's generated id and hidden label, so an external
 * `<label htmlFor>` names and focuses the input. With a consumer id the input also drops
 * `cmdk-input`: cmdk refocuses the element with its own id on every highlight change and
 * would otherwise move focus to the list while the person types.
 */
export function CommandInput({
  expanded = true,
  onKeyDown,
  id,
  'aria-labelledby': labelledBy,
  ...props
}: CommandInputProps) {
  const isExpanded = expanded && !props.disabled;
  const namedByConsumer =
    id !== undefined || labelledBy !== undefined || props['aria-label'] !== undefined;
  return (
    <BaseCommand.Input {...safeProps(props)} className="ns-command-input" asChild>
      {/* cmdk supplies role=combobox and its control IDs through this private slot. */}
      {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
      <input
        aria-expanded={isExpanded}
        {...(!isExpanded ? { 'aria-activedescendant': undefined } : {})}
        {...(namedByConsumer ? { 'aria-labelledby': labelledBy } : {})}
        {...(id === undefined ? {} : { id, 'cmdk-input': undefined })}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          // cmdk handles keys at the root. Hidden options must never be activated.
          if (
            !isExpanded &&
            (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter'].includes(event.key) ||
              (event.ctrlKey && ['n', 'j', 'p', 'k'].includes(event.key)))
          )
            event.stopPropagation();
        }}
      />
    </BaseCommand.Input>
  );
}
export type CommandListProps = Closed<ComponentProps<typeof BaseCommand.List>>;
export function CommandList(props: CommandListProps) {
  return <BaseCommand.List {...safeProps(props)} className="ns-command-list" />;
}
export type CommandGroupProps = Closed<ComponentProps<typeof BaseCommand.Group>>;
export function CommandGroup(props: CommandGroupProps) {
  return <BaseCommand.Group {...safeProps(props)} className="ns-command-group" />;
}
export type CommandItemProps = Closed<ComponentProps<typeof BaseCommand.Item>>;
export function CommandItem(props: CommandItemProps) {
  return <BaseCommand.Item {...safeProps(props)} className="ns-command-item" />;
}
export type CommandStatusProps = Omit<
  ElementProps<'div'>,
  'role' | 'aria-disabled' | 'aria-selected'
>;
/** Non-interactive loading, error or empty content inside the listbox. Keep actions outside it. */
export function CommandStatus(props: CommandStatusProps) {
  return (
    <div
      {...safeProps(props)}
      className="ns-command-empty"
      role="option"
      aria-disabled="true"
      aria-selected="false"
      aria-live="polite"
    />
  );
}
export type CommandEmptyProps = CommandStatusProps;
export function CommandEmpty(props: CommandEmptyProps) {
  const empty = useCommandState((state) => state.filtered.count === 0);
  return empty ? <CommandStatus {...props} /> : null;
}
export type CommandSeparatorProps = Omit<ElementProps<'div'>, 'role' | 'children'> & {
  /** Keep the divider while a search filters the list. */
  alwaysRender?: boolean;
};
/** A presentational divider: a listbox may own only options and groups, never a separator. */
export function CommandSeparator({ alwaysRender = false, ...props }: CommandSeparatorProps) {
  const searching = useCommandState((state) => state.search !== '');
  if (searching && !alwaysRender) return null;
  return <div {...safeProps(props)} className="ns-command-separator" role="presentation" />;
}
export type CommandFooterProps = ElementProps<'footer'>;
export function CommandFooter(props: CommandFooterProps) {
  return <footer {...safeProps(props)} className="ns-command-footer" />;
}
