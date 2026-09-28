import { CopyIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Field, FieldError, FieldLabel } from '@/components/field';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group';

const meta = {
  title: 'Components/Input Group',
  parameters: {
    docs: {
      description: {
        component:
          'A text field with icons, text or buttons attached inside its border. Use it for search fields, units and copy buttons.',
      },
    },
  },
  component: InputGroup,
  render: (args) => (
    <Field className="w-80">
      <FieldLabel htmlFor="search">Search</FieldLabel>
      <InputGroup {...args}>
        <InputGroupInput id="search" placeholder="Search projects" />
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
    </Field>
  ),
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Search' });
    await userEvent.type(input, 'billing');
    await expect(input).toHaveValue('billing');
    await expect(canvas.getByText('12 results')).toBeVisible();
  },
};

export const AddonFocusesInput: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByText('12 results'));
    await expect(canvas.getByRole('textbox', { name: 'Search' })).toHaveFocus();
  },
};

export const WithText: Story = {
  render: (args) => (
    <Field className="w-80">
      <FieldLabel htmlFor="subdomain">Subdomain</FieldLabel>
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="subdomain" defaultValue="acme" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.nanostack.dev</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Subdomain' });
    const prefix = canvas.getByText('https://').getBoundingClientRect();
    const suffix = canvas.getByText('.nanostack.dev').getBoundingClientRect();
    const box = input.getBoundingClientRect();
    await expect(prefix.right).toBeLessThanOrEqual(box.left + 1);
    await expect(suffix.left).toBeGreaterThanOrEqual(box.right - 1);
  },
};

const onCopy = fn();

export const WithButton: Story = {
  render: (args) => (
    <Field className="w-80">
      <FieldLabel htmlFor="api-key">API key</FieldLabel>
      <InputGroup {...args}>
        <InputGroupInput id="api-key" readOnly defaultValue="ns_live_1234" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy API key" onClick={onCopy}>
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    onCopy.mockClear();
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'API key' })).toHaveFocus();
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Copy API key' });
    await expect(button).toHaveFocus();
    await expect(button).toHaveAttribute('type', 'button');
    await userEvent.keyboard('{Enter}');
    await expect(onCopy).toHaveBeenCalledOnce();
    await expect(canvas.getByRole('textbox', { name: 'API key' })).not.toHaveFocus();
  },
};

export const WithTextarea: Story = {
  render: (args) => (
    <Field className="w-96">
      <FieldLabel htmlFor="message">Message</FieldLabel>
      <InputGroup {...args}>
        <InputGroupTextarea id="message" placeholder="Ask a question" />
        <InputGroupAddon align="block-end">
          <InputGroupText>Markdown supported</InputGroupText>
          <InputGroupButton variant="default" size="sm" className="ml-auto">
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Message' });
    await userEvent.type(textarea, 'Hello');
    await expect(textarea).toHaveValue('Hello');
    const send = canvas.getByRole('button', { name: 'Send' }).getBoundingClientRect();
    await expect(send.top).toBeGreaterThanOrEqual(textarea.getBoundingClientRect().bottom - 1);
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Field className="w-80" data-disabled>
      <FieldLabel htmlFor="search">Search</FieldLabel>
      <InputGroup {...args} data-disabled>
        <InputGroupInput id="search" placeholder="Search projects" disabled />
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Search' });
    await expect(input).toBeDisabled();
    await userEvent.tab();
    await expect(input).not.toHaveFocus();
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Field className="w-80" data-invalid>
      <FieldLabel htmlFor="search">Search</FieldLabel>
      <InputGroup {...args}>
        <InputGroupInput
          id="search"
          defaultValue="%%"
          aria-invalid
          aria-describedby="search-error"
        />
        <InputGroupAddon>
          <MagnifyingGlassIcon aria-hidden />
        </InputGroupAddon>
      </InputGroup>
      <FieldError id="search-error">Remove the special characters.</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Search' });
    await expect(input).toHaveAccessibleDescription('Remove the special characters.');
    const group = input.closest('[data-slot=input-group]');
    await expect(group).not.toBeNull();
    const destructive = getComputedStyle(canvas.getByRole('alert')).color;
    await expect(getComputedStyle(group as Element).borderColor).toBe(destructive);
  },
};
