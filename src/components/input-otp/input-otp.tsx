import type { ComponentProps } from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export type InputOTPProps = ComponentProps<typeof InputOTP>;
export type InputOTPGroupProps = ComponentProps<typeof InputOTPGroup>;
export type InputOTPSeparatorProps = ComponentProps<typeof InputOTPSeparator>;
export type InputOTPSlotProps = ComponentProps<typeof InputOTPSlot>;

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
