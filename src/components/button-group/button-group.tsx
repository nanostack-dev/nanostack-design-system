import type { ComponentProps } from 'react';

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from '@/components/ui/button-group';

export type ButtonGroupProps = ComponentProps<typeof ButtonGroup>;
export type ButtonGroupOrientation = NonNullable<ButtonGroupProps['orientation']>;
export type ButtonGroupSeparatorProps = ComponentProps<typeof ButtonGroupSeparator>;
export type ButtonGroupTextProps = ComponentProps<typeof ButtonGroupText>;

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
