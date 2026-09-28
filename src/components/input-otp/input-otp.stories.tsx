import type { Meta, StoryObj } from '@storybook/react-vite';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { expect, fn } from 'storybook/test';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/input-otp';

const usage = `
A row of one-character slots for a one-time code. Use it for two-factor codes, email verification codes, and PINs. For any other short value, use \`Input\`.

Compose it from parts: \`InputOTP\` holds one or more \`InputOTPGroup\`, each with one \`InputOTPSlot\` per character, and an optional \`InputOTPSeparator\` between groups. Set \`maxLength\` to the number of slots, and \`pattern\` to limit the characters (\`REGEXP_ONLY_DIGITS\` from \`input-otp\`).

The props are the whole API. The parts do not accept \`className\` or \`style\`. The slots have one size: 36 px, the height of a \`md\` input.

## Do not

- Do not use it for a password or a code longer than eight characters. Use \`Input\`.
- Do not split a six-digit code into more than two groups.
- Do not submit the form yourself on every change. Use \`onComplete\`, which fires when the last slot is filled.
`;

const meta = {
  title: 'Components/Input OTP',
  parameters: { docs: { description: { component: usage } } },
  component: InputOTP,
  args: {
    id: 'code',
    maxLength: 6,
    pattern: REGEXP_ONLY_DIGITS,
    onChange: fn(),
    onComplete: fn(),
    children: null,
  },
  render: ({ children: _children, ...args }) => (
    <div className="w-fit">
      <Field>
        <FieldLabel htmlFor={args.id}>Verification code</FieldLabel>
        <InputOTP {...args}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </div>
  ),
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Verification code' });
    await userEvent.click(input);
    await userEvent.keyboard('123456');
    await expect(input).toHaveValue('123456');
    await expect(args.onComplete).toHaveBeenCalledWith('123456');
    for (const digit of ['1', '2', '3', '4', '5', '6']) {
      await expect(canvas.getByText(digit)).toBeVisible();
    }
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Verification code' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('12ab3');
    await expect(input).toHaveValue('123');
    await userEvent.keyboard('{Backspace}');
    await expect(input).toHaveValue('12');
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: '123' },
  render: ({ children: _children, ...args }) => (
    <div className="w-fit">
      <Field disabled>
        <FieldLabel htmlFor={args.id}>Verification code</FieldLabel>
        <InputOTP {...args}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole('textbox', { name: 'Verification code' });
    await expect(input).toBeDisabled();
    await userEvent.tab();
    await expect(input).not.toHaveFocus();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const Invalid: Story = {
  args: { value: '000000', 'aria-invalid': true, 'aria-describedby': 'code-error' },
  render: ({ children: _children, ...args }) => (
    <div className="w-fit">
      <Field invalid>
        <FieldLabel htmlFor={args.id}>Verification code</FieldLabel>
        <InputOTP {...args}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} aria-invalid />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <FieldError id="code-error">This code has expired.</FieldError>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Verification code' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('This code has expired.');
  },
};

export const WithDescription: Story = {
  args: { maxLength: 4, 'aria-describedby': 'code-description' },
  render: ({ children: _children, ...args }) => (
    <div className="w-fit">
      <Field>
        <FieldLabel htmlFor={args.id}>PIN</FieldLabel>
        <InputOTP {...args}>
          <InputOTPGroup>
            {[0, 1, 2, 3].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription id="code-description">
          Four digits from your authenticator.
        </FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'PIN' })).toHaveAttribute('maxlength', '4');
  },
};
