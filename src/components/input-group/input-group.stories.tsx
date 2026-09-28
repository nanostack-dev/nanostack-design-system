import { CopyIcon, MagnifyingGlassIcon, PaperPlaneRightIcon } from '@phosphor-icons/react';
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
  type InputGroupAddonAlign,
  type InputGroupSize,
} from '@/components/input-group';
import { Stack } from '@/layout/stack';

const sizes: InputGroupSize[] = ['sm', 'md'];
const aligns: InputGroupAddonAlign[] = ['inline-start', 'inline-end', 'block-start', 'block-end'];

const usage = `
A text field with an icon, text or a button inside its border. Use it for a search field, a URL with a prefix, a value with a unit, a secret with a copy button, or a message composer. For a plain field, use \`Input\`.

Compose it from parts: \`InputGroup\` holds one \`InputGroupInput\` or \`InputGroupTextarea\` and one or more \`InputGroupAddon\`. An addon holds an icon, an \`InputGroupText\`, or an \`InputGroupButton\`. A click on an addon focuses the input.

The props are the whole API. The parts do not accept \`className\` or \`style\`. The group fills the width of its container.

## size

| Value | Height | Use it for |
| --- | --- | --- |
| \`sm\` | 32 px | A search or a filter in a side rail, a panel header, or a toolbar. It lines up with a \`sm\` button. |
| \`md\` | 36 px | The default. Forms, dialogs, and the search above a table. |

## InputGroupAddon align

| Value | Use it for |
| --- | --- |
| \`inline-start\` | The default. A search icon or a prefix such as \`https://\`. |
| \`inline-end\` | A unit, a result count, a keyboard hint, or a copy or clear button. |
| \`block-start\` | A header above a textarea, such as a file name. |
| \`block-end\` | A footer below a textarea: a hint and the send button. |

## InputGroupButton

- Give it \`children\` for a text button, or \`icon\` and \`label\` for an icon-only button. The \`label\` becomes the accessible name and the tooltip.
- \`size\` is \`xs\` (the default, 24 px) inside a one-line group, or \`sm\` (32 px) in a \`block-end\` footer.
- \`variant\` and \`tone\` are the \`Button\` values. The default is \`ghost\`. Use \`solid brand\` only for the send action of a composer.

## font

\`InputGroupInput\` and \`InputGroupTextarea\` take \`font\` like \`Input\`: \`mono\` for a value that a machine reads.

## Do not

- Do not put an icon over a plain \`Input\` with absolute positioning. Use this component.
- Do not put more than one input in a group.
- Do not put a primary form action in a one-line group. Put it next to the form.
`;

const meta = {
  title: 'Components/Input Group',
  parameters: { docs: { description: { component: usage } } },
  component: InputGroup,
  argTypes: { size: { control: 'select', options: sizes } },
  render: (args) => (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="search">Search</FieldLabel>
        <InputGroup {...args}>
          <InputGroupInput id="search" placeholder="Search projects" />
          <InputGroupAddon>
            <MagnifyingGlassIcon aria-hidden />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
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

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Each size has the same height as the `Input` and the `Button` of the same size.',
      },
    },
  },
  render: (args) => (
    <div className="w-80">
      <Stack space="md">
        {sizes.map((size) => (
          <InputGroup key={size} {...args} size={size}>
            <InputGroupInput aria-label={`Search ${size}`} placeholder="Search requests" />
            <InputGroupAddon>
              <MagnifyingGlassIcon aria-hidden />
            </InputGroupAddon>
          </InputGroup>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const heights = sizes.map(
      (size) =>
        canvas
          .getByRole('textbox', { name: `Search ${size}` })
          .closest('[data-slot=input-group]')
          ?.getBoundingClientRect().height,
    );
    await expect(heights).toEqual([32, 36]);
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
    <div className="w-80">
      <Field>
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
    </div>
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
  parameters: {
    docs: {
      description: {
        story:
          'An icon-only `InputGroupButton` takes `icon` and `label`. The label names the button and shows as a tooltip.',
      },
    },
  },
  render: (args) => (
    <div className="w-80">
      <Field>
        <FieldLabel htmlFor="api-key">API key</FieldLabel>
        <InputGroup {...args}>
          <InputGroupInput id="api-key" font="mono" readOnly defaultValue="ns_live_1234" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton icon={CopyIcon} label="Copy API key" onClick={onCopy} />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
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
  parameters: {
    docs: {
      description: {
        story:
          'A composer: an `InputGroupTextarea` with a `block-end` addon for the hint and the send button.',
      },
    },
  },
  render: (args) => (
    <div className="w-96">
      <Field>
        <FieldLabel htmlFor="message">Message</FieldLabel>
        <InputGroup {...args}>
          <InputGroupTextarea id="message" placeholder="Ask a question" />
          <InputGroupAddon align="block-end">
            <InputGroupText>Markdown supported</InputGroupText>
            <InputGroupButton
              variant="solid"
              tone="brand"
              size="sm"
              icon={PaperPlaneRightIcon}
              iconPosition="end"
            >
              Send
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Message' });
    await userEvent.type(textarea, 'Hello');
    await expect(textarea).toHaveValue('Hello');
    const send = canvas.getByRole('button', { name: 'Send' }).getBoundingClientRect();
    const box = textarea.getBoundingClientRect();
    await expect(send.top).toBeGreaterThanOrEqual(box.bottom - 1);
    await expect(box.right - send.right).toBeLessThan(24);
  },
};

export const AddonAlignments: Story = {
  parameters: {
    docs: {
      description: { story: 'The four `align` values of `InputGroupAddon`, with a textarea.' },
    },
  },
  render: (args) => (
    <div className="w-96">
      <Stack space="md">
        {aligns.map((align) => (
          <InputGroup key={align} {...args}>
            <InputGroupTextarea aria-label={`Notes ${align}`} rows={2} />
            <InputGroupAddon align={align}>
              <InputGroupText>{align}</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        ))}
      </Stack>
    </div>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByRole('textbox', { name: 'Notes block-end' });
    const footer = canvas.getByText('block-end').getBoundingClientRect();
    await expect(footer.top).toBeGreaterThanOrEqual(textarea.getBoundingClientRect().bottom - 1);
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="w-80">
      <Field disabled>
        <FieldLabel htmlFor="search">Search</FieldLabel>
        <InputGroup {...args} data-disabled>
          <InputGroupInput id="search" placeholder="Search projects" disabled />
          <InputGroupAddon>
            <MagnifyingGlassIcon aria-hidden />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
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
    <div className="w-80">
      <Field invalid>
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
    </div>
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
