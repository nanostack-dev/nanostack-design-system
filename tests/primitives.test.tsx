import { createRef, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, type ButtonProps } from '../src/components/button.js';
import { Input, type InputProps } from '../src/components/input.js';
import { Field, FieldDescription, FieldError, FieldLabel } from '../src/components/field.js';
import { Tabs, TabsList, TabsPanel, TabsTab } from '../src/components/tabs.js';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from '../src/components/dialog.js';
import { Theme } from '../src/theme.js';
import { Heading, Text } from '../src/components/typography.js';

describe('native primitives', () => {
  it('preserves keyboard activation, native form attributes, and React 19 refs', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} onClick={onClick} name="intent" value="save" aria-label="Save draft">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save draft' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('name', 'intent');
    expect(button).toHaveAttribute('value', 'save');
    expect(button).toHaveAttribute('type', 'button');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('keeps disabled actions inert', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Unavailable
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('strips custom styling and render bypasses supplied by untyped JavaScript', () => {
    const unsafe = {
      className: 'consumer-css',
      style: { color: 'red' },
      css: 'color:red',
      classNames: { root: 'consumer-css' },
      unstyled: true,
      render: <a href="/escape">Escape</a>,
      asChild: true,
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' },
    } as unknown as ButtonProps;
    render(<Button {...unsafe}>Approved</Button>);
    const button = screen.getByRole('button', { name: 'Approved' });
    expect(button.className).toBe('ns-button');
    expect(button).not.toHaveAttribute('style');
    expect(button).not.toHaveAttribute('css');
    expect(button).not.toHaveAttribute('classNames');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('Injected')).not.toBeInTheDocument();
  });

  it('keeps native input semantics and controlled change behavior', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    function ControlledInput() {
      const [value, setValue] = useState('');
      return (
        <Input
          ref={ref}
          aria-label="Endpoint name"
          name="endpoint"
          required
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<ControlledInput />);
    const input = screen.getByRole('textbox', { name: 'Endpoint name' });
    await user.type(input, 'Webhook');
    expect(input).toHaveValue('Webhook');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('name', 'endpoint');
    expect(ref.current).toBe(input);
  });

  it('strips input styles without losing autocomplete and validation attributes', () => {
    const unsafe = {
      className: 'custom',
      style: { fontSize: 100 },
      render: <textarea />,
    } as unknown as InputProps;
    render(<Input {...unsafe} aria-label="Email" type="email" autoComplete="email" required />);
    const input = screen.getByRole('textbox');
    expect(input.tagName).toBe('INPUT');
    expect(input).not.toHaveAttribute('style');
    expect(input.className).toBe('ns-input');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toBeRequired();
  });

  it('separates heading semantics from visual size', () => {
    render(
      <>
        <Heading level={1} size="lg">
          Overview
        </Heading>
        <Text as="span" tone="muted">
          Activity today
        </Text>
      </>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Overview');
    expect(screen.getByText('Activity today').tagName).toBe('SPAN');
  });
});

describe('compound composition', () => {
  it('associates labels, descriptions and validation errors with the input', () => {
    render(
      <Field invalid>
        <FieldLabel>Destination</FieldLabel>
        <FieldDescription>Use an HTTPS URL.</FieldDescription>
        <Input />
        <FieldError match>Destination is required.</FieldError>
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Destination' });
    expect(input).toHaveAccessibleDescription('Use an HTTPS URL. Destination is required.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('moves through tabs by keyboard without activating disabled tabs', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Workspace sections">
          <TabsTab value="overview">Overview</TabsTab>
          <TabsTab value="disabled" disabled>
            Unavailable
          </TabsTab>
          <TabsTab value="activity">Activity</TabsTab>
        </TabsList>
        <TabsPanel value="overview">Overview content</TabsPanel>
        <TabsPanel value="activity">Activity content</TabsPanel>
      </Tabs>,
    );
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    const unavailable = screen.getByRole('tab', { name: 'Unavailable' });
    expect(unavailable).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(unavailable).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity).toHaveFocus();
    expect(activity).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Activity' })).toHaveTextContent(
      'Activity content',
    );
    expect(screen.queryByText('Overview content')).not.toBeInTheDocument();
  });

  it('opens a named modal, carries theme into its portal, and restores focus on Escape', async () => {
    const user = userEvent.setup();
    render(
      <Theme colorScheme="dark" brand="echopoint" density="compact">
        <Dialog>
          <DialogTrigger>Open workspace dialog</DialogTrigger>
          <DialogPopup>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>A shared space for your endpoints.</DialogDescription>
            <Input aria-label="Workspace name" />
            <DialogClose>Cancel</DialogClose>
          </DialogPopup>
        </Dialog>
      </Theme>,
    );
    const trigger = screen.getByRole('button', { name: 'Open workspace dialog' });
    await user.click(trigger);
    const popup = await screen.findByRole('dialog', { name: 'Create workspace' });
    expect(popup).toHaveAccessibleDescription('A shared space for your endpoints.');
    expect(popup.closest('.ns-theme')).toHaveAttribute('data-ns-theme', 'dark');
    expect(popup.closest('.ns-theme')).toHaveAttribute('data-ns-brand', 'echopoint');
    expect(popup.closest('.ns-theme')).toHaveAttribute('data-ns-density', 'compact');
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('always offers an accessible dismiss control', async () => {
    const user = userEvent.setup();
    render(
      <Dialog defaultOpen>
        <DialogPopup>
          <DialogTitle>Details</DialogTitle>
        </DialogPopup>
      </Dialog>,
    );
    await user.click(await screen.findByRole('button', { name: 'Close dialog' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
