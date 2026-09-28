import type { ComponentProps } from 'react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

export type InputGroupProps = ComponentProps<typeof InputGroup>;
export type InputGroupAddonProps = ComponentProps<typeof InputGroupAddon>;
export type InputGroupAddonAlign = NonNullable<InputGroupAddonProps['align']>;
export type InputGroupButtonProps = ComponentProps<typeof InputGroupButton>;
export type InputGroupButtonSize = NonNullable<InputGroupButtonProps['size']>;
export type InputGroupInputProps = ComponentProps<typeof InputGroupInput>;
export type InputGroupTextProps = ComponentProps<typeof InputGroupText>;
export type InputGroupTextareaProps = ComponentProps<typeof InputGroupTextarea>;

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
