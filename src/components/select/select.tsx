import type { ComponentProps } from 'react';

import {
  Select,
  SelectContent as SelectContentPrimitive,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectProps = ComponentProps<typeof Select>;
export type SelectContentProps = ComponentProps<typeof SelectContentPrimitive>;
export type SelectGroupProps = ComponentProps<typeof SelectGroup>;
export type SelectItemProps = ComponentProps<typeof SelectItem>;
export type SelectLabelProps = ComponentProps<typeof SelectLabel>;
export type SelectScrollDownButtonProps = ComponentProps<typeof SelectScrollDownButton>;
export type SelectScrollUpButtonProps = ComponentProps<typeof SelectScrollUpButton>;
export type SelectSeparatorProps = ComponentProps<typeof SelectSeparator>;
export type SelectTriggerProps = ComponentProps<typeof SelectTrigger>;
export type SelectTriggerSize = NonNullable<SelectTriggerProps['size']>;
export type SelectValueProps = ComponentProps<typeof SelectValue>;

export function SelectContent({ className, ...props }: SelectContentProps) {
  return (
    <SelectContentPrimitive
      className={cn(
        'w-auto max-w-(--available-width) min-w-[max(var(--anchor-width),9rem)]',
        className,
      )}
      {...props}
    />
  );
}

export {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
