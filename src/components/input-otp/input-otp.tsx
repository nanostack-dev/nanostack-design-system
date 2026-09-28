import { MinusIcon } from '@phosphor-icons/react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { useContext, type ComponentProps, type ReactNode } from 'react';

import type { ClosedProps } from '@/lib/closed-props';

export type InputOTPProps = ClosedProps<
  Omit<ComponentProps<typeof OTPInput>, 'render' | 'children' | 'containerClassName'>
> & {
  children: ReactNode;
};

export function InputOTP(props: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName="cn-input-otp flex items-center has-disabled:opacity-50"
      spellCheck={false}
      className="disabled:cursor-not-allowed"
      {...props}
    />
  );
}

export type InputOTPGroupProps = ClosedProps<ComponentProps<'div'>>;

export function InputOTPGroup(props: InputOTPGroupProps) {
  return (
    <div
      data-slot="input-otp-group"
      className="flex items-center rounded-3xl has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40"
      {...props}
    />
  );
}

export type InputOTPSlotProps = ClosedProps<ComponentProps<'div'>> & {
  index: number;
};

export function InputOTPSlot({ index, ...props }: InputOTPSlotProps) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className="relative flex size-9 items-center justify-center border-y border-r border-input bg-input/50 text-sm transition-all outline-none first:rounded-l-3xl first:border-l last:rounded-r-3xl aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/30 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

export type InputOTPSeparatorProps = ClosedProps<ComponentProps<'div'>>;

export function InputOTPSeparator(props: InputOTPSeparatorProps) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}
