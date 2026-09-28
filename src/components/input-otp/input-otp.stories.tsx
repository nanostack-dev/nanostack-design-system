import type { Meta, StoryObj } from '@storybook/react-vite';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { expect, fn } from 'storybook/test';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/field';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';

const meta = {
  title: 'Components/Input OTP',
  component: InputOTP,
  args: {
    id: 'code',
    maxLength: 6,
    pattern: REGEXP_ONLY_DIGITS,
    onChange: fn(),
    onComplete: fn(),
    children: null,
  },
  render: ({ render: _render, children: _children, ...args }) => (
    <Field className="w-fit">
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
  render: ({ render: _render, children: _children, ...args }) => (
    <Field className="w-fit" data-disabled>
      <FieldLabel htmlFor={args.id}>Verification code</FieldLabel>
      <InputOTP {...args}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </Field>
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
  render: ({ render: _render, children: _children, ...args }) => (
    <Field className="w-fit" data-invalid>
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
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Verification code' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('This code has expired.');
  },
};

export const WithDescription: Story = {
  args: { maxLength: 4, 'aria-describedby': 'code-description' },
  render: ({ render: _render, children: _children, ...args }) => (
    <Field className="w-fit">
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
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'PIN' })).toHaveAttribute('maxlength', '4');
  },
};
