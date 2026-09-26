import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../src/components/checkbox.js';
import { Textarea, type TextareaProps } from '../src/components/textarea.js';
import { Disclosure, DisclosurePanel, DisclosureTrigger } from '../src/components/disclosure.js';
import { Field, FieldDescription, FieldError, FieldLabel } from '../src/components/field.js';
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuLink,
  MenuSeparator,
  MenuTrigger,
  type MenuContentProps,
} from '../src/components/menu.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../src/components/tooltip.js';
import { Theme } from '../src/theme.js';

describe('shared form controls', () => {
  it('labels a checkbox, toggles with Space, and submits its checked value', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Preferences">
        <Field name="notifications">
          <FieldLabel>Notifications</FieldLabel>
          <Checkbox value="enabled" />
        </Field>
      </form>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Notifications' });
    await user.tab();
    expect(checkbox).toHaveFocus();
    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
    const form = screen.getByRole<HTMLFormElement>('form', { name: 'Preferences' });
    expect(new FormData(form).get('notifications')).toBe('enabled');
  });

  it('exposes the mixed checkbox state and keeps disabled choices inert', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox aria-label="Select all" indeterminate disabled onCheckedChange={onCheckedChange} />,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Select all' });
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('connects textarea labels and errors while preserving controlled editing and refs', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLTextAreaElement>();
    function Editor() {
      const [value, setValue] = useState('');
      return (
        <Field invalid name="description">
          <FieldLabel>Description</FieldLabel>
          <FieldDescription>Describe the request.</FieldDescription>
          <Textarea ref={ref} value={value} onValueChange={setValue} required height="compact" />
          <FieldError match>More detail is required.</FieldError>
        </Field>
      );
    }
    render(<Editor />);
    const textbox = screen.getByRole('textbox', { name: 'Description' });
    expect(textbox).toHaveAccessibleDescription('Describe the request. More detail is required.');
    expect(textbox).toHaveAttribute('aria-invalid', 'true');
    expect(textbox).toBeRequired();
    expect(ref.current).toBe(textbox);
    await user.type(textbox, 'First line{Enter}Second line');
    expect(textbox).toHaveValue('First line\nSecond line');
  });

  it('strips untyped textarea sizing and CSS overrides', () => {
    const unsafe = {
      rows: 80,
      cols: 120,
      style: { height: '900px' },
      className: 'custom',
    } as unknown as TextareaProps;
    render(<Textarea {...unsafe} aria-label="Notes" height="compact" />);
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).not.toHaveAttribute('rows');
    expect(textarea).not.toHaveAttribute('cols');
    expect(textarea).not.toHaveAttribute('style');
    expect(textarea).toHaveClass('ns-textarea');
    expect(textarea).toHaveAttribute('data-height', 'compact');
  });
});

describe('composed menus and disclosures', () => {
  it('opens a themed menu by keyboard, selects a command and restores trigger focus', async () => {
    const user = userEvent.setup();
    const archive = vi.fn();
    const unsafe = {
      render: <a href="/escape">Escape</a>,
      style: { display: 'none' },
    } as unknown as MenuContentProps;
    render(
      <Theme brand="echopoint" colorScheme="dark">
        <Menu>
          <MenuTrigger>Actions</MenuTrigger>
          <MenuContent {...unsafe} align="end">
            <MenuGroup>
              <MenuLabel>Manage</MenuLabel>
              <MenuItem onClick={archive}>Archive</MenuItem>
              <MenuItem disabled>Unavailable</MenuItem>
              <MenuSeparator />
              <MenuItem tone="danger">Delete</MenuItem>
            </MenuGroup>
          </MenuContent>
        </Menu>
      </Theme>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.tab();
    await user.keyboard('{ArrowDown}');
    const menu = await screen.findByRole('menu');
    expect(menu.closest('.ns-theme')).toHaveAttribute('data-ns-theme', 'dark');
    expect(menu.closest('.ns-theme')).toHaveAttribute('data-ns-brand', 'echopoint');
    expect(menu).not.toHaveStyle({ display: 'none' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus());
    await user.keyboard('{Enter}');
    expect(archive).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('toggles menu settings while staying open, and closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Menu>
        <MenuTrigger>Preferences</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuCheckboxItem>Show metadata</MenuCheckboxItem>
          </MenuGroup>
        </MenuContent>
      </Menu>,
    );
    const trigger = screen.getByRole('button', { name: 'Preferences' });
    await user.click(trigger);
    const setting = await screen.findByRole('menuitemcheckbox', { name: 'Show metadata' });
    await user.click(setting);
    expect(setting).toBeChecked();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('preserves native menu link destinations, refs and modified clicks', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLAnchorElement>();
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <Menu>
        <MenuTrigger>Navigate</MenuTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuLink ref={ref} href="/details" target="_blank" rel="noreferrer" onClick={onClick}>
              Details
            </MenuLink>
          </MenuGroup>
        </MenuContent>
      </Menu>,
    );
    await user.click(screen.getByRole('button', { name: 'Navigate' }));
    const link = await screen.findByRole('menuitem', { name: 'Details' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/details');
    expect(link).toHaveAttribute('target', '_blank');
    expect(ref.current).toBe(link);
    await user.keyboard('{Control>}');
    await user.click(link);
    await user.keyboard('{/Control}');
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0].ctrlKey).toBe(true);
  });

  it('expands and collapses linked disclosure content by keyboard', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure>
        <DisclosureTrigger>Advanced options</DisclosureTrigger>
        <DisclosurePanel>Optional settings</DisclosurePanel>
      </Disclosure>,
    );
    const trigger = screen.getByRole('button', { name: 'Advanced options' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.tab();
    await user.keyboard('{Enter}');
    const panel = screen.getByText('Optional settings');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  });

  it('opens a supplemental visual label by keyboard and preserves the portal theme', async () => {
    const user = userEvent.setup();
    render(
      <Theme colorScheme="dark" density="compact">
        <Tooltip>
          <TooltipTrigger size="sm" aria-label="Refresh activity">
            Refresh
          </TooltipTrigger>
          <TooltipContent>Refresh activity</TooltipContent>
        </Tooltip>
      </Theme>,
    );
    const trigger = screen.getByRole('button', { name: 'Refresh activity' });
    await user.tab();
    const tooltip = await screen.findByText('Refresh activity');
    expect(trigger).toHaveAccessibleName('Refresh activity');
    expect(trigger).toHaveAttribute('data-size', 'sm');
    expect(tooltip.closest('.ns-theme')).toHaveAttribute('data-ns-theme', 'dark');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Refresh activity')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('keeps disabled tooltip triggers native-disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Tooltip>
        <TooltipTrigger disabled onClick={onClick} aria-label="Unavailable">
          Unavailable
        </TooltipTrigger>
        <TooltipContent>Disabled action</TooltipContent>
      </Tooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Unavailable' });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    await user.tab();
    expect(trigger).not.toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
