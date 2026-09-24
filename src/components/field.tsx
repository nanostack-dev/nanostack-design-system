'use client';

import { Field as BaseField } from '@base-ui/react/field';
import { safeProps, type ElementProps } from '../internal/props.js';

export type FieldProps = ElementProps<'div'> &
  Pick<
    BaseField.Root.Props,
    'name' | 'disabled' | 'invalid' | 'validate' | 'validationMode' | 'validationDebounceTime'
  >;
export function Field(props: FieldProps) {
  return <BaseField.Root {...safeProps(props)} className="ns-field" />;
}

export type FieldLabelProps = ElementProps<'label'>;
export function FieldLabel(props: FieldLabelProps) {
  return <BaseField.Label {...safeProps(props)} nativeLabel className="ns-field-label" />;
}

export type FieldDescriptionProps = ElementProps<'p'>;
export function FieldDescription(props: FieldDescriptionProps) {
  return <BaseField.Description {...safeProps(props)} className="ns-field-description" />;
}

export type FieldErrorProps = ElementProps<'div'> & Pick<BaseField.Error.Props, 'match'>;
export function FieldError(props: FieldErrorProps) {
  return <BaseField.Error {...safeProps(props)} className="ns-field-error" />;
}
