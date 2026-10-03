import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';

import { Inline } from '@/layout/inline';

import { CopyButton, CopyIconButton } from './index';

const writeText = fn<(value: string) => Promise<void>>();
const usage = `
Copies a value and announces the actual clipboard outcome. Anchor uses it for integration identifiers and webhook URLs; Echopoint uses the same behavior for endpoint URLs and other values. Use Button for an action that does not write text to the clipboard.

CopyButton shows a label. CopyIconButton uses an accessible label and tooltip for a dense row.

## variant

| Value | Use it for |
| --- | --- |
| outline | The default CopyButton next to a displayed value. |
| ghost | CopyIconButton in a dense row or next to an input. |
| soft | A secondary clipboard action in a toolbar. |
| solid | The main clipboard action on a result surface. |

## tone

| Value | Use it for |
| --- | --- |
| neutral | Copying a value without extra emphasis. |
| brand | The main action on a generated result. |
| critical | Copying a recovery or deletion instruction inside a critical workflow. |

## size

| Value | Use it for |
| --- | --- |
| xs | Dense rows and inline controls. |
| sm | Toolbars and result cards. |
| md | The default in a form. |
| lg | A main action in a spacious result surface. |

## width

| Value | Use it for |
| --- | --- |
| auto | The default, next to the value being copied. |
| fill | A labeled copy action in a narrow mobile form. |

value is the text to write. label is the resting accessible name. copiedLabel and errorLabel customize outcome copy. onCopied and onCopyFailed let the product offer domain-specific recovery. Feedback resets after two seconds. Clipboard access requires a supported secure context and permission; a rejection or missing API announces failure.

## Do not

- Do not report success before the clipboard promise resolves.
- Do not use a generic Copy label when several values can be copied.
- Do not add custom classes, CSS or styles to change the control.
- Do not put secrets in clipboard success messages.
`;

const meta = {
  title: 'Blocks/CopyButton',
  component: CopyButton,
  parameters: { docs: { description: { component: usage } } },
  args: {
    value: 'https://example.com/endpoint',
    label: 'Copy endpoint URL',
    onCopied: fn(),
    onCopyFailed: fn(),
  },
  beforeEach: () => {
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    return () => {
      if (descriptor) Object.defineProperty(navigator, 'clipboard', descriptor);
      else Reflect.deleteProperty(navigator, 'clipboard');
    };
  },
} satisfies Meta<typeof CopyButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CopiesAfterResolution: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Copy endpoint URL' });
    await userEvent.click(button);
    await expect(writeText).toHaveBeenCalledWith(args.value);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copied'));
    await expect(args.onCopied).toHaveBeenCalledOnce();
    await expect(args.onCopyFailed).not.toHaveBeenCalled();
    await expect(button).toHaveFocus();
  },
};

export const PermissionDenied: Story = {
  play: async ({ args, canvas, userEvent }) => {
    writeText.mockRejectedValueOnce(new Error('Permission denied'));
    await userEvent.click(canvas.getByRole('button', { name: 'Copy endpoint URL' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copy failed'));
    await expect(args.onCopyFailed).toHaveBeenCalledOnce();
    await expect(args.onCopied).not.toHaveBeenCalled();
  },
};

export const ClipboardUnavailable: Story = {
  play: async ({ args, canvas, userEvent }) => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    await userEvent.click(canvas.getByRole('button', { name: 'Copy endpoint URL' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copy failed'));
    await expect(args.onCopyFailed).toHaveBeenCalledOnce();
  },
};

export const PendingWrite: Story = {
  play: async ({ canvas, userEvent }) => {
    let finish: (() => void) | undefined;
    writeText.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const button = canvas.getByRole('button', { name: 'Copy endpoint URL' });
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
    button.click();
    await expect(writeText).toHaveBeenCalledOnce();
    finish?.();
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copied'));
  },
};

export const KeyboardIconControl: Story = {
  render: (args) => <CopyIconButton {...args} size="sm" />,
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Copy endpoint URL' });
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copied'));
    await expect(writeText).toHaveBeenCalledWith(args.value);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Copy endpoint URL' });
    await expect(button).toBeDisabled();
    button.click();
    await expect(writeText).not.toHaveBeenCalled();
  },
};

export const Appearance: Story = {
  render: (args) => (
    <Inline>
      <CopyButton {...args} variant="solid" tone="brand" size="lg" />
      <CopyButton {...args} variant="soft" size="sm" />
      <CopyButton {...args} variant="outline" size="md" />
      <CopyIconButton {...args} variant="ghost" size="xs" />
    </Inline>
  ),
};
