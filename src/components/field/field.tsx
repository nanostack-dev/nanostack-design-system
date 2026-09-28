import type { ComponentProps } from 'react';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field';

export type FieldProps = ComponentProps<typeof Field>;
export type FieldOrientation = NonNullable<FieldProps['orientation']>;
export type FieldContentProps = ComponentProps<typeof FieldContent>;
export type FieldDescriptionProps = ComponentProps<typeof FieldDescription>;
export type FieldErrorProps = ComponentProps<typeof FieldError>;
export type FieldGroupProps = ComponentProps<typeof FieldGroup>;
export type FieldLabelProps = ComponentProps<typeof FieldLabel>;
export type FieldLegendProps = ComponentProps<typeof FieldLegend>;
export type FieldSeparatorProps = ComponentProps<typeof FieldSeparator>;
export type FieldSetProps = ComponentProps<typeof FieldSet>;
export type FieldTitleProps = ComponentProps<typeof FieldTitle>;

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
